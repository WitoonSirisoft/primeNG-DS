import type { Meta, StoryObj } from '@storybook/angular-vite';

/**
 * Sakai layout sidebar menu (src/app/layout/component/app.menu.ts + app.menuitem.ts, styles assets/layout/_menu.scss).
 * Not a PrimeNG component: static markup with the exact DOM / classes AppMenuitem renders (no router / LayoutService).
 * Batch 2 (DECISIONS #97, planned): states default, hover, active route (+ hover); one level of collapsible group.
 * active:   'chart' = "Chart" is the active route; 'login' = Auth > Login active (use with expanded)
 * expanded: Auth group open (li.active-menuitem, toggler rotated, children indented 1rem)
 * .layout-sidebar is position: fixed in Sakai; here it is static so the capture finds it in the cell.
 */
const ITEM = (label: string, icon: string, active: boolean, toggler = false) =>
    `<a tabindex="0" class="${active ? 'active-route' : ''}"><i class="pi pi-fw ${icon} layout-menuitem-icon"></i><span class="layout-menuitem-text">${label}</span>${toggler ? '<i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>' : ''}</a>`;

const sidebar = (active: string, expanded: boolean) => `
<div class="layout-sidebar" style="position:static;height:auto;overflow:visible">
  <ul class="layout-menu">
    <li class="layout-root-menuitem"><div class="layout-menuitem-root-text">UI Components</div>
      <ul class="layout-root-submenulist">
        <li>${ITEM('Menu', 'pi-bars', false)}</li>
        <li>${ITEM('Chart', 'pi-chart-bar', active === 'chart')}</li>
        <li>${ITEM('Timeline', 'pi-calendar', false)}</li>
      </ul>
    </li>
    <li class="layout-root-menuitem"><div class="layout-menuitem-root-text">Pages</div>
      <ul class="layout-root-submenulist">
        <li>${ITEM('Landing', 'pi-globe', false)}</li>
        <li class="${expanded ? 'active-menuitem' : ''}">${ITEM('Auth', 'pi-user', false, true)}
          ${expanded ? `<ul>
            <li>${ITEM('Login', 'pi-sign-in', active === 'login')}</li>
            <li>${ITEM('Error', 'pi-times-circle', false)}</li>
            <li>${ITEM('Access Denied', 'pi-lock', false)}</li>
          </ul>` : ''}
        </li>
        <li>${ITEM('Crud', 'pi-pencil', false)}</li>
      </ul>
    </li>
  </ul>
</div>`;

const meta: Meta = { title: 'Components/SidebarMenu' };
export default meta;

export const Playground: StoryObj = {
    args: { active: 'chart', expanded: false },
    argTypes: { active: { control: 'select', options: ['chart', 'login', 'none'] } },
    render: (a) => ({
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:320px">${sidebar(a['active'], !!a['expanded'])}</div>`
    })
};
