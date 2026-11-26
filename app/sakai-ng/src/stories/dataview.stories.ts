import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

/**
 * p-dataview, primeng 21. Extras (DECISIONS #102). Sakai List demo (listdemo.ts): header with list / grid SelectButton, list + grid item templates (Tailwind markup, copied as-is).
 * 3 products (ProductService images from the PrimeVue CDN). layout list | grid.
 */
const P = [
    { name: 'Bamboo Watch', category: 'Accessories', price: 65, rating: 5, inventoryStatus: 'INSTOCK', image: 'bamboo-watch.jpg' },
    { name: 'Black Watch', category: 'Accessories', price: 72, rating: 4, inventoryStatus: 'INSTOCK', image: 'black-watch.jpg' },
    { name: 'Blue Band', category: 'Fitness', price: 79, rating: 3, inventoryStatus: 'LOWSTOCK', image: 'blue-band.jpg' }
];
const sev = (s: string) => (s === 'INSTOCK' ? 'success' : s === 'LOWSTOCK' ? 'warn' : 'danger');
const meta: Meta = { title: 'Components/DataView', decorators: [moduleMetadata({ imports: [DataViewModule, SelectButtonModule, ButtonModule, TagModule, FormsModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { layout: 'list' },
    argTypes: { layout: { control: 'inline-radio', options: ['list', 'grid'] } },
    render: (a) => ({
        props: { products: P, layout: a['layout'], options: ['list', 'grid'], sev },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:900px">
  <p-dataview [value]="products" [layout]="layout">
    <ng-template #header><div class="flex justify-end"><p-select-button [(ngModel)]="layout" [options]="options" [allowEmpty]="false"><ng-template #item let-option><i class="pi" [class.pi-bars]="option === 'list'" [class.pi-table]="option === 'grid'"></i></ng-template></p-select-button></div></ng-template>
    <ng-template #list let-items><div class="flex flex-col">@for (item of items; track item.name; let i = $index) {
      <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" [class.border-t]="i !== 0" [class.border-surface]="i !== 0">
        <div class="md:w-40 relative"><img class="block mx-auto rounded w-full" [src]="'https://primefaces.org/cdn/primevue/images/product/' + item.image" [alt]="item.name" />
          <div class="absolute bg-black/70 rounded-border" [style]="{ left: '4px', top: '4px' }"><p-tag [value]="item.inventoryStatus" [severity]="sev(item.inventoryStatus)" /></div></div>
        <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
          <div class="flex flex-row md:flex-col justify-between items-start gap-2"><div><span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span><div class="text-lg font-medium mt-2">{{ item.name }}</div></div>
            <div class="bg-surface-100 p-1" style="border-radius: 30px"><div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)"><span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span><i class="pi pi-star-fill text-yellow-500"></i></div></div></div>
          <div class="flex flex-col md:items-end gap-8"><span class="text-xl font-semibold">$ {{ item.price }}</span>
            <div class="flex flex-row-reverse md:flex-row gap-2"><p-button icon="pi pi-heart" [outlined]="true" /><p-button icon="pi pi-shopping-cart" label="Buy Now" /></div></div></div></div>
    }</div></ng-template>
    <ng-template #grid let-items><div class="grid grid-cols-12 gap-4">@for (item of items; track item.name) {
      <div class="col-span-12 sm:col-span-6 lg:col-span-4 p-2"><div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
        <div class="bg-surface-50 flex justify-center rounded p-4"><div class="relative mx-auto"><img class="rounded w-full" [src]="'https://primefaces.org/cdn/primevue/images/product/' + item.image" [alt]="item.name" style="max-width: 300px" />
          <div class="absolute bg-black/70 rounded-border" [style]="{ left: '4px', top: '4px' }"><p-tag [value]="item.inventoryStatus" [severity]="sev(item.inventoryStatus)" /></div></div></div>
        <div class="pt-6"><div class="flex flex-row justify-between items-start gap-2"><div><span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span><div class="text-lg font-medium mt-1">{{ item.name }}</div></div>
          <div class="bg-surface-100 p-1" style="border-radius: 30px"><div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)"><span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span><i class="pi pi-star-fill text-yellow-500"></i></div></div></div>
          <div class="flex flex-col gap-6 mt-6"><span class="text-2xl font-semibold">$ {{ item.price }}</span><div class="flex gap-2"><p-button icon="pi pi-shopping-cart" label="Buy Now" class="flex-auto whitespace-nowrap" styleClass="w-full" /><p-button icon="pi pi-heart" [outlined]="true" /></div></div></div></div></div>
    }</div></ng-template>
  </p-dataview></div>`
    })
};
