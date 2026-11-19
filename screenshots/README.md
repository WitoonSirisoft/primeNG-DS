# screenshots/: reference captures (PILOT_CHECKLIST Day 2)

Reference images of every PrimeNG state the Figma agent will be asked to build. They are the **visual source of truth** (SPEC section 2, priority 3). If a state has no image here, the agent must report it, not invent it.

Source stories: `app/sakai-ng/src/stories/` (Storybook, `npm run storybook` in `app/sakai-ng`).

---

## 1. How interaction states are captured (decided Day 2.2)

**Real browser input, no faked CSS.** PrimeNG's Aura styles use real `:hover`, `:active` and `:focus-visible` rules, so the capture script triggers them the same way a user would:

| State | How it is produced | Applies to |
|---|---|---|
| `default` | Page loaded, mouse parked at (0,0), nothing focused | all |
| `hover` | Mouse moved over the component | Button, InputText |
| `focus` | Keyboard **Tab** onto the component (so `:focus-visible` matches and the focus ring shows) | Button, InputText |
| `active` | Mouse pressed and **held** on the component while capturing | Button |
| `disabled`, `loading`, `readonly`, `invalid` | Set through the component's input / attribute in the story | per component |

Verified Day 2.2: hover, active and keyboard focus change the computed styles exactly as PrimeNG's CSS defines (for example primary Button: emerald 500 → 600 on hover → 700 on press; 1px primary focus ring on Tab).

**Rejected alternatives:** a pseudo-states addon (rewrites CSS rules; PrimeNG injects its styles at runtime, so this is fragile), and adding state classes by hand (PrimeNG has no state classes for hover/active).

Tag is not interactive: static states only.

## 2. Capture settings (fixed; do not change mid-pilot)

| Setting | Value |
|---|---|
| Tool | Playwright + Chromium, against the built Storybook (`npm run build-storybook`) |
| Viewport | 1280 × 800 |
| Device pixel ratio | 2 (place images in Figma at 50% to compare 1:1; DECISIONS #19) |
| Root font size | 14px (Sakai default; Figma converts 1rem = 14px, DECISIONS #15) |
| Surface behind component | `card` (Sakai `--surface-card`) by default; `ground` only when testing contrast against the page |
| Animations | Paused; transitions disabled (loading spinner is frozen) |
| Fonts | Wait for `document.fonts.ready`; **fail the capture if Lato did not load** (it comes from fonts.cdnfonts.com) |
| Crop | The component's `[data-cell]` box (4px padding around the component) |

## 3. File naming

```
screenshots/<component>/<component>__<prop>-<value>__...__state-<state>__<mode>.png
```

- Lowercase, `__` between parts, `-` between a prop and its value.
- Props use the **PrimeNG input name** and the **exact PrimeNG value** (`severity-danger`, not `severity-error`).
- `size-base` / `psize-base` = size not set in code (SPEC 4.2).
- Always include every axis of the capture set, in a fixed order per component:
  - Button: `severity`, `size`, `style` (solid/outlined/text/raised/rounded), extras (`icon`, `iconpos`, `icononly`, `badge`, `loading`, `link`, `plain`), `state`, `mode`
  - InputText: `variant`, `psize`, `content` (empty/placeholder/value), extras (`invalid`, `readonly`, `fluid`), `state`, `mode`
  - Tag: `severity`, `icon`, `rounded`, `mode`
- `<mode>` = `light` | `dark`.

Examples:
```
button/button__severity-danger__size-large__style-solid__state-hover__light.png
inputtext/inputtext__variant-filled__psize-base__content-placeholder__state-focus__dark.png
tag/tag__severity-none__icon-no__rounded-yes__light.png
```

## 4. Related decisions (agent/DECISIONS.md)

- Tag with no severity = `severity-none`, which is also its Figma value (#16).
- InputText size is named `psize` in file names (code name); the Figma property is `Size` (#17).
- Label + helper text is the `Form row` pattern, not part of InputText; captured as `inputtext/pattern__formrow__...` (#18).
