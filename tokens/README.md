# tokens/: design tokens for the Base design system

**Source of truth for every Figma variable name and value** (SPEC section 2, priority 1).
Direction of truth: code → Figma (DECISIONS #2). Never edit `tokens.json` by hand.

| File | What it is |
|---|---|
| `base/tokens.json` | Aura defaults exported from the installed `@primeuix/themes`, plus Sakai typography (generated) |
| `themes/*.json` | Override files: change **values only**, never names or structure (DECISIONS #4) |

Regenerate (from `app/sakai-ng`): `npm run tokens`. Re-run after any PrimeNG / `@primeuix/themes` update and commit the result with that update.

---

## 1. Collections and modes

| Collection (Figma) | JSON key | Modes | Tokens | Contents |
|---|---|---|---|---|
| `Primitives` | `primitives` | none | 248 | 22 color palettes (50–950) + 6 border radii |
| `Semantic` | `semantic` | Light, Dark | 157 | primary, surface, text, content, form-field, focus-ring, highlight, overlay, list, navigation, mask, …, and 13 Sakai typography tokens (section 3.1) |
| `Components` | `components` | Light, Dark | 225 | `button` (175), `inputtext` (29), `tag` (21) |

Total: **630** tokens (617 from Aura + 13 from Sakai CSS). Only the 3 pilot components are exported (Aura has 88); add more with `--components=`.

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
- `$type`: `color`, `dimension`, `shadow`, `duration`, `fontWeight`, `fontFamily`, `number`, `strokeStyle`.
- `px` exists on every `dimension`; a list (e.g. `[3.5, 7]`) means a multi-value token (see 5.2).
- `composite: true` marks a value Figma cannot store as a single variable (see 5.2).
- `$metadata` holds versions, counts, the px base and the findings below.

### 3.1 Typography tokens (from Sakai CSS, DECISIONS #28)

Aura has no font tokens: Sakai sets the font in plain CSS. The export script **parses** Sakai's `src/assets/layout/_core.scss` and `_typography.scss` (it fails loudly if a rule moves), so these stay generated, never hand-edited. They are marked `"source": "sakai"`, carry the CSS rule they came from in `"sakai"`, and have `"cssVar": null` (there is no `--p-` variable; code changes them in the SCSS, not the preset).

| Token | Value | px | From |
|---|---|---|---|
| `font-family` | `Lato` (`fallback`: `sans-serif`) | | `body { font-family }` |
| `typography.base.font-size` | `14px` | 14 | `html { font-size }` (= 1rem, DECISIONS #15) |
| `typography.base.font-weight` | `400` | | browser default (Sakai sets none) |
| `typography.base.line-height` | `1.2` | | `html { line-height }`, inherited by all component text |
| `typography.paragraph.line-height` | `1.5` | | `p { line-height }` |
| `typography.heading.font-weight` / `.line-height` | `700` / `1.5` | | `h1–h6` |
| `typography.heading.h1`…`h6.font-size` | `2.5rem` `2rem` `1.75rem` `1.5rem` `1.25rem` `1rem` | 35 28 24.5 21 17.5 14 | `h1`…`h6` |

Component text sizes and weights stay Aura tokens (`button.sm/lg.font-size`, `button.label.font-weight`, `inputtext.sm/lg.font-size`, `tag.font-size`, `tag.font-weight`). The base Button and InputText size is a literal `1rem` in PrimeNG CSS, so their text styles use `typography.base.font-size`. All values were checked against `getComputedStyle` in Sakai and Storybook (2026-11-20).

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
- **Font family: no token in Aura.** Sakai sets `Lato` in plain CSS (`_core.scss`). **Resolved for Figma** by the `font-family` token from Sakai CSS (section 3.1, DECISIONS #28): a theme can override it and every text style follows. In code it is still changed in Sakai's SCSS, not in the PrimeNG preset.
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
- font family: now a token (section 3.1), but neither file overrides it yet: Georgia and Courier New are not available in Figma (open question #12),
- severity colors success / info / warn / danger / help (section 5.1),
- literal component values such as `button.rounded-border-radius`, `button.icon-only-width`, `tag.padding`, `tag.font-size` (section 5.3).

## 7. Figma variables (Day 4)

Figma is generated from `base/tokens.json` by a re-runnable procedure; never edit variables by hand without changing the source (DECISIONS #2).

```bash
cd app/sakai-ng
npm run figma:plan        # writes tokens/figma/plan.json + tokens/figma/calls/*.js
```
Then run the files in `tokens/figma/calls/` **in order** with the Figma MCP `use_figma` tool on the Base file (`PrimeNG-Sakai`, key `s014qvCap64VIeEJe6Lq3K`): `01-primitives`, `02-semantic`, `03-components`, `04-effect-styles`, `05-text-styles`, then `99-verify` (read-only check of variables and text styles).
The script overwrites call files in place and never deletes; if it prints `Stale call files`, delete those by hand and don't run them.
Each call **upserts by name**: creates what is missing, updates what changed, reports `created / updated / unchanged`, never duplicates and never deletes (variables not in the plan are reported as `extra` by 99-verify). Re-running with unchanged tokens reports everything `unchanged`.
A theme is applied the same way: `node scripts/figma-variables.mjs --theme=../../tokens/themes/test-brand-a.json` (Day 6, on a duplicate of the Base file).

| Figma | Contents | Modes | Count |
|---|---|---|---|
| Collection `Primitives` | palettes + radius (hidden from pickers: scopes `[]`) | `Value` | 248 |
| Collection `Semantic` | aliases to Primitives / Semantic, plus typography | `Light`, `Dark` | 163 |
| Collection `Components` | aliases to Semantic (and to Primitives where Aura does, 5.1) | `Light`, `Dark` | 244 |
| Effect styles | shadow tokens that are not `none` | — | 7 |
| Text styles | `Heading/H1`–`H6`, `Body/Paragraph`, `Body/Base`, `Button/Label sm/base/lg`, `InputText/Text sm/base/lg`, `Tag/Label` (spec: `app/sakai-ng/scripts/text-styles.mjs`) | — | 15 |

**Rules beyond the naming rule (section 2), DECISIONS #24:**
- **color-mix** (`color-mix(in srgb, {x}, transparent N%)`): the color variable **aliases `{x}`**; a FLOAT variable `<name>-opacity` holds `1 - N%` per mode (1 where that mode has no mix). In components, put the color on its own background layer and bind the **layer opacity** to `<name>-opacity`. A color that aliases a color-mix token gets its own `-opacity` aliasing the source's (e.g. `list/option/selected-background-opacity` → `highlight/background-opacity`).
- **Multi-value paddings**: `a b` → `<name>-y`, `<name>-x`; `a b c d` → `-top`, `-right`, `-bottom`, `-left` (CSS shorthand order). No CSS variable exists for these, so they have no code syntax; their description names the source variable.
- **Shadows** → effect styles named like the token (`button/raised-shadow`); `none` shadows have no style (11 skipped).
- **Types**: color → COLOR; dimension / font weight / opacity / duration (seconds) → FLOAT; focus-ring style → STRING. Scopes are set per role (backgrounds → fills, `*-color` → text + shape fill, borders and focus rings → stroke, radius, gap, size, font size/weight, opacity); durations and offsets are hidden.
- **Typography**: `font-family` → STRING (scope font family); font sizes and weights → FLOAT (scopes font size / font weight); line heights are CSS ratios → hidden FLOAT (Figma would read a bound number as px). **Text styles** bind font family, size and weight to those variables, and set line height as a percent (`1.5` → 150%) and letter spacing 0. Font style comes from the weight: 400 Regular, 500 Medium, 700 Bold. Each style's description names its CSS selector and tokens. Sakai typography variables have no code syntax; their description names the SCSS rule.
- **Code syntax**: every variable with a CSS variable has WEB syntax `var(--p-…)`.
- **Modes**: `Semantic` and `Components` each have `Light`/`Dark`. To preview Dark on a frame, set **both** collections to `Dark`.

**Verified (Day 4.3, 4.4):** all 642 variables resolve to exactly the values in `tokens.json` in both modes (99-verify: 642/642, 0 mismatches). Update test: changing `primary.500` and re-running all calls updated exactly 1 variable in place (same ID, still an alias, change visible through `primary/color` and `button/primary/background`), created 0, left 641 variables and 7 effect styles unchanged; then restored.

**Typography added (2026-11-20, DECISIONS #28):** 13 variables created in `Semantic` and 15 text styles created; a re-run of `05-text-styles` reported 15 unchanged. 99-verify: **655/655 variables** in both modes and **15/15 text styles** (family, style, size, line height, bindings), 0 extra, 0 missing.
