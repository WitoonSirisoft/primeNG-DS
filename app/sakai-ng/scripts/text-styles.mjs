/**
 * Figma text styles for the Base (DECISIONS #28). Shared by figma-variables.mjs (creates them)
 * and figma-verify.mjs (checks them). Every field is a token PATH in tokens/base/tokens.json, never a
 * literal, so a theme or a PrimeNG/Sakai update flows through. `css` records where the browser gets it
 * (measured in Storybook/Sakai 2026-11-20: all values below match getComputedStyle).
 *
 * Line height: CSS uses unitless ratios (1.2, 1.5). Figma stores them as PERCENT (120%, 150%) so the
 * style stays right if the font size changes. Not bound to a variable: Figma reads a bound number as px.
 */
const BASE = { family: 'font-family', lineHeight: 'typography.base.line-height' };
const H = (n) => ({
    name: `Heading/H${n}`,
    ...BASE,
    size: `typography.heading.h${n}.font-size`,
    weight: 'typography.heading.font-weight',
    lineHeight: 'typography.heading.line-height',
    css: `Sakai _typography.scss: h${n}`
});
export const TEXT_STYLES = [
    ...[1, 2, 3, 4, 5, 6].map(H),
    { name: 'Body/Paragraph', ...BASE, size: 'typography.base.font-size', weight: 'typography.base.font-weight', lineHeight: 'typography.paragraph.line-height', css: 'Sakai _typography.scss: p' },
    { name: 'Body/Base', ...BASE, size: 'typography.base.font-size', weight: 'typography.base.font-weight', css: 'Sakai _core.scss: html/body (text outside components and paragraphs)' },
    { name: 'Button/Label sm', ...BASE, size: 'button.sm.font-size', weight: 'button.label.font-weight', css: '.p-button-sm .p-button-label' },
    { name: 'Button/Label base', ...BASE, size: 'typography.base.font-size', weight: 'button.label.font-weight', css: '.p-button .p-button-label (PrimeNG CSS font-size: 1rem literal, no token)' },
    { name: 'Button/Label lg', ...BASE, size: 'button.lg.font-size', weight: 'button.label.font-weight', css: '.p-button-lg .p-button-label' },
    { name: 'InputText/Text sm', ...BASE, size: 'inputtext.sm.font-size', weight: 'typography.base.font-weight', css: '.p-inputtext-sm' },
    { name: 'InputText/Text base', ...BASE, size: 'typography.base.font-size', weight: 'typography.base.font-weight', css: '.p-inputtext (PrimeNG CSS font-size: 1rem literal, no token)' },
    { name: 'InputText/Text lg', ...BASE, size: 'inputtext.lg.font-size', weight: 'typography.base.font-weight', css: '.p-inputtext-lg' },
    { name: 'Tag/Label', ...BASE, size: 'tag.font-size', weight: 'tag.font-weight', css: '.p-tag' },
    { name: 'Textarea/Text sm', ...BASE, size: 'textarea.sm.font-size', weight: 'typography.base.font-weight', css: '.p-textarea-sm' },
    { name: 'Textarea/Text base', ...BASE, size: 'typography.base.font-size', weight: 'typography.base.font-weight', css: '.p-textarea (PrimeNG CSS font-size: 1rem literal, no token)' },
    { name: 'Textarea/Text lg', ...BASE, size: 'textarea.lg.font-size', weight: 'typography.base.font-weight', css: '.p-textarea-lg' },
    { name: 'Select/Text sm', ...BASE, size: 'select.sm.font-size', weight: 'typography.base.font-weight', css: '.p-select-sm .p-select-label' },
    { name: 'Select/Text base', ...BASE, size: 'typography.base.font-size', weight: 'typography.base.font-weight', css: '.p-select-label, .p-select-option (PrimeNG CSS font-size: 1rem literal, no token)' },
    { name: 'Select/Text lg', ...BASE, size: 'select.lg.font-size', weight: 'typography.base.font-weight', css: '.p-select-lg .p-select-label' },
    { name: 'Select/Group', ...BASE, size: 'typography.base.font-size', weight: 'select.option-group.font-weight', css: '.p-select-option-group' },
    { name: 'Message/Text sm', ...BASE, size: 'message.text.sm.font-size', weight: 'message.text.font-weight', css: '.p-message-sm .p-message-text' },
    { name: 'Message/Text base', ...BASE, size: 'message.text.font-size', weight: 'message.text.font-weight', css: '.p-message-text' },
    { name: 'Message/Text lg', ...BASE, size: 'message.text.lg.font-size', weight: 'message.text.font-weight', css: '.p-message-lg .p-message-text' },
    { name: 'DataTable/Column title', ...BASE, size: 'typography.base.font-size', weight: 'datatable.column-title.font-weight', css: '.p-datatable-column-title' },
    { name: 'DataTable/Column footer', ...BASE, size: 'typography.base.font-size', weight: 'datatable.column-footer.font-weight', css: '.p-datatable-tfoot > tr > td (column footer)' },
    { name: 'Dialog/Title', ...BASE, size: 'dialog.title.font-size', weight: 'dialog.title.font-weight', css: '.p-dialog-title' },
    { name: 'Toast/Summary', ...BASE, size: 'toast.summary.font-size', weight: 'toast.summary.font-weight', css: '.p-toast-summary' },
    { name: 'Toast/Detail', ...BASE, size: 'toast.detail.font-size', weight: 'toast.detail.font-weight', css: '.p-toast-detail' },
    { name: 'Stepper/Number', ...BASE, size: 'stepper.step-number.font-size', weight: 'stepper.step-number.font-weight', css: '.p-step-number (#102)' },
    { name: 'Stepper/Title', ...BASE, size: 'typography.base.font-size', weight: 'stepper.step-title.font-weight', css: '.p-step-title (#102)' },
    { name: 'ToggleButton/Label sm', ...BASE, size: 'togglebutton.sm.font-size', weight: 'togglebutton.font-weight', css: '.p-togglebutton-sm (#101)' },
    { name: 'ToggleButton/Label', ...BASE, size: 'typography.base.font-size', weight: 'togglebutton.font-weight', css: '.p-togglebutton (font-size 1rem, #101)' },
    { name: 'ToggleButton/Label lg', ...BASE, size: 'togglebutton.lg.font-size', weight: 'togglebutton.font-weight', css: '.p-togglebutton-lg (#101)' },
    { name: 'Avatar/Label', ...BASE, size: 'avatar.font-size', weight: 'typography.base.font-weight', css: '.p-avatar (#100)' },
    { name: 'Avatar/Label lg', ...BASE, size: 'avatar.lg.font-size', weight: 'typography.base.font-weight', css: '.p-avatar-lg (#100)' },
    { name: 'Avatar/Label xl', ...BASE, size: 'avatar.xl.font-size', weight: 'typography.base.font-weight', css: '.p-avatar-xl (#100)' },
    { name: 'Body/Strong', ...BASE, size: 'typography.base.font-size', weight: 'typography.strong.font-weight', css: 'b, strong in content (#100)' },
    { name: 'Card/Title', ...BASE, size: 'layout.card.title.font-size', weight: 'layout.card.title.font-weight', lineHeight: 'layout.card.title.line-height', css: 'Sakai card title: font-semibold text-xl (#100)' },
    { name: 'Chart/Label', ...BASE, size: 'layout.chart.font-size', weight: 'typography.base.font-weight', lineHeight: 'layout.chart.line-height', css: 'Chart.js canvas text: legend, ticks (Chart.defaults.font 12px; family set to Lato) (#102)' },
    { name: 'Chart/Label medium', ...BASE, size: 'layout.chart.font-size', weight: 'layout.chart.tick-font-weight', lineHeight: 'layout.chart.line-height', css: 'Sakai Chart demo: bar x ticks font weight 500 (#102)' },
    { name: 'DataView/Meta', ...BASE, size: 'layout.dataview.meta.font-size', weight: 'layout.dataview.meta.font-weight', lineHeight: 'layout.dataview.meta.line-height', css: 'Sakai List demo: font-medium text-sm (category, rating) (#102)' },
    { name: 'DataView/Name', ...BASE, size: 'layout.dataview.name.font-size', weight: 'layout.dataview.name.font-weight', lineHeight: 'layout.dataview.name.line-height', css: 'Sakai List demo: text-lg font-medium (#102)' },
    { name: 'DataView/Price', ...BASE, size: 'layout.dataview.price.font-size', weight: 'layout.dataview.price.font-weight', lineHeight: 'layout.dataview.price.line-height', css: 'Sakai List demo: text-xl font-semibold (list) (#102)' },
    { name: 'DataView/Price lg', ...BASE, size: 'layout.dataview.price-lg.font-size', weight: 'layout.dataview.price.font-weight', lineHeight: 'layout.dataview.price-lg.line-height', css: 'Sakai List demo: text-2xl font-semibold (grid) (#102)' },
    { name: 'Accordion/Header', ...BASE, size: 'typography.base.font-size', weight: 'accordion.header.font-weight', css: '.p-accordionheader (#100)' },
    { name: 'Tabs/Tab label', ...BASE, size: 'typography.base.font-size', weight: 'tabs.tab.font-weight', css: '.p-tab (#98)' },
    { name: 'Menu/Submenu label', ...BASE, size: 'typography.base.font-size', weight: 'menu.submenu-label.font-weight', css: '.p-menu-submenu-label' },
    { name: 'Menu/Item label', ...BASE, size: 'typography.base.font-size', weight: 'typography.base.font-weight', lineHeight: 'typography.menu-item-label.line-height', css: '.p-menu-item-label' },
    { name: 'Sidebar/Section', ...BASE, size: 'layout.menu.root-text.font-size', weight: 'layout.menu.root-text.font-weight', textCase: 'layout.menu.root-text.text-transform', css: 'Sakai _menu.scss: .layout-menuitem-root-text' },
    { name: 'Sidebar/Item active', ...BASE, size: 'typography.base.font-size', weight: 'layout.menu.item.active-font-weight', css: 'Sakai _menu.scss: ul a.active-route' }
];
/** Figma font style for a CSS weight (Lato in Figma: Thin, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black). */
export const WEIGHT_STYLE = { 100: 'Thin', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
