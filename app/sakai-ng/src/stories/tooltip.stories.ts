import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

/** pTooltip, primeng 21. Extras (DECISIONS #102). Sakai Overlay demo: <p-button label="Save" pTooltip="Click to proceed" />. position top | right | bottom | left; long: a long text (max-width). Captured on hover of the button; the wrapper (.sb-capture) is the screenshot area (the tooltip is appended to body but lies inside it). */
const meta: Meta = { title: 'Components/Tooltip', decorators: [moduleMetadata({ imports: [TooltipModule, ButtonModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { position: 'top', long: false },
    argTypes: { position: { control: 'select', options: ['top', 'right', 'bottom', 'left'] } },
    render: (a) => ({
        props: { position: a['position'], text: a['long'] ? 'Saves the product and all of its variants, then returns to the list' : 'Click to proceed' },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px"><div class="sb-capture" style="width:420px;height:160px;display:flex;align-items:center;justify-content:center">
  <p-button label="Save" [pTooltip]="text" [tooltipPosition]="position" /></div></div>`
    })
};
