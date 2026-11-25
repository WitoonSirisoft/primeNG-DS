# COMPONENTS.md: Pilot build order and status

Status values: `not started` | `in progress` | `reviewed`
Rules: build one component at a time with a review gate (PILOT_CHECKLIST 5.1). Nothing enters `02 Components` until status is `reviewed`.

| # | Figma component | PrimeNG selector | Status | Owner | Fix rounds | Figma link | Report | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Button | `<p-button>` | reviewed | Witoon | 6 (Day 5, see report) | 02 Components: Button 74:9, Link 122:147, Plain 123:150, Vertical 124:156, Badge 120:147 | agent/REPORT_BUTTON.md | 864 + 18 + 36 + 36 + Badge 14; doc frame 131:193; stress frame 144:161 (99 Sandbox); approved 2026-11-24 (visual 4) |
| 2 | InputText | `pInputText` | reviewed | Witoon | | 02 Components: InputText 138:192 | agent/REPORT_INPUTTEXT.md | 144 built + verified 0 errors (2026-11-24); doc frame 142:191, stress frame 141:191 (99 Sandbox); approved 2026-11-24 (visual 5) |
| 3 | Tag | `<p-tag>` | reviewed | Witoon | | 02 Components: Tag 146:192 | agent/REPORT_TAG.md | 14 built + verified 0 errors (2026-11-24); doc frame 146:488, stress frame 146:385 (99 Sandbox); approved 2026-11-24 (visual 5) |
| 4 | Textarea | `pTextarea` | reviewed | Witoon | | 02 Components: Textarea 170:192 | agent/REPORT_GROUP_A.md | 144 built + verified 0 errors (2026-11-24); stress 173:440; approved 2026-11-24 (visual 5) |
| 5 | IconField | `<p-iconfield>` | reviewed | Witoon | | 02 Components: IconField 171:192 | agent/REPORT_GROUP_A.md | 6 (composed) built + verified 0 errors (2026-11-24); stress 173:440; approved 2026-11-24 (visual 5) |
| 6 | Password | `<p-password>` | reviewed | Witoon | | 02 Components: Password 171:247 | agent/REPORT_GROUP_A.md | 6 (composed) built + verified 0 errors (2026-11-24); stress 173:440; approved 2026-11-24 (visual 5) |
| 7 | InputNumber | `<p-inputnumber>` | reviewed | Witoon | | 02 Components: InputNumber 172:213 | agent/REPORT_GROUP_A.md | 12 (composed) built + verified 0 errors (2026-11-24); stress 173:440; approved 2026-11-24 (visual 5) |
| 8 | DatePicker (field, Date, Panel) | `<p-datepicker>` | reviewed (visual 5), panel re-capture check | Witoon | | 02 Components: DatePicker 181:243, DatePicker Date 182:258, DatePicker Panel 182:276 | agent/REPORT_DATEPICKER.md | 9 + 6 + panel built, 0 unbound paints (2026-11-24); doc frame 185:1569; stress 185:1582 |
| 9 | Checkbox | `<p-checkbox>` | reviewed (visual 5) | Witoon | | 02 Components: Checkbox 208:360 | agent/REPORT_GROUP_B.md | 144 built + verified 0 errors, 0 unbound paints (2026-11-25); doc 210:3891; stress 210:3792 |
| 10 | RadioButton | `<p-radiobutton>` | reviewed (visual 5) | Witoon | | 02 Components: RadioButton 209:456 | agent/REPORT_GROUP_B.md | 96 built + verified 0 errors, 0 unbound paints (2026-11-25); doc 210:3904; stress 210:3792 |
| 11 | ToggleSwitch | `<p-toggleswitch>` | reviewed (visual 5) | Witoon | | 02 Components: ToggleSwitch 207:360 | agent/REPORT_GROUP_B.md | 48 (sm/lg design-only) built + verified 0 errors, 0 unbound paints (2026-11-25); doc 210:3917; stress 210:3792 |
| 12 | Select (field, Option, Option Group, Panel) | `<p-select>` | reviewed (visual 5) | Witoon | | 02 Components: Select 213:456, Select Option 215:3357, Select Option Group 215:3392, Select Panel 215:3396 | agent/REPORT_GROUP_C.md | 144 + 8 + 1 + 3 built, verify 0 errors, 0 unbound paints (2026-11-25); doc 216:927; stress 213:5119 |
| 13 | Message | `<p-message>` | reviewed (visual 5) | Witoon | | 02 Components: Message 218:615 | agent/REPORT_GROUP_D.md | 54 built, verify 0 unbound paints, icons per severity (2026-11-25); doc 219:2176; stress 219:1401 |
