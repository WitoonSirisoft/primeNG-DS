# Report: Batch 2 · Sidebar Menu — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5)** (on `02 Components`). Decision #97.
Source: Sakai layout menu (`app.menu.ts`, `app.menuitem.ts`, `assets/layout/_menu.scss`). Not a PrimeNG component.
Generator: `scripts/figma-sidebarmenu.mjs` (`npm run figma:sidebarmenu`; first build used `-- --fresh`) → `calls/23-sidebarmenu-1.js`. Update in place (#68) = run without `--fresh` (not run yet).
Story: `sidebarmenu.stories.ts` (active chart | login | none; expanded). Captures: 5 states × Light + Dark (10).

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Sidebar Menu Item | 287:4039 | 24 | State default / hover / active / active-hover × Toggler none / collapsed / expanded × Level 0 / 1; Label, Show icon, Icon |
| Sidebar Section | 287:4231 | — | Label; text style Sidebar/Section (UPPERCASE) |
| Sidebar Menu | 287:4234 | 2 | Expanded false (Chart active) / true (Auth open, Login active); exposed rows |
| Doc frame | 288:6429 | — | next to the set on 02 Components |
| Examples (99 Sandbox) | 288:5510 | — | the 5 captured states, Light + Dark |
| Stress (99 Sandbox) | 288:6187 | — | long labels wrap, no icons, Dark, resized to 220 |

## Sizes vs browser (CSS px from the 2× captures)
| | Figma | Browser |
|---|---|---|
| Sidebar, collapsed | 280 × 312 | 280 × 311.56 |
| Sidebar, expanded | 280 × 426 | 280 × 424.95 |
| Item row | 38 | 37.8 |
| Section label | 35 | 35.4 |
| Level 1 indent | 14 | 14 |
Differences come from Figma rounding text boxes to whole px (same as earlier components).

## Checks
- All colours, paddings, gaps, radii, icon sizes, sidebar width bound to variables (13 layout/* + Aura semantic). 0 unbound paints of 115.
- Screenshots match the captures (active colour + 700, hover background, toggler down/up, indent). Dark mode correct.
- Stress: long labels wrap and the toggler stays right; Show icon off removes the gap; narrower width keeps rows fluid.

## Gaps (documented in the doc frame)
- Focus state (inset focus ring) not modelled. Levels 2–4 not modelled.
- Icon slot 18 / toggler slot 13.5 are literals (pi-fw fixed width; no token).
- Expanded toggler = Icon/angle-up (code rotates angle-down by 180°; looks the same).

## Review questions for Witoon
1. Visual score (1–5) for Sidebar Menu, and for Menu (p-menu)?
2. Is Level 1 enough, or do you need deeper levels (2–4)?
3. Do you need the keyboard focus state?

## Accessibility (computed in Figma, WCAG AA)
Light: item 10.35 · active 2.54 (fails AA) · active+hover 2.32 (fails) · section 10.35. Dark all pass. Aura primary on white, documented.
