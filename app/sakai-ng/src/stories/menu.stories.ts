import { AfterViewInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { Menu, MenuModule } from 'primeng/menu';

/**
 * p-menu, primeng 21. Batch 2 (DECISIONS #95): the Sakai UI Kit menus (src/app/pages/uikit/menudemo.ts).
 * layout 'plain'   = Plain Menu: groups Customers (New, Edit) + Orders (View, Search)
 * layout 'overlay' = Overlay Menu items (Save, Update, Delete, separator, Home) shown inline
 * layout 'popup'   = the same items as a popup (shadow), opened on load; appendTo="self" so the capture finds it
 * disabled: makes "Update" disabled (overlay / popup)
 */
const PLAIN = [
    { label: 'Customers', items: [{ label: 'New', icon: 'pi pi-fw pi-plus' }, { label: 'Edit', icon: 'pi pi-fw pi-user-edit' }] },
    { label: 'Orders', items: [{ label: 'View', icon: 'pi pi-fw pi-list' }, { label: 'Search', icon: 'pi pi-fw pi-search' }] }
];
const OVERLAY = (dis: boolean) => [
    { label: 'Save', icon: 'pi pi-save' }, { label: 'Update', icon: 'pi pi-refresh', disabled: dis }, { label: 'Delete', icon: 'pi pi-trash' },
    { separator: true }, { label: 'Home', icon: 'pi pi-home' }
];

@Component({
    selector: 'sb-menu-popup', standalone: true, imports: [MenuModule],
    template: `<p-menu #m [popup]="true" [model]="items" appendTo="self" /><div #anchor style="width:1px;height:1px"></div>`
})
class MenuPopupHost implements AfterViewInit {
    @Input() items: any[] = [];
    @ViewChild('m') m!: Menu;
    @ViewChild('anchor') anchor!: ElementRef;
    ngAfterViewInit() { setTimeout(() => this.m.show({ currentTarget: this.anchor.nativeElement, target: this.anchor.nativeElement } as any)); }
}

const meta: Meta = { title: 'Components/Menu', decorators: [moduleMetadata({ imports: [MenuModule, MenuPopupHost] })] };
export default meta;

export const Playground: StoryObj = {
    args: { layout: 'plain', disabled: false },
    render: (a) => ({
        props: { layout: a['layout'], plain: PLAIN, overlay: OVERLAY(!!a['disabled']) },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:300px;height:320px">
  @if (layout === 'plain') { <p-menu [model]="plain" /> }
  @if (layout === 'overlay') { <p-menu [model]="overlay" /> }
  @if (layout === 'popup') { <sb-menu-popup [items]="overlay" /> }</div>`
    })
};
