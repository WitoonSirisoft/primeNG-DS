# tokens/: design tokens for the Base design system

**Source of truth for every Figma variable name and value** (SPEC section 2, priority 1).
Direction of truth: code → Figma (DECISIONS #2). Never edit `tokens.json` by hand.

| File | What it is |
|---|---|
| `base/tokens.json` | Aura defaults exported from the installed `@primeuix/themes` (generated) |
| `themes/*.json` | Override files: change **values only**, never names or structure (DECISIONS #4) |

Regenerate (from `app/sakai-ng`): `npm run tokens`. Re-run after any PrimeNG / `@primeuix/themes` update and commit the result with that update.

---

## 1. Collections and modes

| Collection (Figma) | JSON key | Modes | Tokens | Contents |
|---|---|---|---|---|
| `Primitives` | `primitives` | none | 248 | 22 color palettes (50–950) + 6 border radii |
| `Semantic` | `semantic` | Light, Dark | 144 | primary, surface, text, content, form-field, focus-ring, highlight, overlay, list, navigation, mask, … |
| `Components` | `components` | Light, Dark | 225 | `button` (175), `inputtext` (29), `tag` (21) |

Total: **617** tokens. Only the 3 pilot components are exported (Aura has 88); add more with `--components=`.

## 2. Naming rule (code ↔ JSON ↔ Figma ↔ CSS)

A token's **path** is its key path in the Aura preset, with each camelCase key written in kebab-case. A component's `root` group is dropped (PrimeNG does the same).

| Aura preset key | Token path (JSON) | Figma variable | CSS variable |
|---|---|---|---|
| `semantic.formField.paddingX` | `form-field.padding-x` | `form-field/padding-x` | `--p-form-field-padding-x` |
| `semantic.colorScheme.light.primary.color` | `primary.color` | `primary/color` (Light mode) | `--p-primary-color` |
| `components.button.root.paddingX` | `button.padding-x` | `button/padding-x` | `--p-button-padding-x` |
| `components.button.colorScheme.light.outlined.primary.borderColor` | `button.outlined.primary.border-color` | `button/outlined/primary/border-color` | `--p-button-outlined-primary-border-color` |
| `primitive.emerald.500` | `emerald.500` | `emerald/500` | `--p-emerald-500` |

Rules:
- **Figma variable name = token path with `.` replaced by `/`.** Mechanical, no exceptions.
- **CSS variable = `--p-` + token path with `.` replaced by `-`.** Stored in each token's `$extensions.primeng.cssVar`.
- Paths are unique across all three collections, so an alias never needs a collection prefix.

## 3. Token format

```jsonc
"padding-x": {                       // button.padding-x
  "$type": "dimension",
  "$value": "{form-field.padding-x}",            // alias → semantic token (keep as a Figma variable alias)
  "$extensions": { "primeng": {
    "cssVar": "--p-button-padding-x",
    "px": 10.5,                                   // rem × 14 (DECISIONS #15); use this number in Figma
    "resolved": "0.75rem"                         // final value after following aliases (for checking only)
  }}
}
"background": {                      // button.primary.background
  "$type": "color",
  "$value": { "light": "{primary.color}", "dark": "{primary.color}" },   // one value per mode
  "$extensions": { "primeng": { "cssVar": "...", "resolved": { "light": "#10b981", "dark": "#34d399" } } }
}
```

- `$value` is one value (same in every mode) or `{ "light": …, "dark": … }`.
- **Aliases** are `{path}`. Create them as **Figma variable aliases**, never as copied values (PILOT_CHECKLIST 3.1 MUST).
- `$type`: `color`, `dimension`, `shadow`, `duration`, `fontWeight`, `number`, `strokeStyle`.
- `px` exists on every `dimension`; a list (e.g. `[3.5, 7]`) means a multi-value token (see 5.2).
- `composite: true` marks a value Figma cannot store as a single variable (see 5.2).
- `$metadata` holds versions, counts, the px base and the findings below.

## 4. Validation (Day 3.2)

Every token (not a sample) was compared with the CSS variable PrimeNG renders in the browser (Storybook, same setup as Sakai), in Light and Dark: **1,234 / 1,234 checks match, 0 mismatches, 0 missing** (2026-11-19, @primeuix/themes 2.0.2, primeng 21.0.2). Light and Dark values differ wherever Aura defines them per mode (83 semantic, 168 component tokens).

## 5. Findings for the Base (report items, not fixed here)

Per SPEC 5.1 the export mirrors Aura exactly and does **not** invent tokens to work around these. Each needs a human decision (agent/DECISIONS.md open questions).

### 5.1 Component tokens that reference primitives directly (SPEC 5.3 violation in Aura itself)
**94 tokens.** Button and Tag severities `success`, `info`, `warn`, `danger`, `help` point straight at primitive palettes (`{green.500}`, `{sky.100}`, `{orange.700}`, `{red.…}`, `{purple.…}`); `tag.rounded-border-radius` points at `{border-radius.xl}`.
Effect: these colors **cannot be re-themed through the Semantic layer**. Changing "danger" means changing the `red` primitive palette, which also affects anything else using red. `primary`, `secondary` and `contrast` are fine (they go through `primary.*` / `surface.*`).

### 5.2 Composite values Figma variables can't hold directly
**39 tokens.**
- **31 `color-mix(...)` values**: transparent overlays, e.g. `button.text.primary.hover-background` and dark-mode `highlight.background` / `tag.*.background` = `color-mix(in srgb, {green.500}, transparent 84%)`. Figma can't alias inside a mix: it needs either a computed color (loses the alias) or a color variable plus an opacity.
- **8 multi-value paddings**: e.g. `tag.padding` = `0.25rem 0.5rem` (`px: [3.5, 7]`). Figma needs separate vertical and horizontal numbers.

### 5.3 Theming axes with no token (input for Day 3.4 and Day 6)
- **Font family: no token in Aura.** Sakai sets `Lato` in plain CSS (`_core.scss`). The font axis can't be themed through tokens.
- **Spacing / density: no global spacing scale.** Density is controlled by `form-field.padding-*`, `form-field.sm/lg.*`, `list.*`, `navigation.*` and per-component tokens (e.g. `button.gap`, `button.icon-only-width`, `tag.padding`).
- **Radius:** themable via `border-radius.*` primitives, but `button.rounded-border-radius` (`2rem`), `button.icon-only-width` and Tag `font-size` / `padding` are literal values in component tokens.

### 5.4 Not exported
Aura's global `css` string (extra selectors for list-type components; not tokens) and the 85 non-pilot components.

## 6. Theme files (`themes/`)

Same shape as `base/tokens.json`, containing **only the tokens they override, values only**. Every path must already exist in the base file with the same shape (single value or `{light, dark}`). A theme never renames, adds or removes tokens (SPEC 5.3). Applying a theme = replace those values in the Primitives and Semantic collections; components must restyle with no edits.

| File | Primary | Surface | Radius | Density (form-field padding) | Font (wanted) | Overrides |
|---|---|---|---|---|---|---|
| `themes/test-brand-a.json` | indigo | stone | sharp (all 0) | roomy (about +33%) | Georgia, serif | 34 |
| `themes/test-brand-b.json` | orange | neutral | very rounded (about 3x) | compact (about −33%) | Courier New, monospace | 34 |

Both are pilot test themes for the Day 6 theme-swap test, not client brands. Each lists in `$metadata.notThemableByTokens` what it **cannot** change, so Day 6 can tell expected gaps from real defects:
- font family (no token, section 5.3),
- severity colors success / info / warn / danger / help (section 5.1),
- literal component values such as `button.rounded-border-radius`, `button.icon-only-width`, `tag.padding`, `tag.font-size` (section 5.3).
