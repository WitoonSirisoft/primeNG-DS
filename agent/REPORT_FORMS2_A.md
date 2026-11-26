# Report: Forms 2 group 1 · InputGroup, SelectButton — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5 ×2)** (on `02 Components`). Decision #101.
Generator: `scripts/figma-forms2a.mjs` + plugin code `scripts/figma-forms2a.body.js` (`npm run figma:forms2a`; first build `-- --fresh`) → `calls/28-forms2a-1.js`.
Styles added: text styles ToggleButton/Label sm|base|lg (44); effect styles togglebutton/content/checked-shadow, multiselect/shadow, multiselect/overlay/shadow, autocomplete/shadow, autocomplete/overlay/shadow.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| InputGroup Addon | 317:4332 | 5 | Position first / middle / after-input / last / last-after-input; Show icon + Icon, Show text + Text, Show checkbox |
| InputGroup | 317:4358 | 4 | Row icon / multi / button / checkbox (Sakai rows); Field = InputText, Button with square inner corners |
| SelectButton Option | 317:4419 | 12 | State default / hover / checked / disabled × Size |
| SelectButton | 317:4480 | 12 | Size × Invalid × Disabled; 3 exposed options + Show option 4 / 5 |
| Docs | 318:8498 / 318:8513 | — | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | 318:7978 / 318:8415 | — | Light + Dark |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| InputGroup rows | 404 × 33 (checkbox 33.5) | 404 × 32.8 (33.5) |
| SelectButton small / base / large | 235 × 31 / 256 × 33 / 274 × 35 | 232.56 × 30.69 / 253.19 × 32.8 / 273.86 × 34.89 |
Width differences = Figma rounding each text box (≈ 1 px per option).

## Checks
0 unbound paints of 129. Screenshots match (addon borders + square inner corners, button row, checkbox row; checked white chip + shadow, hover, invalid outline, icons). Added Disabled axis after review of the example (dividers must use the disabled border colour).

## Gaps
Focus rings not modelled. Price field uses InputText (InputNumber identical in the default state). InputNumber / Password in groups: swap the Field.
