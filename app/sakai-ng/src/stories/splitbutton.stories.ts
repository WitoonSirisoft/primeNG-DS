import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { SplitButtonModule } from 'primeng/splitbutton';

/**
 * p-splitbutton, primeng 21. Batch 2 (DECISIONS #90): Button + dropdown Button joined. Args: severity, size, outlined, text,
 * rounded, raised, disabled. Label "Save", items as the Sakai UI Kit toolbar.
 */
const meta: Meta = { title: 'Components/SplitButton', decorators: [moduleMetadata({ imports: [SplitButtonModule] })] };
export default meta;

const ITEMS = [{ label: 'Update', icon: 'pi pi-refresh' }, { label: 'Delete', icon: 'pi pi-times' }, { separator: true }, { label: 'Home', icon: 'pi pi-home' }];

export const Playground: StoryObj = {
    args: { severity: 'primary', size: 'base', outlined: false, text: false, rounded: false, raised: false, disabled: false },
    render: (a) => ({
        props: { ...a, items: ITEMS, sz: a['size'] === 'base' ? undefined : a['size'], sev: a['severity'] === 'primary' ? undefined : a['severity'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-block;padding:8px">
  <p-splitbutton label="Save" [model]="items" [severity]="sev" [size]="sz" [outlined]="outlined" [text]="text" [rounded]="rounded" [raised]="raised" [disabled]="disabled" /></div>`
    })
};
