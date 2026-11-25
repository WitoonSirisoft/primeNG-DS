import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SIZE_OPTS, sizeOf } from './_forms';

/** p-toggleswitch, primeng 21.0.2. Inputs: size, invalid, disabled, readonly. No variant. */
const meta: Meta = { title: 'Components/ToggleSwitch', decorators: [moduleMetadata({ imports: [ToggleSwitchModule, FormsModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { checked: false, size: 'base', invalid: false, disabled: false },
    argTypes: { size: { control: 'inline-radio', options: SIZE_OPTS } },
    render: (args) => ({
        props: { ...args, s: sizeOf(args['size']) },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <p-toggleswitch [(ngModel)]="checked" [size]="s" [invalid]="invalid" [disabled]="disabled" /></div>`
    })
};
