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
    { name: 'Message/Text lg', ...BASE, size: 'message.text.lg.font-size', weight: 'message.text.font-weight', css: '.p-message-lg .p-message-text' }
];
/** Figma font style for a CSS weight (Lato in Figma: Thin, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black). */
export const WEIGHT_STYLE = { 100: 'Thin', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
