import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { Dashboard } from '../app/pages/dashboard/dashboard';

/**
 * Batch 5 template (DECISIONS #105): the real Sakai Dashboard page component (pages/dashboard: Stats, Recent Sales, Best Selling, Revenue Stream, Notifications)
 * rendered at the desktop App Shell content width (1076 = 1440 − 22rem − 2 × 2rem) on --surface-ground. Data from Sakai's ProductService; images from the PrimeVue CDN.
 * The capture waits (entry.wait) for the Revenue Stream chart (Sakai draws it after 150 ms + Chart.js animation).
 */
const meta: Meta = { title: 'Components/Dashboard', decorators: [moduleMetadata({ imports: [Dashboard] })] };
export default meta;
export const Playground: StoryObj = {
    render: () => ({
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px"><div class="sb-capture" style="width:1076px;background:var(--surface-ground)"><app-dashboard /></div></div>`
    })
};
