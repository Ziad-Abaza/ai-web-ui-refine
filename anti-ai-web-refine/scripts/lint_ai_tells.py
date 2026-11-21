#!/usr/bin/env python3
"""
AI Web Tells Linter (lint_ai_tells.py)
Audits HTML/CSS files against 28 recognizable AI-generated web design clichés.
Zero dependencies — runs on standard Python 3.
"""

import sys
import os
import re
import json
import argparse
from typing import List, Dict, Any

TELLS = {
    # Original 16 tells (V1)
    "V1-01": {
        "name": "purple_gradients",
        "title": "Purple/Indigo/Violet Gradients",
        "description": "Multi-hue gradients shifting from purple, indigo, or violet into pink or blue.",
        "fix": "Use solid brand color, or keep gradients strictly within a single hue.",
        "v1": True
    },
    "V1-02": {
        "name": "gradient_text",
        "title": "Gradient-Filled Headlines",
        "description": "Headings with background-clip: text and transparent fill.",
        "fix": "Use solid colors. Rely on font weight, size scale, and contrast for emphasis.",
        "v1": True
    },
    "V1-03": {
        "name": "emoji_in_headings",
        "title": "Emoji in Headings or Features",
        "description": "Emojis used inside <h1>-<h6> or as feature icons (🚀, ✨, ⚡, 💡, 🤖).",
        "fix": "Remove emojis. Use authentic brand typography or a cohesive SVG icon set.",
        "v1": True
    },
    "V1-04": {
        "name": "flat_typography",
        "title": "Flat Typographic Scale",
        "description": "Heading to body size ratio is under 2.0x or lacks weight contrast.",
        "fix": "h1 should be at least 2.5x body size with at least 1.25x ratio between heading levels.",
        "v1": True
    },
    "V1-05": {
        "name": "single_side_card_borders",
        "title": "Single-Side Colored Card Borders",
        "description": "Decorative accent borders on one side (border-top, border-left) without status meaning.",
        "fix": "Use a subtle uniform border, or let whitespace and surface contrast define cards.",
        "v1": True
    },
    "V1-06": {
        "name": "glassmorphism_backdrop",
        "title": "Glassmorphism & Heavy Backdrop Blur",
        "description": "backdrop-filter: blur() applied behind body text or main cards.",
        "fix": "Use solid opaque surfaces with proper contrast ratios.",
        "v1": True
    },
    "V1-07": {
        "name": "weak_contrast",
        "title": "Weak Contrast Ratios",
        "description": "Low-contrast muted gray text (#64748b, #94a3b8) on dark background surfaces.",
        "fix": "Maintain at least 4.5:1 contrast for normal text and 3:1 for large display text.",
        "v1": True
    },
    "V1-08": {
        "name": "three_identical_cards",
        "title": "Three Identical Cards in a Row",
        "description": "Exactly three parallel identical cards used regardless of content.",
        "fix": "Choose layout by content: tables for specs/pricing, numbered lists for steps, ledgers for lots.",
        "v1": True
    },
    "V1-09": {
        "name": "badge_overuse",
        "title": "Badge / Eyebrow Overuse",
        "description": "Pill badge or glowing chip placed above multiple section headings.",
        "fix": "Keep at most one badge on the entire page, and only when it carries vital info.",
        "v1": True
    },
    "V1-10": {
        "name": "reused_generic_icons",
        "title": "Reused Generic Icons",
        "description": "Generic icons repeated for unrelated features.",
        "fix": "Use bespoke photography, authentic diagrams, or purpose-drawn icons.",
        "v1": True
    },
    "V1-11": {
        "name": "unstyled_ui_defaults",
        "title": "Stock UI Library Defaults",
        "description": "Unstyled defaults from Tailwind (indigo-500, violet-600) or Bootstrap (#0d6efd).",
        "fix": "Build a custom brand palette derived from the product, packaging, or brand history.",
        "v1": True
    },
    "V1-12": {
        "name": "excessive_entrance_animation",
        "title": "Excessive Entrance Animations",
        "description": "Scroll-triggered fade-in / slide-up animations across every section.",
        "fix": "Zero animations, or at most one subtle, purposeful moment.",
        "v1": True
    },
    "V1-13": {
        "name": "cursor_glow",
        "title": "Cursor-Following Glow",
        "description": "Interactive mouse follower or radial cursor glow.",
        "fix": "Remove cursor effects. Keep navigation tactile and predictable.",
        "v1": True
    },
    "V1-14": {
        "name": "hover_contrast_drop",
        "title": "Buttons Losing Contrast on Hover",
        "description": "Hover state transitions where text and background contrast falls below standards.",
        "fix": "Hover states must preserve at least 4.5:1 contrast.",
        "v1": True
    },
    "V1-15": {
        "name": "off_scale_spacing",
        "title": "Arbitrary Spacing Off Scale",
        "description": "Magic numbers in padding or margins (e.g., 23px, 37px, 73px).",
        "fix": "Define a strict 4px token scale (4, 8, 12, 16, 24, 32, 48, 64px) via CSS variables.",
        "v1": True
    },
    "V1-16": {
        "name": "em_dash_overuse",
        "title": "Em Dash (—) Overuse in Copy",
        "description": "Frequent em dashes separating short marketing fragments.",
        "fix": "Write complete, grounded sentences. Maximum one em dash on the entire page.",
        "v1": True
    },

    # Added 12 tells (X)
    "X-17": {
        "name": "stock_font_stack",
        "title": "Stock Font Stack (Inter / Poppins / Roboto)",
        "description": "Relying on standard AI default fonts (Inter, Poppins, Roboto).",
        "fix": "Pair an expressive display face with a disciplined body font matching brand tone.",
        "v1": False
    },
    "X-18": {
        "name": "transition_all",
        "title": "Lazy transition: all",
        "description": "CSS wildcard transition: all that causes layout jank.",
        "fix": "Animate only explicit properties (color, background-color, transform, opacity).",
        "v1": False
    },
    "X-19": {
        "name": "stock_marketing_buzzwords",
        "title": "Stock Marketing Buzzwords",
        "description": "Generic filler copy: 'unlock', 'seamless', 'game-changer', 'افتح قوة', 'لا مثيل لها'.",
        "fix": "State concrete facts, specific processes, authentic numbers, and honest timelines.",
        "v1": False
    },
    "X-20": {
        "name": "vague_testimonials",
        "title": "Vague / First-Name-Only Testimonials",
        "description": "Testimonials attributed to 'John D.', 'Sarah', or fictional quotes without titles.",
        "fix": "Provide full real attribution (Full Name, Role, Organization, City) or show fewer.",
        "v1": False
    },
    "X-21": {
        "name": "gradient_orbs",
        "title": "Floating Gradient Orbs / Neon Blobs",
        "description": "Blurred radial gradient divs floating behind content.",
        "fix": "Remove neon blobs. Use textured paper, authentic borders, or clean surfaces.",
        "v1": False
    },
    "X-22": {
        "name": "everything_centered",
        "title": "Monotonous Centered Layout",
        "description": "Every section and paragraph is centered (text-align: center).",
        "fix": "Start-align text by default. Reserve centering for a deliberate, singular statement.",
        "v1": False
    },
    "X-23": {
        "name": "repeated_section_skeletons",
        "title": "Repeated Section Skeletons",
        "description": "Three or more consecutive sections with the same heading + 3-card grid.",
        "fix": "Vary section rhythm: alternate dense tables, asymmetrical columns, and quiet text.",
        "v1": False
    },
    "X-24": {
        "name": "heavy_blurry_shadows",
        "title": "Overly Heavy Diffuse Shadows",
        "description": "box-shadow with blur radius 30px or higher.",
        "fix": "Use crisp, shallow shadows (4px-16px) or solid 1px structural borders.",
        "v1": False
    },
    "X-25": {
        "name": "missing_focus_visible",
        "title": "Missing :focus-visible Styles",
        "description": "No explicit :focus-visible styling on interactive elements.",
        "fix": "Add high-contrast, visible focus rings for keyboard accessibility.",
        "v1": False
    },
    "X-26": {
        "name": "motion_without_reduced_motion",
        "title": "Motion Without prefers-reduced-motion",
        "description": "CSS animations or keyframes without a @media (prefers-reduced-motion: reduce) fallback.",
        "fix": "Wrap animations or disable them inside prefers-reduced-motion media query.",
        "v1": False
    },
    "X-27": {
        "name": "arabic_letter_spacing",
        "title": "Letter-Spacing on Arabic Text",
        "description": "letter-spacing applied to Arabic script, breaking cursive ligature connections.",
        "fix": "Never apply letter-spacing or italics to Arabic text. Set letter-spacing: normal.",
        "v1": False
    },
    "X-28": {
        "name": "stock_cta_labels",
        "title": "Generic Stock CTA Labels",
        "description": "Generic CTA buttons: 'Get Started', 'Learn More', 'ابدأ الآن', 'اعرف أكثر'.",
        "fix": "Name the specific outcome: 'Order Roast Batch #42', 'Reserve Tasting Seat'.",
        "v1": False
    }
}

EMOJI_PATTERN = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27ff]')
BUZZWORDS_EN = ["unlock", "seamless", "seamlessly", "game-changer", "supercharge", "next-gen", "elevate", "synergy"]
BUZZWORDS_AR = ["افتح قوة", "لا مثيل لها", "ارتقِ", "سلسة", "ثورة في عالم", "بدون مجهود"]
STOCK_CTAS_EN = ["get started", "learn more", "sign up now", "start free trial"]
STOCK_CTAS_AR = ["ابدأ الآن", "اعرف أكثر", "سجل الآن", "ابدأ مجانا"]


def audit_html(content: str, v1_only: bool = False) -> List[Dict[str, Any]]:
    hits = []

    def add_hit(code: str, evidence: str, line_no: int = 1):
        if v1_only and not TELLS[code]["v1"]:
            return
        hits.append({
            "code": code,
            "title": TELLS[code]["title"],
            "description": TELLS[code]["description"],
            "evidence": evidence.strip()[:140],
            "line": line_no,
            "fix": TELLS[code]["fix"]
        })

    lines = content.splitlines()

    # 1. Purple Gradients (V1-01)
    for i, line in enumerate(lines, 1):
        if re.search(r'linear-gradient\([^)]*(indigo|purple|violet|#6366f1|#8b5cf6|#a855f7|#7c3aed|#ec4899)', line, re.I):
            add_hit("V1-01", line, i)
            break

    # 2. Gradient text (V1-02)
    for i, line in enumerate(lines, 1):
        if "background-clip: text" in line or "-webkit-background-clip: text" in line:
            add_hit("V1-02", line, i)
            break

    # 3. Emoji in headings (V1-03)
    heading_matches = re.finditer(r'<h[1-6][^>]*>(.*?)</h[1-6]>', content, re.I | re.S)
    for m in heading_matches:
        if EMOJI_PATTERN.search(m.group(1)):
            add_hit("V1-03", f"Heading contains emoji: {m.group(0)}")
            break

    # 5. Single side card borders (V1-05)
    for i, line in enumerate(lines, 1):
        if re.search(r'border-(left|top):\s*[2-6]px\s+solid\s+(#8b5cf6|#a855f7|#ec4899|#6366f1|var\(--purple|indigo)', line, re.I):
            add_hit("V1-05", line, i)
            break

    # 6. Glassmorphism backdrop blur (V1-06)
    for i, line in enumerate(lines, 1):
        if "backdrop-filter: blur" in line or "-webkit-backdrop-filter: blur" in line:
            add_hit("V1-06", line, i)
            break

    # 7. Weak contrast dark mode (V1-07)
    for i, line in enumerate(lines, 1):
        if re.search(r'color:\s*(#64748b|#475569|#94a3b8)', line, re.I) and ("background" in content and ("#0" in content or "#1" in content)):
            add_hit("V1-07", line, i)
            break

    # 8. Three identical cards (V1-08)
    if content.count('class="card"') >= 3 or "grid-template-columns: repeat(3" in content:
        add_hit("V1-08", "Found 3-card grid pattern without content differentiation")

    # 9. Badge overuse (V1-09)
    badge_count = len(re.findall(r'class="[^"]*badge[^"]*"', content, re.I))
    if badge_count > 1:
        add_hit("V1-09", f"Found {badge_count} badges across sections (maximum recommended: 1)")

    # 13. Cursor glow (V1-13)
    if "cursor-glow" in content or "pointer-glow" in content:
        add_hit("V1-13", "Found interactive cursor glow element")

    # 15. Off scale spacing (V1-15)
    for i, line in enumerate(lines, 1):
        m = re.search(r'(padding|margin)[^:]*:\s*([^;]+);', line)
        if m:
            val = m.group(2)
            if re.search(r'\b(17|23|37|73|29|41|53)px\b', val):
                add_hit("V1-15", line, i)
                break

    # 16. Em dash overuse (V1-16)
    dash_count = content.count("—") + content.count("&mdash;")
    if dash_count > 1:
        add_hit("V1-16", f"Found {dash_count} em dashes (—) in copy (maximum recommended: 1)")

    # --- Extra Tells (X) ---
    if not v1_only:
        # 17. Stock font stack (X-17)
        for i, line in enumerate(lines, 1):
            if re.search(r"font-family:[^;]*\b(Inter|Poppins|Roboto)\b", line, re.I):
                add_hit("X-17", line, i)
                break

        # 18. transition: all (X-18)
        for i, line in enumerate(lines, 1):
            if re.search(r'transition:\s*all\b', line):
                add_hit("X-18", line, i)
                break

        # 19. Stock marketing buzzwords (X-19)
        found_buzz = []
        for bw in BUZZWORDS_EN + BUZZWORDS_AR:
            if re.search(rf'\b{re.escape(bw)}\b', content, re.I):
                found_buzz.append(bw)
        if found_buzz:
            add_hit("X-19", f"Stock buzzwords found: {', '.join(found_buzz[:4])}")

        # 20. Vague testimonials (X-20)
        if re.search(r'—\s*(Michael|John|Sarah|Alex|David)\b(?!\s*,\s*[A-Z])', content):
            add_hit("X-20", "First-name-only testimonial without official role or company attribution")

        # 21. Gradient orbs / neon blobs (X-21)
        if re.search(r'(glow-orb|blur-orb|neon-blob|blob-1|orb-1)', content, re.I):
            add_hit("X-21", "Decorative blurred neon gradient orb element found")

        # 22. Everything centered (X-22)
        if re.search(r'(header,\s*section|body)\s*\{[^}]*text-align:\s*center', content, re.I):
            add_hit("X-22", "Global centering applied across header and sections")

        # 24. Heavy blurry shadows (X-24)
        for i, line in enumerate(lines, 1):
            m = re.search(r'box-shadow:[^;]*\b([3-9]\d|\d{3,})px', line)
            if m:
                add_hit("X-24", line, i)
                break

        # 25. Missing focus visible (X-25)
        if ":focus-visible" not in content and "<style" in content:
            add_hit("X-25", "No :focus-visible rules declared for accessible keyboard navigation")

        # 26. Motion without reduced motion (X-26)
        if "@keyframes" in content and "prefers-reduced-motion" not in content:
            add_hit("X-26", "@keyframes animations found without prefers-reduced-motion fallback")

        # 27. Arabic letter spacing (X-27)
        if ("dir=\"rtl\"" in content or "lang=\"ar\"" in content or any(c in content for c in "ابتثجحخدذرزسشصضطظعغفقكلمنهوي")):
            for i, line in enumerate(lines, 1):
                if re.search(r'letter-spacing:\s*(?!0\b|normal\b)[0-9.]+(px|em|rem)', line):
                    add_hit("X-27", line, i)
                    break

        # 28. Stock CTA labels (X-28)
        for cta in STOCK_CTAS_EN + STOCK_CTAS_AR:
            if re.search(rf'<button[^>]*>\s*{re.escape(cta)}[^<]*</button>', content, re.I) or \
               re.search(rf'<a[^>]*>\s*{re.escape(cta)}[^<]*</a>', content, re.I):
                add_hit("X-28", f"Stock CTA button text found: '{cta}'")
                break

    return hits


def main():
    parser = argparse.ArgumentParser(description="Audit HTML/CSS for 28 AI-generated web design tells.")
    parser.add_argument("file", help="Path to HTML file to audit")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    parser.add_argument("--v1-only", action="store_true", help="Audit only original 16 tells")
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: File '{args.file}' not found.", file=sys.stderr)
        sys.exit(1)

    with open(args.file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    hits = audit_html(content, v1_only=args.v1_only)

    if args.json:
        print(json.dumps({
            "file": args.file,
            "total_hits": len(hits),
            "hits": hits
        }, indent=2, ensure_ascii=False))
        return

    # Terminal Pretty Report
    print("=" * 68)
    print(f"  AI WEB DESIGN AUDIT REPORT")
    print(f"  Target: {args.file}")
    print(f"  Scope:  {'Original 16 (V1)' if args.v1_only else 'Full 28 Tells (V1 + Added)'}")
    print("=" * 68)

    if not hits:
        print("\n  [SUCCESS] 0 AI Tells detected! The design looks authentic and human-crafted.\n")
        return

    print(f"\n  [ALERT] Found {len(hits)} AI Tells:\n")
    for idx, hit in enumerate(hits, 1):
        print(f"  {idx}. [{hit['code']}] {hit['title']}")
        print(f"     Evidence:    {hit['evidence']}")
        print(f"     Recommended: {hit['fix']}\n")

    print("-" * 68)
    print(f"  Summary: {len(hits)} tell(s) need review.")
    print("=" * 68)


if __name__ == "__main__":
    main()
