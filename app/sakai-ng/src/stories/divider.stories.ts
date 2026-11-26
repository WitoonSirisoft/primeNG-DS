import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { DividerModule } from 'primeng/divider';

/**
 * p-divider, primeng 21. Batch 3 (DECISIONS #100). Sakai: Panels demo login card '<p-divider ...><b>OR</b></p-divider>'.
 * layout horizontal | vertical; align left | center | right (horizontal) / top | center | bottom (vertical); type solid | dashed | dotted; content: show 'OR'.
 * The divider sits between two blocks of text; the capture is the wrapper (.sb-capture): an empty divider has 0 height (line = ::before), so it is not 'visible' to Playwright, and the wrapper shows its margins.
 */
const meta: Meta = { title: 'Components/Divider', decorators: [moduleMetadata({ imports: [DividerModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { layout: 'horizontal', align: 'left', type: 'solid', content: false },
    argTypes: { layout: { control: 'select', options: ['horizontal', 'vertical'] }, align: { control: 'select', options: ['left', 'center', 'right', 'top', 'bottom'] }, type: { control: 'select', options: ['solid', 'dashed', 'dotted'] } },
    render: (a) => ({
        props: { ...a },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:400px">
  <div class="sb-capture" [style]="layout === 'vertical' ? 'display:flex;height:120px' : 'display:block'">
    <p class="m-0">Block A</p>
    <p-divider [layout]="layout" [align]="align" [type]="type">@if (content) { <b>OR</b> }</p-divider>
    <p class="m-0">Block B</p>
  </div></div>`
    })
};
