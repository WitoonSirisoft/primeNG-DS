import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

/**
 * p-inputgroup + p-inputgroup-addon, primeng 21. Forms 2 (DECISIONS #101). The four rows of the Sakai Input demo (inputdemo.ts):
 * row 'icon' = user icon + Username · 'multi' = clock + star addons, InputNumber Price, '$' and '.00' addons · 'button' = Search button + Keyword · 'checkbox' = checkbox addon + Confirm
 */
const meta: Meta = { title: 'Components/InputGroup', decorators: [moduleMetadata({ imports: [FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, ButtonModule, CheckboxModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { row: 'icon' },
    argTypes: { row: { control: 'select', options: ['icon', 'multi', 'button', 'checkbox'] } },
    render: (a) => ({
        props: { row: a['row'], checked: false },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:420px">
  @if (row === 'icon') { <p-inputgroup><p-inputgroup-addon><i class="pi pi-user"></i></p-inputgroup-addon><input pInputText placeholder="Username" /></p-inputgroup> }
  @if (row === 'multi') { <p-inputgroup><p-inputgroup-addon><i class="pi pi-clock"></i></p-inputgroup-addon><p-inputgroup-addon><i class="pi pi-star-fill"></i></p-inputgroup-addon><p-inputnumber placeholder="Price" /><p-inputgroup-addon>$</p-inputgroup-addon><p-inputgroup-addon>.00</p-inputgroup-addon></p-inputgroup> }
  @if (row === 'button') { <p-inputgroup><p-button label="Search" /><input pInputText placeholder="Keyword" /></p-inputgroup> }
  @if (row === 'checkbox') { <p-inputgroup><p-inputgroup-addon><p-checkbox [(ngModel)]="checked" [binary]="true" /></p-inputgroup-addon><input pInputText placeholder="Confirm" /></p-inputgroup> }
</div>`
    })
};
