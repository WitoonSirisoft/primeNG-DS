# Report: Extras group 2 · Tree, TreeTable — 2026-11-26

Status: **APPROVED 2026-11-26 (visual 5)** (on `02 Components`). Decision #102.
Generator: `scripts/figma-tree.mjs` + plugin code `scripts/figma-tree.body.js` (`npm run figma:tree`; first build `-- --fresh`) → `calls/32-tree-1.js`.

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| Tree Node | 333:5840 | 9 | Toggle expanded/collapsed/leaf × State default/hover/selected; Label, Icon (swap), Show icon, Show checkbox; Checkbox exposed; width 200, label wraps |
| Tree | 333:5907 | 2 | Selection single/checkbox; Sakai files demo; nodes exposed; Children frames (padding-left tree/indent) |
| TreeTable Header Cell | 333:6049 | — | DataTable/Column title; bottom border 1 |
| TreeTable Body Cell | 333:6051 | — | Text; bottom border 1 |
| TreeTable Toggler Cell | 333:6054 | 9 | Toggle × Level 0/1/2 (16 px per level, PrimeNG inline margin); Text, Show checkbox; Checkbox exposed |
| TreeTable Row | 333:6118 | 3 | State default/hover/selected; cells Name/Size/Type exposed |
| TreeTable | 333:6155 | 2 | Selection plain/checkbox; Sakai files demo (Applications partial, Editor checked) |
| Docs | 335:2 / 335:17 | — | shared format + computed accessibility (all pass) |
| Examples / stress (99 Sandbox) | 334:2 / 334:1886 | — | Light + Dark; states; long labels, narrow widths |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Tree (both modes) | 384 × 262.5 | 384 × 262.5 |
| TreeTable | 624 × 318 | 624 × 317.8 |
| Node row / table row | 31.5 / 46.5 | 31.5 / 46.5 |

## Checks
0 unbound paints of 226 (Checkbox instances excluded). Selected backgrounds use a separate Background layer with bound opacity (`*-selected-background-opacity`, rule #25) — dark selected text 10.22 (was 1.76 with a solid fill). Fixed: long labels / cell text overflow (fixed widths + text FILL, wraps).

## Gaps
Tree: filter, loading, drag-drop, context-menu highlight not built; partial checking set by hand. TreeTable: columns equal width (long first column wraps hard when narrow — fix widths of Size / Type cells); sort icons, paginator, footer, resize, loading mask not built.
