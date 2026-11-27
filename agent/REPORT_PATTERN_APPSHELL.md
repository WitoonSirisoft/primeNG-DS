# Report: Batch 4 pattern 1 · App shell — 2026-11-27

Status: **APPROVED 2026-11-27 (visual 5)**. Decision #103 (choices: logo slot, desktop + mobile, Light/Dark).
Generator: `scripts/figma-appshell.mjs` + `scripts/figma-appshell.body.js` (`npm run figma:appshell`; first build `-- --fresh`) → `calls/35-appshell-1.js`.
Story: `appshell.stories.ts` (Sakai layout classes, placeholder logo; wrapper `transform` so fixed parts position inside). Capture: new per-entry `viewport` option (desktop 1500 × 1000, mobile 420 × 900).
Tokens (pushed with your OK): 25 Sakai layout variables (layout/topbar/*, layout/main/*, layout/footer/*, layout/sidebar/top|left) + text style Topbar/Logo, then layout/surface-ground (surface 100 / 950) → **2,051 vars, fp 2fe19480 ✅**, 53 text styles.

## Built
| Part | Page | Node | Notes |
|---|---|---|---|
| Topbar Action | 02 Components | 351:6472 | 3: default / hover / highlight; Icon swap; 2.5rem circle |
| App Logo | 02 Components | 351:6481 | logo slot, placeholder mark (primary), 42 wide |
| Topbar | 02 Components | 351:6484 | 2: Device desktop / mobile; App name, Logo swap; actions exposed; long names truncate |
| Layout Footer | 02 Components | 351:6541 | Text + bold primary Link, top border |
| App Shell | 03 Patterns | 351:6545 | 2: desktop 1440 × 900 / mobile 390 × 844; vertical auto layout (your request): Topbar → Body [Sidebar column (left 28, top/bottom 28) + Main container (Main + Footer, space between)]; sidebar lands at 28,84 280 × 788, card at 336,84 — same as Sakai; Card + Footer + Sidebar Menu exposed |
| Doc | 03 Patterns | 352:866 | shared format + computed accessibility |
| Topbar doc | 02 Components | 356:2 | Topbar + Topbar Action + App Logo; computed accessibility (added 2026-11-27 on request) |
| Examples / stress (99 Sandbox) | | 352:2 / 352:691 | Light + Dark; long app names |

## Checks
Layout matches the captures (topbar 56, content top 84 / sides 28, sidebar left 28 top 84, footer at the bottom of the 900 frame). 0 unbound paints of 73 (Sidebar Menu / Card instances excluded). Contrast: text passes; Light palette icon on primary 2.54 and footer link (primary on surface-ground) 2.32 — Aura Light primary (known gap, fix in project theme).

## Gaps
Top padding 28 = 6rem − 4rem topbar (no single token; literal); the rest of the spacing is bound to layout/* tokens. Sidebar collapsed, mobile overlay menu and topbar dropdown not built. Long app names truncate (design choice; Sakai overflows). Sidebar items are the Sidebar Menu defaults, not the Sakai full menu.
