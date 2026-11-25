import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ARGTYPES, CITIES, sizeOf } from './_forms';

/** p-select, primeng 21.0.2. Inputs: options, optionLabel, placeholder, showClear, checkmark, editable, filter, size, variant, invalid, disabled, fluid. Overlay kept inside the cell (appendTo self) for capture. */
const meta: Meta = { title: 'Components/Select', decorators: [moduleMetadata({ imports: [SelectModule, FormsModule] })] };
export default meta;
const tpl = (h: string) => `<div data-cell="playground" class="sb-cell" style="display:inline-flex;align-items:flex-start;padding:4px;${h}">
  <p-select [options]="options" optionLabel="name" [(ngModel)]="model" [placeholder]="placeholder" [showClear]="showClear" [checkmark]="checkmark"
    [editable]="editable" [filter]="filter" [group]="grouped" optionGroupLabel="label" optionGroupChildren="items" [size]="s" [variant]="variant" [invalid]="invalid" [disabled]="disabled" appendTo="self" [style]="{ width: '14rem' }" /></div>`;
const args = { selected: false, grouped: false, empty: false, placeholder: 'Select a city', showClear: false, checkmark: false, editable: false, filter: false, size: 'base', variant: 'outlined', invalid: false, disabled: false };
// Grouped example for the option-group capture (#74)
const GROUPS = [
    { label: 'Italy', items: [CITIES[1], { name: 'Milan', code: 'MI' }] },
    { label: 'United Kingdom', items: [CITIES[2], { name: 'Manchester', code: 'MAN' }] }
];
const props = (a: any) => ({ ...a, options: a.empty ? [] : a.grouped ? GROUPS : CITIES, model: a.selected && !a.empty ? CITIES[1] : null, s: sizeOf(a.size) });
export const Playground: StoryObj = { args, argTypes: ARGTYPES, render: (a) => ({ props: props(a), template: tpl('') }) };
/** Panel open (click during capture); cell tall enough to hold the overlay. */
export const Open: StoryObj = { args: { ...args, selected: true }, argTypes: ARGTYPES, render: (a) => ({ props: props(a), template: tpl('height:320px;') }) };
