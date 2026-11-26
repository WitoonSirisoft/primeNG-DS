import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { TimelineModule } from 'primeng/timeline';

/** p-timeline, primeng 21. Extras (DECISIONS #102). Sakai Timeline demo: events1 (Ordered, Processing, Shipped, Delivered), content = status. align left | right | alternate; layout vertical | horizontal; opposite: date on the opposite side. */
const EVENTS = [
    { status: 'Ordered', date: '15/10/2020 10:30' },
    { status: 'Processing', date: '15/10/2020 14:00' },
    { status: 'Shipped', date: '15/10/2020 16:15' },
    { status: 'Delivered', date: '16/10/2020 10:00' }
];
const meta: Meta = { title: 'Components/Timeline', decorators: [moduleMetadata({ imports: [TimelineModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { align: 'left', layout: 'vertical', opposite: false },
    argTypes: { align: { control: 'select', options: ['left', 'right', 'alternate', 'top', 'bottom'] }, layout: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
    render: (a) => ({
        props: { events: EVENTS, align: a['align'], layout: a['layout'], opposite: !!a['opposite'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:544px">
  <p-timeline [value]="events" [align]="align" [layout]="layout">
    <ng-template #content let-event>{{ event.status }}</ng-template>
    @if (opposite) { <ng-template #opposite let-event><small class="text-muted-color">{{ event.date }}</small></ng-template> }
  </p-timeline></div>`
    })
};
