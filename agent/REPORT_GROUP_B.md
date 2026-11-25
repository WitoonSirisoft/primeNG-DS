# Report: Batch 1 · Group B (Checkbox, RadioButton, ToggleSwitch) — 2026-11-25

Status: **reviewed and approved 2026-11-25 — visual 5 for all three**; invalid + disabled settled by #72 (on `02 Components`). Plan: `agent/PLAN_GROUP_B.md`. Decisions #69–#71.
Generator: `scripts/figma-toggles.mjs` (`npm run figma:toggles [-- --set=checkbox|radiobutton|toggleswitch]`), calls `13-<set>-1.js` + `13-<set>-verify-1.js`. Uses the update-in-place helper (#68): first build of new sets, so every layer was added (0 kept).

## Built
| Set | Node | Variants | Axes | Doc frame |
|---|---|---|---|---|
| ToggleSwitch | 207:360 | 48 | Size (sm/lg design-only, #71) × State × Invalid × Checked | 210:3917 |
| Checkbox | 208:360 | 144 | Size × Variant × State × Invalid × Checked (no, yes, indeterminate) | 210:3891 |
| RadioButton | 209:456 | 96 | Size × Variant × State × Invalid × Checked | 210:3904 |
| Stress frame (99 Sandbox) | 210:3792 | — | Light + Dark, controls with labels (long label wraps), sizes, disabled, invalid, focus | — |
New variables (7, derived): `checkbox/focus-ring-radius` (7 = radius 4 + offset 2 + width 1), `toggleswitch/sm|lg/width|height|handle-size` (design-only). Base now **1,090 variables**, fingerprint `73e212d0` ✅ (Figma = expected).

## Sizes vs browser (screenshots/manifest.csv)
| | Figma | Browser |
|---|---|---|
| Checkbox / RadioButton sm / base / lg | 14 / 17.5 / 21 | same |
| ToggleSwitch base | 35 × 21 | 35 × 21 |
| ToggleSwitch sm / lg (design-only) | 28 × 17.5 / 42 × 24.5 | 35 × 21 (no sizes in Aura) |

## Visual check (base, Light, against the screenshots)
Checkbox: unchecked, checked, indeterminate (dark minus on white box), hover, focus ring, disabled, invalid, filled — match. RadioButton: same set — match. ToggleSwitch: off/on, hover, focus ring, disabled (dark handle on light track), invalid — match.
Check / minus marks: Figma uses `Icon/check` / `Icon/minus`, PrimeNG draws its own SVG; no visible difference at these sizes.

## Binding scan (verify)
Checkbox 144 / RadioButton 96 / ToggleSwitch 48: **0 errors, 0 unbound paints** (size, fill, border, radius, shadow, focus ring colour/width/radius, icon/dot/handle colour and size, handle side, track border width, inset).
Allowed literals: border width 1 on Checkbox/RadioButton (CSS literal, no token), focus-ring position (computed from offset + width tokens; Figma cannot bind positions).

## Stress test (frame 210:3792)
Light + Dark (Semantic + Components modes): all colours switch. Long label wraps next to the control (control centred, gap 0.5rem as PrimeNG demos). Small/large sizes, disabled, invalid, focus shown.

## Accessibility (computed from the variables)
| | Light | Dark |
|---|---|---|
| Unchecked border (Checkbox / Radio) | 1.48 | 2.29 |
| Checked fill / mark | 2.54 | 9.22 |
| Invalid border | 2.77 | 9.34 |
| Indeterminate mark | 10.35 | 17.72 |
| Toggle track off / on | 1.48 / 2.54 | 1.70 / 9.22 |
WCAG 1.4.11 asks 3:1 for controls: Light fails everywhere except the minus mark (Aura/Sakai defaults, kept in the Base, as with the field borders). Real projects must raise these in the project theme.

## Fix log (agent-side)
1. Stress rows were fixed 100 px tall (frame default) → hug.
2. Doc frames overlapped (taller than the sets) → sets re-spaced (Toggle 11,253 → Checkbox 12,027 → Radio 12,835).

## Not built (decided)
Labels / form rows (#69, batch 4 patterns). Radio group and checkbox group layouts (pattern level).

## Needs Witoon's decision
1. Visual score (1–5) per set.
2. Invalid + disabled: Figma keeps red (#70, same as InputText); the browser shows the disabled border. OK to keep?

## Review 2026-11-25
Visual 5 ×3. Invalid + disabled → #72 (follow the browser): Checkbox 18 + RadioButton 12 variants rebuilt in place (border only, 30 writes, 0 layers added/removed); ToggleSwitch, InputText, Textarea unchanged (browser keeps red).
