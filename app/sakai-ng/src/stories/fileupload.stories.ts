import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';

/**
 * p-fileupload, primeng 21. Forms 2 (DECISIONS #101). Sakai File demo (filedemo.ts):
 * mode 'advanced' (multiple, empty template "Drag and drop files to here to upload.") · 'basic' (chooseLabel Choose, chooseIcon pi-upload).
 * files: advanced with 2 pending image files (PNG bytes, set on the component after init; accept=image/* rejects other types). No upload happens: url is a dummy.
 */
@Component({
    selector: 'sb-fileupload', standalone: true, imports: [FileUploadModule],
    template: `<p-fileupload #fu name="demo[]" [multiple]="true" mode="advanced" url="/dummy" accept="image/*" [maxFileSize]="1000000"><ng-template #empty><div>Drag and drop files to here to upload.</div></ng-template></p-fileupload>`
})
class FileUploadHost implements AfterViewInit {
    @Input() files = false;
    @ViewChild('fu') fu!: FileUpload;
    constructor(private cd: ChangeDetectorRef) {}
    ngAfterViewInit() {
        if (!this.files) return;
        setTimeout(() => {
            // accept="image/*" validates in the files setter → use real PNG bytes (a 1×1 grey pixel), so the thumbnails render
            const png = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN89+7dfwAJ8gPyY1ZBdgAAAABJRU5ErkJggg=='), (c) => c.charCodeAt(0));
            this.fu.files = [new File([png], 'product-photo.png', { type: 'image/png' }), new File([png], 'banner.png', { type: 'image/png' })];
            (this.fu as any).cd?.markForCheck();
            this.cd.detectChanges();
        });
    }
}
const meta: Meta = { title: 'Components/FileUpload', decorators: [moduleMetadata({ imports: [FileUploadModule, FileUploadHost] })] };
export default meta;
export const Playground: StoryObj = {
    args: { mode: 'advanced', files: false },
    argTypes: { mode: { control: 'inline-radio', options: ['advanced', 'basic'] } },
    render: (a) => ({
        props: { mode: a['mode'], files: !!a['files'] },
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px;width:560px">
  @if (mode === 'advanced') { <sb-fileupload [files]="files" /> }
  @else { <p-fileupload mode="basic" chooseLabel="Choose" chooseIcon="pi pi-upload" name="demo[]" url="/dummy" accept="image/*" [maxFileSize]="1000000" /> }
</div>`
    })
};
