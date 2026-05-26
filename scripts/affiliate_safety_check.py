from __future__ import annotations

import os
import re
import sys
import json
import urllib.request
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
TARGET_SUFFIXES = {".html", ".xml"}
SKIP_DIRS = {".git", ".github", "assets", "scripts"}

ALLOWED_AMAZON_FILES = {
    "editorial_policy.html",
    "privacy.html",
}

RULES = [
    (
        "fixed_price_or_best_deal",
        re.compile(r"([0-9０-９][0-9０-９,，]*(?:\s|&nbsp;)*円|円[〜~]|税込|送料込|最安値|最安|激安)"),
        "固定金額・最安値・税込/送料込などの断定は避け、リンク先の最新表示へ誘導してください。",
    ),
    (
        "ranking_claim",
        re.compile(r"(ランキング\s*[1１]\s*位|[1１]\s*位\s*獲得|第\s*[1１]\s*位|人気\s*第?\s*[1１]\s*位|上位を維持|3サイト全部で1位|３サイト全部で１位)"),
        "ランキングは変動するため、固定の順位表記は避けてください。",
    ),
    (
        "customer_review_or_quote",
        re.compile(r"(カスタマーレビュー|口コミ|レビュー転載)"),
        "レビュー転載・口コミ引用に見える表現は避け、独自の感想や確認ポイントに置き換えてください。",
    ),
    (
        "short_or_redirect_url",
        re.compile(r"(amzn\.to|a\.co/|bit\.ly|tinyurl\.com|x\.gd|t\.co/)"),
        "短縮URLやリダイレクトURLは使わず、正規の広告URL・公式URLを使ってください。",
    ),
    (
        "listing_ad_mention",
        re.compile(r"(リスティング広告|検索連動型広告)"),
        "リスティング広告運用を示す表現はAmazon提携審査・規約上のリスクがあります。",
    ),
]

AFFILIATE_HREF_RE = re.compile(
    r"<a\b(?=[^>]*\bhref=[\"'][^\"']*(?:px\.a8\.net|af\.moshimo\.com)[^\"']*[\"'])[^>]*>",
    re.IGNORECASE,
)


def iter_target_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts[:-1]):
            continue
        if path.is_file() and path.suffix.lower() in TARGET_SUFFIXES:
            files.append(path)
    return sorted(files)


def line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def is_allowed_match(path: Path, content: str, start: int, end: int, rule_id: str) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    line_start = content.rfind("\n", 0, start) + 1
    line_end = content.find("\n", end)
    if line_end == -1:
        line_end = len(content)
    line = content[line_start:line_end]

    if rule_id == "customer_review_or_quote" and "レビュー転載" in line:
        return "行っていません" in line or "していません" in line

    if "Amazon" in line and rel in ALLOWED_AMAZON_FILES:
        return True

    return False


def check_text_rules(path: Path, content: str) -> list[str]:
    findings: list[str] = []
    for rule_id, pattern, message in RULES:
        for match in pattern.finditer(content):
            if is_allowed_match(path, content, match.start(), match.end(), rule_id):
                continue
            rel = path.relative_to(ROOT).as_posix()
            line = line_number(content, match.start())
            snippet = match.group(0)
            findings.append(f"{rel}:{line}: [{rule_id}] {snippet} - {message}")

    if "Amazon" in content and path.name not in ALLOWED_AMAZON_FILES:
        for match in re.finditer("Amazon", content):
            if is_allowed_match(path, content, match.start(), match.end(), "amazon"):
                continue
            rel = path.relative_to(ROOT).as_posix()
            line = line_number(content, match.start())
            findings.append(f"{rel}:{line}: [amazon_mention] Amazon表記は審査前後に慎重に扱ってください。")

    return findings


def check_affiliate_links(path: Path, content: str) -> list[str]:
    findings: list[str] = []
    for match in AFFILIATE_HREF_RE.finditer(content):
        tag = match.group(0)
        rel_match = re.search(r"\brel=[\"']([^\"']+)[\"']", tag, re.IGNORECASE)
        rel_value = rel_match.group(1).lower() if rel_match else ""
        if "nofollow" not in rel_value and "sponsored" not in rel_value:
            rel = path.relative_to(ROOT).as_posix()
            line = line_number(content, match.start())
            findings.append(f"{rel}:{line}: [affiliate_rel] 提携リンクには rel=\"nofollow sponsored\" などを付けてください。")
    return findings


def check_sitemap() -> list[str]:
    findings: list[str] = []
    sitemap_path = ROOT / "sitemap.xml"
    try:
        tree = ET.parse(sitemap_path)
    except Exception as exc:
        return [f"sitemap.xml: [sitemap_parse] XMLとして読めません: {exc}"]

    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [el.text or "" for el in tree.findall(".//sm:loc", ns)]
    required = {
        "https://kaz-mio.github.io/",
        "https://kaz-mio.github.io/editorial_policy.html",
        "https://kaz-mio.github.io/privacy.html",
        "https://kaz-mio.github.io/contact.html",
    }
    for url in sorted(required - set(locs)):
        findings.append(f"sitemap.xml: [sitemap_missing] 必須ページがありません: {url}")
    return findings


def send_discord(summary: str) -> None:
    webhook = os.environ.get("DISCORD_WEBHOOK_URL")
    if not webhook:
        return
    payload = json.dumps({"content": summary}, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        webhook,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=10) as response:
        response.read()


def main() -> int:
    findings: list[str] = []
    for path in iter_target_files():
        content = path.read_text(encoding="utf-8", errors="ignore")
        findings.extend(check_text_rules(path, content))
        if path.suffix.lower() == ".html":
            findings.extend(check_affiliate_links(path, content))
    findings.extend(check_sitemap())

    if findings:
        body = "\n".join(findings[:40])
        if len(findings) > 40:
            body += f"\n... and {len(findings) - 40} more"
        print("Affiliate safety check failed:\n" + body)
        send_discord("KAZ & MIO: アフィリエイト安全チェックで要確認が見つかりました。\n```" + body[:1500] + "```")
        return 1

    message = "Affiliate safety check passed."
    print(message)
    send_discord("KAZ & MIO: アフィリエイト安全チェックOKです。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
