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
| 14 | DataTable (Header Cell, Body Cell, Header, Footer, Slot) | `<p-table>` | reviewed (visual 5) | Witoon | | 02 Components: Header Cell 223:3495, Body Cell 223:3724, Header 224:3582, Footer 224:3631, Slot 223:3491 | agent/REPORT_DATATABLE.md | 54 + 36 + 6 + 6, 0 unbound paints (2026-11-25); doc 246:1588; example 243:2330, stress 244:1694 (99 Sandbox) |
| 15 | Paginator (+ Paginator Button) | `<p-paginator>` | reviewed (visual 5) | Witoon | | 02 Components: Paginator 224:3723, Paginator Button 224:3650 | agent/REPORT_DATATABLE.md | 2 + 15 (2026-11-25) |
| 16 | Button Icon | `<p-button>` icon only | reviewed (visual 5) | Witoon | | 02 Components: Button Icon 230:725 | agent/REPORT_DATATABLE.md | 864, verify 0 errors (2026-11-25); doc 246:1601 (#85) |
| 17 | Scrollbar (design-only) | none (browser native scrollbar) | reviewed (visual 5) | Witoon | | 02 Components: Scrollbar 251:6309 | agent/REPORT_DATATABLE.md | 2 (#88); doc 253:9905; overflow examples 253:9049 / 253:9146 (99 Sandbox) |
| 18 | SplitButton | `<p-splitbutton>` | reviewed (visual 5) | Witoon | | 02 Components: SplitButton 256:6309 | agent/REPORT_TOOLBAR.md | 144, check 0 errors, 0 unbound paints (2026-11-25); doc 260:13797; compare 259:13611 |
| 19 | Toolbar | `<p-toolbar>` | reviewed (visual 5) | Witoon | | 02 Components: Toolbar 260:9764 | agent/REPORT_TOOLBAR.md | 1 (prefilled groups, #89); doc 260:13808; example 260:12789, stress 260:13008 |
| 20 | Dialog (+ Dialog Slot) | `<p-dialog>` | reviewed (visual 5) | Witoon | | 02 Components: Dialog 264:9848, Dialog Slot 264:9843 | agent/REPORT_DIALOG.md | #91; doc 267:3995; examples 266:13746 / 266:13938, stress 266:15277 |
| 21 | ConfirmDialog | `<p-confirmdialog>` | reviewed (visual 5) | Witoon | | 02 Components: ConfirmDialog 264:9902 | agent/REPORT_DIALOG.md | #93 |
| 22 | Dialog Mask | modal mask | reviewed (visual 5) | Witoon | | 02 Components: Dialog Mask 264:9846 | agent/REPORT_DIALOG.md | #92, design aid |
| 23 | Toast | `<p-toast>` | reviewed (visual 5) | Witoon | | 02 Components: Toast 271:9918 | agent/REPORT_TOAST.md | 6 (#94); doc 273:14861; examples 273:14153 / 273:14244, stress 273:14306 |
| 24 | Menu | `<p-menu>` | approved (visual 5) | Witoon | | 02 Components: Menu 284:4024; parts Menu Item 284:4008, Submenu Label 284:4020, Separator 284:4022 | agent/REPORT_MENU.md | #95, #96; doc 285:16629; examples 285:16350 |
| 25 | Sidebar Menu | Sakai `app-menu` (layout) | approved (visual 5) | Witoon | | 02 Components: Sidebar Menu 287:4234; parts Sidebar Menu Item 287:4039 (24), Sidebar Section 287:4231 | agent/REPORT_SIDEBARMENU.md | #97; doc 288:6429; examples 288:5510; stress 288:6187 |
| 26 | Tabs | `<p-tabs>` | approved (visual 5) | Witoon | | 02 Components: Tabs 294:4222; parts Tab 294:4166 (4), Tab List 294:4190, Tabs Slot 294:4163 | agent/REPORT_TABS.md | #98; doc 295:6756; examples 295:6361; stress 295:6649 |
| 27 | Card | Sakai `div.card` (layout) | approved (visual 5) | Witoon | | 02 Components: Card 299:4189 (+ Card Slot 299:4187) | agent/REPORT_BATCH3_CONTENT.md | #100; doc 300:7246 |
| 28 | Divider | `<p-divider>` | approved (visual 5) | Witoon | | 02 Components: Divider 299:4195 (18) | agent/REPORT_BATCH3_CONTENT.md | #100; doc 300:7252 |
| 29 | Accordion | `<p-accordion>` | approved (visual 5) | Witoon | | 02 Components: Accordion 299:4312; Accordion Panel 299:4270 (6), Accordion Slot 299:4267 | agent/REPORT_BATCH3_CONTENT.md | #100; doc 300:7257; examples 300:6658; stress 300:7172 |
| 30 | Avatar + Avatar Group | `<p-avatar>` / `<p-avatargroup>` | approved (visual 5) | Witoon | | 02 Components: Avatar 306:4212 (12), Avatar Group 306:4255 (3) | agent/REPORT_BATCH3_DISPLAY.md | #100; doc 307:7362 |
| 31 | Chip | `<p-chip>` | approved (visual 5) | Witoon | | 02 Components: Chip 306:4304 (2) | agent/REPORT_BATCH3_DISPLAY.md | #100; doc 307:7377; examples 307:7003; stress 307:7288 |
| 32 | Breadcrumb | `<p-breadcrumb>` | approved (visual 5) | Witoon | | 02 Components: Breadcrumb 309:4257; Item 309:4246 (2), Separator 309:4254 | agent/REPORT_BATCH3_NAV.md | #100; doc 310:8183 |
| 33 | Menubar | `<p-menubar>` | approved (visual 5; open-submenu capture not yet working) | Witoon | | 02 Components: Menubar 309:4381; Item 309:4298 (12), Submenu 309:4358 | agent/REPORT_BATCH3_NAV.md | #100; doc 310:8198; examples 310:7271; stress 310:8080 |
| 34 | InputGroup | `<p-inputgroup>` | approved (visual 5) | Witoon | | 02 Components: InputGroup 317:4358 (4), Addon 317:4332 (5) | agent/REPORT_FORMS2_A.md | #101; doc 318:8498 |
| 35 | SelectButton | `<p-selectbutton>` | approved (visual 5) | Witoon | | 02 Components: SelectButton 317:4480 (12), Option 317:4419 (12) | agent/REPORT_FORMS2_A.md | #101; doc 318:8513; examples 318:7978; stress 318:8415 |
| 36 | MultiSelect | `<p-multiselect>` | approved (visual 5) | Witoon | | 02 Components: MultiSelect 321:4469 (144), Option 322:6439 (4), Panel 322:6458 | agent/REPORT_FORMS2_B.md | #101; doc 323:9529 |
| 37 | AutoComplete | `<p-autocomplete>` | approved (visual 5) | Witoon | | 02 Components: AutoComplete 322:4997 (144); panel = Select Panel | agent/REPORT_FORMS2_B.md | #101; doc 323:9544; examples 323:8873; stress 323:9462 |
| 38 | FileUpload | `<p-fileupload>` | approved (visual 5) | Witoon | | 02 Components: FileUpload 324:5569 (3), FileUpload File 324:5548 | agent/REPORT_FORMS2_C.md | #101; doc 325:9409; examples 325:8968 |
| 39 | Tooltip | `pTooltip` | approved (visual 5) | Witoon | | 02 Components: Tooltip 328:5660 (4) | agent/REPORT_EXTRAS_1.md | #102; doc 329:10322; examples 329:9382 |
| 40 | Timeline | `<p-timeline>` | approved (visual 5) | Witoon | | 02 Components: Timeline 328:5746 (4), Timeline Event 328:5677 (8) | agent/REPORT_EXTRAS_1.md | #102; doc 329:10337 |
| 41 | Stepper | `<p-stepper>` | approved (visual 5) | Witoon | | 02 Components: Stepper 328:5927 (3), Step 328:5891 (6), Stepper Slot 328:5924 | agent/REPORT_EXTRAS_1.md | #102; doc 329:10352 |
| 42 | Tree | `<p-tree>` | approved (visual 5) | Witoon | | 02 Components: Tree 333:5907 (2), Tree Node 333:5840 (9) | agent/REPORT_EXTRAS_2.md | #102; doc 335:2; examples 334:2 |
| 43 | TreeTable | `<p-treetable>` | approved (visual 5) | Witoon | | 02 Components: TreeTable 333:6155 (2), Row 333:6118 (3), Toggler Cell 333:6054 (9), Header Cell 333:6049, Body Cell 333:6051 | agent/REPORT_EXTRAS_2.md | #102; doc 335:17 |
| 44 | DataView | `<p-dataview>` | approved (visual 5) | Witoon | | 02 Components: DataView 338:6264 (2), List Item 338:6114 (2), Grid Item 338:6214 | agent/REPORT_EXTRAS_3.md | #102; doc 339:1464; examples 339:2 |
| 45 | Chart | `<p-chart>` | approved (visual 5) | Witoon | | 02 Components: Chart 341:6462 (4), Chart Legend Item 341:6452 (3) | agent/REPORT_EXTRAS_4.md | #102; doc 342:981; examples 342:2 |
