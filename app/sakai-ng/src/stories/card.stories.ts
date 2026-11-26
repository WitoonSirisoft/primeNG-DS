import type { Meta, StoryObj } from '@storybook/angular-vite';

/**
 * Sakai layout card: <div class="card"> (assets/layout/_utils.scss) + title <div class="font-semibold text-xl mb-4"> (Tailwind). Not a PrimeNG component.
 * Batch 3 (DECISIONS #100). title: show the title; stacked: two cards (margin-bottom 2rem between, none after the last).
 * The cell background is the Sakai page background so the white card is visible.
 */
const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const meta: Meta = { title: 'Components/Card' };
export default meta;
export const Playground: StoryObj = {
    args: { title: true, stacked: false },
    render: (a) => ({
        props: { title: !!a['title'], stacked: !!a['stacked'], text: TEXT },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:560px;background:var(--surface-ground)">
  <div [class.sb-capture]="stacked">
    @for (i of (stacked ? [1, 2] : [1]); track i) {
      <div class="card">@if (title) {<div class="font-semibold text-xl mb-4">Card {{ i }}</div>}<p class="m-0">{{ text }}</p></div>
    }
  </div></div>`
    })
};
