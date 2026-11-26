import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';

/** p-tree, primeng 21. Extras (DECISIONS #102). Sakai Tree demo: selectionMode="checkbox" (NodeService files). Static nodes here; Documents and Work expanded, Resume.doc selected. selection: checkbox | single. */
const NODES = () => {
    const resume = { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file' };
    const tree = [
        { key: '0', label: 'Documents', icon: 'pi pi-fw pi-folder', expanded: true, children: [
            { key: '0-0', label: 'Work', icon: 'pi pi-fw pi-cog', expanded: true, children: [{ key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file' }, resume] },
            { key: '0-1', label: 'Home', icon: 'pi pi-fw pi-home', children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file' }] }
        ] },
        { key: '1', label: 'Events', icon: 'pi pi-fw pi-calendar', children: [{ key: '1-0', label: 'Meeting', icon: 'pi pi-fw pi-calendar-plus' }] },
        { key: '2', label: 'Movies', icon: 'pi pi-fw pi-star-fill', children: [{ key: '2-0', label: 'Al Pacino', icon: 'pi pi-fw pi-star-fill' }] }
    ];
    return { tree, resume };
};
const meta: Meta = { title: 'Components/Tree', decorators: [moduleMetadata({ imports: [TreeModule, FormsModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { selection: 'checkbox' },
    argTypes: { selection: { control: 'inline-radio', options: ['checkbox', 'single'] } },
    render: (a) => {
        const n = NODES();
        return {
            props: { nodes: n.tree, mode: a['selection'], sel: a['selection'] === 'checkbox' ? [n.resume] : n.resume },
            template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:400px"><p-tree [value]="nodes" [selectionMode]="mode" [(selection)]="sel" /></div>`
        };
    }
};
