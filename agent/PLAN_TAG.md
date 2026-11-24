# Plan: Tag (SPEC 8.2), Day 5, decision #55 (2026-11-24)

```
Component: Tag
PrimeNG: <p-tag> (primeng 21.0.2, Aura via @primeuix/themes 2.0.2)
Source CSS: node_modules/@primeuix/styles/dist/tag/index.mjs (read 2026-11-24)
Inputs mapped: severity (none = omitted → primary tokens, secondary, success, info, warn, danger, contrast), rounded, value, icon
Inputs not mapped: style, styleClass (no visual)
Design-only: none (Tag has no interactive states)
Variants: Severity 7 × Rounded 2 = 14 (#55); icon via `Show icon` (boolean) + `Icon` (swap, default Icon/check)
Sub-parts: Container (auto layout) › Background (absolute, fill + layer opacity) · Icon (instance) · Label (text property `Value`, default "Tag")
Tokens: tag/padding-y|x, tag/gap, tag/border-radius, tag/rounded-border-radius, tag/icon/size, tag/<sev>/background,
        tag/<sev>/background-opacity (primary, success, info, warn, danger: Dark color-mix 16%), tag/<sev>/color,
        text style Tag/Label (font-size tag/font-size, weight tag/font-weight)
Missing: none (checked against tokens/figma/plan.json)
Expected size (screenshots/manifest.csv, 56 captures): 32.55 × 21.69 without icon, 46.55 × 21.69 with icon.
```

## CSS rule → Figma
| Aura rule | Figma |
|---|---|
| `.p-tag` inline-flex, center, padding, radius, gap, font-size/weight | Container: auto layout horizontal, center, Hug × Hug; padding `tag/padding-y|x`, gap `tag/gap`, radius `tag/border-radius`; text style `Tag/Label` |
| `.p-tag` background / color (primary default), `.p-tag-<sev>` | Background layer fill `tag/<sev>/background`, layer opacity bound to `tag/<sev>/background-opacity` where it exists (Dark color-mix 16%, Light 100); label + icon fill `tag/<sev>/color` |
| `.p-tag-icon` font-size/width/height = icon size | Icon instance width + height bound to `tag/icon/size` (10.5) |
| `.p-tag-rounded` | Rounded=true: radius `tag/rounded-border-radius` |

## Validation
Node: 14 names, all variables in plan.json. Figma verify: bindings, 0 literal paints, sizes vs 32.55/46.55 × 21.69. Stress: long value, icon swap, Dark, primary swap.
