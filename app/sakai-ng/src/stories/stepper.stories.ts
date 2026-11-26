import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';

/** p-stepper, primeng 21. Extras (DECISIONS #102). Sakai Menu demo: <p-stepper [value]="1"> with a step list Header I–III. active: current step; panels: add step panels with content + Next / Back buttons (PrimeNG basic demo). */
const meta: Meta = { title: 'Components/Stepper', decorators: [moduleMetadata({ imports: [StepperModule, ButtonModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { active: 1, panels: false },
    render: (a) => ({
        props: { active: Number(a['active']), panels: !!a['panels'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:640px">
  <p-stepper [value]="active">
    <p-step-list><p-step [value]="1">Header I</p-step><p-step [value]="2">Header II</p-step><p-step [value]="3">Header III</p-step></p-step-list>
    @if (panels) {
      <p-step-panels>
        <p-step-panel [value]="active"><ng-template #content><div class="flex flex-col h-24"><div class="border-2 border-dashed border-surface-200 rounded bg-surface-50 flex-auto flex justify-center items-center font-medium">Content {{ ['I','II','III'][active - 1] }}</div></div>
          <div class="flex pt-6 justify-between">@if (active > 1) {<p-button label="Back" severity="secondary" icon="pi pi-arrow-left" />} @else {<span></span>}<p-button label="Next" icon="pi pi-arrow-right" iconPos="right" /></div></ng-template></p-step-panel>
      </p-step-panels>
    }
  </p-stepper></div>`
    })
};
