---
noteId: "3fa606e0e59111f1ba4411e04ee48923"
tags: []

---

# Arabic & RTL Web Design Guide

Arabic web design is where generic AI templates fail most visibly. AI models routinely apply Latin-centric CSS assumptions to Arabic text, producing broken letter connections, awkward line wraps, and inverted layouts.

Follow this guide to build pristine, authentic Arabic and RTL web interfaces.

---

### 1. The Cardinal Rule: Never Use `letter-spacing` on Arabic
* **Why**: Arabic is intrinsically cursive; letters connect through contextual ligatures. Adding `letter-spacing` breaks these ligatures, creating disconnected letter fragments that look completely broken to native readers.
* **Rule**:
  ```css
  /* DO NOT DO THIS ON ARABIC: */
  .arabic-text { letter-spacing: 2px; } /* BROKEN! */

  /* DO THIS: */
  [lang="ar"], [dir="rtl"], .arabic-text {
    letter-spacing: normal !important;
  }
  ```

### 2. Never Synthesize Italics (`font-style: italic`)
* In traditional Arabic calligraphy and typography, "italics" do not exist. Slanted Arabic looks distorted and synthetic.
* To emphasize Arabic text, use:
  - Font weight contrast (e.g., Medium to Bold).
  - Color shift (e.g., brand copper or deep maritime green).
  - Typographic scale or decorative quotation marks (« »).

### 3. Dedicated Arabic Font Families
Do not rely on fallback Latin fonts with tacked-on Arabic glyphs. Use typefaces designed by Arabic type designers:
* **Display & Editorial**:
  - *Amiri*: Classical Naskh elegance, ideal for cultural, heritage, and artisanal brands.
  - *Aref Ruqaa*: Expressive, traditional Ruq'ah script.
  - *Cairo*: Contemporary, geometric, strong display presence.
* **UI & Body**:
  - *IBM Plex Sans Arabic*: Balanced, legible at 14-16px, outstanding screen performance.
  - *Readex Pro*: Modern, friendly, highly legible.
  - *Tajawal*: Clean, neutral, corporate-friendly.

### 4. Line Height Scale for Arabic
Arabic glyphs feature taller ascenders, deeper descenders, and diacritics (harakat). Latin line-height values (1.4-1.5) cause overlapping accents in Arabic.
* **Body text**: Set `line-height` between `1.75` and `1.9`.
* **Large Headings**: Set `line-height` between `1.25` and `1.35`.

### 5. CSS Logical Properties (Mandatory for Bi-directional UI)
Never use physical directions (`left`, `right`). Use CSS logical properties to allow seamless LTR/RTL switching:

| Physical (Avoid) | Logical (Use) |
|---|---|
| `margin-left: 16px` | `margin-inline-start: 16px` |
| `margin-right: 16px` | `margin-inline-end: 16px` |
| `padding-left: 24px` | `padding-inline-start: 24px` |
| `padding-right: 24px` | `padding-inline-end: 24px` |
| `border-left: 1px solid` | `border-inline-start: 1px solid` |
| `left: 0` | `inset-inline-start: 0` |
| `right: 0` | `inset-inline-end: 0` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |

### 6. Numerals Consistency
Pick one numeral system and adhere to it consistently:
* **Eastern Arabic / Mashriq Numerals** (١، ٢، ٣، ٤، ٥): Ideal for heritage, literary, or official documents in Egypt and the Levant.
* **Western Arabic / Maghreb Numerals** (1, 2, 3, 4, 5): Common in tech, e-commerce, and modern products.
* Never mix both numeral styles within the same section.

### 7. Icon Directionality & Mirroring
* Icons that indicate direction (back/forward arrows, step indicators, phone receivers) must flip in RTL:
  ```css
  [dir="rtl"] .icon-directional {
    transform: scaleX(-1);
  }
  ```
* Universal physical objects (clocks, coffee cups, checkmarks, search magnifying glasses) should **not** flip.
