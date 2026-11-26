# Report: Extras group 1 · Tooltip, Timeline, Stepper — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5)** (on `02 Components`). Decision #102.
Generator: `scripts/figma-extras1.mjs` + plugin code `scripts/figma-extras1.body.js` (`npm run figma:extras1`; first build `-- --fresh`) → `calls/31-extras1-1.js`.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Tooltip | 328:5660 | 4 | Position top/right/bottom/left; arrow vector; text max width 154; box max width bound to tooltip/max-width |
| Timeline Event | 328:5677 | 8 | Layout vertical/horizontal × Align start/end × Position middle/last; Content, Opposite, Show opposite; marker ring + inset dot; connector fills |
| Timeline | 328:5746 | 4 | Align left/right/alternate/horizontal; 4 Sakai events exposed |
| Step | 328:5891 | 6 | State default/active/completed × Position middle/last; Number, Title |
| Stepper | 328:5927 | 3 | Active 1/2/3; 3 steps exposed; Show panels + Stepper Slot 328:5924 |
| Docs | 329:10322 / 329:10337 / 329:10352 | — | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | 329:9382 / 329:10254 | — | Light + Dark |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Tooltip top | 121 × 34.5 | 121 × 34.5 |
| Timeline vertical | 227 | 226.8 |
| Timeline horizontal | 88.76 | 88.55 |
| Stepper list | 42 | 42 |
| Long tooltip | 175 × 69 (wraps) | wraps |

## Checks
0 unbound paints of 208. Fixed: connectors missing (separator FILL), long tooltip not wrapping (text max width), horizontal height (Spacer in Opposite), Tooltip REF error (append box before REF).

## Gaps
Tooltip show/hide delay and auto-flip are code only. Timeline custom markers / icons not built. Stepper vertical orientation and linear (locked) mode not built.
