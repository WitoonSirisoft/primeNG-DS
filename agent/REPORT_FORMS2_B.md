# Report: Forms 2 group 2 · MultiSelect, AutoComplete — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5 ×2)** (on `02 Components`). Decision #101.
Generator: `scripts/figma-forms2b.mjs` + plugin code `scripts/figma-forms2b.body.js` (`npm run figma:forms2b`; first build `-- --fresh`) → `calls/29-forms2b-multiselect.js`, `-autocomplete.js`, `-panel.js` (one call each, 144 variants per field set).

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| MultiSelect | 321:4469 | 144 | Size × Variant × State × Invalid × Content (placeholder / chips / value); Placeholder, Value, Show clear |
| AutoComplete | 322:4997 | 144 | same axes, Content (placeholder / value / chips); dropdown button always shown |
| MultiSelect Option | 322:6439 | 4 | State default / focus / selected / selected-focus; checkbox + Label |
| MultiSelect Panel | 322:6458 | — | header (toggle-all + filter IconField, Show header) + 5 options + Show option 6 |
| AutoComplete panel | — | — | use Select Panel (same overlay + list token values) |
| Docs | 323:9529 / 323:9544 | — | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | 323:8873 / 323:9462 | — | Light + Dark, incl. open states |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| MultiSelect base (placeholder / chips / comma) | 252 × 33 | 252 × 32.8 |
| AutoComplete base single | 252 × 33 | 252 × 32.8 |
| AutoComplete chips (2, wraps) | 252 × 60.3 | 252 × 60.09 |
| MultiSelect panel | 252 × 218 | ≈ 252 × 217 |

## Checks
0 unbound paints of 1,969. Screenshots match (chips + remove icons, comma, clear, invalid red, disabled, filled hover/focus; panel header, checked options tinted, focus darker; dropdown button grey, chips wrap).

## Gaps
Chip text stays 14 at small / large (code inherits field font size). AutoComplete dropdown hover / active and loading states not built. Chip padding calc(padding / 2) = literal 3.5 / 5.25 (no variable). Panel filter shows the IconField placeholder (clear it on the instance). AutoComplete panel not captured (async suggestions showed the loader) → Select Panel used.
