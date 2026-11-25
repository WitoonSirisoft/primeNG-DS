import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ARGTYPES, sizeOf } from './_forms';

/** p-radiobutton, primeng 21.0.2. Inputs: value, size, variant, invalid, disabled. checked = model equals value. */
const meta: Meta = { title: 'Components/RadioButton', decorators: [moduleMetadata({ imports: [RadioButtonModule, FormsModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { checked: false, size: 'base', variant: 'outlined', invalid: false, disabled: false },
    argTypes: ARGTYPES,
    render: (args) => ({
        props: { ...args, s: sizeOf(args['size']), model: args['checked'] ? 'a' : null },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <p-radiobutton name="sb" value="a" [(ngModel)]="model" [size]="s" [variant]="variant" [invalid]="invalid" [disabled]="disabled" /></div>`
    })
};
