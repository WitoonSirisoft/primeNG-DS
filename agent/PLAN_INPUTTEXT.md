# Plan: InputText (SPEC 8.2), Day 5, decisions #50–#53 (2026-11-24) — draft for Witoon's check

```
Component: InputText
PrimeNG: pInputText directive on <input> (primeng 21.0.2, Aura via @primeuix/themes 2.0.2)
Source CSS: node_modules/@primeuix/styles/dist/inputtext/index.mjs (read 2026-11-24)
Inputs mapped: pSize (small/large → Size, #17), variant (outlined/filled), invalid, disabled, placeholder, value
Inputs not mapped (no visual): readonly (no Aura style, #51), fluid (= set instance width to Fill), type, name, ngModel
Design-only properties: State default/hover/focus (disabled maps to the input); Content placeholder/value/empty
Variants: Size 3 × Variant 2 × State 4 (default, hover, focus, disabled) × Invalid 2 × Content 3 = 144 (#50)
Sub-parts: Container (auto layout, stroke, shadow) › Text (TEXT property, Fill width)
Tokens needed: inputtext/* (padding, sm/lg padding + font-size, border-radius, background, filled-*-background,
               border-color, hover-/focus-/invalid-border-color, color, placeholder-color, invalid-placeholder-color,
               disabled-background, disabled-color), text styles InputText/Text sm|base|lg, effect style inputtext/shadow
Not used: inputtext/focus-ring/* (width 0, style none → no outline in Aura), inputtext.focus-ring.shadow (= none)
Missing: none (checked against tokens/figma/plan.json).
```

## CSS rule → Figma (one row per Aura rule)
| Aura rule | Figma |
|---|---|
| `.p-inputtext` padding, radius, 1px border, background, color, `box-shadow: inputtext.shadow` | Container: auto layout, padding `inputtext/padding-y|x`, radius `inputtext/border-radius`, 1px stroke `inputtext/border-color`, fill `inputtext/background`, effect style `inputtext/shadow` |
| `-sm` / `-lg` font-size + padding | Size=small/large: `inputtext/sm|lg/padding-*`, text style `InputText/Text sm|lg` |
| `:enabled:hover` border | State=hover: stroke `inputtext/hover-border-color` |
| `:enabled:focus` border + `box-shadow: focus.ring.shadow` (none) + outline width 0 | State=focus: stroke `inputtext/focus-border-color`, **shadow removed**, no focus-ring layer |
| `.p-variant-filled` (+ hover / focus) | Variant=filled: fill `inputtext/filled-background` / `filled-hover-background` / `filled-focus-background` |
| `:disabled` (opacity 1) | State=disabled: fill `inputtext/disabled-background`, value text `inputtext/disabled-color`; **no layer opacity** (unlike Button); border and shadow unchanged |
| `.p-invalid` border | Invalid=true: stroke `inputtext/invalid-border-color` in **every** state, incl. hover/focus (#53) and disabled |
| `::placeholder` / `.p-invalid::placeholder` | Content=placeholder: text `inputtext/placeholder-color`, or `inputtext/invalid-placeholder-color` when Invalid=true (also when disabled — Aura has no disabled placeholder rule) |
| value text | Content=value: text `inputtext/color` (disabled → `inputtext/disabled-color`); invalid does not change it |
| empty input | Content=empty: Text layer kept at opacity 0 so the height stays (as the browser keeps the line box) |
| `.p-inputtext-fluid` width 100% | not a variant: designer sets the instance to Fill |

## Construction
- **Container**: auto layout horizontal, Fixed width × Hug height. Default width = browser default `<input>` (size=20), measured in screenshots/manifest.csv: **small 149.5 × 27.19, base 172 × 32.8, large 194.5 × 38.39**. Width is a literal per Size (no Aura token; documented as design-only), height hugs. Stroke weight 1, inside.
- **Text**: TEXT properties `Placeholder` (default "Placeholder") and `Value` (default "Value"); placeholder variants bind to `Placeholder`, value/empty variants bind to `Value`. Width Fill, single line, truncate with ellipsis (like a real input). No per-variant text formatting (#48 lesson): only the fill differs.
- Generator: `scripts/figma-inputtext.mjs`, same pattern as Button (SPEC function validated in Node against plan.json, upsert by name, batches of 48, verify call). Page `02 Components` (#52).
- Light/Dark: nothing per mode; switching collections restyles every variant.

## Validation plan
- Node: 144 unique names, every bound variable exists in plan.json.
- Figma verify: count 144; every paint/stroke/padding/radius bound; literal scan 0 (except Content=empty opacity 0).
- Expected sizes above (from manifest.csv, 146 InputText captures incl. hover/focus/disabled/readonly).
- Browser (Sakai/Storybook, Day-2 stories state×variant, pSize×variant): width/height per size within 1px; screenshot side-by-side Light + Dark.
- Stress: long value (ellipsis), Fill width, Dark, primary swap (focus border follows primary).

## Risks
1. ~~Line height~~ resolved: heights match 120% text styles exactly (base 7×2 + 2 + 16.8 = 32.8; small 27.2; large 38.4).
2. Text-property formatting spread (#48): avoided by binding only fills per variant.
3. Invalid+hover/focus follows Angular forms (#53); `[invalid]` attribute users see a different hover/focus — documented in the report.
