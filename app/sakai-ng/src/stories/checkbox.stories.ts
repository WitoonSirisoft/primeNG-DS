import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ARGTYPES, sizeOf } from './_forms';

/** p-checkbox (binary), primeng 21.0.2. Inputs: binary, indeterminate, size, variant, invalid, disabled. */
const meta: Meta = { title: 'Components/Checkbox', decorators: [moduleMetadata({ imports: [CheckboxModule, FormsModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { checked: false, indeterminate: false, size: 'base', variant: 'outlined', invalid: false, disabled: false },
    argTypes: ARGTYPES,
    render: (args) => ({
        props: { ...args, s: sizeOf(args['size']) },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <p-checkbox [(ngModel)]="checked" [binary]="true" [indeterminate]="indeterminate" [size]="s" [variant]="variant" [invalid]="invalid" [disabled]="disabled" /></div>`
    })
};
