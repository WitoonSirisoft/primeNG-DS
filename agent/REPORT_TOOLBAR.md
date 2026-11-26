# Report: Batch 2 · Toolbar + SplitButton — 2026-11-25

Status: **reviewed and approved 2026-11-25 — visual 5** (on `02 Components`). Decisions #89–#90.
Generators: `scripts/figma-splitbutton.mjs` (`npm run figma:splitbutton`) → `18-splitbutton-1..4.js`; `scripts/figma-toolbar.mjs` (`npm run figma:toolbar`) → `19-toolbar-1.js`; example `19-toolbar-example.js`. Update in place (#68).
Stories: `splitbutton.stories.ts`, `toolbar.stories.ts` (layout crud | uikit). Captures: 19 SplitButton + 2 Toolbar (Light + Dark).

## Built
| Set | Node | Variants | Notes |
|---|---|---|---|
| SplitButton | 256:6309 | 144 | Severity 8 × Variant 3 × Size 3 × Rounded 2; nested Button + Dropdown (Button, label hidden, chevron) exposed; Raised |
| Toolbar | 260:9764 | 1 | Start / Center / End prefilled, exposed; Show start / center / end |
| Doc frames | 260:13797 (SplitButton), 260:13808 (Toolbar) | — | |
| SplitButton compare (99 Sandbox) | 259:13611 | — | solid, outlined rounded, raised, secondary outlined, text, disabled, hover main / dropdown, small, large |
| Toolbar example (99 Sandbox) | 260:12789 | — | CRUD + UI Kit replicas |
| Stress (99 Sandbox) | 260:13008 | — | Light + Dark, toolbars at 884 and 400 (wrap), SplitButton row |
Tokens: toolbar 6 + splitbutton 2 → 1,258 variables, fingerprint 460521ca; effect style splitbutton/raised-shadow (26).

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| SplitButton small / base / large | 76.25 × 27.5 / 88 × 33 / 100.75 × 38.5 | 77.23 × 27.19 / 87.84 × 32.8 / 98.44 × 38.39 |
| Toolbar | 884 × 56 | 884 × 55.8 |
| UI Kit toolbar: search x / w, SplitButton x / w | 359.3 / 196.5, 784.5 / 88 | 359 / 196.5, 785 / 88 |
| CRUD toolbar: New + Delete, Export | 166, 86 | 165, 86 |
Heights +0.2 come from Button (33 vs 32.8, accepted in batch 1). SplitButton large +2.3 is the Lato label width at 15.75 in Figma.

## Binding scan
SplitButton: 144 checked, **0 errors** (inner corners 0, main end border 0, outer radius button/border-radius or splitbutton/rounded-border-radius, dropdown label hidden + chevron, Raised linked, parts exposed), **0 unbound paints**. Toolbar: fills/strokes/radius/padding/gap bound to toolbar variables.

## Fix log
1. Dropdown first built as Button Icon (35 wide): the code's dropdown has no `icon` input, so it is not `p-button-icon-only` → rebuilt as Button with the label hidden (37 wide at base, as CSS).
2. Pinning the dropdown chevron to 14px (svg `icon.size`) inside an instance is ignored by Figma → small 1.75 narrower; documented.
3. Toolbar: confirmed inner buttons are not raised/rounded in code (template) → Raised / Rounded live on the SplitButton container.

## Accessibility
Colours are Button's (checked in batch 1). Toolbar has no text of its own. Code: dropdown has aria-haspopup / aria-expanded (expandAriaLabel).

## Known gaps
- Dropdown menu (TieredMenu) not built.
- Toolbar groups hold a fixed number of items (start 3, center 1, end 2); more needs a local component.
