import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { BreadcrumbModule } from 'primeng/breadcrumb';

/**
 * p-breadcrumb, primeng 21. Batch 3 (DECISIONS #100). Sakai Menu demo (menudemo.ts): home pi-home + Computer > Notebook > Accessories > Backpacks > Item.
 * icons: items with icons (PrimeNG MenuItem.icon) to capture icon colour/gap
 */
const ITEMS = [{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }];
const ICON_ITEMS = [{ label: 'Computer', icon: 'pi pi-desktop' }, { label: 'Notebook', icon: 'pi pi-book' }, { label: 'Item', icon: 'pi pi-tag' }];
const meta: Meta = { title: 'Components/Breadcrumb', decorators: [moduleMetadata({ imports: [BreadcrumbModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { icons: false },
    render: (a) => ({
        props: { items: a['icons'] ? ICON_ITEMS : ITEMS, home: { icon: 'pi pi-home', url: '#' } },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:560px"><p-breadcrumb [model]="items" [home]="home" /></div>`
    })
};
