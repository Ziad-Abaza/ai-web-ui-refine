---
name: "anti-ai-web-refine"
description: "Review and refine an existing website or landing page so it looks designed for its brand instead of AI-generated. Audits 28 AI-design tells (purple gradients, gradient headlines, emoji headings, identical card rows, badges above every heading, stock fonts, stock copy, scroll animations, weak contrast, em dashes and more) with a linter, then redesigns with a brand-derived palette, type scale, and layout while preserving content and functionality. Includes RTL and Arabic handling. Use whenever the user wants a site to stop looking AI-made, generic, templated, or \"like every AI landing page\", asks to polish, review, critique, or refine a website design, or says things like \"يبان إنه عمل AI\", \"الموقع شكله generic\", \"حسّن تصميم الموقع\", even if they never name these patterns."

---

# Anti-AI web refine

Goal: a page where nobody can tell a model made it, because every visual choice traces back to the brand. Deleting clichés is not enough. In testing, a pass that cleared all 16 original tells still produced a clean but anonymous page (stock fonts, stock copy, centred skeleton, no visual idea). The workflow below adds the positive direction that fixed that.

## Workflow

1. **Inspect first.** Read every page and component. Note functionality, factual content, and brand assets (name, logo, colours) that must survive. Never invent facts: statistics, testimonials, logos, prices, awards.
2. **Measure.** Run the linter on each HTML file and keep the output as the "before":
   `python3 scripts/lint_ai_tells.py path/to/index.html`
   It reports 16 original tells (V1) and 12 extras (X) with evidence. It reads static HTML and CSS only; for framework projects, point it at built output or the rendered page saved as HTML. Linter hits are prompts for judgment, not verdicts (a coloured border can be meaningful).
3. **Set direction before editing.** Fill `references/direction-worksheet.md`: audience, three brand adjectives, one visual idea rooted in the brand's world, palette, type, layout moves, copy rules. This step is the difference between "cleaned up" and "designed".
4. **Rebuild with the direction.** Rules that matter, with reasons:
   - Colour comes from the brand or product; stock palette values read as defaults. Body contrast 4.5:1, large text 3:1, in every state including hover.
   - Two type families at most, each with a role. h1 at least 2.5x body, 1.25x between levels, and a weight or colour difference from body, otherwise hierarchy disappears.
   - Pick the layout the content needs. Prices go in a ledger, reasons in a numbered list, quotes as one large plus small. Use a card grid once at most, and only for truly equal items.
   - Start-align text; centre one deliberate moment. No two neighbouring sections share a skeleton.
   - Spacing from a 4px token scale, varied on purpose.
   - Copy: keep every fact, rewrite stock phrasing, name the outcome in CTAs, at most one em dash on the page.
   - Motion: none, or one purposeful moment. Name transitioned properties, never `all`. Provide `prefers-reduced-motion` and `:focus-visible`.
   - Self-host fonts.
5. **Arabic or RTL?** Read `references/rtl-arabic.md` before writing CSS. Fonts, tracking, numerals, and logical properties are where generated Arabic sites fail.
6. **Verify.**
   - Re-run the linter. Remaining hits need a stated reason.
   - `python3 scripts/content_check.py original.html refined.html`: missing numbers must be zero; scan the missing words to confirm only stock phrases were dropped.
   - Screenshot at 375, 768, 1280 px (headless Chrome or Playwright) and actually look: overflow, stranded items in RTL, display type that is unreadable when small, empty columns. Fix and re-check once.
7. **Report** using `references/report-template.md`: before and after scores, direction, tells kept on purpose, copy before and after, and items needing client input (real testimonial names, photography). Keep it short.

## Judgment calls

- A linter score of 0 is necessary, not sufficient. If the page could belong to any brand, the visual idea is missing; go back to step 3.
- If the brand has strong existing guidelines, they win over this skill's palette and type suggestions. The tells still apply.
- If the product is visual (food, fashion, interiors) and there are no images, flag it in the report. Do not fake imagery with gradients or stock blobs.
- Do not touch behaviour: forms, links, routes, analytics, accessibility attributes stay intact unless they are broken.

## Files

- `scripts/lint_ai_tells.py`: the 28-pattern linter (`--json`, `--v1-only` available)
- `scripts/content_check.py`: confirms facts survived the rewrite
- `references/patterns.md`: each tell, why it reads as AI, what to use instead
- `references/direction-worksheet.md`: the brief to fill before coding
- `references/rtl-arabic.md`: RTL and Arabic checklist
- `references/report-template.md`: final report format
