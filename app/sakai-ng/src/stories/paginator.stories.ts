import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { PaginatorModule } from 'primeng/paginator';

/**
 * p-paginator, primeng 21. Batch 2 (DECISIONS #80). Args: first (index of the first row: 0 = page 1, 20 = page 3),
 * report (showCurrentPageReport + rows-per-page Select), totalRecords 120, rows 10.
 */
const meta: Meta = { title: 'Components/Paginator', decorators: [moduleMetadata({ imports: [PaginatorModule] })] };
export default meta;

export const Playground: StoryObj = {
    args: { first: 0, report: false },
    render: (a) => ({
        props: { first: a['first'], report: a['report'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:4px;width:720px">
  <p-paginator [first]="first" [rows]="10" [totalRecords]="120" [rowsPerPageOptions]="report ? [10, 20, 30] : undefined"
    [showCurrentPageReport]="report" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" /></div>`
    })
};
