import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ARGTYPES, sizeOf } from './_forms';

/**
 * p-datepicker, primeng 21.0.2 (DECISIONS #65). Field inputs: showIcon, iconDisplay ('input' | 'button'), size, variant, invalid, disabled, placeholder.
 * Panel: captured with [inline]="true" + showButtonBar (day view). Fixed month: November 2026, selected 18, dates before the 3rd disabled (minDate).
 * NOTE: "today" is the capture machine's real date; it is highlighted only when the capture runs in November 2026.
 */
const meta: Meta = { title: 'Components/DatePicker', decorators: [moduleMetadata({ imports: [DatePickerModule, FormsModule] })] };
export default meta;
const SEL = new Date(2026, 10, 18);
export const Playground: StoryObj = {
    args: { selected: false, placeholder: 'Select a date', icon: 'none', size: 'base', variant: 'outlined', invalid: false, disabled: false },
    argTypes: { ...ARGTYPES, icon: { control: 'inline-radio', options: ['none', 'input', 'button'], description: "'none' = showIcon off; otherwise showIcon + iconDisplay" } },
    render: (args) => ({
        props: { ...args, s: sizeOf(args['size']), model: args['selected'] ? SEL : null, show: args['icon'] !== 'none', disp: args['icon'] === 'none' ? 'button' : args['icon'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <p-datepicker [(ngModel)]="model" [placeholder]="placeholder" [showIcon]="show" [iconDisplay]="disp" [size]="s" [variant]="variant"
    [invalid]="invalid" [disabled]="disabled" dateFormat="mm/dd/yy" /></div>`
    })
};
/** Day-view panel, shown inline so it can be captured without opening an overlay. */
export const Panel: StoryObj = {
    render: () => ({
        props: { model: SEL, min: new Date(2026, 10, 3), def: SEL },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <p-datepicker [(ngModel)]="model" [inline]="true" [showButtonBar]="true" [minDate]="min" [defaultDate]="def" /></div>`
    })
};
