import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { AccordionModule } from 'primeng/accordion';

/**
 * p-accordion (Accordion > AccordionPanel > AccordionHeader / AccordionContent), primeng 21. Batch 3 (DECISIONS #100).
 * Sakai UI Kit Panels demo (src/app/pages/uikit/panelsdemo.ts): 3 panels, first open.
 * open: '0' | '1' | 'none'; disabled: Header III disabled
 */
const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const meta: Meta = { title: 'Components/Accordion', decorators: [moduleMetadata({ imports: [AccordionModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { open: '0', disabled: false },
    argTypes: { open: { control: 'select', options: ['0', '1', 'none'] } },
    render: (a) => ({
        props: { open: a['open'] === 'none' ? undefined : a['open'], disabled: !!a['disabled'], text: TEXT, headers: ['Header I', 'Header II', 'Header III'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:560px">
  <p-accordion [value]="open">
    @for (h of headers; track $index) {
      <p-accordion-panel [value]="'' + $index" [disabled]="disabled && $index === 2">
        <p-accordion-header>{{ h }}</p-accordion-header>
        <p-accordion-content><p class="m-0">{{ text }}</p></p-accordion-content>
      </p-accordion-panel>
    }
  </p-accordion></div>`
    })
};
