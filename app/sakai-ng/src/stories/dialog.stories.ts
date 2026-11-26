import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';

/**
 * p-dialog, primeng 21. Batch 2 (DECISIONS #91–#92). Opened on load (modal).
 * layout 'product' = Sakai CRUD "Product Details" dialog for a new product (src/app/pages/crud/crud.ts, no image, empty fields)
 * layout 'simple'  = Sakai UI Kit dialog (src/app/pages/uikit/overlaydemo.ts): text + Save; width 450px here (code: 30vw)
 * closable: header close button on/off · header: showHeader on/off
 */
const meta: Meta = {
    title: 'Components/Dialog',
    decorators: [moduleMetadata({ imports: [FormsModule, DialogModule, ButtonModule, InputTextModule, TextareaModule, SelectModule, RadioButtonModule, InputNumberModule] })]
};
export default meta;

const STATUSES = [{ label: 'INSTOCK' }, { label: 'LOWSTOCK' }, { label: 'OUTOFSTOCK' }];
const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const Playground: StoryObj = {
    args: { layout: 'product', closable: true, header: true },
    render: (a) => ({
        props: { layout: a['layout'], closable: a['closable'], header: a['header'], visible: true, product: {}, statuses: STATUSES, text: TEXT },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;width:600px;height:900px">
  @if (layout === 'product') {
  <p-dialog [(visible)]="visible" [style]="{ width: '450px' }" header="Product Details" [modal]="true" [closable]="closable" [showHeader]="header">
    <ng-template #content>
      <div class="flex flex-col gap-6">
        <div><label for="name" class="block font-bold mb-3">Name</label><input type="text" pInputText id="name" [(ngModel)]="product.name" fluid /></div>
        <div><label for="description" class="block font-bold mb-3">Description</label><textarea id="description" pTextarea [(ngModel)]="product.description" rows="3" cols="20" fluid></textarea></div>
        <div><label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
          <p-select [(ngModel)]="product.inventoryStatus" inputId="inventoryStatus" [options]="statuses" optionLabel="label" optionValue="label" placeholder="Select a Status" fluid /></div>
        <div><span class="block font-bold mb-4">Category</span>
          <div class="grid grid-cols-12 gap-4">
            @for (c of ['Accessories', 'Clothing', 'Electronics', 'Fitness']; track c) {
            <div class="flex items-center gap-2 col-span-6"><p-radiobutton [inputId]="c" name="category" [value]="c" [(ngModel)]="product.category" /><label [for]="c">{{ c }}</label></div>
            }
          </div></div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6"><label for="price" class="block font-bold mb-3">Price</label><p-inputnumber inputId="price" [(ngModel)]="product.price" mode="currency" currency="USD" locale="en-US" fluid /></div>
          <div class="col-span-6"><label for="quantity" class="block font-bold mb-3">Quantity</label><p-inputnumber inputId="quantity" [(ngModel)]="product.quantity" fluid /></div>
        </div>
      </div>
    </ng-template>
    <ng-template #footer>
      <p-button label="Cancel" icon="pi pi-times" text />
      <p-button label="Save" icon="pi pi-check" />
    </ng-template>
  </p-dialog>
  } @else {
  <p-dialog header="Dialog" [(visible)]="visible" [style]="{ width: '450px' }" [modal]="true" [closable]="closable" [showHeader]="header">
    <p class="leading-normal m-0">{{ text }}</p>
    <ng-template #footer><p-button label="Save" /></ng-template>
  </p-dialog>
  }</div>`
    })
};
