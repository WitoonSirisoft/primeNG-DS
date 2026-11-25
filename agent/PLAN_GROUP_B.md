# Plan: Batch 1 · Group B (Checkbox, RadioButton, ToggleSwitch) — 2026-11-25

Status: **approved 2026-11-25** (#69–#71): controls only, full sets, ToggleSwitch design-only sizes (rem steps), indeterminate included.
Generator: `scripts/figma-toggles.mjs` (built 2026-11-25, see REPORT_GROUP_B.md) (one generator, 3 sets), using the update-in-place helper `lib/figma-sync.mjs` (#68). Built on `02 Components`.

## What the browser shows (screenshots/manifest.csv)
| Component | Sizes (px) | Axes in code |
|---|---|---|
| Checkbox | small 14 · base 17.5 · large 21 (square) | size, variant outlined/filled, checked no/yes, indeterminate, invalid, disabled |
| RadioButton | small 14 · base 17.5 · large 21 (circle) | size, variant outlined/filled, checked no/yes, invalid, disabled |
| ToggleSwitch | **35 × 21 for every size** | checked no/yes, invalid, disabled (Aura has no toggleswitch size or filled tokens) |

## Tokens (all already in the Base)
- Checkbox 33: box (width/height ×3 sizes, radius, background, filled-background, border colours per state, checked background/border per state, disabled, invalid, shadow), icon (colour per state, size ×3), focus ring.
- RadioButton 31: same as Checkbox; the "icon" is the inner dot (size ×3, colour per state).
- ToggleSwitch 32: track (width, height, radius, border width, background/border per state, gap = handle inset), handle (size, colour per state), focus ring.
- No border-width token for Checkbox / RadioButton: Aura CSS is a literal `1px` (same as InputText).

## Proposed structure
| Set | Axes | Variants |
|---|---|---|
| Checkbox | Size 3 × Variant 2 × State 4 (default, hover, focus, disabled) × Invalid 2 × Checked 3 (no, yes, indeterminate) | 144 |
| RadioButton | Size 3 × Variant 2 × State 4 × Invalid 2 × Checked 2 | 96 |
| ToggleSwitch | Size 3 (design-only sm/lg, #71) × State 4 × Invalid 2 × Checked 2 | 48 |
- Checked icon = `Icon/check`, indeterminate = `Icon/minus` (PrimeNG draws its own SVG check/minus; I'll compare against the screenshots and report any visible difference).
- Focus = ring frame outside the box (focus-ring width / offset / colour), like Button.
- Invalid keeps the red border in hover/focus (#53, Angular forms).
- Labels are not part of the components (PrimeNG uses a separate `<label>`); see question 1.

## Gates
Generator → verify (0 unbound paints, bindings) → compare with screenshots → stress test (Dark, label next to control, theme swap) → docs (doc frame, MAPPING, COMPONENTS, REPORT_GROUP_B.md) → your review.

## Questions
1. Labels: control only (as in code) or also a labelled version now?
2. Variant coverage: full set (256 in total) or reduced?
3. ToggleSwitch size: no Size axis (Aura has none) or design-only sizes?
4. Checkbox indeterminate: include as Checked=indeterminate?
