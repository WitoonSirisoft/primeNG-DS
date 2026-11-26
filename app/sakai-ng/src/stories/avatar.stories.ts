import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

/**
 * p-avatar / p-avatargroup, primeng 21. Batch 3 (DECISIONS #100). Sakai Misc demo (miscdemo.ts): label + icon avatars, sizes, circle, group with '+2'.
 * Images are not used (Figma can't load remote images; the image avatar = an image fill on the same shape).
 * content label | icon; size normal | large | xlarge; shape square | circle; group: 4 label avatars + '+2'
 */
const meta: Meta = { title: 'Components/Avatar', decorators: [moduleMetadata({ imports: [AvatarModule, AvatarGroupModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { content: 'label', size: 'normal', shape: 'square', group: false },
    argTypes: { content: { control: 'select', options: ['label', 'icon'] }, size: { control: 'select', options: ['normal', 'large', 'xlarge'] }, shape: { control: 'select', options: ['square', 'circle'] } },
    render: (a) => ({
        props: { content: a['content'], size: a['size'] === 'normal' ? undefined : a['size'], shape: a['shape'], group: !!a['group'], labels: ['A', 'B', 'C', 'D'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px">
  @if (group) {
    <p-avatargroup>
      @for (l of labels; track l) { <p-avatar [label]="l" [size]="size" [shape]="shape" /> }
      <p-avatar label="+2" [size]="size" [shape]="shape" />
    </p-avatargroup>
  } @else {
    @if (content === 'icon') { <p-avatar icon="pi pi-user" [size]="size" [shape]="shape" /> } @else { <p-avatar label="P" [size]="size" [shape]="shape" /> }
  }</div>`
    })
};
