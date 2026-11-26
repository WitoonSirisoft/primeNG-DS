import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';

/** p-treetable, primeng 21. Extras (DECISIONS #102). Sakai Tree demo: columns Name / Size / Type, selectionMode="checkbox" (NodeService files). Static nodes; Applications expanded, Editor selected. checkbox: on | off. */
const DATA = () => [
    { key: '0', data: { name: 'Applications', size: '100kb', type: 'Folder' }, expanded: true, children: [
        { key: '0-0', data: { name: 'Angular', size: '25kb', type: 'Folder' } },
        { key: '0-1', data: { name: 'Editor', size: '25kb', type: 'Application' } },
        { key: '0-2', data: { name: 'Music', size: '50kb', type: 'Application' } }
    ] },
    { key: '1', data: { name: 'Cloud', size: '20kb', type: 'Folder' }, children: [{ key: '1-0', data: { name: 'backup-1.zip', size: '10kb', type: 'Zip' } }] },
    { key: '2', data: { name: 'Desktop', size: '150kb', type: 'Folder' }, children: [{ key: '2-0', data: { name: 'note-meeting.txt', size: '50kb', type: 'Text' } }] }
];
const COLS = [{ field: 'name', header: 'Name' }, { field: 'size', header: 'Size' }, { field: 'type', header: 'Type' }];
const meta: Meta = { title: 'Components/TreeTable', decorators: [moduleMetadata({ imports: [TreeTableModule, CommonModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { checkbox: true },
    render: (a) => ({
        props: { data: DATA(), cols: COLS, checkbox: !!a['checkbox'], keys: { '0-1': { checked: true, partialChecked: false }, '0': { checked: false, partialChecked: true } } },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:640px">
  <p-treetable [value]="data" [columns]="cols" [selectionMode]="checkbox ? 'checkbox' : null" [(selectionKeys)]="keys" dataKey="key">
    <ng-template #header let-columns><tr>@for (col of columns; track col.field) {<th>{{ col.header }}</th>}</tr></ng-template>
    <ng-template #body let-rowNode let-rowData="rowData" let-columns="columns">
      <tr [ttRow]="rowNode" [ttSelectableRow]="rowNode">
        @for (col of columns; track col.field; let i = $index) {<td>@if (i === 0) {<span class="inline-flex items-center gap-2"><p-treeTableToggler [rowNode]="rowNode" />@if (checkbox) {<p-treeTableCheckbox [value]="rowNode" />}{{ rowData[col.field] }}</span>} @else { {{ rowData[col.field] }} }</td>}
      </tr>
    </ng-template>
  </p-treetable></div>`
    })
};
