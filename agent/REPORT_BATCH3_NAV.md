# Report: Batch 3 group 3 · Breadcrumb, Menubar — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5 ×2)** (on `02 Components`). Decision #100.
Generator: `scripts/figma-nav.mjs` + plugin code `scripts/figma-nav.body.js` (`npm run figma:nav`; first build `-- --fresh`) → `calls/27-nav-1.js`.
Capture script: new `clickSel` option (click before hover); menubar story arg `wide` (1100); plan open-customers = click Customers + hover New; + search-wide. Re-capture 2026-11-26: submenu still closed and the wide shot missing → the plan edit had not been saved (guard bug), now applied with clickSel on .p-menubar-item-content (optional re-run later; submenu built from tokens, not pixel-compared) (first run: hover did not open the submenu; at 784 the items wrap next to the search field).

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Breadcrumb Item | 309:4246 | 2 | State default / hover; Label, Show label, Show icon, Icon |
| Breadcrumb Separator | 309:4254 | — | chevron-right |
| Breadcrumb | 309:4257 | — | Home + 5 Sakai items with separators, exposed |
| Menubar Item | 309:4298 | 12 | Level root / submenu × State default / hover / active × Submenu |
| Menubar Submenu | 309:4358 | — | 2 exposed items + Show item 3 / 4; shadow menubar/submenu/shadow |
| Menubar | 309:4381 | — | 5 root items + End (IconField left / base; Show end, swap) |
| Docs | 310:8183 / 310:8198 | — | shared format + computed accessibility |
| Examples / stress (99 Sandbox) | 310:7271 / 310:8080 | — | Light + Dark, incl. open + nested submenu |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Breadcrumb height | 45 | 44.8 |
| Menubar (plain, 784) | 784 × 44 | 784 × 44 |
| Root item | 28 tall | 28 |
| Submenu item | 28 tall | 28 (compare after re-capture) |

## Checks
0 unbound paints of 86. Breadcrumb screenshots match (home, separators, muted items, hover darker, icons). Menubar plain / hover Quit match.

## Gaps
Focus ring not modelled. Menubar mobile mode (hamburger) not built; item wrap is code-only. Breadcrumb has no current-page style (PrimeNG default).
