import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { ButtonModule } from 'primeng/button';
import { MATRIX_STYLES, SIZES } from './_matrix';

/**
 * <p-button> — PrimeNG 21.0.2 (see VERSIONS.md). Values verified against node_modules/primeng/types/primeng-button.d.ts.
 * severity: ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined
 *   ('primary' adds no CSS class of its own; it renders the same as no severity.)
 * size: 'small' | 'large' | undefined (undefined = Figma `base`)
 * iconPos: 'left' | 'right' | 'top' | 'bottom'
 * variant: 'outlined' | 'text' (same result as the outlined / text booleans)
 * Interaction states (hover, focus-visible, active) are NOT faked here; they are produced by real
 * mouse/keyboard input during capture. See screenshots/README.md.
 */
const SEVERITIES = ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'] as const;
const STYLES = [
    { name: 'solid', outlined: false, text: false, raised: false, rounded: false },
    { name: 'outlined', outlined: true, text: false, raised: false, rounded: false },
    { name: 'text', outlined: false, text: true, raised: false, rounded: false },
    { name: 'raised', outlined: false, text: false, raised: true, rounded: false },
    { name: 'rounded', outlined: false, text: false, raised: false, rounded: true }
];

const meta: Meta = {
    title: 'Components/Button',
    decorators: [moduleMetadata({ imports: [ButtonModule] })],
    parameters: { docs: { description: { component: 'PrimeNG `<p-button>` (primeng 21.0.2, Aura). Args map 1:1 to PrimeNG inputs.' } } }
};
export default meta;

/** One button; every arg is a PrimeNG input. Used by the capture script via URL args. */
export const Playground: StoryObj = {
    args: {
        label: 'Button',
        icon: '',
        iconPos: 'left',
        severity: 'primary',
        size: 'base',
        outlined: false,
        text: false,
        plain: false,
        raised: false,
        rounded: false,
        link: false,
        disabled: false,
        loading: false,
        badge: '',
        badgeSeverity: 'secondary',
        fluid: false
    },
    argTypes: {
        severity: { control: 'select', options: SEVERITIES },
        size: { control: 'inline-radio', options: ['small', 'base', 'large'], description: "'base' = no size attribute in code" },
        iconPos: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] },
        icon: { control: 'select', options: ['', 'pi pi-check', 'pi pi-user', 'pi pi-search', 'pi pi-trash', 'pi pi-bookmark'] },
        badgeSeverity: { control: 'select', options: ['success', 'info', 'warn', 'danger', 'help', 'primary', 'secondary', 'contrast'] }
    },
    render: (args) => ({
        props: { ...args, sizeValue: args['size'] === 'base' ? undefined : args['size'], iconValue: args['icon'] || undefined, labelValue: args['label'] || undefined, badgeValue: args['badge'] || undefined },
        template: `
      <div data-cell="playground" class="sb-cell" style="display:inline-flex">
        <p-button [label]="labelValue" [icon]="iconValue" [iconPos]="iconPos" [severity]="severity" [size]="sizeValue"
          [outlined]="outlined" [text]="text" [plain]="plain" [raised]="raised" [rounded]="rounded" [link]="link"
          [disabled]="disabled" [loading]="loading" [badge]="badgeValue" [badgeSeverity]="badgeSeverity" [fluid]="fluid" />
      </div>`
    })
};

/** severity × size, solid style. */
export const SeverityBySize: StoryObj = {
    render: () => ({
        props: { severities: SEVERITIES, sizes: SIZES },
        styles: [MATRIX_STYLES],
        template: `
      <div class="sb-matrix" style="grid-template-columns: 90px repeat(3, max-content)">
        <span></span>
        @for (s of sizes; track s.name) { <span class="sb-h">size={{ s.name }}</span> }
        @for (sev of severities; track sev) {
          <span class="sb-h">{{ sev }}</span>
          @for (s of sizes; track s.name) {
            <span class="sb-cell" [attr.data-cell]="'severity-' + sev + '__size-' + s.name">
              <p-button label="Button" [severity]="sev" [size]="s.value" />
            </span>
          }
        }
      </div>`
    })
};

/** severity × style (solid, outlined, text, raised, rounded), size base. */
export const SeverityByStyle: StoryObj = {
    render: () => ({
        props: { severities: SEVERITIES, styles: STYLES },
        styles: [MATRIX_STYLES],
        template: `
      <div class="sb-matrix" style="grid-template-columns: 90px repeat(5, max-content)">
        <span></span>
        @for (st of styles; track st.name) { <span class="sb-h">{{ st.name }}</span> }
        @for (sev of severities; track sev) {
          <span class="sb-h">{{ sev }}</span>
          @for (st of styles; track st.name) {
            <span class="sb-cell" [attr.data-cell]="'severity-' + sev + '__style-' + st.name">
              <p-button label="Button" [severity]="sev" [outlined]="st.outlined" [text]="st.text" [raised]="st.raised" [rounded]="st.rounded" />
            </span>
          }
        }
      </div>`
    })
};

/** Icon positions, icon-only (each style), and badge. */
export const Icons: StoryObj = {
    render: () => ({
        props: { positions: ['left', 'right', 'top', 'bottom'], styles: STYLES, sizes: SIZES },
        styles: [MATRIX_STYLES],
        template: `
      <div class="sb-section"><h3>Icon position (iconPos)</h3>
        <div class="sb-matrix" style="grid-template-columns: repeat(4, max-content)">
          @for (p of positions; track p) { <span class="sb-h">iconPos={{ p }}</span> }
          @for (p of positions; track p) {
            <span class="sb-cell" [attr.data-cell]="'iconpos-' + p"><p-button label="Button" icon="pi pi-check" [iconPos]="p" /></span>
          }
        </div>
      </div>
      <div class="sb-section"><h3>Icon only (no label) × style</h3>
        <div class="sb-matrix" style="grid-template-columns: repeat(5, max-content)">
          @for (st of styles; track st.name) { <span class="sb-h">{{ st.name }}</span> }
          @for (st of styles; track st.name) {
            <span class="sb-cell" [attr.data-cell]="'icononly__style-' + st.name">
              <p-button icon="pi pi-check" ariaLabel="Check" [outlined]="st.outlined" [text]="st.text" [raised]="st.raised" [rounded]="st.rounded" />
            </span>
          }
        </div>
      </div>
      <div class="sb-section"><h3>Icon only × size</h3>
        <div class="sb-matrix" style="grid-template-columns: repeat(3, max-content)">
          @for (s of sizes; track s.name) { <span class="sb-h">size={{ s.name }}</span> }
          @for (s of sizes; track s.name) {
            <span class="sb-cell" [attr.data-cell]="'icononly__size-' + s.name"><p-button icon="pi pi-check" ariaLabel="Check" [size]="s.value" /></span>
          }
        </div>
      </div>
      <div class="sb-section"><h3>Badge</h3>
        <div class="sb-matrix" style="grid-template-columns: repeat(2, max-content)">
          <span class="sb-h">badge</span><span class="sb-h">badge + outlined</span>
          <span class="sb-cell" data-cell="badge"><p-button label="Notifications" badge="2" /></span>
          <span class="sb-cell" data-cell="badge__style-outlined"><p-button label="Notifications" badge="2" badgeSeverity="contrast" [outlined]="true" /></span>
        </div>
      </div>`
    })
};

/** Static states: disabled, loading, link, plain. Hover / focus / active come from real input during capture. */
export const States: StoryObj = {
    render: () => ({
        props: { styles: STYLES },
        styles: [MATRIX_STYLES],
        template: `
      <div class="sb-section"><h3>Disabled × style</h3>
        <div class="sb-matrix" style="grid-template-columns: repeat(5, max-content)">
          @for (st of styles; track st.name) { <span class="sb-h">{{ st.name }}</span> }
          @for (st of styles; track st.name) {
            <span class="sb-cell" [attr.data-cell]="'disabled__style-' + st.name">
              <p-button label="Button" [disabled]="true" [outlined]="st.outlined" [text]="st.text" [raised]="st.raised" [rounded]="st.rounded" />
            </span>
          }
        </div>
      </div>
      <div class="sb-section"><h3>Loading</h3>
        <div class="sb-matrix" style="grid-template-columns: repeat(3, max-content)">
          <span class="sb-h">with label</span><span class="sb-h">with label + icon</span><span class="sb-h">icon only</span>
          <span class="sb-cell" data-cell="loading"><p-button label="Button" [loading]="true" /></span>
          <span class="sb-cell" data-cell="loading__icon"><p-button label="Button" icon="pi pi-check" [loading]="true" /></span>
          <span class="sb-cell" data-cell="loading__icononly"><p-button icon="pi pi-check" ariaLabel="Check" [loading]="true" /></span>
        </div>
        <p class="sb-note">The spinner animates; capture freezes animations (see screenshots/README.md).</p>
      </div>
      <div class="sb-section"><h3>Link and plain</h3>
        <div class="sb-matrix" style="grid-template-columns: repeat(3, max-content)">
          <span class="sb-h">link</span><span class="sb-h">plain + text</span><span class="sb-h">plain + outlined</span>
          <span class="sb-cell" data-cell="link"><p-button label="Button" [link]="true" /></span>
          <span class="sb-cell" data-cell="plain__style-text"><p-button label="Button" [plain]="true" [text]="true" /></span>
          <span class="sb-cell" data-cell="plain__style-outlined"><p-button label="Button" [plain]="true" [outlined]="true" /></span>
        </div>
      </div>`
    })
};
