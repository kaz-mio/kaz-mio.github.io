#!/usr/bin/env python3
"""Build municipal residential land price estimates from MLIT land price data.

The output is intentionally small enough for GitHub Pages: one average
residential land price per municipality, converted from yen/m2 to万円/坪.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import re
import tempfile
import urllib.request
import zipfile
from collections import defaultdict


BASE_URL = "https://nlftp.mlit.go.jp"
PAGE_TEMPLATE = BASE_URL + "/ksj/gml/datalist/KsjTmplt-L01-{year}.html"
DEFAULT_OUTPUT = pathlib.Path("assets/land-prices/land_price_municipal_latest.json")
PREFECTURE_NAMES = {
    "北海道": "北海道",
    "青森": "青森県",
    "岩手": "岩手県",
    "宮城": "宮城県",
    "秋田": "秋田県",
    "山形": "山形県",
    "福島": "福島県",
    "茨城": "茨城県",
    "栃木": "栃木県",
    "群馬": "群馬県",
    "埼玉": "埼玉県",
    "千葉": "千葉県",
    "東京": "東京都",
    "神奈川": "神奈川県",
    "新潟": "新潟県",
    "富山": "富山県",
    "石川": "石川県",
    "福井": "福井県",
    "山梨": "山梨県",
    "長野": "長野県",
    "岐阜": "岐阜県",
    "静岡": "静岡県",
    "愛知": "愛知県",
    "三重": "三重県",
    "滋賀": "滋賀県",
    "京都": "京都府",
    "大阪": "大阪府",
    "兵庫": "兵庫県",
    "奈良": "奈良県",
    "和歌山": "和歌山県",
    "鳥取": "鳥取県",
    "島根": "島根県",
    "岡山": "岡山県",
    "広島": "広島県",
    "山口": "山口県",
    "徳島": "徳島県",
    "香川": "香川県",
    "愛媛": "愛媛県",
    "高知": "高知県",
    "福岡": "福岡県",
    "佐賀": "佐賀県",
    "長崎": "長崎県",
    "熊本": "熊本県",
    "大分": "大分県",
    "宮崎": "宮崎県",
    "鹿児島": "鹿児島県",
    "沖縄": "沖縄県",
}


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "kaz-mio-land-price-updater"})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read().decode("utf-8")


def discover_page(year: int | None) -> tuple[int, str, str]:
    candidates: list[int]
    if year:
        candidates = [year]
    else:
        now_year = dt.datetime.now(dt.timezone.utc).year
        candidates = [now_year + 1, now_year, now_year - 1, now_year - 2]

    for candidate in candidates:
        url = PAGE_TEMPLATE.format(year=candidate)
        try:
            html = fetch_text(url)
        except Exception:
            continue
        if f"L01-{candidate % 100:02d}_01_GML.zip" in html:
            return candidate, url, html
    raise RuntimeError("Could not find a usable MLIT L01 land price page.")


def extract_download_rows(year: int, html: str) -> list[tuple[str, str, str]]:
    yy = f"{year % 100:02d}"
    rows: list[tuple[str, str, str]] = []
    for number in range(1, 48):
        code = f"{number:02d}"
        marker = f"prefecture{code}_{yy}"
        index = html.find(marker)
        if index < 0:
            raise RuntimeError(f"Missing MLIT prefecture row: {marker}")
        chunk = html[index : index + 2200]
        name_match = re.search(rf'{marker}">([^<]+)</td>', chunk)
        url_match = re.search(
            rf"DownLd\('[^']*','L01-{yy}_{code}_GML\.zip','([^']*)'",
            chunk,
        )
        if not name_match or not url_match:
            raise RuntimeError(f"Could not parse MLIT download row: {marker}")
        prefecture = PREFECTURE_NAMES.get(name_match.group(1).strip(), name_match.group(1).strip())
        path = url_match.group(1).replace("//", "/")
        rows.append((code, prefecture, BASE_URL + path))
    return rows


def first_after(text: str, start: int, chars: str) -> int:
    positions = [text.find(char, start) for char in chars]
    positions = [position for position in positions if position >= 0]
    return min(positions) if positions else -1


def municipality_name(prefecture: str, properties: dict) -> str:
    address = (properties.get("L01_025") or "").replace("\u3000", " ").strip()
    stem = (properties.get("L01_024") or "").strip()
    rest = address
    if prefecture and rest.startswith(prefecture):
        rest = rest[len(prefecture) :].strip()

    if stem and rest.startswith(stem) and len(rest) > len(stem) and rest[len(stem)] in "市区町村":
        return stem + rest[len(stem)]

    city_pos = rest.find("市")
    ward_pos = rest.find("区", city_pos + 1) if city_pos >= 0 else -1
    if city_pos > 0 and ward_pos > city_pos:
        return rest[: ward_pos + 1]

    county_pos = rest.find("郡")
    if county_pos > 0:
        suffix_pos = first_after(rest, county_pos + 1, "町村")
        if suffix_pos > county_pos:
            return rest[: suffix_pos + 1]

    if city_pos > 0:
        return rest[: city_pos + 1]

    for suffix in ("区", "町", "村"):
        pos = rest.find(suffix)
        if pos > 0:
            return rest[: pos + 1]

    return stem or rest[:12] or "不明"


def read_geojson_from_zip(zip_path: pathlib.Path) -> dict:
    with zipfile.ZipFile(zip_path) as archive:
        geojson_name = next(name for name in archive.namelist() if name.endswith(".geojson"))
        return json.loads(archive.read(geojson_name).decode("utf-8"))


def build_data(year: int | None = None) -> dict:
    data_year, source_url, html = discover_page(year)
    rows = extract_download_rows(data_year, html)
    prefectures = []

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = pathlib.Path(temp_dir)
        for code, prefecture, url in rows:
            zip_path = temp_path / url.rsplit("/", 1)[-1]
            urllib.request.urlretrieve(url, zip_path)
            geojson = read_geojson_from_zip(zip_path)
            buckets: dict[tuple[str, str], list[float]] = defaultdict(list)

            for feature in geojson.get("features", []):
                properties = feature.get("properties", {})
                if str(properties.get("L01_002")) != "000":
                    continue
                price = properties.get("L01_008")
                if not isinstance(price, (int, float)) or price <= 0:
                    continue
                city = municipality_name(prefecture, properties)
                buckets[(str(properties.get("L01_001")), city)].append(float(price))

            cities = []
            pref_prices = []
            for (city_code, city), values in sorted(buckets.items(), key=lambda item: (item[0][0], item[0][1])):
                average = sum(values) / len(values)
                pref_prices.extend(values)
                cities.append(
                    {
                        "code": city_code,
                        "name": city,
                        "yenPerSqm": round(average),
                        "unitPrice": round(average * 3.305785 / 10000, 1),
                        "points": len(values),
                    }
                )

            pref_average = sum(pref_prices) / len(pref_prices)
            prefectures.append(
                {
                    "code": code,
                    "name": prefecture,
                    "yenPerSqm": round(pref_average),
                    "unitPrice": round(pref_average * 3.305785 / 10000, 1),
                    "points": len(pref_prices),
                    "cities": cities,
                }
            )

    return {
        "source": f"国土数値情報 地価公示データ {data_year}年版",
        "sourceUrl": source_url,
        "license": "CC BY 4.0",
        "dataYear": data_year,
        "basisDate": f"{data_year}-01-01",
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "unit": "万円/坪",
        "priceField": "住宅地（用途区分 L01_002=000）の市区町村別平均",
        "prefectures": prefectures,
    }


def preserve_generated_at_if_unchanged(output_path: pathlib.Path, new_data: dict) -> dict:
    if not output_path.exists():
        return new_data
    try:
        old_data = json.loads(output_path.read_text(encoding="utf-8"))
    except Exception:
        return new_data

    old_compare = dict(old_data)
    new_compare = dict(new_data)
    old_compare.pop("generatedAt", None)
    new_compare.pop("generatedAt", None)
    if old_compare == new_compare and old_data.get("generatedAt"):
        new_data["generatedAt"] = old_data["generatedAt"]
    return new_data


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--year", type=int, help="Specific MLIT L01 data year to fetch.")
    parser.add_argument("--output", type=pathlib.Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    data = build_data(args.year)
    data = preserve_generated_at_if_unchanged(args.output, data)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    city_count = sum(len(pref["cities"]) for pref in data["prefectures"])
    point_count = sum(pref["points"] for pref in data["prefectures"])
    print(
        f"Wrote {args.output} ({data['dataYear']}, "
        f"{len(data['prefectures'])} prefectures, {city_count} municipalities, {point_count} points)"
    )


if __name__ == "__main__":
    main()
