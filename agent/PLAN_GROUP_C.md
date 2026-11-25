# Plan: Batch 1 · Group C (Select) — 2026-11-25

Status: **approved 2026-11-25** (#73–#75): full 144, panel with filter + option groups + empty message, Show clear = boolean property.
Generator: `scripts/figma-select.mjs` (built 2026-11-25, see REPORT_GROUP_C.md), update in place (#68). Built on `02 Components`.

## What the browser shows (screenshots/manifest.csv)
- Field: 196 wide (story sets 14rem; PrimeNG has no default width) × 27.19 / 32.8 / 38.39 (small / base / large). Same box as InputText, with a chevron trigger on the right (`select/dropdown/width` 2.5rem).
- States captured: default, hover, focus, disabled, invalid, filled variant, placeholder / value, show clear (× icon before the chevron).
- Open panel (204 × 260 capture): overlay with 5 options; the selected option has a highlight; with `checkmark` a ✓ sits before the label.

## Tokens (63 `select/*`, all in the Base)
Field (background, borders per state, colours, padding ×3 sizes, font size sm/lg, radius, shadow, focus ring), dropdown trigger (width, colour), clear icon colour, overlay (background, border, radius, shadow, colour), list (padding, gap, header padding), option (padding, radius, colour, focus/selected/selected-focus background + colour), checkmark (colour, gutters), option group (background, colour, weight, padding), empty message (padding).

## Proposed structure (same pattern as DatePicker: field + panel parts)
| Component | Axes / content |
|---|---|
| `Select` (field) | Size 3 × Variant 2 × State 4 × Invalid 2 × Content 3 (placeholder, value, empty) = 144, same rules as InputText (#50–#54, #72) · boolean `Show clear` · text properties Placeholder / Value · fluid by default (#67) |
| `Select Option` | State: default, focus (hover / keyboard), selected, selected-focus, disabled · boolean `Checkmark` · text `Label` |
| `Select Panel` | overlay with a list of Option instances (example: the 5 cities, Rome selected) · see question 2 for extras |

## Gates
Generator → verify (0 unbound paints) → compare with screenshots → stress test (long value, Dark, fluid width, panel overrides survive rebuild) → docs → your review.

## Questions
1. Field coverage: full 144 (as InputText) or reduced?
2. Panel extras: which of filter (search box), option groups, empty message?
3. Clear icon: boolean property on the field, or a separate variant?
