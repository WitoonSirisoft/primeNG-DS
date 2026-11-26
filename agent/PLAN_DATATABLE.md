# Plan: Batch 2 · DataTable (+ Paginator) — 2026-11-25

Status: **approved 2026-11-25** (#80–#83): paginator together, text + swap slot, sizes + striped + gridlines, example now on 99 Sandbox.
Reference: Sakai CRUD page (`src/app/pages/crud/crud.ts`): toolbar, caption with search, header row with select-all checkbox and sortable columns, body rows (checkbox, text, image, price, category, rating, Tag status, edit/delete rounded outlined buttons), paginator.

## How a table works in Figma
A Figma table is assembled from **cell components** placed in columns (each column = a vertical auto-layout of cells, so widths line up and a column can be resized at once). The DataTable "component" is therefore a kit of parts plus an assembled example.

## Proposed parts
| Part | Axes / properties (draft) | Aura tokens |
|---|---|---|
| `DataTable Header Cell` | Size 3 · Sort (none, unsorted, ascending, descending) · State (default, hover) · Text · optional select-all checkbox | datatable.header-cell.*, sort-icon.* |
| `DataTable Body Cell` | Size 3 · Row state (default, hover, selected) · Striped (yes/no) · content (see question 2) | datatable.row.*, body-cell.* |
| `DataTable Caption` / `Footer` | header bar (title + search), footer bar | datatable.header.*, footer.* |
| `Paginator` | first/prev/pages/next/last, current page, rows-per-page Select | paginator.* (separate PrimeNG component) |
| Example: Products table | Sakai CRUD replica, assembled from the parts, on 99 Sandbox for comparison | — |

## Steps
1. Export `datatable` + `paginator` tokens, push the new variables (patch + fingerprint).
2. Stories + capture plan: CRUD-like table (default, row hover, selected rows, sorted column, sizes, striped, gridlines) and paginator states → **Witoon runs the capture**.
3. Generator `figma-datatable.mjs` (update in place, #68) → verify → compare → stress (long text, many columns, Dark) → docs → review.

## Questions
1. Paginator in this step?
2. Body cell content: fixed content types, or text + a swap slot?
3. Options: sizes, striped rows, gridlines?
4. Assembled example now (sandbox) or only in batch 4 patterns?
