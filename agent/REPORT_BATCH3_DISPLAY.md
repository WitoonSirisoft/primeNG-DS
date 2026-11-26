# Report: Batch 3 group 2 · Avatar, Avatar Group, Chip — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5 ×3)** (on `02 Components`). Decision #100.
Generator: `scripts/figma-display.mjs` + plugin code `scripts/figma-display.body.js` (`npm run figma:display`; first build `-- --fresh`) → `calls/26-display-1.js`.
Text styles added: Avatar/Label, Avatar/Label lg, Avatar/Label xl (41 text styles).

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Avatar | 306:4212 | 12 | Size × Shape × Content; Label, Icon, Group border |
| Avatar Group | 306:4255 | 3 | Size; 5 exposed circle avatars (A–D, +2), negative gap = group offset |
| Chip | 306:4304 | 2 | Removable; Label, Show icon, Icon |
| Docs | 307:7362 / 307:7377 | — | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | 307:7003 / 307:7288 | — | Light + Dark |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Avatar normal / large / xlarge | 28 / 42 / 56 | 28 / 42 / 56 |
| Avatar Group normal / large / xlarge | 98 / 154 / 196 wide | 5 × size − 4 × offset (same) |
| Chip label / removable | 62 × 31 / 79.5 × 31 | 61.44 × 30.8 / 78.94 × 30.8 |
In a group the 2px ring is white on white, so the visible circle is 4px smaller (same in browser and Figma).

## Checks
0 unbound paints of 88. Screenshots match (label/icon avatars, circle/square, group overlap + ring, chips with icon / remove icon), Light + Dark.

## Accessibility
See doc frames (computed). Chip remove icon target 14 × 14 (below the 24 × 24 WCAG 2.2 minimum) — noted for projects.

## Gaps
Image avatars / chips not built (Figma can't load remote images; use an image fill). Circle = radius 9999 (#47). OverlayBadge not built.
