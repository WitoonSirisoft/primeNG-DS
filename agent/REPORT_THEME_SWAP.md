# Report: Day 6.1 theme-swap test — 2026-11-24

Test file: copy of the Base, `PrimeNG-Sakai-Theme-swap-testing` (Figma key 2PHAzFZItQRe3iVKxlf5G9). The real Base was not touched.
Themes: `tokens/themes/test-brand-a.json` (indigo, stone surface, sharp radius 0, roomy +33%, **Kanit**) and `test-brand-b.json` (orange, neutral surface, very rounded, compact, **IBM Plex Sans Thai**) (#56).

## Procedure (values only, #57)
1. `npm run figma:plan -- --theme=<theme> --out=tokens/figma/theme-<x>` — the normal variables procedure, into its own folder.
2. `node scripts/figma-theme-diff.mjs --dir=tokens/figma/theme-<x>` — writes `10-theme-values.js` (only the values that differ: **35 of 691**, ~3.6k chars) and `11-restore-base.js` (the way back).
3. Run `10-theme-values.js` on the copy. Fonts: the text styles follow the `font-family` variable by themselves; the style call was not needed.
4. Scan every variant of the 7 component sets (1,126 variants) in Light and Dark for colours from the old palettes, radius values, fonts and paddings.
5. Run `11-restore-base.js`, then compare a fingerprint of all 691 resolved values + 15 text styles with the real Base.

**Zero manual component edits.** No variable created, renamed or deleted (691 before and after).

## Results
| Check | Brand A | Brand B |
|---|---|---|
| Primary colour (all states, all sets) | indigo everywhere, no emerald left | orange everywhere, no emerald/indigo left |
| Surface colours | stone, no slate/zinc left (Light + Dark) | neutral, no slate/zinc/stone left |
| Font (all text in all sets) | Kanit 100% | IBM Plex Sans Thai 100% |
| Radius | 0 everywhere except the 3 items below | 16 (md) / 28 (xl) / focus ring 19 |
| Density | Button + InputText padding +33% | Button + InputText padding −33% |
| Light / Dark | both correct | both correct |

## Elements that did not follow the theme
All are **bound to variables** (no hardcoded or unbound values in Figma); they did not move because Aura stores them as fixed numbers in component tokens, not as aliases of the global radius/spacing scale:
1. **Button Rounded radius** `button/rounded-border-radius` = 28 (Aura `2rem`) and its focus ring 31.
2. **Tag padding** `tag/padding-x|y` = 7 / 3.5.
3. **Badge padding** `badge/padding-x|y` = 7 / 0.
A theme can still change each one by overriding that component token (values only); the test themes did not include them.
Not counted: Badge `Circle=true` radius = badge height (round on purpose, CSS 50%). Severity colours (success/info/warn/danger/help) use fixed palettes in Aura; the test themes don't change them (expected, tokens/README 5.1).

## Defect found and fixed during the test
- **Focus-ring radius ignored the theme** (derived variable #34 was computed from the Base value). `figma-variables.mjs` now follows the themed values. Base output unchanged; brand A ring 9 → 3, brand B 9 → 19.
- Diff call: a font-family change needs the new font loaded first; `figma-theme-diff.mjs` now loads it.

## Re-run / round trip
After `11-restore-base.js` the copy's fingerprint equals the real Base: **691 variables + 15 text styles, fingerprint f8ea4a56 = f8ea4a56.** → passes.

## Design observation
Brand B: primary orange = Aura warn orange, so warn tags/buttons look like primary. A real orange brand should change the warn palette (component tokens).

## Re-test with component overrides (Witoon 2026-11-24: add them to the theme files)
Theme files now also override `button.rounded-border-radius`, `tag.padding`, `badge.padding` (A: 0 / +33% · B: 6rem / −33%). Diff: **40 of 691** variables.
| Element | Brand A | Brand B |
|---|---|---|
| Button Rounded radius / its focus ring | 0 / 3 | 84 / 87 |
| Tag padding x / y | 9.33 / 4.67 (Tag 38.7 × 24.3) | 4.67 / 2.33 (Tag 30.3 × 19.7) |
| Badge padding x | 9.33 | 4.67 |
→ **0 elements left that do not theme.** Restore + fingerprint again: f8ea4a56 = Base.

## Scoring (6.3)
| Measure | Result |
|---|---|
| Theme-swap test A passes | **Y** (0 unthemed after the component overrides) |
| Theme-swap test B passes | **Y** (0 unthemed) |
| Elements that did not theme (count) | **0** (3 before the overrides, all component literals; gate ≤ 2 met) |
| Re-run update test passes | **Y** (restore → fingerprint equals Base, twice) |

## Lesson for Stage 2 (client themes)
A client theme must set, besides primary/surface/radius scale/spacing/font: `button.rounded-border-radius`, `tag.padding`, `badge.padding` (Aura literals). Template: `tokens/themes/test-brand-a.json`.
