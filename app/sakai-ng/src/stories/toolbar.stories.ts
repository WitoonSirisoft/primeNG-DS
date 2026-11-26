import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

/**
 * p-toolbar, primeng 21. Batch 2 (DECISIONS #89): replicas of the two Sakai toolbars.
 * layout 'crud'  = src/app/pages/crud/crud.ts (start: New + Delete, end: Export)
 * layout 'uikit' = src/app/pages/uikit/panelsdemo.ts (start: 3 icon text buttons, center: search, end: SplitButton Save)
 * Cell is 900px wide (the toolbar stretches).
 */
const meta: Meta = {
    title: 'Components/Toolbar',
    decorators: [moduleMetadata({ imports: [ToolbarModule, ButtonModule, SplitButtonModule, IconFieldModule, InputIconModule, InputTextModule] })]
};
export default meta;

const ITEMS = [{ label: 'Update', icon: 'pi pi-refresh' }, { label: 'Delete', icon: 'pi pi-times' }, { separator: true }, { label: 'Home', icon: 'pi pi-home' }];

export const Playground: StoryObj = {
    args: { layout: 'crud' },
    render: (a) => ({
        props: { layout: a['layout'], items: ITEMS },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:900px">
  @if (layout === 'crud') {
  <p-toolbar>
    <ng-template #start>
      <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" />
      <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined [disabled]="true" />
    </ng-template>
    <ng-template #end><p-button label="Export" icon="pi pi-upload" severity="secondary" /></ng-template>
  </p-toolbar>
  } @else {
  <p-toolbar>
    <ng-template #start>
      <p-button icon="pi pi-plus" class="mr-2" severity="secondary" text />
      <p-button icon="pi pi-print" class="mr-2" severity="secondary" text />
      <p-button icon="pi pi-upload" severity="secondary" text />
    </ng-template>
    <ng-template #center>
      <p-iconfield><p-inputicon><i class="pi pi-search"></i></p-inputicon><input pInputText placeholder="Search" /></p-iconfield>
    </ng-template>
    <ng-template #end><p-splitbutton label="Save" [model]="items" /></ng-template>
  </p-toolbar>
  }</div>`
    })
};
