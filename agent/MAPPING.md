
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
| Scrollbar | Direction | horizontal, vertical | none (browser native scrollbar) | [scrollable] / scrollHeight / overflow | no | none | design-only, #88; thumb via instance padding |
| Button Icon | Severity / Variant / Size / State / Rounded | as Button | `<p-button>` | icon only (no label) | no | none | #85 |
