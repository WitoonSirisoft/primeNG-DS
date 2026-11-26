import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ARGTYPES, CITIES, sizeOf } from './_forms';

/**
 * p-autocomplete, primeng 21. Forms 2 (DECISIONS #101). Sakai Input demo: dropdown, multiple, display chip, placeholder "Search".
 * Same axes as Select (#73): size, variant, state. multiple: chips; selected: value(s) set; dropdown: dropdown button. Suggestions = all cities (open = click the dropdown button).
 */
const meta: Meta = { title: 'Components/AutoComplete', decorators: [moduleMetadata({ imports: [AutoCompleteModule, FormsModule] })] };
export default meta;
const tpl = (h: string) => `<div data-cell="playground" class="sb-cell" style="display:inline-flex;align-items:flex-start;padding:4px;${h}">
  <p-autocomplete [(ngModel)]="model" [suggestions]="suggestions" optionLabel="name" placeholder="Search" [dropdown]="dropdown" [multiple]="multiple" [size]="s" [variant]="variant"
    [invalid]="invalid" [disabled]="disabled" appendTo="self" [style]="{ width: '18rem' }" [inputStyle]="{ width: '100%' }" (completeMethod)="suggestions = all" /></div>`;
const args = { selected: false, multiple: false, dropdown: true, size: 'base', variant: 'outlined', invalid: false, disabled: false };
const props = (a: any) => ({ ...a, all: CITIES, suggestions: CITIES, model: a.selected ? (a.multiple ? [CITIES[0], CITIES[1]] : CITIES[1]) : a.multiple ? [] : null, s: sizeOf(a.size) });
export const Playground: StoryObj = { args, argTypes: ARGTYPES, render: (a) => ({ props: props(a), template: tpl('') }) };
export const Open: StoryObj = { args: { ...args }, argTypes: ARGTYPES, render: (a) => ({ props: props(a), template: tpl('height:300px;') }) };
