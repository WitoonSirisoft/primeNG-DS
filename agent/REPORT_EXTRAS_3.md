# Report: Extras group 3 · DataView — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5)** (on `02 Components`). Decision #102 (choices: DataView frame + Sakai items, image placeholders, existing variables + DataView text styles).
Generator: `scripts/figma-dataview.mjs` + plugin code `scripts/figma-dataview.body.js` (`npm run figma:dataview`; first build `-- --fresh`) → `calls/33-dataview-1.js`.
Tokens: export-tokens reads the Sakai List demo text classes → 11 `layout/dataview/*` variables (meta / name / price / price-lg size, weight, line height); text styles DataView/Meta, Name, Price, Price lg. Pushed with your OK: **2,022 vars, fp 2c42e249 ✅**, 50 text styles.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| DataView List Item | 338:6114 | 2 | Position first / other (top border); Category, Name, Rating, Price; Status tag, Buy, Favorite exposed |
| DataView Grid Item | 338:6214 | — | card (border, image box surface/50), same props; Buy fills |
| DataView | 338:6264 | 2 | Layout list / grid; Show header; SelectButton (bars / table icons); 3 Sakai products exposed |
| Doc | 339:1464 | — | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | 339:2 / 339:1218 | — | Light + Dark; long names, narrow widths |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| List | 884 × 459.99 | 884 × 459.98 |
| Grid | 884 × 441.39 | 884 × 440.17 (Figma text boxes round to whole px) |
| Header | 52 | 52 |

## Checks
0 unbound paints of 78 (Button / Tag / SelectButton instances excluded). Contrast: text all pass (category 4.76 / 6.91); the yellow star is 1.92 on white (decorative — the number carries the rating). Fixed: border counted twice (strokes are in layout → padding 21), long names overflow (title fills and wraps).

## Gaps
Placeholders instead of product photos. Footer, paginator, empty and loading states not built. Rating pill shadow and the black/70 backdrop behind the status tag not built (Tailwind arbitrary values, no tokens). Spacing and the 3.5 radius are Sakai Tailwind literals.
