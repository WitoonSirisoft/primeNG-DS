# Report: Batch 1 · Group C (Select) — 2026-11-25

Status: **reviewed and approved 2026-11-25 — visual 5** (on `02 Components`). Plan: `agent/PLAN_GROUP_C.md`. Decisions #73–#75.
Generator: `scripts/figma-select.mjs` (`npm run figma:select -- --set=field|panel`), calls `14-select-field-1.js` (+ verify) and `14-select-panel-1.js`. Update in place (#68).

## Built
| Component | Node | Variants | Notes |
|---|---|---|---|
| Select (field) | 213:456 | 144 | Size × Variant × State × Invalid × Content; Placeholder, Value, Show clear (#75); 196 wide, fluid |
| Select Option | 215:3357 | 8 | State (default, focus, selected, selected-focus) × Check (none, blank, checked) |
| Select Option Group | 215:3392 | 1 | Label |
| Select Panel | 215:3396 | 3 | Content (options, grouped, empty) + Filter (IconField instance) |
| Doc frame | 216:927 | — | covers all four |
| Stress / compare frame (99 Sandbox) | 213:5119 | — | base states, open panels, fluid 320, long value, Dark |
New: text styles `Select/Text sm|base|lg`, `Select/Group` (Base now 22 text styles); derived variable `select/option/check-padding-left` (5.25) → **1,091 variables, fingerprint 482170e2 ✅**.
Story `select.stories.ts`: Open story gets `grouped` / `empty` args (cell 320 high); capture plan +3 (filter, grouped, empty). Re-captured by Witoon.

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Field sm / base / lg | 196 × 27.5 / 33 / 38.5 | 196 × 27.19 / 32.8 / 38.39 (same text-box rounding as InputText) |
| Option row | 31 | 30.5 |
| Panel options / filter / grouped / empty | 172 / 215.5 / 205 / 40 | ≈ 170 / 213 / 201 / 39 (measured from the 2× captures; +0.2–0.5 per row) |

## Visual check
Field: placeholder, value, hover, focus, disabled, invalid, show clear, filled — match. Panels: options, checkmark mode, filter, grouped, empty — match. Rome in the example panels = selected-focus (#d1fae5, same pixel as the browser) because PrimeNG focuses the selected option on open. Filter input in the capture is focused (green); the Figma example shows it at rest.

## Binding scan
Field verify 144: **0 errors**. All four parts: **0 unbound paints**.

## Stress test (frame 213:5119)
Fluid 320 (text fills, icons stay right) · long value ends with … · Show clear on · Dark (Semantic + Components): field + panel with filter · override of a panel row label kept.

## Accessibility (computed)
Text Light / Dark: option 10.35 / 17.72, selected 5.21 / 10.22, selected + focus 6.78 / 8.53, group header 4.76 / 6.91, placeholder 4.76 / 7.76 — all pass 4.5:1. Field border as InputText (below 3:1, Aura default).

## Fix log
1. Derived variable needed the second value of the `select.option.padding` shorthand (generator + verify fixed).
2. `figma-variables.mjs` flagged 12-/13-/14- component calls as stale → filter updated.
3. Example panels used `selected`; captures show `selected-focus` → generator data changed, applied to the two example rows.

## Not built
Editable select, loading state, virtual scroll, disabled option, filter clear icon (documented).

## Needs Witoon's decision
1. Visual score (1–5) per component.
