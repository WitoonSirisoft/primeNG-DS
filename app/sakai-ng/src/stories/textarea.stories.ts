import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { TextareaModule } from 'primeng/textarea';
import { VARIANT_OPTS, sizeOf } from './_forms';

/** pTextarea (directive on <textarea>), primeng 21.0.2. Inputs: pSize, variant, invalid, fluid, autoResize. disabled/readonly/placeholder/rows are native. */
const meta: Meta = { title: 'Components/Textarea', decorators: [moduleMetadata({ imports: [TextareaModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { value: '', placeholder: 'Placeholder', pSize: 'base', variant: 'outlined', rows: 3, cols: 24, invalid: false, disabled: false, readonly: false, fluid: false, autoResize: false },
    argTypes: { pSize: { control: 'inline-radio', options: ['small', 'base', 'large'] }, variant: { control: 'inline-radio', options: VARIANT_OPTS } },
    render: (args) => ({
        props: { ...args, s: sizeOf(args['pSize']) },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <textarea pTextarea [value]="value" [placeholder]="placeholder" [pSize]="s" [variant]="variant" [rows]="rows" [cols]="cols"
    [invalid]="invalid" [disabled]="disabled" [readonly]="readonly" [fluid]="fluid" [autoResize]="autoResize"></textarea></div>`
    })
};
