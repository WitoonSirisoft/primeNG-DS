import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';

/**
 * p-tabs (Tabs > TabList > Tab, TabPanels > TabPanel), primeng 21. Batch 2 (DECISIONS #98).
 * Sakai UI Kit: Panels demo (3 tabs + panels) and Menu demo (tab list only), src/app/pages/uikit/panelsdemo.ts / menudemo.ts.
 * layout 'panel' = tabs + panel text (Panels demo); 'list' = tab list only (Menu demo)
 * icons: an icon before each label; badge: a badge after Header II (PrimeNG 'template' demo content)
 * disabled: Header III disabled
 * Tab content is laid out with display:flex + gap var(--p-tabs-tab-gap) when icons/badge are on (PrimeNG's demo uses 'flex items-center gap-2').
 */
const TEXT = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.'
];
const TABS = [
    { label: 'Header I', icon: 'pi pi-user' },
    { label: 'Header II', icon: 'pi pi-chart-line' },
    { label: 'Header III', icon: 'pi pi-cog' }
];

const meta: Meta = { title: 'Components/Tabs', decorators: [moduleMetadata({ imports: [TabsModule, BadgeModule] })] };
export default meta;

export const Playground: StoryObj = {
    args: { layout: 'panel', icons: false, badge: false, disabled: false },
    argTypes: { layout: { control: 'select', options: ['panel', 'list'] } },
    render: (a) => ({
        props: { layout: a['layout'], icons: !!a['icons'], badge: !!a['badge'], disabled: !!a['disabled'], tabs: TABS, text: TEXT, flex: !!a['icons'] || !!a['badge'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:560px">
  <p-tabs value="0">
    <p-tablist>
      @for (t of tabs; track $index) {
        <p-tab [value]="'' + $index" [disabled]="disabled && $index === 2" [style]="flex ? 'display:flex;align-items:center;gap:var(--p-tabs-tab-gap)' : ''">
          @if (icons) { <i [class]="t.icon"></i> }
          <span>{{ t.label }}</span>
          @if (badge && $index === 1) { <p-badge value="2" /> }
        </p-tab>
      }
    </p-tablist>
    @if (layout === 'panel') {
      <p-tabpanels>
        @for (p of text; track $index) { <p-tabpanel [value]="'' + $index"><p class="m-0">{{ p }}</p></p-tabpanel> }
      </p-tabpanels>
    }
  </p-tabs></div>`
    })
};
