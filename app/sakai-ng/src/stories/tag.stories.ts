import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { TagModule } from 'primeng/tag';
import { MATRIX_STYLES } from './_matrix';

/**
 * <p-tag> — PrimeNG 21.0.2. Verified against node_modules/primeng/types/primeng-tag.d.ts.
 * severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined | null
 *   NOTE: no 'primary' and no 'help' value. Not setting severity renders the primary color.
 *   In stories this default is labelled "(none)"; its Figma value name is an open decision.
 * Inputs: value, icon, rounded. Tag is not interactive (no hover/focus states).
 */
const SEVERITIES: { name: string; value: string | undefined }[] = [
    { name: '(none)', value: undefined },
    { name: 'secondary', value: 'secondary' },
    { name: 'success', value: 'success' },
    { name: 'info', value: 'info' },
    { name: 'warn', value: 'warn' },
    { name: 'danger', value: 'danger' },
    { name: 'contrast', value: 'contrast' }
];
const FORMS = [
    { name: 'default', icon: undefined, rounded: false },
    { name: 'icon', icon: 'pi pi-check', rounded: false },
    { name: 'rounded', icon: undefined, rounded: true },
    { name: 'rounded-icon', icon: 'pi pi-check', rounded: true }
];

const meta: Meta = {
    title: 'Components/Tag',
    decorators: [moduleMetadata({ imports: [TagModule] })],
    parameters: { docs: { description: { component: 'PrimeNG `<p-tag>` (primeng 21.0.2, Aura). Args map 1:1 to PrimeNG inputs.' } } }
};
export default meta;

export const Playground: StoryObj = {
    args: { value: 'Tag', severity: '(none)', icon: '', rounded: false },
    argTypes: {
        severity: { control: 'select', options: SEVERITIES.map((s) => s.name), description: "'(none)' = severity not set (primary color)" },
        icon: { control: 'select', options: ['', 'pi pi-check', 'pi pi-user', 'pi pi-exclamation-triangle', 'pi pi-times', 'pi pi-info-circle'] }
    },
    render: (args) => ({
        props: { ...args, sevValue: args['severity'] === '(none)' ? undefined : args['severity'], iconValue: args['icon'] || undefined },
        template: `<span data-cell="playground" class="sb-cell" style="display:inline-flex"><p-tag [value]="value" [severity]="sevValue" [icon]="iconValue" [rounded]="rounded" /></span>`
    })
};

/** severity × form (default, icon, rounded, rounded + icon). */
export const SeverityByForm: StoryObj = {
    render: () => ({
        props: { severities: SEVERITIES, forms: FORMS },
        styles: [MATRIX_STYLES],
        template: `
      <div class="sb-matrix" style="grid-template-columns: 90px repeat(4, max-content)">
        <span></span>
        @for (f of forms; track f.name) { <span class="sb-h">{{ f.name }}</span> }
        @for (sev of severities; track sev.name) {
          <span class="sb-h">{{ sev.name }}</span>
          @for (f of forms; track f.name) {
            <span class="sb-cell" [attr.data-cell]="'severity-' + (sev.value ?? 'none') + '__form-' + f.name">
              <p-tag value="Tag" [severity]="sev.value" [icon]="f.icon" [rounded]="f.rounded" />
            </span>
          }
        }
      </div>`
    })
};

/** Long text, to check that Tag grows without clipping. */
export const LongValue: StoryObj = {
    render: () => ({
        styles: [MATRIX_STYLES],
        template: `<span data-cell="long" class="sb-cell" style="display:inline-flex"><p-tag value="A much longer tag value to test growth" icon="pi pi-info-circle" severity="info" /></span>`
    })
};
