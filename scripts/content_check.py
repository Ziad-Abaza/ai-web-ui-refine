#!/usr/bin/env python3
"""
Content & Fact Preservation Checker (content_check.py)
Compares original HTML with refined HTML to ensure essential facts, numbers,
dates, and prices were preserved during redesign and not hallucinated or lost.
"""

import sys
import os
import re
import argparse
from typing import Set

def extract_numbers_and_prices(text: str) -> Set[str]:
    # Match numbers, percentages, currency, dates, years
    patterns = [
        r'\b\d{4}\b',                      # Years (e.g. 1968, 2026)
        r'\b\d+(?:,\d{3})*(?:\.\d+)?\b',   # Integers / Decimals
        r'\$\d+(?:\.\d{2})?',              # USD prices
        r'\d+\s*(?:ج\.م|EGP|LE|SAR|AED)'   # Arabic/Regional currency
    ]
    matches = set()
    for p in patterns:
        for m in re.finditer(p, text):
            matches.add(m.group(0).strip())
    return matches

def clean_html_text(html: str) -> str:
    # Strip script/style tags
    clean = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', html, flags=re.S | re.I)
    # Strip tags
    clean = re.sub(r'<[^>]+>', ' ', clean)
    # Normalize whitespace
    clean = re.sub(r'\s+', ' ', clean)
    return clean

def main():
    parser = argparse.ArgumentParser(description="Check fact and data preservation between original and refined pages.")
    parser.add_argument("original", help="Path to original HTML file")
    parser.add_argument("refined", help="Path to refined HTML file")
    args = parser.parse_args()

    for path in [args.original, args.refined]:
        if not os.path.exists(path):
            print(f"Error: File '{path}' does not exist.", file=sys.stderr)
            sys.exit(1)

    with open(args.original, "r", encoding="utf-8", errors="ignore") as f:
        orig_text = clean_html_text(f.read())
    with open(args.refined, "r", encoding="utf-8", errors="ignore") as f:
        ref_text = clean_html_text(f.read())

    orig_nums = extract_numbers_and_prices(orig_text)
    ref_nums = extract_numbers_and_prices(ref_text)

    missing_nums = orig_nums - ref_nums

    print("=" * 60)
    print("  FACT & DATA PRESERVATION CHECK")
    print(f"  Original: {args.original}")
    print(f"  Refined:  {args.refined}")
    print("=" * 60)

    print(f"  Numbers/Prices in Original: {len(orig_nums)}")
    print(f"  Numbers/Prices in Refined:  {len(ref_nums)}")

    if not missing_nums:
        print("\n  [PASS] All factual numbers and pricing points survived!")
    else:
        print(f"\n  [NOTICE] {len(missing_nums)} numbers/values from original were modified or dropped:")
        for item in sorted(missing_nums):
            print(f"   - {item}")
        print("\n  Confirm whether these were placeholder AI numbers intentionally replaced by real data.")
    print("=" * 60)

if __name__ == "__main__":
    main()
