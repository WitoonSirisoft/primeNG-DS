import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProductService } from '../app/pages/service/product.service';

/**
 * p-table, primeng 21. Batch 2 (DECISIONS #80–#83): replica of the Sakai CRUD products table (src/app/pages/crud/crud.ts):
 * caption with title + search, header with select-all checkbox and sortable columns, body with checkbox, code, name, image,
 * price, category, rating, Tag status and rounded outlined edit / delete buttons, paginator (5 rows).
 * Args: size, stripedRows, showGridlines, selected (rows 1 and 3 selected), sorted (sort by name, ascending).
 * Images: public/demo/images/product (served via staticDirs in .storybook/main.ts).
 */
const meta: Meta = { title: 'Components/DataTable', decorators: [moduleMetadata({ imports: [CommonModule, TableModule, ButtonModule, TagModule, RatingModule, IconFieldModule, InputIconModule, InputTextModule, FormsModule] })] };
export default meta;

const PRODUCTS = new ProductService().getProductsData().slice(0, 5);
const SEV: Record<string, 'success' | 'warn' | 'danger'> = { INSTOCK: 'success', LOWSTOCK: 'warn', OUTOFSTOCK: 'danger' };

export const Playground: StoryObj = {
    args: { size: 'base', striped: false, gridlines: false, selected: false, sorted: false },
    argTypes: { size: { control: 'inline-radio', options: ['small', 'base', 'large'] } },
    render: (a) => ({
        props: {
            products: PRODUCTS,
            selection: a['selected'] ? [PRODUCTS[0], PRODUCTS[2]] : [],
            sev: (s: string) => SEV[s],
            s: a['size'] === 'base' ? undefined : a['size'],
            striped: a['striped'],
            gridlines: a['gridlines'],
            sortField: a['sorted'] ? 'name' : undefined
        },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:4px;width:1100px">
  <p-table [value]="products" [(selection)]="selection" dataKey="id" [rows]="5" [paginator]="true" [size]="s" [stripedRows]="striped" [showGridlines]="gridlines"
    [sortField]="sortField" [sortOrder]="1" [tableStyle]="{ 'min-width': '75rem' }">
    <ng-template #caption>
      <div class="flex items-center justify-between">
        <h5 class="m-0">Manage Products</h5>
        <p-iconfield><p-inputicon styleClass="pi pi-search" /><input pInputText type="text" placeholder="Search..." /></p-iconfield>
      </div>
    </ng-template>
    <ng-template #header>
      <tr>
        <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
        <th style="min-width: 8rem">Code</th>
        <th pSortableColumn="name" style="min-width: 12rem">Name <p-sortIcon field="name" /></th>
        <th>Image</th>
        <th pSortableColumn="price" style="min-width: 8rem">Price <p-sortIcon field="price" /></th>
        <th pSortableColumn="category" style="min-width: 10rem">Category <p-sortIcon field="category" /></th>
        <th pSortableColumn="rating" style="min-width: 10rem">Reviews <p-sortIcon field="rating" /></th>
        <th pSortableColumn="inventoryStatus" style="min-width: 10rem">Status <p-sortIcon field="inventoryStatus" /></th>
        <th style="min-width: 8rem"></th>
      </tr>
    </ng-template>
    <ng-template #body let-product>
      <tr>
        <td style="width: 3rem"><p-tableCheckbox [value]="product" /></td>
        <td>{{ product.code }}</td>
        <td>{{ product.name }}</td>
        <td><img [src]="'demo/images/product/' + product.image" [alt]="product.name" style="width: 64px" class="rounded" /></td>
        <td>{{ product.price | currency: 'USD' }}</td>
        <td>{{ product.category }}</td>
        <td><p-rating [(ngModel)]="product.rating" [readonly]="true" /></td>
        <td><p-tag [value]="product.inventoryStatus" [severity]="sev(product.inventoryStatus)" /></td>
        <td>
          <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
          <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
        </td>
      </tr>
    </ng-template>
  </p-table></div>`
    })
};
