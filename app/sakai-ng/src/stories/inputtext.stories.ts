import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { InputTextModule } from 'primeng/inputtext';
import { MATRIX_STYLES, SIZES } from './_matrix';

/**
 * pInputText (directive on <input>) — PrimeNG 21.0.2. Verified against node_modules/primeng/types/primeng-inputtext.d.ts.
 * Inputs: pSize: 'small' | 'large' (NOTE: named pSize, not size), variant: 'filled' | 'outlined', invalid, fluid.
 * disabled / readonly / placeholder are native HTML attributes, not PrimeNG inputs.
 * Aura has no dedicated readonly style: readonly renders like default (shown so the screenshot proves it).
 * Focus and hover come from real input during capture (screenshots/README.md).
 */
const VARIANTS = ['outlined', 'filled'] as const;
const STATES = [
    { name: 'empty', value: '', placeholder: '', disabled: false, readonly: false, invalid: false },
    { name: 'placeholder', value: '', placeholder: 'Placeholder', disabled: false, readonly: false, invalid: false },
    { name: 'value', value: 'Text value', placeholder: 'Placeholder', disabled: false, readonly: false, invalid: false },
    { name: 'disabled', value: 'Text value', placeholder: 'Placeholder', disabled: true, readonly: false, invalid: false },
    { name: 'readonly', value: 'Text value', placeholder: 'Placeholder', disabled: false, readonly: true, invalid: false },
    { name: 'invalid', value: '', placeholder: 'Placeholder', disabled: false, readonly: false, invalid: true },
    { name: 'invalid-value', value: 'Text value', placeholder: 'Placeholder', disabled: false, readonly: false, invalid: true }
];

const meta: Meta = {
    title: 'Components/InputText',
    decorators: [moduleMetadata({ imports: [InputTextModule] })],
    parameters: { docs: { description: { component: 'PrimeNG `pInputText` directive (primeng 21.0.2, Aura). Args map 1:1 to PrimeNG inputs or native attributes.' } } }
};
export default meta;

export const Playground: StoryObj = {
    args: { value: '', placeholder: 'Placeholder', pSize: 'base', variant: 'outlined', invalid: false, fluid: false, disabled: false, readonly: false },
    argTypes: {
        pSize: { control: 'inline-radio', options: ['small', 'base', 'large'], description: "PrimeNG input `pSize`; 'base' = not set" },
        variant: { control: 'inline-radio', options: VARIANTS }
    },
    render: (args) => ({
        props: { ...args, sizeValue: args['pSize'] === 'base' ? undefined : args['pSize'] },
        template: `
      <div data-cell="playground" class="sb-cell" [style.display]="fluid ? 'block' : 'inline-flex'" [style.width]="fluid ? '400px' : null">
        <input pInputText type="text" [value]="value" [placeholder]="placeholder" [pSize]="sizeValue" [variant]="variant"
          [invalid]="invalid" [fluid]="fluid" [disabled]="disabled" [readonly]="readonly" />
      </div>`
    })
};

/** state × variant, size base. */
export const StateByVariant: StoryObj = {
    render: () => ({
        props: { states: STATES, variants: VARIANTS },
        styles: [MATRIX_STYLES],
        template: `
      <div class="sb-matrix" style="grid-template-columns: 110px repeat(2, max-content)">
        <span></span>
        @for (v of variants; track v) { <span class="sb-h">variant={{ v }}</span> }
        @for (st of states; track st.name) {
          <span class="sb-h">{{ st.name }}</span>
          @for (v of variants; track v) {
            <span class="sb-cell" [attr.data-cell]="'state-' + st.name + '__variant-' + v">
              <input pInputText type="text" [value]="st.value" [placeholder]="st.placeholder" [variant]="v"
                [disabled]="st.disabled" [readonly]="st.readonly" [invalid]="st.invalid" />
            </span>
          }
        }
      </div>`
    })
};

/** pSize × variant, with a value. */
export const SizeByVariant: StoryObj = {
    render: () => ({
        props: { sizes: SIZES, variants: VARIANTS },
        styles: [MATRIX_STYLES],
        template: `
      <div class="sb-matrix" style="grid-template-columns: 110px repeat(2, max-content)">
        <span></span>
        @for (v of variants; track v) { <span class="sb-h">variant={{ v }}</span> }
        @for (s of sizes; track s.name) {
          <span class="sb-h">pSize={{ s.name }}</span>
          @for (v of variants; track v) {
            <span class="sb-cell" [attr.data-cell]="'size-' + s.name + '__variant-' + v">
              <input pInputText type="text" value="Text value" [pSize]="s.value" [variant]="v" />
            </span>
          }
        }
      </div>`
    })
};

/** fluid: spans 100% of its container (container fixed at 400px here). */
export const Fluid: StoryObj = {
    render: () => ({
        styles: [MATRIX_STYLES],
        template: `
      <div data-cell="fluid" style="width:400px; padding:4px"><input pInputText type="text" placeholder="Placeholder" [fluid]="true" /></div>`
    })
};

/**
 * Label + helper text. NOT part of pInputText: this is a form-row composition (SPEC 03 Patterns),
 * written the way Sakai's Form Layout page does it. Kept for reference only; see DECISIONS open questions.
 */
export const WithLabelAndHelper: StoryObj = {
    name: 'With label and helper (pattern)',
    render: () => ({
        styles: [MATRIX_STYLES],
        template: `
      <div class="sb-matrix" style="grid-template-columns: repeat(2, 260px)">
        <span class="sb-h">default</span><span class="sb-h">invalid</span>
        <div data-cell="formrow" class="flex flex-col gap-2">
          <label for="sb-user">Username</label>
          <input pInputText id="sb-user" type="text" placeholder="Placeholder" aria-describedby="sb-user-help" />
          <small id="sb-user-help">Helper text</small>
        </div>
        <div data-cell="formrow__invalid" class="flex flex-col gap-2">
          <label for="sb-user-inv">Username</label>
          <input pInputText id="sb-user-inv" type="text" placeholder="Placeholder" [invalid]="true" aria-describedby="sb-user-inv-help" />
          <small id="sb-user-inv-help" class="text-red-500">Error message</small>
        </div>
      </div>`
    })
};
