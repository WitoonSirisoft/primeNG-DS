# screenshots/: reference captures (PILOT_CHECKLIST Day 2)

Reference images of every PrimeNG state the Figma agent will be asked to build. They are the **visual source of truth** (SPEC section 2, priority 3). If a state has no image here, the agent must report it, not invent it.

Source stories: `app/sakai-ng/src/stories/` (Storybook, `npm run storybook` in `app/sakai-ng`).
Capture script: `app/sakai-ng/scripts/capture-screenshots.mjs`.

## 0. How to (re)capture

Run on **one machine only** (the designated Mac), so font rendering is identical across all images.

```bash
cd app/sakai-ng
nvm use                              # Node 22
npx playwright install chromium      # first time only (Playwright's own Chromium)
npm run capture                      # builds Storybook, then captures ~892 images (~3-5 min)
```

- Output: `screenshots/<component>/*.png`, plus `screenshots/manifest.json` and `manifest.csv` (every file with its story, args, state, mode and CSS-pixel size).
- The script **stops** if the Lato web font doesn't load (it needs internet access to fonts.cdnfonts.com). Never use `--allow-missing-font` for real references.
- Partial run: `node scripts/capture-screenshots.mjs --only=tag` (needs a built Storybook; does not rewrite the manifests).
- Re-capture everything whenever PrimeNG, the theme, Sakai styles or `.storybook/preview.ts` change, and commit the images together with that change.

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

## 4. What is captured (capture plan in the script)

| Component | Sets | Images |
|---|---|---|
| Button | severity × size (solid); severity × style (outlined, text, raised, rounded); disabled per severity × style; icon-only per size × style; icon positions; loading; badge; link; plain. Interactive sets in default/hover/focus/active | 690 |
| InputText | variant × pSize × content (empty, placeholder, value) in default/hover/focus; disabled; readonly; invalid (placeholder, value) in default/hover/focus; fluid; Form row pattern (default, invalid) | 146 |
| Tag | severity (7, incl. `none`) × icon × rounded | 56 |

All in Light and Dark. Total 892.

## 5. PrimeNG behaviours the images show (do not "fix" these in Figma)

Found while verifying the capture (Day 2.3). Each is real Aura CSS, confirmed in the theme source:

- **InputText invalid: hover and focus depend on how the field is marked invalid** (re-verified Day 3 in Storybook, the Sakai app and these screenshots):
  - **`[invalid]` input** (class `p-invalid`, used in these screenshots): the red border is **replaced** by the normal hover border on hover and the normal focus (primary) border on focus. `.p-inputtext:enabled:hover/focus` (specificity 0,3,0) beats `.p-inputtext.p-invalid` (0,2,0). The invalid placeholder stays red.
  - **Angular form validation** (classes `ng-invalid ng-dirty`): the red border **stays** on hover and focus. `.p-inputtext.ng-invalid.ng-dirty` (0,3,0) comes after the hover/focus rules and wins. An invalid but untouched control (`ng-invalid` without `ng-dirty`) shows no red at all.
  - Which one Figma follows is open question #11 in agent/DECISIONS.md.
- **Raised Button loses its shadow when focused.** The focus-visible `box-shadow` replaces the raised shadow.
- **Link Button looks the same on hover and active.** Aura's link `hoverColor` and `activeColor` are both `{primary.color}`; hover adds the underline.
- **Readonly InputText looks identical to default.** Aura has no readonly style.
- **Disabled InputText looks the same in `filled` and `outlined`.**
- **Plain text Button matches the contrast text Button in Dark mode** (same color tokens).

## 6. Related decisions (agent/DECISIONS.md)

- Tag with no severity = `severity-none`, which is also its Figma value (#16).
- InputText size is named `psize` in file names (code name); the Figma property is `Size` (#17).
- Label + helper text is the `Form row` pattern, not part of InputText; captured as `inputtext/pattern__formrow__...` (#18).
