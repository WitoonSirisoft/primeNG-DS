# Report: Batch 3 group 1 · Card, Divider, Accordion — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5 ×3)** (on `02 Components`). Decision #100.
Generator: `scripts/figma-content.mjs` + plugin code `scripts/figma-content.body.js` (`npm run figma:content`; first build `-- --fresh`) → `calls/25-content-1.js`. Update in place = run without `--fresh` (not run yet).
Stories: card / divider / accordion `.stories.ts`. Text styles added: Card/Title, Accordion/Header, Body/Strong (+ Semantic `typography/strong/font-weight` 700) → 1,586 vars, 38 text styles.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Card | 299:4189 | — | Title, Show title, Content, Show content, Show slot + Slot (Card Slot 299:4187) |
| Divider | 299:4195 | 18 | Layout × Type × Align; Content + Label |
| Accordion Panel | 299:4270 | 6 | State default/hover/disabled × Expanded; Header, Content, Show content, Show slot + Slot (Accordion Slot 299:4267) |
| Accordion | 299:4312 | — | 3 exposed panels + Show panel 4 / 5 |
| Docs | 300:7246 / 300:7252 / 300:7257 | — | next to each set |
| Examples / stress (99 Sandbox) | 300:6658 / 300:7172 | — | Light + Dark |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Card with title | 544 × 136 | 544 × 136.5 |
| Card without title | — | 98 (28 + 42 + 28) |
| Stacked cards | gap layout/card/gap 28 | 28 |
| Accordion, first open | 544 × 227.25 | 544 × 226.64 |
| Accordion, all closed | 544 × 148.5 | 544 × 147.89 |
| Divider horizontal, no content | 28 tall (margins as padding) | 0 + 2 × 14 margin |
Divider re-captured (wrapper .sb-capture): 70 / 86.8 tall = text block 21 + divider 28 / 44.8 + 21 ✓. Dash pattern measured: dashed 2.5/2.5, dotted 1/1.

## Checks
- 0 unbound paints of 116 (Card, Divider, Accordion Panel, Accordion).
- Fixed during build: accordion header fills the panel (chevron at the right); divider keeps its hug size when Content is off (0-size Spacer: a frame whose only flow child is hidden does not shrink).

## Gaps
- Divider dashed/dotted = dash pattern [2.5,2.5] / [1,1] (measured). Divider content is text only.
- Accordion focus ring not modelled; first/last header radius not drawn (invisible: header background = surface).
- Card title values are Tailwind utility literals (font-semibold text-xl mb-4) read into layout/card/title/*.

## Accessibility (computed in Figma, WCAG AA)
Card text 10.35 / 17.72 pass; Divider content 10.35 / 17.72 pass (line decorative 1.23 / 1.7); Accordion header 4.76 / 6.91, hover/open/content 10.35 / 17.72, icons ≥ 4.76: all pass.
