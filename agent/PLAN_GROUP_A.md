# Plan: Batch 1 · Group A (Textarea, IconField, Password, InputNumber) — 2026-11-24, #61–#64

Source CSS: `@primeuix/styles/dist/{textarea,iconfield,password,inputnumber}`. Sizes: screenshots/manifest.csv (captured 2026-11-24).

## Textarea (standalone, #62) — 144 variants
Same generator rules as InputText (`figma-inputtext.mjs` with a `--set=textarea` profile): tokens `textarea/*`, effect style `textarea/shadow`, text styles **new** `Textarea/Text sm|base|lg` (font-size bound to `textarea/sm/font-size`, `typography/base/font-size`, `textarea/lg/font-size`). Multi-line text, top-aligned. Fixed size per Size (cols 24 × rows 3): **183.5×56.56 · 208×66.39 · 233.5×76.17** (line box 120% × 3 + padding + border).

## Shared: new derived variables (computed from themed values, like #34/#57)
| Variable | Formula (Aura CSS) | Base value |
|---|---|---|
| `iconfield/input-padding` | `form-field.padding-x × 2 + icon-size` (padding on the icon side) | 35 |
| `password/input-padding` | same formula, toggle-mask side | 35 |
| `inputnumber/stacked-input-padding` | `inputnumber.button.width + form-field.padding-x` | 45.5 |
CSS uses the base `form-field.padding-x` and `icon-size` for every size, so one value each.

## IconField (composed, #61) — 6 variants: Icon position left/right × Size 3
- Auto layout wrapper (Hug) holding one **InputText instance** (exposed: Variant, State, Invalid, Content, Placeholder, Value) with: width = InputText width − own side padding + 35 (**175.75 · 196.5 · 217.25**), padding on the icon side bound to `iconfield/input-padding`.
- **Icon** instance (swap, default `Icon/search`), absolute, inset `form-field/padding-x` from the icon side, vertically centred; size bound `form-field/sm/font-size` · `icon-size` · `form-field/lg/font-size`; colour `iconfield/icon/color`.

## Password (composed, #63) — 6 variants: Toggle mask false/true × Size 3
- InputText instance (exposed), Value shown as `••••••••`, Placeholder "Password".
- Toggle mask = true: right padding bound to `password/input-padding`, width − own side padding + 35 (**175.75 · 196.5 · 217.25**); eye icon (swap `Icon/eye` ↔ `Icon/eye-slash`) at inset `form-field/padding-x`, size `icon-size` (14, all sizes per CSS), colour `password/icon/color`.
- Not built: strength meter, clear icon (#63).

## InputNumber (composed, #64) — 12 variants: Buttons none / stacked / horizontal / vertical × Size 3
| Buttons | Structure | Size (sm · base · lg) |
|---|---|---|
| none | InputText instance, Value "42" | 149.5×27.19 · 172×32.8 · 194.5×38.39 |
| stacked | InputText, right padding `inputnumber/stacked-input-padding`; button group absolute right (inset 1, height −2): 2 buttons (`Icon/angle-up` / `Icon/angle-down`), width `inputnumber/button/width`, bg `inputnumber/button/background`, icon `inputnumber/button/color`, outer corners radius `inputnumber/button/border-radius` − 1 | ≈ +35 wide (207 base) |
| horizontal | [− button] [InputText, radius 0] [+ button]; buttons 1px border `inputnumber/button/border-color` (inner side 0), outer radius bound; icons `Icon/minus` / `Icon/plus` | +70 wide (242 base) |
| vertical | [+ button] / [InputText, radius 0, centred text] / [− button]; buttons full width, padding-y `inputnumber/button/vertical-padding`, border except the side touching the input | 172×90.8 base |
Icon size in buttons: `form-field/sm/font-size` · `icon-size` · `form-field/lg/font-size`. Button hover/pressed: documented only (#64).

## Build and checks
- `figma-variables.mjs`: + 3 derived variables, + 3 Textarea text styles → push (additive).
- `figma-inputtext.mjs --set=textarea`; new `figma-composite.mjs --set=iconfield|password|inputnumber` (instances of the InputText set by key, upsert by name).
- Verify: bindings (0 unbound paints), sizes vs the table above (±0.5px), Light/Dark scan. Stress: long value, Fill width, Dark, primary swap. Docs: report, MAPPING rows, doc frame. **One review for Group A.**
