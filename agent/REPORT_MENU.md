# Report: Batch 2 · Menu — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5)** (on `02 Components`). Decisions #95, #96.
Generator: `scripts/figma-menu.mjs` (`npm run figma:menu`; first build used `-- --fresh`, no sync helper) → `22-menu-1.js`; example `22-menu-example.js`. Update in place (#68) = run without `--fresh`.
Story: `menu.stories.ts` (layout plain | overlay | popup; disabled). Captures: plain, plain-hover, overlay, overlay-disabled, popup × Light + Dark.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Menu Item | 284:4008 | 3 | State default / focus / disabled; Label, Show icon, Icon |
| Menu Submenu Label | 284:4020 | — | Label |
| Menu Separator | 284:4022 | — | 1px, menu/separator/border-color |
| Menu | 284:4024 | 2 | Popup false / true (menu/shadow); prefilled exposed rows |
| Doc frame | 285:16629 | — | |
| Examples (99 Sandbox) | 285:16350 | — | A Sakai plain (hover), B overlay items (Update disabled), C popup, D stress (no icons, long label); Light + Dark |

Tokens: new `typography/menu-item-label/line-height` = 1 (Semantic, read from PrimeNG CSS `.p-menu-item-label`, #96) → 1,365 variables, fingerprint 9712a1e2 (expected; Figma not re-fingerprinted yet). Text style `Menu/Item label` (32).

## Sizes vs browser (CSS px from the 2× captures)
| | Figma | Browser |
|---|---|---|
| Plain (2 groups, 4 items) | 284 × 192.6 | 284 × 192.59 |
| Overlay items (4 items + separator) | 284 × 130 | 284 × 130 |
| Popup | 175 × 130 | 175 × 130 |
| Item | 28 | 28 |
| Group label | 30.8 | 30.8 |

## Checks
All colours, paddings, gaps, radii and the icon size are bound to variables; disabled opacity bound to `disabled-opacity`; popup shadow = effect style `menu/shadow`. Screenshot of the examples checked once (Light + Dark).

## Known differences
1. Sakai's plain menu uses `pi-fw` icons (18 wide, centred) → its labels sit 4px further right than in the Base (14 icons). Derived from CSS, not measured.
2. Group label height is fixed at 30.8: Figma rounds the 16.8 text box to 17. If the text style size changes, update the height.
3. Width does not grow with a long label (CSS popup widens to fit content); resize the instance (stress D).

## Fix log
1. Separator instance cannot be exposed (no properties) → only items and labels are exposed.
2. Hidden rows were not found in instances → `figma.skipInvisibleInstanceChildren=false` in the example.
3. Label text style needed `line-height: 1` → token read from PrimeNG CSS (export-tokens.mjs), text style `Menu/Item label`.
