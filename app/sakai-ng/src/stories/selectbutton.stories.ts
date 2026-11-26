import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { sizeOf } from './_forms';

/** p-selectbutton (built from ToggleButtons), primeng 21. Forms 2 (DECISIONS #101). Sakai Input demo: options Option 1–3, first selected. size, disabled, invalid; icons: options with icons only (icon mode). */
const OPTS = [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }];
const ICONS = [{ icon: 'pi pi-align-left', v: 'l' }, { icon: 'pi pi-align-center', v: 'c' }, { icon: 'pi pi-align-right', v: 'r' }];
const meta: Meta = { title: 'Components/SelectButton', decorators: [moduleMetadata({ imports: [FormsModule, SelectButtonModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { size: 'base', disabled: false, invalid: false, icons: false },
    argTypes: { size: { control: 'inline-radio', options: ['small', 'base', 'large'] } },
    render: (a) => ({
        props: { s: sizeOf(a['size']), disabled: !!a['disabled'], invalid: !!a['invalid'], icons: !!a['icons'], opts: OPTS, iopts: ICONS, value: OPTS[0], ivalue: 'l' },
        template: `<div data-cell="playground" class="sb-cell" style="display:inline-block;padding:8px">
  @if (icons) { <p-selectbutton [options]="iopts" [(ngModel)]="ivalue" optionValue="v" [size]="s" [disabled]="disabled" [invalid]="invalid"><ng-template #item let-item><i [class]="item.icon"></i></ng-template></p-selectbutton> }
  @else { <p-selectbutton [options]="opts" [(ngModel)]="value" optionLabel="name" [size]="s" [disabled]="disabled" [invalid]="invalid" /> }
</div>`
    })
};
