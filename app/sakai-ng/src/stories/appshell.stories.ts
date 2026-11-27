import type { Meta, StoryObj } from '@storybook/angular-vite';

/**
 * Sakai app shell (src/app/layout/component/app.layout.ts + app.topbar.ts + app.sidebar/menu + app.footer.ts; styles assets/layout/*.scss).
 * Batch 4 pattern 1 (DECISIONS #103). Static markup with the exact Sakai classes (no router / LayoutService).
 * The wrapper has `transform` so the fixed topbar / sidebar position against it (a browser rule), not the Storybook page.
 * Media queries follow the page width: the capture plan sets the viewport (desktop 1500 wide → static sidebar; mobile 420 wide → sidebar hidden).
 * device: desktop (1440 × 900) | mobile (390 × 844).
 */
const ITEM = (label: string, icon: string, active: boolean) =>
    `<a tabindex="0" class="${active ? 'active-route' : ''}"><i class="pi pi-fw ${icon} layout-menuitem-icon"></i><span class="layout-menuitem-text">${label}</span></a>`;
const MENU = `<ul class="layout-menu">
  <li class="layout-root-menuitem"><div class="layout-menuitem-root-text">Home</div>
    <ul class="layout-root-submenulist"><li>${ITEM('Dashboard', 'pi-home', true)}</li></ul></li>
  <li class="layout-root-menuitem"><div class="layout-menuitem-root-text">UI Components</div>
    <ul class="layout-root-submenulist">
      <li>${ITEM('Form Layout', 'pi-id-card', false)}</li><li>${ITEM('Input', 'pi-check-square', false)}</li><li>${ITEM('Button', 'pi-mobile', false)}</li>
      <li>${ITEM('Table', 'pi-table', false)}</li><li>${ITEM('List', 'pi-list', false)}</li><li>${ITEM('Tree', 'pi-share-alt', false)}</li>
    </ul></li>
  <li class="layout-root-menuitem"><div class="layout-menuitem-root-text">Pages</div>
    <ul class="layout-root-submenulist"><li>${ITEM('Crud', 'pi-pencil', false)}</li><li>${ITEM('Empty', 'pi-circle-off', false)}</li></ul></li>
</ul>`;
const ACTION = (icon: string, label = '', extra = '') => `<button type="button" class="layout-topbar-action ${extra}"><i class="pi ${icon}"></i>${label ? `<span>${label}</span>` : ''}</button>`;
const shell = (dark: boolean, mobile: boolean) => `
<div class="sb-capture" style="position:relative;transform:translateZ(0);overflow:hidden;width:${mobile ? 390 : 1440}px;height:${mobile ? 844 : 900}px;background:var(--surface-ground)">
 <div class="layout-wrapper layout-static">
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      ${ACTION('pi-bars', '', 'layout-menu-button')}
      <a class="layout-topbar-logo"><svg viewBox="0 0 54 40" fill="none"><circle cx="27" cy="20" r="18" fill="var(--primary-color)" /></svg><span>SAKAI</span></a>
    </div>
    <div class="layout-topbar-actions">
      <div class="layout-config-menu">${ACTION(dark ? 'pi-moon' : 'pi-sun')}<div class="relative">${ACTION('pi-palette', '', 'layout-topbar-action-highlight')}</div></div>
      ${ACTION('pi-ellipsis-v', '', 'layout-topbar-menu-button')}
      <div class="layout-topbar-menu hidden lg:block"><div class="layout-topbar-menu-content">${ACTION('pi-calendar', 'Calendar')}${ACTION('pi-inbox', 'Messages')}${ACTION('pi-user', 'Profile')}</div></div>
    </div>
  </div>
  <div class="layout-sidebar">${MENU}</div>
  <div class="layout-main-container">
    <div class="layout-main"><div class="card"><div class="font-semibold text-xl mb-4">Empty Page</div><p>Use this page to start from scratch and place your custom content.</p></div></div>
    <div class="layout-footer">SAKAI by <a class="text-primary font-bold hover:underline">PrimeNG</a></div>
  </div>
 </div>
</div>`;

const meta: Meta = { title: 'Components/AppShell' };
export default meta;

export const Playground: StoryObj = {
    args: { device: 'desktop' },
    argTypes: { device: { control: 'inline-radio', options: ['desktop', 'mobile'] } },
    render: (a, ctx) => ({
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px">${shell(ctx.globals['theme'] === 'dark', a['device'] === 'mobile')}</div>`
    })
};
