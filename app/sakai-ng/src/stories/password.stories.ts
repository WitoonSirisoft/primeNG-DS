import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ARGTYPES, sizeOf } from './_forms';

/** p-password, primeng 21.0.2. Inputs: feedback, toggleMask, size, variant, invalid, disabled, fluid, placeholder. Overlay (strength meter) kept inside the cell (appendTo self) for capture. */
const meta: Meta = { title: 'Components/Password', decorators: [moduleMetadata({ imports: [PasswordModule, FormsModule] })] };
export default meta;
const tpl = (h: string) => `<div data-cell="playground" class="sb-cell" style="display:inline-flex;align-items:flex-start;padding:4px;${h}">
  <p-password [(ngModel)]="value" [placeholder]="placeholder" [feedback]="feedback" [toggleMask]="toggleMask" [size]="s" [variant]="variant"
    [invalid]="invalid" [disabled]="disabled" appendTo="self" /></div>`;
const args = { value: '', placeholder: 'Password', size: 'base', variant: 'outlined', feedback: false, toggleMask: false, invalid: false, disabled: false };
export const Playground: StoryObj = { args, argTypes: ARGTYPES, render: (a) => ({ props: { ...a, s: sizeOf(a['size']) }, template: tpl('') }) };
/** feedback panel (strength meter) open on focus. */
export const Open: StoryObj = { args: { ...args, feedback: true, value: 'abc' }, argTypes: ARGTYPES, render: (a) => ({ props: { ...a, s: sizeOf(a['size']) }, template: tpl('height:150px;') }) };
