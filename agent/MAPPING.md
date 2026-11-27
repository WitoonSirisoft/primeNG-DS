
| Textarea | Size | small, base, large | `pTextarea` | pSize | no | none | |
| Textarea | Variant | outlined, filled | `pTextarea` | variant | no | none | |
| Textarea | State | default, hover, focus, disabled | `pTextarea` | disabled → [disabled] | partly | none | |
| Textarea | Invalid | false, true | `pTextarea` | invalid / ng-invalid ng-dirty | no | none | |
| Textarea | Content | placeholder, value, empty | `pTextarea` | — | yes | none | |
| Textarea | Placeholder / Value | text | `pTextarea` | placeholder / value | no | none | |
| IconField | Icon position | left, right | `<p-iconfield>` | iconPosition | no | none | |
| IconField | Size | small, base, large | `<p-iconfield>` | pSize of the inner input | no | none | |
| IconField | Icon | instance swap | `<p-inputicon>` | class (pi pi-…) | no | none | |
| Password | Toggle mask | false, true | `<p-password>` | toggleMask | no | none | |
| Password | Size | small, base, large | `<p-password>` | size | no | none | |
| Password | Icon | eye / eye-slash | `<p-password>` | toggle mask icon | no | none | |
| InputNumber | Buttons | none, stacked, horizontal, vertical | `<p-inputnumber>` | showButtons + buttonLayout | no | none | |
| InputNumber | Size | small, base, large | `<p-inputnumber>` | size | no | none | |
| DatePicker | Icon display | none, input, button | `<p-datepicker>` | showIcon + iconDisplay | no | none |  |
| DatePicker | Size | small, base, large | `<p-datepicker>` | size | no | none |  |
| DatePicker | Icon (swap) | Icon/calendar | `<p-datepicker>` | icon / inputicon template | no | none |  |
| DatePicker Date | State | default, hover, selected, today, disabled, other-month | `<p-datepicker>` day cell | selected date / today / minDate, maxDate, disabledDates / showOtherMonths | no | none | disabled + other-month = date colour at disabled-opacity (measured) |
| DatePicker Date | Day (text) | 1–31 | `<p-datepicker>` day cell | date value | no | none |  |
| DatePicker Panel | Month / Year (text) | November / 2026 | `<p-datepicker>` header | current view | no | none | month/year views not built (#65) |
| Checkbox | Size | small, base, large | `<p-checkbox>` | size | no | none |  |
| Checkbox | Variant | outlined, filled | `<p-checkbox>` | variant | no | none |  |
| Checkbox | State | default, hover, focus, disabled | `<p-checkbox>` | hover/focus = interaction; disabled → [disabled] | no | none |  |
| Checkbox | Invalid | false, true | `<p-checkbox>` | [invalid] | no | none | stays red in every state (#70) |
| Checkbox | Checked | no, yes, indeterminate | `<p-checkbox>` | model / [indeterminate] | no | none | indeterminate: checked is false in code |
| RadioButton | Size | small, base, large | `<p-radiobutton>` | size | no | none |  |
| RadioButton | Variant | outlined, filled | `<p-radiobutton>` | variant | no | none |  |
| RadioButton | State | default, hover, focus, disabled | `<p-radiobutton>` | hover/focus = interaction; disabled → [disabled] | no | none |  |
| RadioButton | Invalid | false, true | `<p-radiobutton>` | [invalid] | no | none | stays red in every state (#70) |
| RadioButton | Checked | no, yes | `<p-radiobutton>` | model equals value | no | none |  |
| ToggleSwitch | Size | small, base, large | `<p-toggleswitch>` | — (base only) | yes | design-only | small/large not in Aura or code (#71) |
| ToggleSwitch | State | default, hover, focus, disabled | `<p-toggleswitch>` | hover/focus = interaction; disabled → [disabled] | no | none |  |
| ToggleSwitch | Invalid | false, true | `<p-toggleswitch>` | [invalid] | no | none | stays red in every state (#70) |
| ToggleSwitch | Checked | no, yes | `<p-toggleswitch>` | model | no | none |  |
| Select | Size | small, base, large | `<p-select>` | size | no | none |  |
| Select | Variant | outlined, filled | `<p-select>` | variant | no | none |  |
| Select | State | default, hover, focus, disabled | `<p-select>` | hover/focus = interaction; disabled → [disabled] | no | none |  |
| Select | Invalid | false, true | `<p-select>` | [invalid] | no | none | red in every state (#53/#72) |
| Select | Content | placeholder, value, empty | `<p-select>` | placeholder / ngModel | no | none |  |
| Select | Show clear | boolean | `<p-select>` | [showClear] | no | none | #75 |
| Select Option | State | default, focus, selected, selected-focus | `<p-select> option` | hover/keyboard focus; selected = ngModel | no | none | selected only without checkmark |
| Select Option | Check | none, blank, checked | `<p-select> option` | [checkmark] | no | none |  |
| Select Option Group | Label | text | `<p-select> option group` | optionGroupLabel | no | none |  |
| Select Panel | Content | options, grouped, empty | `<p-select> overlay` | options / [group] / emptyMessage | no | none |  |
| Select Panel | Filter | boolean | `<p-select> overlay` | [filter] | no | none | IconField instance |
| Message | Severity | success, info, warn, error, secondary, contrast | `<p-message>` | severity | no | none |  |
| Message | Variant | default, outlined, simple | `<p-message>` | variant | no | none |  |
| Message | Size | small, base, large | `<p-message>` | size | no | none |  |
| Message | Text | text | `<p-message>` | content | no | none |  |
| Message | Show icon | boolean | `<p-message>` | [icon] | no | none | icon per severity, design default (#78/#79) |
| Message | Closable | boolean | `<p-message>` | [closable] | no | none | hover/focus not built (#77) |
| DataTable Header Cell | Size | small, base, large | `<p-table>` | size | no | none |  |
| DataTable Header Cell | Sort | none, unsorted, ascending, descending | `<p-table>` th | pSortableColumn + p-sortIcon | no | none | none = not sortable |
| DataTable Header Cell | Title | fit, wrap | `<p-table>` th | (layout only: long title wraps, icon on next line) | no | none | design-only choice, #87 |
| DataTable Header Cell | State | default, hover | `<p-table>` th | :hover (unsorted only) | no | none |  |
| DataTable Header Cell / Body Cell | Gridlines | boolean | `<p-table>` | [showGridlines] | no | none | last column / row borders by hand |
| DataTable Body Cell | Row | default, hover, selected | `<p-table>` tr | [(selection)] / :hover | no | none | set on every cell of the row |
| DataTable Body Cell | Striped | boolean | `<p-table>` | [stripedRows] | no | none | odd rows |
| DataTable cells | Text / Show text | text | `<p-table>` | cell content | no | none |  |
| DataTable cells | Show content / Content | swap | `<p-table>` | #body / #header template | no | none | swap targets must hug (#84) |
| DataTable Header | Title / Show search | text / boolean | `<p-table>` | #caption template | no | none | Sakai CRUD layout |
| DataTable Footer | Text | text | `<p-table>` | #footer template | no | none |  |
| Paginator | Report | boolean | `<p-paginator>` | showCurrentPageReport + rowsPerPageOptions | no | none |  |
| Paginator Button | Type / State / Label | first, prev, page, next, last | `<p-paginator>` | page links / nav | no | none |  |
| SplitButton | Severity / Variant / Size / Rounded | as Button | `<p-splitbutton>` | severity / [outlined] [text] / size / [rounded] | no | none | #90 |
| SplitButton | Raised | boolean | `<p-splitbutton>` | [raised] | no | none | shadow on the container |
| SplitButton | Button / Dropdown (exposed) | nested Button | `<p-splitbutton>` | label, icon / dropdownIcon, [buttonDisabled] / [menuButtonDisabled] | no | none | State per part |
| Toolbar | Show start / center / end | boolean | `<p-toolbar>` | #start / #center / #end templates | no | none | #89; items exposed |
| Dialog | Header / Show header / Closable | text / boolean | `<p-dialog>` | header / [showHeader] / [closable] | no | none | #91 |
| Dialog | Content / Show footer | swap / boolean | `<p-dialog>` | content (#content) / #footer template | no | none | footer Cancel + Save exposed |
| ConfirmDialog | Header / Message / Icon / Closable | text / text / swap / boolean | `<p-confirmdialog>` | confirm({ header, message, icon }) / closable | no | none | #93; No + Yes exposed (rejectLabel / acceptLabel) |
| Dialog Mask | — | — | modal mask | [modal] | no | none | #92 design aid |
| Toast | Severity | info, success, warn, error, secondary, contrast | `<p-toast>` | add({ severity }) | no | none | #94 |
| Toast | Summary / Detail / Show detail / Show icon / Closable | text / boolean | `<p-toast>` | add({ summary, detail, closable }) | no | none | icon per severity |
| Menu | Popup | false, true | `<p-menu>` | [popup]="true" (adds menu.shadow) | no | none | #95 |
| Menu Item | State | default, focus, disabled | `<p-menu>` item | focus = keyboard focus / hover; MenuItem.disabled | no | none | #95 |
| Menu Item | Label / Show icon / Icon | text / boolean / swap | `<p-menu>` item | MenuItem { label, icon } | no | none | 14 icons (Sakai pi-fw = 18) |
| Menu Submenu Label | Label | text | `<p-menu>` group | MenuItem { label, items } | no | none | |
| Menu Separator | — | — | `<p-menu>` | MenuItem { separator: true } | no | none | |
| Sidebar Menu Item | State | default, hover, active, active-hover | Sakai `app-menuitem` (`ul a`) | :hover; routerLinkActive → a.active-route | no | none | #97, Sakai layout, not PrimeNG |
| Sidebar Menu Item | Toggler | none, collapsed, expanded | Sakai `app-menuitem` | item has items; expanded = li.active-menuitem | no | none | expanded = Icon/angle-up |
| Sidebar Menu Item | Level | 0, 1 | Sakai `app-menuitem` | nesting depth (ul ul li a margin-left 1rem) | no | none | levels 2–4 not built |
| Sidebar Menu Item | Label / Show icon / Icon | text / boolean / swap | Sakai `app-menuitem` | MenuItem { label, icon } | no | none | icon slot 18 (pi-fw) |
| Sidebar Section | Label | text | Sakai `.layout-menuitem-root-text` | root MenuItem { label, items } | no | none | |
| Sidebar Menu | Expanded | false, true | Sakai `app-menu` (`.layout-sidebar`) | model (app.menu.ts) | no | none | prefilled exposed rows |
| Tab | State | default, hover, active, disabled | `<p-tab>` | active = Tabs [value]; [disabled]; hover only when inactive + enabled | no | none | #98; focus not built |
| Tab | Label / Show icon / Icon / Badge | text / boolean / swap / boolean | `<p-tab>` | tab content (label, `<i class="pi …">`, `<p-badge>`) | no | none | content flex + gap tabs.tab.gap |
| Tab List | Show tab 4 / Show tab 5 | boolean | `<p-tablist>` | number of `<p-tab>` | no | none | tabs stretch to the tallest (badge → 50) |
| Tabs | Content / Show content / Show slot / Slot | text / boolean / boolean / swap | `<p-tabs>` + `<p-tabpanels>` | `<p-tabpanel>` content | no | none | Tabs Slot (#84) |
| Card | Title / Show title / Content / Show content / Show slot / Slot | text / boolean / text / boolean / boolean / swap | Sakai `<div class="card">` | title div + content | no | none | #100, Sakai layout |
| Divider | Layout / Type / Align | horizontal, vertical / solid, dashed, dotted / start, center, end | `<p-divider>` | layout / type / align (left,center,right / top,center,bottom) | no | none | margins drawn as padding |
| Divider | Content / Label | boolean / text | `<p-divider>` | projected content | no | none | text only |
| Accordion Panel | State / Expanded | default, hover, disabled / false, true | `<p-accordion-panel>` | [disabled]; open = Accordion [value] | no | none | focus not built |
| Accordion Panel | Header / Content / Show content / Show slot / Slot | text / text / boolean / boolean / swap | `<p-accordion-header>` / `<p-accordion-content>` | content | no | none | |
| Accordion | Show panel 4 / Show panel 5 | boolean | `<p-accordion>` | number of panels; [multiple] | no | none | |
| Avatar | Size / Shape / Content | normal, large, xlarge / square, circle / label, icon | `<p-avatar>` | size / shape / label or icon | no | none | #100; image not built |
| Avatar | Label / Icon / Group border | text / swap / boolean | `<p-avatar>` | label / icon / inside p-avatargroup | no | none | |
| Avatar Group | Size | normal, large, xlarge | `<p-avatargroup>` | avatars' size | no | none | 5 exposed avatars |
| Chip | Removable / Label / Show icon / Icon | false, true / text / boolean / swap | `<p-chip>` | removable / label / icon | no | none | image not built |
| Breadcrumb Item | State / Label / Show label / Show icon / Icon | default, hover / text / boolean / boolean / swap | `<p-breadcrumb>` | MenuItem { label, icon }; [home] | no | none | #100 |
| Breadcrumb | — | — | `<p-breadcrumb [model] [home]>` | items + separators | no | none | Sakai demo prefilled |
| Menubar Item | Level / State / Submenu | root, submenu / default, hover, active / false, true | `<p-menubar>` item | hover = focus; active = submenu open; items | no | none | focus not built |
| Menubar Item | Label / Show icon / Icon | text / boolean / swap | `<p-menubar>` item | MenuItem { label, icon } | no | none | |
| Menubar Submenu | Show item 3 / Show item 4 | boolean | `<p-menubar>` submenu | items | no | none | |
| Menubar | Show end / End | boolean / swap | `<p-menubar>` | ng-template #end | no | none | mobile mode not built |
| InputGroup Addon | Position | first, middle, after-input, last, last-after-input | `<p-inputgroup-addon>` | place in the group (borders / corners by CSS) | no | none | #101 |
| InputGroup Addon | Show icon / Icon / Show text / Text / Show checkbox | boolean / swap / boolean / text / boolean | `<p-inputgroup-addon>` | addon content | no | none | |
| InputGroup | Row | icon, multi, button, checkbox | `<p-inputgroup>` | Sakai demo rows | no | none | parts exposed |
| SelectButton Option | State / Size | default, hover, checked, disabled / small, base, large | `<p-selectbutton>` option (ToggleButton) | checked = selected | no | none | focus not built |
| SelectButton Option | Label / Show label / Show icon / Icon | text / boolean / boolean / swap | `<p-selectbutton>` | optionLabel / #item template | no | none | |
| SelectButton | Size / Invalid / Disabled | small, base, large / false, true / false, true | `<p-selectbutton>` | [size] / [invalid] / [disabled] | no | none | Show option 4 / 5 |
| MultiSelect | Size / Variant / State / Invalid / Content | as Select / placeholder, chips, value | `<p-multiselect>` | [size] [variant] [invalid] [disabled]; display chip / comma | partly | none | #101 |
| MultiSelect | Placeholder / Value / Show clear | text / text / boolean | `<p-multiselect>` | placeholder / selected labels / showClear | no | none | |
| MultiSelect Option | State / Label | default, focus, selected, selected-focus / text | `<p-multiselect>` option | focus / selected | no | none | checkbox inside |
| MultiSelect Panel | Show header / Show option 6 | boolean | `<p-multiselect>` overlay | filter / showToggleAll; options | no | none | |
| AutoComplete | Size / Variant / State / Invalid / Content | as Select / placeholder, value, chips | `<p-autocomplete [dropdown]>` | pSize, variant, invalid, disabled; [multiple] | partly | none | panel = Select Panel |
| AutoComplete | Placeholder / Value | text | `<p-autocomplete>` | placeholder / selected item | no | none | |
| FileUpload | Mode / Files | advanced, basic / false, true | `<p-fileupload>` | mode; files chosen | no | none | #101 |
| FileUpload | Empty text / File name | text | `<p-fileupload>` | #empty template / basic chosen file | no | none | |
| FileUpload File | Name / Size / Show thumbnail / Show divider | text / text / boolean / boolean | `<p-fileupload>` file row | file name / formatSize / previewWidth | no | none | badge + remove exposed |
| Tooltip | Position / Text | top, right, bottom, left / text | `pTooltip` | tooltipPosition / pTooltip | no | none | #102 |
| Timeline Event | Layout / Align / Position | vertical, horizontal / start, end / middle, last | `<p-timeline>` event | layout / align / last item | no | none | Content, Opposite, Show opposite |
| Timeline | Align | left, right, alternate, horizontal | `<p-timeline>` | align / layout | no | none | 4 events exposed |
| Step | State / Position / Number / Title | default, active, completed / middle, last / text / text | `<p-step>` | value vs active / last | no | none | |
| Stepper | Active / Show panels | 1, 2, 3 / boolean | `<p-stepper>` | value / p-step-panels | no | none | Slot for panel content |
| Tree Node | Toggle / State / Label / Icon / Show checkbox | expanded, collapsed, leaf / default, hover, selected / text / swap / boolean | `<p-tree>` node | node.expanded, leaf / selection / node.label / node.icon / selectionMode checkbox | no | none | #102; Checkbox exposed |
| Tree | Selection | single, checkbox | `<p-tree>` | selectionMode | no | none | nodes exposed |
| TreeTable Toggler Cell | Toggle / Level / Text / Show checkbox | expanded, collapsed, leaf / 0, 1, 2 / text / boolean | `<p-treetable-toggler>` cell | rowNode.node.expanded / rowNode.level / field / selectionMode checkbox | no | none | indent 16 px per level |
| TreeTable Header Cell / Body Cell | Text | text | `<p-treetable>` th / td | column header / field | no | none | |
| TreeTable Row | State | default, hover, selected | `<p-treetable>` tr | hover / selection | no | none | cells exposed |
| TreeTable | Selection | plain, checkbox | `<p-treetable>` | selectionMode | no | none | rows exposed |
| DataView | Layout / Show header | list, grid / boolean | `<p-dataview>` | layout / #header | no | none | #102; items exposed |
| DataView List Item / Grid Item | Category / Name / Rating / Price (+ Position first/other on list) | text | Sakai List demo #list / #grid template | item fields | no | none | Sakai markup, not PrimeNG |
| Chart | Type | line, bar, pie, doughnut | `<p-chart>` (Chart.js) | type (data / options drawn as a static picture) | no | none | #102; legend items exposed |
| Chart Legend Item | Style / Label | box, outlined, point / text | Chart.js legend | dataset type + usePointStyle / dataset.label | no | none | Swatch colour override |
| Topbar | Device / App name / Logo | desktop, mobile / text / swap | Sakai `<app-topbar>` | viewport ≥ 992 / logo text / logo svg | no | none | #103; actions exposed |
| Topbar Action | State / Icon | default, hover, highlight / swap | Sakai `.layout-topbar-action` | hover / .layout-topbar-action-highlight / icon | no | none | |
| Layout Footer | Text / Link | text | Sakai `<app-footer>` | footer content | no | none | |
| App Shell | Device | desktop, mobile | Sakai `<app-layout>` (.layout-static) | viewport ≥ 992 | no | none | pattern on 03 Patterns |
| Form Field | Layout / Label / Show label / Control / Show help / Help text / Show error | vertical, horizontal / text / boolean / swap / boolean / text / boolean | `<label>` + control + `<small>` / `<p-message severity="error" size="small" variant="simple">` | markup (flex-col gap-2 / grid-cols-12) / label text / sr-only / control / help / [invalid] + message | no | none | #103; Control + Error exposed |
| Form Layout | — | — | Sakai formlayoutdemo.ts | page markup | no | none | pattern on 03 Patterns |
| CRUD Page | State | list, edit, delete | Sakai pages/crud (p-toolbar + p-table + p-dialog + p-confirmdialog) | productDialog / confirmationService.confirm | no | none | #103; pattern on 03 Patterns |
| App Shell | Content | swap | Sakai .layout-main <router-outlet> | routed page | no | none | added for page patterns |
| Page Header | Title / Subtitle / Show breadcrumb / Show subtitle / Show actions | text / boolean | new composition: `<p-breadcrumb>` + `<h4>` + `<p>` + `<p-button>` | markup | no | none | #103; not from Sakai |
| Filter Bar | Show chips | boolean | new composition: `<p-iconfield>` + `<p-select>` + `<p-button text>` + `<p-chip removable>` | markup | no | none | #103; not from Sakai |
| Empty State | Type | no-data, no-results, error | new composition (DataTable #emptymessage or page content) | state | no | none | #103; not from Sakai |
| Auth Page | Page | login, access, error, notfound | Sakai pages/auth/*.ts, pages/notfound/notfound.ts | route | no | none | #105; template on 04 Templates |
| Floating Configurator | — | — | Sakai `<app-floating-configurator>` | toggleDarkMode / palette | no | none | #105 |
| App Page | Page / Device | empty, crud, dashboard / desktop, mobile | Sakai routed pages in app.layout | route | no | none | #105; template on 04 Templates |
| Stat Card | Color | blue, orange, cyan, purple | Sakai statswidget.ts | widget markup | no | none | #105 |
| Recent Sales / Best Selling Products / Revenue Stream / Notifications / Dashboard Content | — | — | Sakai dashboard widgets | widget markup | no | none | #105; patterns on 03 Patterns |
| Scrollbar | Direction | horizontal, vertical | none (browser native scrollbar) | [scrollable] / scrollHeight / overflow | no | none | design-only, #88; thumb via instance padding |
| Button Icon | Severity / Variant / Size / State / Rounded | as Button | `<p-button>` | icon only (no label) | no | none | #85 |
