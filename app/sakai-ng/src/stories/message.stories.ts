import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { MessageModule } from 'primeng/message';

/** p-message, primeng 21.0.2. Inputs: severity (success|info|warn|error|secondary|contrast), variant (outlined|simple), size, closable, icon, text. Not interactive (close button hover only). */
const meta: Meta = { title: 'Components/Message', decorators: [moduleMetadata({ imports: [MessageModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { severity: 'info', text: 'Message content', variant: 'default', size: 'base', closable: false, icon: '' },
    argTypes: {
        severity: { control: 'select', options: ['success', 'info', 'warn', 'error', 'secondary', 'contrast'] },
        variant: { control: 'inline-radio', options: ['default', 'outlined', 'simple'], description: "'default' = not set" },
        size: { control: 'inline-radio', options: ['small', 'base', 'large'] }
    },
    render: (args) => ({
        props: { ...args, v: args['variant'] === 'default' ? undefined : args['variant'], s: args['size'] === 'base' ? undefined : args['size'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-flex;padding:4px">
  <p-message [severity]="severity" [variant]="v" [size]="s" [closable]="closable" [icon]="icon || undefined">{{ text }}</p-message></div>`
    })
};
