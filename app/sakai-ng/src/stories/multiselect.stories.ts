import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ARGTYPES, CITIES, sizeOf } from './_forms';

/** p-multiselect, primeng 21. Forms 2 (DECISIONS #101). Sakai Input demo: display="chip", filter. Same axes as Select (#73): size, variant, state; selected: 2 values; chip: display chip vs comma. Overlay inside the cell (appendTo self) for the 'open' capture. */
const meta: Meta = { title: 'Components/MultiSelect', decorators: [moduleMetadata({ imports: [MultiSelectModule, FormsModule] })] };
export default meta;
const tpl = (h: string) => `<div data-cell="playground" class="sb-cell" style="display:inline-flex;align-items:flex-start;padding:4px;${h}">
  <p-multiselect [options]="options" optionLabel="name" [(ngModel)]="model" placeholder="Select Cities" [display]="chip ? 'chip' : 'comma'" [filter]="filter" [showClear]="showClear"
    [size]="s" [variant]="variant" [invalid]="invalid" [disabled]="disabled" appendTo="self" [style]="{ width: '18rem' }" /></div>`;
const args = { selected: false, chip: true, filter: false, showClear: false, size: 'base', variant: 'outlined', invalid: false, disabled: false };
const props = (a: any) => ({ ...a, options: CITIES, model: a.selected ? [CITIES[0], CITIES[1]] : [], s: sizeOf(a.size) });
export const Playground: StoryObj = { args, argTypes: ARGTYPES, render: (a) => ({ props: props(a), template: tpl('') }) };
export const Open: StoryObj = { args: { ...args, selected: true }, argTypes: ARGTYPES, render: (a) => ({ props: props(a), template: tpl('height:360px;') }) };
