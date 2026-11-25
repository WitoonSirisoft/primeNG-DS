# Plan: DatePicker (batch 1, DECISIONS #65) — 2026-11-24

Source CSS `@primeuix/styles/dist/datepicker`; references `screenshots/datepicker/` (68 images).

## 1. `DatePicker` field — 9 variants: Icon display (none, input, button) × Size 3 (axis name ≠ swap property `Icon`) (composed from InputText, like IconField #61)
| Icon display | Structure | Width sm · base · lg (browser) |
|---|---|---|
| none | InputText instance | 149.5 · 172 · 194.5 |
| input | InputText, right padding `datepicker/input-padding` (derived: form-field.padding-x × 2 + icon-size = 35); `Icon/calendar` inside at inset `form-field/padding-x`, size `form-field/sm/font-size` · `icon-size` · `form-field/lg/font-size`, colour `datepicker/input-icon/color` | 175.75 · 196.5 · 217.25 |
| button | InputText (right corners 0) + dropdown button: width `datepicker/dropdown/sm/width` · `width` · `lg/width` (28 · 35 · 42), bg `datepicker/dropdown/background`, 1px border `datepicker/dropdown/border-color` (no left border), right radius `datepicker/dropdown/border-radius`, icon colour `datepicker/dropdown/color` | 177.5 · 207 · 236.5 |
Field states come from the inner InputText. Dropdown button hover/active: documented, not built (as #64).

## 2. `DatePicker Date` — 6 variants: State default, hover, selected, today, disabled, other-month
Cell padding `datepicker/date/padding` (3.5) around a 28×28 day (`datepicker/date/width|height`), circle (Aura radius 50%: radius bound to the height). Text: `Body/Base`, property `Day`.
| State | Background | Text | Opacity |
|---|---|---|---|
| default | none | `datepicker/date/color` | — |
| hover | `datepicker/date/hover-background` | `datepicker/date/hover-color` | — |
| selected | `datepicker/date/selected-background` | `datepicker/date/selected-color` | — |
| today | `datepicker/today/background` | `datepicker/today/color` | — |
| disabled / other-month | none | `datepicker/date/color` | `disabled-opacity` (60%, measured: #334155 at 60% = rgb 132,141,153) |

## 3. `DatePicker Panel` — 1 component (day view)
Panel: padding `datepicker/panel/padding`, bg, 1px border, radius, effect style `datepicker/panel/shadow` (overlay; the inline story has no shadow). Width 276 (browser).
Header: `Button` instances prev / next (Severity secondary, Variant text, Rounded, icon-only `Icon/chevron-left|right`; icon-only width gap #44 applies) · title = month and year text buttons (padding `datepicker/select-month|year/padding-*`, radius, colour, weight `datepicker/title/font-weight`, gap `datepicker/title/gap`) · padding-bottom `datepicker/header/padding-bottom`, bottom border `datepicker/header/border-color`.
Day view: margin-top `datepicker/day-view/margin-top`; weekday row (padding `datepicker/week-day/padding`, weight `datepicker/week-day/font-weight`, colour `datepicker/week-day/color`); 5 week rows of `DatePicker Date` instances (example: November 2026, 18 selected, 24 today, 1–2 disabled, Dec 1–5 other-month). Designers change any day by swapping its State and editing `Day`.
Not built (#65): month / year views, range, time picker, button bar, multiple months.
