# Icons → Figma (DECISIONS #26, #31)

Source: the PrimeIcons **font** (`primeicons` 7.0.0, what renders in code) + PrimeNG's `SpinnerIcon`.
Not `primeicons/raw-svg`: those are a different, padded 24px drawing (check would be ~10px wide instead of 14.875).
Regenerate (from `app/sakai-ng`): `npm run figma:icons`.

| File | What |
|---|---|
| `icons-sheet.svg` | All 315 icons, one `<g id="<name>__<hash>" transform="translate(x y)">` each (glyph + invisible 14px `bounds` box; Figma drops that box on import, so the converter uses sheet origin + translate) |
| `manifest.json` | Name, source, box size, hash per icon |
| `../calls/06-icons-from-sheet.js` | Converts the imported sheet into `Icon/<name>` components (upsert, skips unchanged) |
| `../calls/06-icons-N.js` | Alternative: same result without an import, paths sent in the calls (6 large calls) |

## How to import (designer, ~2 minutes)

1. Open the Base file **PrimeNG-Sakai** → page **01 Foundations**.
2. Drag `tokens/figma/icons/icons-sheet.svg` from Finder onto the canvas (or File → Place image… / ⌘⇧K and pick it).
   Figma imports it as editable vectors: one frame with 315 groups named like `check__c8a4679d0e`. Don't rename or ungroup anything.
3. Tell Claude "sheet imported". Claude runs `06-icons-from-sheet.js`, which:
   - turns each group into a component `Icon/<name>` inside the **Icons** frame (fill bound to `text/color`, box = the code icon box),
   - leaves the icons already created untouched (same hash → `unchanged`; the 3 early test icons get refreshed),
   - deletes the imported sheet when there were no errors.
4. Expected result: `iconComponentsNow: 315`, `errors: []`.

If the result says *hash differs*, the sheet came from an older run: re-run `npm run figma:icons` and import the new sheet.

Checks in the converter: the sheet must be exactly 480×384 (not scaled), and each glyph must sit where the font puts it
(±0.05px). Some glyphs overhang their box, as in the browser (e.g. `user-plus` 0.71px right, `volume-up` 0.18px left).
First import on 2026-11-23: 315/315 components (`bounds` box dropped by Figma → converter fixed the same day).
