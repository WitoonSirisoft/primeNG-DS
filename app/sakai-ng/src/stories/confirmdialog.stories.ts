import { Component, OnInit, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

/**
 * p-confirmdialog, primeng 21. Batch 2 (DECISIONS #93): the Sakai CRUD delete confirmation (src/app/pages/crud/crud.ts),
 * opened on load. Width 450px, header "Confirm", icon pi-exclamation-triangle, default Yes / No buttons.
 * appendTo="self": ConfirmDialog renders into <body> by default; the capture looks inside the story cell (no visual change).
 */
@Component({
    selector: 'sb-confirm-host',
    standalone: true,
    imports: [ConfirmDialogModule],
    providers: [ConfirmationService],
    template: `<p-confirmdialog [style]="{ width: '450px' }" appendTo="self" />`
})
class ConfirmHost implements OnInit {
    private cs = inject(ConfirmationService);
    ngOnInit() {
        setTimeout(() => this.cs.confirm({ message: 'Are you sure you want to delete the selected products?', header: 'Confirm', icon: 'pi pi-exclamation-triangle', accept: () => {} }));
    }
}

const meta: Meta = { title: 'Components/ConfirmDialog', decorators: [moduleMetadata({ imports: [ConfirmHost] })] };
export default meta;

export const Playground: StoryObj = {
    render: () => ({ template: `<div data-cell="playground" class="sb-cell" style="display:block;width:600px;height:400px"><sb-confirm-host /></div>` })
};
