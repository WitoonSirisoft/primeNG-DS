# Report: Batch 1 · DatePicker — 2026-11-24

Status: **reviewed 2026-11-24 — visual 5; Panel rework (button bar) done, awaiting re-capture check** (on `02 Components`). Plan: `agent/PLAN_DATEPICKER.md`. Decision #65.
Generators: `figma-composite.mjs --set=datepicker` (field, `calls/11-composite-datepicker.js`), `figma-datepicker.mjs` (Date + Panel, `npm run figma:datepicker`, `calls/12-datepicker.js`). Both re-run in place (same node IDs).

## Built
| Set | Node | Variants | Axes / content | Doc frame |
|---|---|---|---|---|
| DatePicker (field) | 181:243 | 9 | Icon display (none, input, button) × Size; InputText instance inside (exposed); swap `Icon` (default Icon/calendar) | 185:1569 |
| DatePicker Date | 182:258 | 6 | State: default, hover, selected, today, disabled, other-month; text property `Day` | 185:1569 |
| DatePicker Panel | 182:276 | 1 | Header (Button instances prev/next, Month, Year), weekday row, 5 week rows of Date instances (November 2026) | 185:1569 |
| Stress frame (99 Sandbox) | 185:1582 | — | fluid 320, Light, Dark, overrides | — |

## Sizes vs browser
| | Figma | Browser |
|---|---|---|
| Field none sm / base / lg | 149.5 / 172 / 194.5 | same |
| Field input sm / base / lg | 175.75 / 196.5 / 217.25 | same |
| Field button sm / base / lg | 177.5 / 207 / 236.5 | same |
| Date cell | 35 × 35 (circle 28) | 35 × 35 (circle 28) |
| Panel (inline, day view) | 268 × 269.8 | ≈ 267–268 × ≈ 270.5 (measured from the 2× screenshot) |
Header is ≈ 2px shorter: prev/next use the Button instance (37 × 32.8); the browser buttons are 35 × 35. This is the known icon-only width gap (#44).

Correction to the plan: the plan said panel width 276. The screenshot shows the inline panel hugs a 7 × 35 grid (268), so the panel now hugs its content. I'm not certain where 276 came from (possibly a different measurement).

## Binding scan
Field 9 / Date 6 / Panel: **0 unbound paints**. Inner InputText exposed on all 9 field variants. Paddings, gaps, radii, day size, weekday weight/colour, panel shadow (effect style) are all bound. Day radius is bound to the day height (Aura `50%` cannot be a variable).

## Stress test (frame 185:1582)
- Fluid width 320: works only when **both** the instance and the nested InputText are set to Fill. Setting only the outer one leaves the field at 172 and the icon floats. Documented in the doc frame. The same probably applies to IconField / Password / InputNumber (Group A), but I haven't tested that yet.
- Dark: correct (panel #18181b-ish, selected #10b981-ish, today dark). Needs Dark set on **Semantic and Components**.
- Overrides: Month text → February, Week 5 hidden (4-row month), day 3 swapped to hover. All kept, nothing detached.

## Accessibility
Day text passes 4.5:1. Other-month / disabled days (date colour × disabled-opacity): **Light 3.35:1**, Dark 7.00:1. Light fails 4.5:1 (same as Aura; disabled is exempt).

## Not built (decided, #65)
Month / year views, range, multiple, time picker, button bar, week numbers.

## Needs Witoon's decision
1. #65 says a **6-week grid**; I built **5 rows** (November 2026 has 5, matching the browser). Should I add a hidden Week 6 for 6-row months?
2. Fluid width needs 2 Fill settings. Should I keep it documented only, or make the nested InputText Fill by default inside the composites (also Group A)?
3. Visual score (1–5) for the field, Date and Panel.

## Review 2026-11-24 (Witoon) and rework
- 5 week rows: fine. Visual score 5.
- Panel needs the **Today / Clear button bar** (#66) → added: `Button bar` boolean (default on), Button secondary text small ×2, space-between, border-top + padding bound to `datepicker/buttonbar/*`. Panel now 268 × 305.3 (bar 35.5). Story `Panel` now has `showButtonBar` → **re-capture needed** to compare the height.
- Inner InputText Fill by default for all composites (#67): IconField 6, Password 6, InputNumber 12, DatePicker 9 → widths unchanged; resized to 320 all stretch correctly (horizontal InputNumber inner 250, DatePicker button inner 285). Generator `figma-composite.mjs` updated; applied in Figma with the same code as a patch (no full re-run).

## New finding: layer overrides inside the Panel are lost on a rebuild
The generator rebuilds the Panel by deleting and recreating its layers (same node ID, new children). Changes that are component **properties** survive (Button bar, Day). Direct layer changes made in an instance (Month text, hiding Week 5, swapping a day's State) were **reset** by the rebuild. I re-applied them in the stress frame. The field sets are not affected because their overrides are properties or live on the exposed InputText.

## Fix 2026-11-25: update in place (#68)
`figma-datepicker.mjs` now finds every layer by name and type and updates it; it creates only what is missing and removes only unknown layers. Re-run on the Base: **79 layers kept, 0 created, 0 removed**, all 185 layer IDs unchanged. Stress panel overrides (February, Week 5 hidden, day 3 hover, Button bar off) **kept**.
Open: `figma-button`, `figma-inputtext`, `figma-tag`, `figma-composite` still clear and rebuild children. Overrides that are component properties survive (labels, Value, Tag text). Overrides on nested layers would be reset, e.g. State or Invalid set on the exposed InputText inside IconField / Password / InputNumber / DatePicker. I haven't tested this.
Re-capture: the 2026-11-24 run used the old storybook-static build (10:19 UTC, before the story got showButtonBar), so the panel PNGs still have no button bar (276 × 283.59). Needs `npm run capture -- --only=datepicker` (it rebuilds Storybook first).
Re-capture 2026-11-25 ✅: browser panel grew by 35.19 (283.59 → 318.78 incl. story wrapper), Figma by 35.5 (button bar). Layout, Today / Clear labels and colours match. Note: the browser's "today" follows the real date (25th in this capture); the Figma example keeps the 24th.
