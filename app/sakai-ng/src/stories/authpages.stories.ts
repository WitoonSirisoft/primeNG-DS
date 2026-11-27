import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

/**
 * Batch 5 templates (DECISIONS #104): Sakai full-screen pages copied from pages/auth/login.ts, access.ts, error.ts and pages/notfound/notfound.ts.
 * Changes for the capture only: the Sakai logo is replaced by the placeholder mark (logo slot, as in the App Shell); <app-floating-configurator> is its static markup;
 * the wrapper has `transform` so the fixed configurator positions inside it; size 1440 × 900 (capture viewport 1500 × 1000).
 * page: login | access | error | notfound.
 */
const LOGO = (cls: string) => `<svg viewBox="0 0 54 40" fill="none" class="${cls}"><circle cx="27" cy="20" r="18" fill="var(--primary-color)" /></svg>`;
const CONFIG = (dark: boolean) => `<div class="flex gap-4 top-8 right-8 fixed"><p-button type="button" [rounded]="true" icon="pi ${dark ? 'pi-moon' : 'pi-sun'}" severity="secondary" /><div class="relative"><p-button icon="pi pi-palette" type="button" rounded /></div></div>`;
const FRAME = (grad: string, inner: string) => `<div style="border-radius: 56px; padding: 0.3rem; background: ${grad}"><div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">${inner}</div></div>`;
const PAGES: Record<string, string> = {
    login: `<div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-full min-w-full overflow-hidden" style="height:100%"><div class="flex flex-col items-center justify-center">
<div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"><div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
<div class="text-center mb-8">${LOGO('mb-8 w-16 shrink-0 mx-auto')}<div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PrimeLand!</div><span class="text-muted-color font-medium">Sign in to continue</span></div>
<div><label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label><input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-120 mb-8" />
<label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label><p-password id="password1" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
<div class="flex items-center justify-between mt-2 mb-8 gap-8"><div class="flex items-center"><p-checkbox id="rememberme1" [binary]="true" class="mr-2"></p-checkbox><label for="rememberme1">Remember me</label></div><span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span></div>
<p-button label="Sign In" styleClass="w-full"></p-button></div></div></div></div></div>`,
    access: `<div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center overflow-hidden" style="height:100%"><div class="flex flex-col items-center justify-center">${FRAME('linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)', `<div class="gap-4 flex flex-col items-center">
<div class="flex justify-center items-center border-2 border-orange-500 rounded-full" style="width: 3.2rem; height: 3.2rem"><i class="text-orange-500 pi pi-fw pi-lock text-2xl!"></i></div>
<h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2">Access Denied</h1><span class="text-muted-color mb-8">You do not have the necessary permisions. Please contact admins.</span>
<img src="https://primefaces.org/cdn/templates/sakai/auth/asset-access.svg" alt="Access denied" class="mb-8" width="80%" /><div class="col-span-12 mt-8 text-center"><p-button label="Go to Dashboard" severity="warn" /></div></div>`)}</div></div>`,
    error: `<div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center overflow-hidden" style="height:100%"><div class="flex flex-col items-center justify-center">${FRAME('linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)', `<div class="gap-4 flex flex-col items-center">
<div class="flex justify-center items-center border-2 border-pink-500 rounded-full" style="height: 3.2rem; width: 3.2rem"><i class="pi pi-fw pi-exclamation-circle text-2xl! text-pink-500"></i></div>
<h1 class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-2">Error Occured</h1><span class="text-muted-color mb-8">Requested resource is not available.</span>
<img src="https://primefaces.org/cdn/templates/sakai/auth/asset-error.svg" alt="Error" class="mb-8" width="80%" /><div class="col-span-12 mt-8 text-center"><p-button label="Go to Dashboard" severity="danger" /></div></div>`)}</div></div>`,
    notfound: `<div class="flex items-center justify-center overflow-hidden" style="height:100%;background:var(--surface-ground)"><div class="flex flex-col items-center justify-center">${LOGO('mb-8 w-32 shrink-0')}
${FRAME('linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)', `<span class="text-primary font-bold text-3xl">404</span><h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Not Found</h1><div class="text-surface-600 dark:text-surface-200 mb-8">Requested resource is not available.</div>
${[['pi-table', 'Frequently Asked Questions', 'Ultricies mi quis hendrerit dolor.', ''], ['pi-question-circle', 'Solution Center', 'Phasellus faucibus scelerisque eleifend.', ''], ['pi-unlock', 'Permission Manager', 'Accumsan in nisl nisi scelerisque', 'mb-8 ']]
    .map(([i, t, s, mb]) => `<a class="w-full flex items-center ${mb}py-8 border-surface-300 dark:border-surface-500 border-b"><span class="flex justify-center items-center border-2 border-primary text-primary rounded-border" style="height: 3.5rem; width: 3.5rem"><i class="pi pi-fw ${i} text-2xl!"></i></span><span class="ml-6 flex flex-col"><span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0 block">${t}</span><span class="text-surface-600 dark:text-surface-200 lg:text-xl">${s}</span></span></a>`)
    .join('')}<p-button label="Go to Dashboard" />`)}</div></div>`
};
const meta: Meta = { title: 'Components/AuthPages', decorators: [moduleMetadata({ imports: [FormsModule, InputTextModule, PasswordModule, CheckboxModule, ButtonModule] })] };
export default meta;
export const Playground: StoryObj = {
    args: { page: 'login' },
    argTypes: { page: { control: 'select', options: ['login', 'access', 'error', 'notfound'] } },
    render: (a, ctx) => ({
        template: `<div data-cell="playground" class="sb-cell" style="display:block;padding:8px"><div class="sb-capture" style="position:relative;transform:translateZ(0);overflow:hidden;width:1440px;height:900px">${CONFIG(ctx.globals['theme'] === 'dark')}${PAGES[a['page'] as string]}</div></div>`
    })
};
