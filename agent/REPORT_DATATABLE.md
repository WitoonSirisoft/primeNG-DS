# Report: Batch 2 · DataTable + Paginator (+ Button Icon) — 2026-11-25

Status: **reviewed and approved 2026-11-25 — visual 5** (on `02 Components`). Decisions #80–#87.
Generators: `scripts/figma-datatable.mjs` (`npm run figma:datatable`) → calls `16-datatable-1.js` (cells), `16-datatable-2.js` (bars, paginator), `16-datatable-example.js` (Sakai CRUD example). Button Icon: `scripts/figma-button.mjs --set=icon` → `07-button-icon-*.js` (+ verify). Update in place (#68).

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| DataTable Slot | 223:3491 | — | dashed placeholder, hug (#84) |
| DataTable Header Cell | 223:3495 | 54 | Size 3 × Sort/State 5 × Gridlines 2 × Title fit/wrap (wrap for sortable only, #87); Text, Show text, Show content, Content |
| DataTable Body Cell | 223:3724 | 36 | Size 3 × Row 3 × Striped 2 × Gridlines 2; same properties |
| DataTable Header (caption) | 224:3582 | 6 | Size 3 × Gridlines 2; Title, Show search (IconField) |
| DataTable Footer | 224:3631 | 6 | Size 3 × Gridlines 2; Text |
| Paginator Button | 224:3650 | 15 | first/prev/next/last × default/hover/disabled; page × default/hover/selected |
| Paginator | 224:3723 | 2 | Report no (page 1) / yes (page 3 + report + rows-per-page Select) |
| Button Icon | 230:725 | 864 | #85, same axes as Button |
| Doc frames | 246:1588 (DataTable), 246:1601 (Button Icon) | — | |
| Example (99 Sandbox) | 243:2330 (helpers 243:1752) | — | Sakai CRUD "Manage Products", 5 products |
| Stress frame (99 Sandbox) | 244:1694 | — | Light + Dark, sizes, gridlines, striped, hover, selected, long text, paginator |
Tokens: 156 new variables (1,247, fingerprint 3d8159c9). Text styles: DataTable/Column title, DataTable/Column footer (27).

## Sizes vs browser (CSS px from the base capture)
| | Figma | Browser |
|---|---|---|
| Table width (9 columns) | 986 | ~986 |
| Header row (with select-all checkbox) | 39.5 | 40 |
| Body row with 64px image | 64.67 | 64 |
| Paginator | 49 | 49 |
| Row action button (rounded icon only) | 35 × 35 | 35 × 35 |
| Caption | 55 | 62 (story Tailwind classes not applied; known story difference) |
| Rows-per-page Select | 75 | ~73.6 (Figma measures "10" ~1.4px wider) |

## Visual check
Base light example vs `datatable__size-base__state-default__light.png`: same layout, columns, text, sort icons, tags, stars, buttons, paginator. Differences: product photos are placeholders (images can't be created by the plugin API); rating is a local helper (no Rating component yet); caption height (above).

## Binding scan
DataTable sets: **0 unbound paints** (scan of all 7 sets). No separate verify call exists for the DataTable generator (bindings were checked by the scan and by reading heights). Button Icon: verify 864 checked, **0 errors** after the fix below, 0 literal paints.

## Stress test (244:1694)
Body text wraps and rows grow (selected long row 62.5 / 90 / 97 for sm / base / lg). Dark mode resolves all tokens. Caption title wraps after fix 4. Long header titles: Title=wrap wraps the title and moves the sort icon to the next line, as Sakai (#87; tested at 176 and 140 wide).

## Fix log
1. Figma resets other stroke sides when one side is set to 0 → gridline/header borders lost a side. Sync helper now writes all four sides when any differs (`figma-sync.mjs`); 33 cells + 3 header bars patched.
2. A fixed-size component swapped into a slot keeps the slot's size, and nested instances can't be resized by script → rule #84 (swap targets hug); DataTable Slot made hug.
3. Button had no icon-only size (37 × 32.8 vs 35 × 35) → Button Icon set (#85). Built with faster direct calls; first verify found 24 loading variants whose hidden right icon had a swap link the generator does not set → removed (120 variants).
4. Caption title did not wrap; a long title pushed the search out → title Fill + wrap.
5. Rows-per-page Select fixed at 73 truncated "10" → width computed from the text.
6. Long header titles were cut off → Title fit/wrap axis (#87, replaces #86).

## Accessibility (computed, 14px text needs 4.5:1)
| | Light | Dark |
|---|---|---|
| row / hover / striped | 10.35 / 13.35 / 9.9 | 17.72 / 14.9 / 19.9 |
| selected row / sorted header | 5.21 / 5.21 | 12.98 / 12.98 |
| header / sort icon | 10.35 / 4.76 | 17.72 / 6.91 |
| paginator selected page / report | 5.21 / 4.76 | 12.98 / 6.91 |
All AA.

## Known gaps
- Long header titles: the designer picks Title=wrap (Figma can't switch layout by text length).
- Selected row's top border (CSS colours the row above's bottom border) not automatic.
- Gridlines: right border of last column and bottom of last row added by hand.
- No Rating component; product images are placeholders.

## Addendum: table overflow scrollbar (#88) — approved 2026-11-25, visual 5
| Set | Node | Variants | Notes |
|---|---|---|---|
| Scrollbar | 251:6309 | 2 | design-only, macOS overlay look; doc 253:9905 |
| Overflow A (horizontal) | 253:9049 | — | 986 table in 600 container; thumb 362.68 (= 596 × 600 / 986) |
| Overflow B (vertical, scrollHeight 200) | 253:9146 | — | header row outside the container; thumb 121.23 (= 196 × 200 / 323.35) |
- New design-only variables: scrollbar/size 7, scrollbar/inset 2, scrollbar/thumb-color black 50% / white 50% → 1,250 variables, fingerprint f4eea6d2 (checked in Figma).
- Values are commonly documented macOS overlay values, not measured (headless captures hide overlay scrollbars).
- Fix log: resizing the Thumb layer inside an instance is ignored by Figma → thumb fills the bar and the instance padding sets its start / end.
- Generator: scripts/figma-scrollbar.mjs (npm run figma:scrollbar) → calls/17-scrollbar-1.js; example calls/17-scrollbar-example.js; variables patch patches/batch2-scrollbar.js.

