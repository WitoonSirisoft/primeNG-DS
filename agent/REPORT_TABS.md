# Report: Batch 2 · Tabs — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5; up to 5 tabs enough)** (on `02 Components`). Decision #98.
Generator: `scripts/figma-tabs.mjs` (`npm run figma:tabs`; first build used `-- --fresh`) → `calls/24-tabs-1.js`. Update in place = run without `--fresh` (not run yet).
Story: `tabs.stories.ts` (layout panel | list; icons; badge; disabled). Captures: 6 states × Light + Dark (12).
Tokens: 53 `tabs/*` variables (1,431, fp 570691ab, checked in Figma); text style `Tabs/Tab label` (35).

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Tab | 294:4166 | 4 | State default / hover / active / disabled; Label, Show icon, Icon, Badge |
| Tab List | 294:4190 | — | 3 exposed tabs + Show tab 4 / Show tab 5; full-width bottom border |
| Tabs | 294:4222 | — | Tab List + Panel (Content text or Show slot → Tabs Slot) |
| Tabs Slot | 294:4163 | — | placeholder, swap for any hugging component (#84) |
| Doc frame | 295:6756 | — | |
| Examples (99 Sandbox) | 295:6361 | — | the 6 captured states, Light + Dark |
| Stress (99 Sandbox) | 295:6649 | — | 5 tabs + long label, narrow 320, slot, Dark icons + badge + panel |

## Sizes vs browser (CSS px from the 2× captures)
| | Figma | Browser |
|---|---|---|
| Tab list | 544 × 46 | 544 × 45.8 |
| Tab list with icons + badge | 544 × 50 | 544 × 50 |
| Tabs with panel | 544 × 200 | 544 × 199.8 |
| Tab "Header I" | 84.5 | 84 |

## Checks
- All colours, borders, paddings, gaps, opacity bound to variables; 0 unbound paints of 55.
- Screenshots match: muted inactive, darker hover, primary active + bar, disabled 60 %, badge circle, panel text 1.5 line height; Dark correct.
- Fixed during build: tabs stretch to the tallest tab (code = flex stretch); list/Tabs height hug after resize.

## Gaps
- Focus ring not modelled. Scrollable tabs (nav buttons + fade shadow) not built: in Figma long lists overflow. Nav-button effect styles are in the plan but not pushed.
- Active bar is drawn as the active tab's bottom border (same colour and place; the sliding animation is code-only).

## Review questions for Witoon
1. Visual score (1–5)?
2. Is "Show tab 4 / 5" (max 5 without duplicating) enough?

## Accessibility (computed in Figma, WCAG AA)
Light: tab 4.76 · hover 10.35 · active 2.54 (fails AA) · panel 10.35; active bar 2.54 (< 3:1). Dark all pass. Aura defaults, documented.
