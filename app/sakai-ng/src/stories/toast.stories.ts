import { Component, Input, OnInit, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * p-toast, primeng 21. Batch 2 (DECISIONS #94). One sticky toast per story (Sakai UI Kit messages page texts).
 * Args: severity (info | success | warn | error | secondary | contrast), detail (show the detail line), closable.
 */
const TEXT: Record<string, [string, string]> = {
    info: ['Info Message', 'PrimeNG rocks'], success: ['Success Message', 'Message sent'], warn: ['Warn Message', 'There are unsaved changes'],
    error: ['Error Message', 'Validation failed'], secondary: ['Secondary Message', 'Message content'], contrast: ['Contrast Message', 'Message content']
};

@Component({ selector: 'sb-toast-host', standalone: true, imports: [ToastModule], providers: [MessageService], template: `<p-toast />` })
class ToastHost implements OnInit {
    @Input() severity = 'info';
    @Input() detail = true;
    @Input() closable = true;
    private ms = inject(MessageService);
    ngOnInit() {
        const [summary, detail] = TEXT[this.severity];
        setTimeout(() => this.ms.add({ severity: this.severity, summary, detail: this.detail ? detail : undefined, sticky: true, closable: this.closable }));
    }
}

const meta: Meta = { title: 'Components/Toast', decorators: [moduleMetadata({ imports: [ToastHost] })] };
export default meta;

export const Playground: StoryObj = {
    args: { severity: 'info', detail: true, closable: true },
    render: (a) => ({
        props: a,
        template: `<div data-cell="playground" class="sb-cell" style="display:block;width:600px;height:300px"><sb-toast-host [severity]="severity" [detail]="detail" [closable]="closable" /></div>`
    })
};
