# Report: Batch 5 group 1 · Auth pages + 404 — 2026-11-27

Status: **APPROVED 2026-11-27 (visual 5)**. Decisions #104 / #105 (choices: gradient with bound stops, placeholder illustrations, layout/auth/* tokens).
Story `authpages.stories.ts` (Sakai pages copied; logo = placeholder mark) + capture `authpagesPlan` (8 images, viewport 1500 × 1000). No generator: composition of approved instances, built with direct plugin calls.
Tokens (pushed with your OK): 24 layout/auth/* + 6 text styles Auth/* → after the h1 fix (line-height 1 → 1.2, Sakai typography wins over Tailwind) **2,076 vars, fp 4022a95d ✅** (repo plan matches), 60 text styles.

## Built
| Part | Page | Node | Notes |
|---|---|---|---|
| Auth Page | 04 Templates | 367:6747 | 4: login (367:6497), access (367:6565), error (367:6621), notfound (367:6677); 1440 × 900 |
| Floating Configurator | 02 Components | 367:6474 | theme (secondary rounded) + palette (primary rounded) Button Icons; top-right 2rem |
| App Logo | 02 Components | 351:6481 | mark now scales with the slot size (no auto layout, constraints Scale) |
| Doc | 04 Templates | 369:1141 | shared format + computed accessibility |
| Examples (99 Sandbox) | | 369:2 | Light + Dark × 4 pages |

## Sizes vs browser
| Card | Figma | Browser |
|---|---|---|
| Login | 568.4 × 557.4 | 568 × 554 |
| Access | 552 × 726 | — × 719 |
| 404 | 518 × 689 | — × 687 |

## Checks
0 unbound paints / gradient stops of 45. Gradient stops bound to variables (Figma takes the alpha from the variable → 40% / 0% stops are their own tokens; 404 start = primary on a 40% opacity layer). Contrast: text passes; Light primary 2.54 (404 code, Forgot password) and Light orange access icon 2.8 below target (Aura / Sakai colours).
Fixed after the capture: logo mark didn't scale; password spacing 14 (only one of mb-4 / mt-2 applies); h1 margin 1.5rem 0 1rem + line-height 1.2 from Sakai _typography.scss (unlayered CSS beats Tailwind).

## Gaps
Illustrations are placeholders; Sakai logo → App Logo slot; mobile (< 640) and the configurator panel not built.
