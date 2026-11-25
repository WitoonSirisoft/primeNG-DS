import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ARGTYPES, sizeOf } from './_forms';

/** p-inputnumber, primeng 21.0.2. Inputs: showButtons, buttonLayout (stacked|horizontal|vertical), mode, prefix, suffix, size, variant, invalid, disabled, placeholder. */
const meta: Meta = { title: 'Components/InputNumber', decorators: [moduleMetadata({ imports: [InputNumberModule, FormsModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { value: 42, placeholder: 'Number', showButtons: false, buttonLayout: 'stacked', prefix: '', suffix: '', size: 'base', variant: 'outlined', invalid: false, disabled: false },
    argTypes: { ...ARGTYPES, buttonLayout: { control: 'inline-radio', options: ['stacked', 'horizontal', 'vertical'] } },
    render: (args) => ({
        props: { ...args, s: sizeOf(args['size']) },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <p-inputnumber [(ngModel)]="value" [placeholder]="placeholder" [showButtons]="showButtons" [buttonLayout]="buttonLayout" [prefix]="prefix || undefined" [suffix]="suffix || undefined"
    [size]="s" [variant]="variant" [invalid]="invalid" [disabled]="disabled" /></div>`
    })
};
