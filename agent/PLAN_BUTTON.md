# Plan: Button (SPEC 8.2), Day 5, approved 2026-11-20 (DECISIONS #33–#35)

```
Component: Button
PrimeNG: <p-button> (primeng 21.0.2, Aura via @primeuix/themes 2.0.2)
Inputs mapped: severity (8), size (3), outlined/text → Variant (3), rounded, raised, disabled, loading,
               label, icon, iconPos (left/right = `Icon left`/`Icon right` booleans; top/bottom = `Button Vertical` set, #33), badge, badgeSeverity (via nested Badge)
Inputs not mapped (no visual in Figma): type, tabindex, ariaLabel, autofocus, style, styleClass, badgeClass,
               buttonProps, hostName, loadingIcon (custom icon = swap Icon instance), fluid (= set instance to Fill)
Design-only properties: State (default, hover, focus, active are design-only; disabled, loading map to inputs)
Estimated variants: Button 864 (Severity 8 × Variant 3 × Size 3 × State 6 × Rounded 2)
                    + Button Link 18 (Size 3 × State 6) + Button Plain 36 (Variant outlined/text 2 × Size 3 × State 6)
                    + Button Vertical 36 (Icon position top/bottom × Size 3 × State 6) + Badge 7 (Severity, experimental)  = 961
Sub-parts: Container (auto layout, stroke) › Background (layer opacity for color-mix) · Focus ring · Icon (instance swap)
           · Label (text property) · Strut (hidden nbsp, keeps label line height when icon-only, as PrimeNG ::after) · Badge (instance)
Tokens needed: button/* (190 vars: padding, sm/lg padding + font-size, gap, border-radius, rounded-border-radius,
               icon-only-width ×3, badge-size, label/font-weight, focus-ring width/offset/style,
               <severity>/{background,hover-,active-background, border-color ×3, color ×3, focus-ring/color},
               outlined/<sev>/*, text/<sev>/* (+ -opacity), link/*, outlined|text/plain/*),
               disabled-opacity, typography/base/font-size, text styles Button/Label sm|base|lg,
               effect style button/raised-shadow, Icon/check, Icon/primeng-spinner, badge/* (31)
Missing: none. Added (derived, #34): button/focus-ring-radius (9), button/rounded-focus-ring-radius (31).
```

## Construction (per SPEC 6)
- **Container**: auto layout horizontal, center/center, Hug × Hug; padding bound to `button/padding-y|x` (sm/lg variants bound to `button/sm|lg/padding-*`), gap `button/gap`, radius `button/border-radius` (Rounded=true → `button/rounded-border-radius`), 1px stroke bound to the state's border color. Fill none.
- **Background**: absolute rectangle filling the container, fill bound to the state's background; layer opacity bound to the `-opacity` variable where the token is a color-mix (outlined/text hover & active, Dark). Same radius binding.
- **Label**: text property `Label` (default "Button"), text style `Button/Label <size>`, fill bound to the state's color.
- **Icon**: instance swap `Icon` (default `Icon/check`), boolean `Show icon`; size 14 / 12.25 / 15.75 by size (height bound to the size's font-size variable, width follows the glyph box); fill override bound to the state's color.
- **States** (from screenshots, real hover/active/focus): hover/active use `hover-*` / `active-*` tokens; **focus** = default colors + `Focus ring` layer: 1px stroke `button/<sev>/focus-ring/color`, offset 2px (`button/focus-ring/offset`); **disabled** = default colors, whole-button opacity bound to `disabled-opacity` (0.6); **loading** = disabled look + Icon swapped to `Icon/primeng-spinner` (shown even without an icon, as in code).
- **Raised**: boolean → shows a `Shadow` layer using effect style `button/raised-shadow`.
- **Icon-only**: turn off `Show label` → width becomes 35 / 28 / 42 (icon-only-width tokens) because padding + icon add up; height kept by the hidden Strut (32.8 / 28.7 / 37.0 like code). Rounded + icon-only = circle (radius = rounded token ≥ half height).
- **Badge**: boolean `Badge` shows a nested `Badge` instance (min-width/height overridden to `button/badge-size` = 14, as PrimeNG CSS does).
- Light/Dark: nothing per mode is built; switching the Semantic + Components collections to Dark restyles every variant.

## Validation plan
Literal-value scan = 0 (except the items in Q2 if literal is chosen); every variant beside its screenshot at 50%
(345 Light + 345 Dark references); stress test: 3× label, narrow width, Dark, each size, primary swap.

## Risks
1. 864 variants is large but within Figma limits; built in batches of ~100 per call, verified by count.
2. Screenshots exist for severity × style at base size and severity × size for solid; other combinations
   (e.g. outlined small hover) are built from tokens and checked by binding, not by image.
4. Icon left/right are two slots sharing one `Icon` swap property; turning both on shows two icons (not possible in code) — documented in the frame.
3. Icon glyph width varies (check = 14.875); icon height is bound, width is not.
