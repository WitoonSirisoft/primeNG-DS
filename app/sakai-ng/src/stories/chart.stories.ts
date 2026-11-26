import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { AfterViewInit, ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';

/**
 * p-chart (Chart.js), primeng 21. Extras (DECISIONS #102). Sakai Chart demo (chartdemo.ts): same data and the same colour lookups
 * (--p-primary-500 / -200, --p-indigo-500, --p-purple-500, --p-teal-500, --text-color, --text-color-secondary, --surface-border). Animation off for a stable capture.
 * type line | bar | pie | doughnut. The wrapper (.sb-capture) is the screenshot area (canvas).
 */
const build = (type: string) => {
    const ds = getComputedStyle(document.documentElement);
    const v = (n: string) => ds.getPropertyValue(n).trim();
    const text = v('--text-color'), muted = v('--text-color-secondary'), border = v('--surface-border');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const axes = { x: { ticks: { color: muted }, grid: { color: border, drawBorder: false } }, y: { ticks: { color: muted }, grid: { color: border, drawBorder: false } } };
    if (type === 'line') return { data: { labels: months, datasets: [
        { label: 'First Dataset', data: [65, 59, 80, 81, 56, 55, 40], fill: false, backgroundColor: v('--p-primary-500'), borderColor: v('--p-primary-500'), tension: 0.4 },
        { label: 'Second Dataset', data: [28, 48, 40, 19, 86, 27, 90], fill: false, backgroundColor: v('--p-primary-200'), borderColor: v('--p-primary-200'), tension: 0.4 }] },
        options: { animation: false, maintainAspectRatio: false, aspectRatio: 0.8, plugins: { legend: { labels: { color: text } } }, scales: axes } };
    if (type === 'bar') return { data: { labels: months, datasets: [
        { label: 'My First dataset', backgroundColor: v('--p-primary-500'), borderColor: v('--p-primary-500'), data: [65, 59, 80, 81, 56, 55, 40] },
        { label: 'My Second dataset', backgroundColor: v('--p-primary-200'), borderColor: v('--p-primary-200'), data: [28, 48, 40, 19, 86, 27, 90] }] },
        options: { animation: false, maintainAspectRatio: false, aspectRatio: 0.8, plugins: { legend: { labels: { color: text } } }, scales: { x: { ticks: { color: muted, font: { weight: 500 } }, grid: { display: false, drawBorder: false } }, y: axes.y } } };
    return { data: { labels: ['A', 'B', 'C'], datasets: [{ data: [540, 325, 702], backgroundColor: [v('--p-indigo-500'), v('--p-purple-500'), v('--p-teal-500')], hoverBackgroundColor: [v('--p-indigo-400'), v('--p-purple-400'), v('--p-teal-400')] }] },
        options: { animation: false, plugins: { legend: { labels: { usePointStyle: true, color: text } } } } };
};
/** Reads the colours only after PrimeNG has injected its theme variables (story render runs too early: the first capture had
 *  Chart.js default / black colours). The capture area (.sb-capture) appears only when the chart has its data. */
@Component({
    selector: 'sb-chart',
    standalone: true,
    imports: [ChartModule],
    template: `@if (data) {<div class="sb-capture" style="width:520px;height:360px;padding:8px"><p-chart [type]="type" [data]="data" [options]="options" height="340px" /></div>}`
})
class SbChart implements AfterViewInit {
    @Input() type = 'line';
    data: unknown = null;
    options: unknown = null;
    private cdr = inject(ChangeDetectorRef);
    ngAfterViewInit() {
        const t0 = Date.now();
        const tick = () => {
            const ready = getComputedStyle(document.documentElement).getPropertyValue('--p-primary-500').trim();
            if (!ready && Date.now() - t0 < 3000) { setTimeout(tick, 50); return; }
            const c = build(this.type);
            this.data = c.data;
            this.options = c.options;
            this.cdr.detectChanges();
        };
        tick();
    }
}
const meta: Meta = { title: 'Components/Chart', decorators: [moduleMetadata({ imports: [ChartModule, SbChart] })] };
export default meta;
export const Playground: StoryObj = {
    args: { type: 'line' },
    argTypes: { type: { control: 'select', options: ['line', 'bar', 'pie', 'doughnut'] } },
    render: (a) => ({
        props: { type: a['type'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px"><sb-chart [type]="type" /></div>`
    })
};
