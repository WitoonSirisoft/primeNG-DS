import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { MenubarModule } from 'primeng/menubar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

/**
 * p-menubar, primeng 21. Batch 3 (DECISIONS #100). Sakai Menu demo (menudemo.ts): nestedMenuItems + end template search field.
 * search: show the end search field; wide: 1100 cell (at 800 the items wrap next to the search field, flex-wrap); tall: wrapper (.sb-capture) tall enough to capture an open submenu (hover 'Customers').
 */
const MODEL = [
    { label: 'Customers', icon: 'pi pi-fw pi-table', items: [{ label: 'New', icon: 'pi pi-fw pi-user-plus', items: [{ label: 'Customer', icon: 'pi pi-fw pi-plus' }, { label: 'Duplicate', icon: 'pi pi-fw pi-copy' }] }, { label: 'Edit', icon: 'pi pi-fw pi-user-edit' }] },
    { label: 'Orders', icon: 'pi pi-fw pi-shopping-cart', items: [{ label: 'View', icon: 'pi pi-fw pi-list' }, { label: 'Search', icon: 'pi pi-fw pi-search' }] },
    { label: 'Shipments', icon: 'pi pi-fw pi-envelope', items: [{ label: 'Tracker', icon: 'pi pi-fw pi-compass' }, { label: 'Map', icon: 'pi pi-fw pi-map-marker' }, { label: 'Manage', icon: 'pi pi-fw pi-pencil' }] },
    { label: 'Profile', icon: 'pi pi-fw pi-user', items: [{ label: 'Settings', icon: 'pi pi-fw pi-cog' }, { label: 'Billing', icon: 'pi pi-fw pi-file' }] },
    { label: 'Quit', icon: 'pi pi-fw pi-sign-out' }
];
const meta: Meta = { title: 'Components/Menubar', decorators: [moduleMetadata({ imports: [MenubarModule, IconFieldModule, InputIconModule, InputTextModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { search: true, tall: false, wide: false },
    render: (a) => ({
        props: { model: MODEL, search: !!a['search'], tall: !!a['tall'], wide: !!a['wide'] },
        template: `<div data-cell="playground" class="sb-cell" [style]="'display:block;padding:8px;width:' + (wide ? 1100 : 800) + 'px'">
  <div [class.sb-capture]="tall" [style]="tall ? 'height:260px' : ''">
  <p-menubar [model]="model">
    <ng-template #end>@if (search) {<p-iconfield><p-inputicon class="pi pi-search" /><input type="text" pInputText placeholder="Search" /></p-iconfield>}</ng-template>
  </p-menubar></div></div>`
    })
};
