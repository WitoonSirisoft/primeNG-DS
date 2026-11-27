# Report: Batch 5 group 2 · Dashboard (+ App Page empty / crud) — 2026-11-27

Status: **APPROVED 2026-11-27 (visual 5)**. Decision #105 (choices: widget components + template; layout/dashboard/* tokens; product photos = placeholders).
Story `dashboard.stories.ts` renders the real Sakai <app-dashboard> (1076 wide on surface-ground); capture `dashboardPlan` (viewport 1500 × 1600, new entry option `wait` for the chart). No generator (direct plugin calls).
Tokens (pushed with your OK): 13 layout/dashboard/* + text styles Dashboard/Value, Dashboard/Label → **2,089 vars, fp 2d7f4f52 ✅**, 62 text styles.

## Built
| Part | Page | Node | Notes |
|---|---|---|---|
| App Page | 04 Templates | 373:2150 | Page empty (desktop / mobile), crud (desktop), **dashboard** (377:9905, 1440 × 1388) |
| Stat Card | 03 Patterns | 377:6816 | 4: Color blue / orange / cyan / purple (Orders, Revenue, Customers, Comments) |
| Recent Sales | 03 Patterns | 377:6817 | DataTable header / body cells (Image, Name ↕, Price ↕, View), 5 rows, Paginator (pages 1–2) |
| Best Selling Products | 03 Patterns | 377:7041 | 6 items, progress track + *-500 fill + % |
| Revenue Stream | 03 Patterns | 377:7104 | static stacked bar chart (primary 400 / 300 / 200), legend items, 0–25,000 |
| Notifications | 03 Patterns | 377:9385 | 3 groups, round tiles (3rem), rich text (strong / secondary / primary bold) |
| Product Thumbnail | 03 Patterns | 377:6847 | image placeholder 42 × 28 |
| Dashboard Content | 03 Patterns | 377:9447 | stats row + 2 columns, 1076 wide |
| Doc | 03 Patterns | 377:11958 | shared format + computed accessibility |
| Examples (99 Sandbox) | | 377:10467 | Light + Dark content, Dark template |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Dashboard content | 1076 × 1230 | 1076 × 1230 |
| Stat / Recent Sales / Best Selling / Revenue / Notifications | 142 / 456 / 463 / 444 / 588 | 141 / 455.7 / 461.9 / 444.5 / 586.4 |

## Checks
0 unbound paints of 98 (own layers). Contrast: text passes; Light primary highlights 2.54, orange % 2.8, cyan % 2.43 below 4.5 (Sakai / Aura colours, known gap). Fixed after measuring: notification tiles 3rem (42, not 48), Best Selling last item keeps mb-6, paginator inside the table (no gap), stat footer as one text (space kept), y ticks with thousands separators.

## Fix after review (image cells)
The thumbnails were swapped into the DataTable Body Cell Content slot, which keeps the slot's 68 × 23 size (a nested instance can't be resized inside another instance) → overflow and a wrong ratio. Image cells are now frames with the body-cell padding / border and a 42 × 28 Product Thumbnail (3:2, fits the 15% column, as in the browser). Row borders were hidden by the cells' own Background layer when the cells fill the row height → Background hidden in this widget (row bg = card bg); lines now match the browser. To check later: the same Background-over-border effect in DataTable Body Cell when cells are stretched.

## Gaps
Photos are placeholders; popup menus, hover / sort states and the mobile stacking not built; chart is static.
