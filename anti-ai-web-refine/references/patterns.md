---
noteId: "30a90d40e59111f1ba4411e04ee48923"
tags: []

---

# The 28 AI Web Design Tells (Catalogue & Human Counterparts)

Why do 95% of AI-generated websites look interchangeable? Because AI models default to the most frequent patterns found in generic templates: purple/indigo gradients, 3-card grids, Inter font, emoji headings, and vague buzzwords.

Here is the exhaustive catalogue of the 28 tells, why each betrays AI generation, and what intentional human designers do instead.

---

### Part 1: The Original 16 Tells (V1)

#### 1. Purple, Indigo, or Violet Gradients
* **The AI Tell**: Multi-hue gradients shifting across `#6366f1` (indigo), `#8b5cf6` (purple), and `#ec4899` (pink).
* **Why it looks AI**: It’s the default palette of every modern AI UI framework and template demo.
* **Human Solution**: Extract a 3-color palette strictly from the brand’s domain (e.g. coffee, maritime brass, parchment, natural slate). If a gradient is needed, keep it monochromatic within a single hue.

#### 2. Gradient-Filled Headlines
* **The AI Tell**: Big headings using `background-clip: text` with a neon gradient fill.
* **Why it looks AI**: Gimmicky decoration used to disguise a lack of typographic hierarchy.
* **Human Solution**: Solid color. Let weight, scale, serif elegance, and letterforms carry the drama.

#### 3. Emojis in Headings and Feature Cards
* **The AI Tell**: Emojis (🚀, 💡, ⚡, 🤖, ☕) prepended to headings or used as feature icons.
* **Why it looks AI**: Models use emojis as shortcuts for icons and visual imagery.
* **Human Solution**: Remove emojis. Use purposeful typography, custom line SVG icons, or authentic product imagery.

#### 4. Flat Typographic Hierarchy
* **The AI Tell**: Headings only slightly larger than body text (1.4x-1.8x) or sharing identical weight.
* **Why it looks AI**: Models treat type as interchangeable text blocks rather than editorial structure.
* **Human Solution**: `h1` at least 2.5x body text size. Scale steps of at least 1.25x. Distinct weight or color between headings and body.

#### 5. Single-Side Colored Card Borders
* **The AI Tell**: Cards with `border-left: 4px solid #8b5cf6` or top borders purely for decoration.
* **Why it looks AI**: A cheap trick to inject color into bland card components.
* **Human Solution**: Uniform subtle borders (1px) or natural surface contrast. Color should only encode semantic status.

#### 6. Glassmorphism & Heavy Backdrop Blur
* **The AI Tell**: `backdrop-filter: blur(16px)` with semi-transparent white/black backgrounds behind text.
* **Why it looks AI**: 2021 Dribbble cliché overused by AI on dark mode themes, hurting legibility.
* **Human Solution**: Crisp, solid opaque surfaces with strong contrast.

#### 7. Weak Contrast in Dark Mode
* **The AI Tell**: Body copy set to `#64748b` or `#475569` on `#0f172a` backgrounds (failing WCAG AA).
* **Why it looks AI**: Models copy unverified CSS presets that prioritize low contrast "sleekness" over readability.
* **Human Solution**: Minimum 4.5:1 contrast for body copy, 3:1 for large display headers in all states.

#### 8. Three Identical Cards in a Row
* **The AI Tell**: Features or pricing invariably forced into a 3-column grid of identical boxes.
* **Why it looks AI**: The ultimate cop-out layout. Easy to code, but rarely fits real content.
* **Human Solution**: Match layout to content: ledgers/tables for specs and prices, numbered vertical steps for workflows, editorial two-column essays for craft stories.

#### 9. Badge / Eyebrow Above Every Heading
* **The AI Tell**: `<span class="badge">✨ FEATURES</span>` pill floating over every section.
* **Why it looks AI**: Repetitive filler that treats the user like they cannot read a heading.
* **Human Solution**: Maximum one badge on the entire page, and only when it carries vital new information.

#### 10. Reused Generic Icons
* **The AI Tell**: The same generic gear, shield, or rocket icon repeated across unrelated claims.
* **Why it looks AI**: Models lack visual context for the actual product.
* **Human Solution**: Authentic photography, specific technical diagrams, or no icons at all.

#### 11. Unstyled UI-Library Defaults
* **The AI Tell**: Tailwind `indigo-600` or Bootstrap `#0d6efd` left unconfigured.
* **Why it looks AI**: Zero brand discovery was performed.
* **Human Solution**: Ground every color in brand reality (e.g. brick clay, coastal water, copper wire).

#### 12. Entrance Animation on Every Section
* **The AI Tell**: Every paragraph and card fades in and slides up on scroll.
* **Why it looks AI**: Makes the page feel like an animated slideshow instead of a functional tool.
* **Human Solution**: Instant rendering or at most one deliberate hero reveal.

#### 13. Cursor-Following Glow
* **The AI Tell**: Radial gradient circle trailing the mouse cursor.
* **Why it looks AI**: Distracting gimmick that adds battery drain and latency.
* **Human Solution**: Tactile, predictable UI with standard pointer interactions.

#### 14. Buttons That Lose Contrast on Hover
* **The AI Tell**: Dark purple button turning light lavender on hover with white text.
* **Why it looks AI**: Hover states generated without contrast validation.
* **Human Solution**: Ensure hover states maintain at least 4.5:1 contrast.

#### 15. Arbitrary Spacing Off-Scale
* **The AI Tell**: Random margins and paddings (`margin-top: 37px`, `padding: 23px`).
* **Why it looks AI**: Lack of an underlying design token system.
* **Human Solution**: Strict 4px token scale (`--sp-1: 4px`, `--sp-2: 8px`, `--sp-4: 16px`, `--sp-6: 24px`, `--sp-8: 32px`, `--sp-16: 64px`).

#### 16. Em Dash Overuse in Copy
* **The AI Tell**: Sentences stitched together with multiple em dashes: *"Crafted with passion — roasted fresh daily — delivered fast."*
* **Why it looks AI**: LLMs love the rhythm of em dashes for persuasive puffery.
* **Human Solution**: Clear, complete sentences with subject, verb, and period. Max 1 em dash per page.

---

### Part 2: The Added 12 Tells (X)

#### 17. Stock Font Stack (Inter, Roboto, Poppins)
* **The AI Tell**: Defaulting to Inter or Poppins for everything.
* **Why it looks AI**: The default font stack of every code assistant.
* **Human Solution**: Pair an expressive display face (Newsreader, Fraunces, Playfair, Amiri) with a disciplined body font.

#### 18. `transition: all`
* **The AI Tell**: Applying `transition: all 0.3s ease` indiscriminately.
* **Why it looks AI**: Lazy CSS that causes accidental transitions on layout, margin, or border properties.
* **Human Solution**: Explicitly name transitioned properties: `transition: color 0.15s, background-color 0.15s`.

#### 19. Stock Marketing Buzzwords
* **The AI Tell**: *"Unlock seamless potential"*, *"Game-changer"*, *"Supercharge your workflow"*, *"افتح قوة القهوة بجودة لا مثيل لها"*.
* **Why it looks AI**: Hallmarked LLM marketing clichés with zero substantive meaning.
* **Human Solution**: Write verifiable facts: specific dates, machinery, origins, weights, and steps.

#### 20. First-Name-Only Testimonials
* **The AI Tell**: *"The best product ever! — Sarah M."*
* **Why it looks AI**: Fictionalized social proof fabricated by the model.
* **Human Solution**: Full attribution: Name, Role, Organization, Location. If not available, ask the client or omit.

#### 21. Gradient Orbs & Neon Blobs
* **The AI Tell**: Huge blurred radial gradients (`filter: blur(80px)`) floating behind cards.
* **Why it looks AI**: The universal "modern AI dark mode" wallpaper.
* **Human Solution**: Intentional background colors, clean surface separation, subtle paper or linen textures.

#### 22. Everything Centered
* **The AI Tell**: `text-align: center` applied to every heading, paragraph, and card on the page.
* **Why it looks AI**: Centering hides lack of layout composition.
* **Human Solution**: Start-align body and headings. Center only a rare, deliberate hero moment.

#### 23. Repeated Section Skeletons
* **The AI Tell**: 3 or 4 sections in a row repeating: [Badge -> Heading -> Subtitle -> 3-Card Grid].
* **Why it looks AI**: Template repetition without structural creativity.
* **Human Solution**: Varied rhythm: dense data tables, asymmetrical columns, quiet editorial passages.

#### 24. Heavy Diffuse Shadows
* **The AI Tell**: `box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5)`.
* **Why it looks AI**: Muddy shadows trying to create artificial depth.
* **Human Solution**: Crisp, shallow shadows (`0 2px 8px rgba(0,0,0,0.06)`) or fine 1px borders.

#### 25. Missing `:focus-visible` Styles
* **The AI Tell**: Default browser outline removed with `outline: none` and no `:focus-visible` replacement.
* **Why it looks AI**: AI forgets keyboard accessibility and focus navigation.
* **Human Solution**: Dedicated `:focus-visible` outline rings with clear contrast and offset.

#### 26. Motion Without `prefers-reduced-motion`
* **The AI Tell**: CSS `@keyframes` that cannot be opted out of.
* **Why it looks AI**: Accessibility is ignored.
* **Human Solution**: Wrap all non-essential motion in `@media (prefers-reduced-motion: no-preference)`.

#### 27. Letter-Spacing on Arabic Text
* **The AI Tell**: Applying `letter-spacing: 2px` across Arabic text or RTL containers.
* **Why it looks AI**: AI models don't realize Arabic is an intrinsically cursive script; tracking breaks letter ligatures.
* **Human Solution**: Never apply `letter-spacing` or synthetic italics to Arabic. Set `letter-spacing: normal`.

#### 28. Stock CTA Labels
* **The AI Tell**: Generic buttons: *"Get Started"*, *"Learn More"*, *"ابدأ الآن"*, *"اعرف أكثر"*.
* **Why it looks AI**: Uncommitted labels that describe the interaction, not the value.
* **Human Solution**: Outcome-focused labels: *"Order Roast Batch #42"*, *"احجز تحميصة الدفعة 42"*, *"Download Technical Specsheet"*.
