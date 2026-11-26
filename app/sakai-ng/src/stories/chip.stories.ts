import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { ChipModule } from 'primeng/chip';

/**
 * p-chip, primeng 21. Batch 3 (DECISIONS #100). Sakai Misc demo (miscdemo.ts): label chips, icon chips, removable. Image chips not captured (remote images).
 * icon: show pi-apple; removable: remove icon
 */
const meta: Meta = { title: 'Components/Chip', decorators: [moduleMetadata({ imports: [ChipModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { label: 'Action', icon: false, removable: false },
    render: (a) => ({
        props: { label: a['label'], icon: a['icon'] ? 'pi pi-apple' : undefined, removable: !!a['removable'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px"><p-chip [label]="label" [icon]="icon" [removable]="removable" /></div>`
    })
};
