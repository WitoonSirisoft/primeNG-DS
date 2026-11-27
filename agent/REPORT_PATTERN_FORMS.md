# Report: Batch 4 pattern 2 · Form Field + Form Layout — 2026-11-27

Status: **APPROVED 2026-11-27 (visual 5)**. Decision #103 (choices: Control swap slot with preferred controls; error = Message simple sm; all 6 Sakai Form Layout cards; help text kept at 11.2px).
Generator: `scripts/figma-formfield.mjs` + `scripts/figma-formfield.body.js` (`npm run figma:formfield`; first build `-- --fresh`) → `calls/36-formfield-1.js`.
Story: `formfield.stories.ts` (Playground: vertical / horizontal × default / help / invalid; Layout: Sakai demo copied). Capture `formfieldPlan` (14 images).
Tokens (pushed with your OK): layout/form/help/font-size 11.2 + text style Form/Help → **2,052 vars, fp 585efda2 ✅**, 54 text styles.

## Built
| Part | Page | Node | Notes |
|---|---|---|---|
| Form Field | 02 Components | 355:6497 | 2: Layout vertical / horizontal; Label, Show label, Control (swap, preferred 8 controls), Show help, Help text, Show error; Control + Error exposed |
| Form Layout | 03 Patterns | 355:6638 | 6 Sakai cards (frames with the Card look) from Form Field, Textarea, Select, Button |
| Docs | | 355:8279 (Form Field) / 355:8294 (Form Layout) | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | | 355:6882 / 355:8118 | Light + Dark; long label + long error; Select control |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Vertical field / + help / + error | 57 / 77 / 79 | 56.59 / 77.03 / 78.28 |
| Horizontal field | 33 | 32.8 |
| Form Layout | 1060 × 912.3 | 1060 × 913.6 |
| Cards V / VG / H / Inline / Help / Advanced | 293 / 151 / 174 / 127 / 171 / 356.3 | 291.6 / 150.6 / 173.8 / 126.4 / 171 / 356.6 |

## Checks
0 unbound paints (own layers). Contrast: label / help 10.35 / 17.72, error 4.83 / 4.71; field border 1.48 / 2.29 (< 3:1, Aura default, known gap).
Fixed during build: a second REF call replaced the label's visible binding (one REF per node); the State=invalid variant was dropped — a swap-bound control resets to the property default, so invalid = Control › Invalid + Show error; nested control height can't be overridden in an instance → Address field built directly (Textarea rows 4); inline fields hug after resize; long labels wrap.

## Gaps
Horizontal label column is fixed 2/12 at 460. FloatLabel and the stacked (< md) Form Layout not built. Form Layout cards are frames (Card has no free content area).
