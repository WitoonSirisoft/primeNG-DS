import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { VARIANT_OPTS, sizeOf } from './_forms';

/** p-iconfield + p-inputicon around pInputText (Sakai search field), primeng 21.0.2. Inputs: iconPosition (left/right); size comes from the input's pSize. */
const meta: Meta = { title: 'Components/IconField', decorators: [moduleMetadata({ imports: [IconFieldModule, InputIconModule, InputTextModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { iconPosition: 'left', icon: 'pi pi-search', value: '', placeholder: 'Search', pSize: 'base', variant: 'outlined', invalid: false, disabled: false },
    argTypes: { iconPosition: { control: 'inline-radio', options: ['left', 'right'] }, pSize: { control: 'inline-radio', options: ['small', 'base', 'large'] }, variant: { control: 'inline-radio', options: VARIANT_OPTS } },
    render: (args) => ({
        props: { ...args, s: sizeOf(args['pSize']) },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <p-iconfield [iconPosition]="iconPosition"><p-inputicon [styleClass]="icon" />
    <input pInputText type="text" [value]="value" [placeholder]="placeholder" [pSize]="s" [variant]="variant" [invalid]="invalid" [disabled]="disabled" /></p-iconfield></div>`
    })
};
