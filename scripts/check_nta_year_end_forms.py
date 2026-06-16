from __future__ import annotations

import html
import re
import sys
import urllib.parse
import urllib.request


NENCHO_PAGE = "https://www.nta.go.jp/users/gensen/nencho/index.htm"
FORMS_PAGE = "https://www.nta.go.jp/users/gensen/nencho/shinkokusyo/index.htm"

EXPECTED_TERMS = [
    "年末調整がよくわかるページ（令和７年分）",
    "基礎控除",
    "給与所得控除",
    "特定親族特別控除",
]

EXPECTED_LINKS = {
    "combined_form_pdf": "https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/pdf/2025bun_06.pdf",
    "combined_form_input_pdf": "https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/pdf/2025bun_06_input.pdf",
    "combined_form_example_pdf": "https://www.nta.go.jp/publication/pamph/gensen/nencho2025/pdf/306.pdf",
    "dependent_form_2025_pdf": "https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/pdf/2025bun_01.pdf",
    "dependent_form_2025_input_pdf": "https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/pdf/2025bun_01_input.pdf",
    "insurance_form_2025_pdf": "https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/pdf/2025bun_04.pdf",
    "insurance_form_2025_input_pdf": "https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/pdf/2025bun_04_input.pdf",
    "housing_credit_example_2025_pdf": "https://www.nta.go.jp/publication/pamph/gensen/nencho2025/pdf/308.pdf",
}


def fetch_text(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "kaz-mio-year-end-form-check/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        body = response.read()
        charset = response.headers.get_content_charset() or "cp932"
    try:
        return body.decode(charset)
    except UnicodeDecodeError:
        return body.decode("cp932", errors="replace")


def extract_links(base_url: str, text: str) -> set[str]:
    links: set[str] = set()
    for match in re.finditer(r'href=["\']([^"\']+)["\']', text, flags=re.IGNORECASE):
        href = html.unescape(match.group(1))
        links.add(urllib.parse.urljoin(base_url, href))
    return links


def main() -> int:
    problems: list[str] = []
    nencho_text = fetch_text(NENCHO_PAGE)
    forms_text = fetch_text(FORMS_PAGE)
    all_links = extract_links(NENCHO_PAGE, nencho_text) | extract_links(FORMS_PAGE, forms_text)

    for term in EXPECTED_TERMS:
        if term not in nencho_text and term not in forms_text:
            problems.append(f"missing official term: {term}")

    for name, url in EXPECTED_LINKS.items():
        if url not in all_links:
            problems.append(f"missing expected link {name}: {url}")

    print("NTA year-end adjustment form check")
    print(f"- checked pages: {NENCHO_PAGE}, {FORMS_PAGE}")
    print(f"- expected links: {len(EXPECTED_LINKS)}")
    for name, url in EXPECTED_LINKS.items():
        status = "ok" if url in all_links else "missing"
        print(f"- {name}: {status} {url}")

    if problems:
        print("\nProblems:")
        for problem in problems:
            print(f"- {problem}")
        print("\nOfficial pages may have changed. Review year_end_adjustment_forms.html before publishing.")
        return 1

    print("- result: passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
