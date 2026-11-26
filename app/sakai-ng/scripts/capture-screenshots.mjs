#!/usr/bin/env node
/**
 * Reference screenshot capture: PILOT_CHECKLIST Day 2.3.
 * Method, settings and naming are defined in screenshots/README.md (DECISIONS #13, #15, #19).
 *
 * Usage (from app/sakai-ng):
 *   npm run capture                         build Storybook, then capture everything
 *   node scripts/capture-screenshots.mjs [options]
 *
 * Options:
 *   --only=button,inputtext,tag   capture only these components (merged into the existing manifest)
 *   --out=<dir>                   output root (default: ../../screenshots)
 *   --static=<dir>                built Storybook (default: storybook-static)
 *   --concurrency=<n>             parallel pages (default: 4)
 *   --chrome=<path>               use this Chrome/Chromium instead of Playwright's bundled one
 *   --allow-missing-font          do not fail when Lato is missing (TEST ONLY: images are not valid references)
 *   --dry-run                     list what would be captured, capture nothing
 */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..');
const arg = (name, dflt) => {
    const hit = process.argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
    if (!hit) return dflt;
    return hit.includes('=') ? hit.split('=').slice(1).join('=') : true;
};
const OUT = resolve(APP, arg('out', '../../screenshots'));
const STATIC = resolve(APP, arg('static', 'storybook-static'));
const CONCURRENCY = Number(arg('concurrency', 4));
const ONLY = arg('only', '') ? String(arg('only')).split(',') : null;
const ALLOW_MISSING_FONT = Boolean(arg('allow-missing-font', false));
const DRY = Boolean(arg('dry-run', false));
const CHROME = arg('chrome', '') || undefined;

// Fixed capture settings (screenshots/README.md section 2). Do not change mid-pilot.
const VIEWPORT = { width: 1280, height: 800 };
const DPR = 2;
const PAD = 8; // px around the component's box, enough for focus ring (offset 2 + width 1) and raised shadow
const MODES = ['light', 'dark'];
const SURFACE = 'card';

// ---------------------------------------------------------------------------
// Capture plan. Each entry = one story load; `states` are captured from that load.
// `name` = ordered file-name parts (without state and mode), README section 3.
// ---------------------------------------------------------------------------
const SEVERITIES = ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'];
const SIZES = ['small', 'base', 'large'];
const STYLES = {
    solid: {},
    outlined: { outlined: true },
    text: { text: true },
    raised: { raised: true },
    rounded: { rounded: true }
};
const INTERACTIVE = ['default', 'hover', 'focus', 'active'];

function buttonPlan() {
    const p = [];
    const add = (args, parts, states) => p.push({ component: 'button', story: 'components-button--playground', args, name: ['button', ...parts], states });
    // 1. severity × size, solid
    for (const severity of SEVERITIES) for (const size of SIZES) add({ severity, size }, [`severity-${severity}`, `size-${size}`, 'style-solid'], INTERACTIVE);
    // 2. severity × style (non-solid), size base
    for (const severity of SEVERITIES)
        for (const [style, a] of Object.entries(STYLES)) if (style !== 'solid') add({ severity, size: 'base', ...a }, [`severity-${severity}`, 'size-base', `style-${style}`], INTERACTIVE);
    // 3. disabled: severity × style, size base
    for (const severity of SEVERITIES)
        for (const [style, a] of Object.entries(STYLES)) add({ severity, size: 'base', disabled: true, ...a }, [`severity-${severity}`, 'size-base', `style-${style}`], ['disabled']);
    // 4. icon-only: style × size, primary
    for (const size of SIZES)
        for (const [style, a] of Object.entries(STYLES)) add({ severity: 'primary', size, label: '!undefined', icon: 'pi pi-check', ...a }, ['severity-primary', `size-${size}`, `style-${style}`, 'icononly'], INTERACTIVE);
    // 5. icon positions, primary base
    for (const pos of ['left', 'right', 'top', 'bottom']) add({ severity: 'primary', size: 'base', icon: 'pi pi-check', iconPos: pos }, ['severity-primary', 'size-base', 'style-solid', `iconpos-${pos}`], ['default']);
    // 6. loading
    add({ severity: 'primary', size: 'base', loading: true }, ['severity-primary', 'size-base', 'style-solid'], ['loading']);
    add({ severity: 'primary', size: 'base', loading: true, icon: 'pi pi-check' }, ['severity-primary', 'size-base', 'style-solid', 'iconpos-left'], ['loading']);
    add({ severity: 'primary', size: 'base', loading: true, label: '!undefined', icon: 'pi pi-check' }, ['severity-primary', 'size-base', 'style-solid', 'icononly'], ['loading']);
    // 7. badge
    add({ severity: 'primary', size: 'base', label: 'Notifications', badge: '2' }, ['severity-primary', 'size-base', 'style-solid', 'badge'], ['default']);
    add({ severity: 'primary', size: 'base', label: 'Notifications', badge: '2', badgeSeverity: 'contrast', outlined: true }, ['severity-primary', 'size-base', 'style-outlined', 'badge'], ['default']);
    // 8. link, plain
    add({ size: 'base', link: true }, ['severity-primary', 'size-base', 'link'], INTERACTIVE);
    add({ size: 'base', plain: true, text: true }, ['severity-primary', 'size-base', 'style-text', 'plain'], INTERACTIVE);
    add({ size: 'base', plain: true, outlined: true }, ['severity-primary', 'size-base', 'style-outlined', 'plain'], INTERACTIVE);
    return p;
}

function inputtextPlan() {
    const p = [];
    const add = (args, parts, states, story = 'components-inputtext--playground') => p.push({ component: 'inputtext', story, args, name: parts, states });
    const CONTENT = { empty: { value: '', placeholder: '' }, placeholder: { value: '', placeholder: 'Placeholder' }, value: { value: 'Text value', placeholder: 'Placeholder' } };
    for (const variant of ['outlined', 'filled']) {
        for (const pSize of SIZES)
            for (const [content, a] of Object.entries(CONTENT)) add({ variant, pSize, ...a }, ['inputtext', `variant-${variant}`, `psize-${pSize}`, `content-${content}`], ['default', 'hover', 'focus']);
        add({ variant, pSize: 'base', ...CONTENT.value, disabled: true }, ['inputtext', `variant-${variant}`, 'psize-base', 'content-value'], ['disabled']);
        add({ variant, pSize: 'base', ...CONTENT.value, readonly: true }, ['inputtext', `variant-${variant}`, 'psize-base', 'content-value'], ['readonly']);
        for (const content of ['placeholder', 'value'])
            add({ variant, pSize: 'base', ...CONTENT[content], invalid: true }, ['inputtext', `variant-${variant}`, 'psize-base', `content-${content}`, 'invalid'], ['default', 'hover', 'focus']);
    }
    add({ variant: 'outlined', pSize: 'base', ...CONTENT.placeholder, fluid: true }, ['inputtext', 'variant-outlined', 'psize-base', 'content-placeholder', 'fluid'], ['default']);
    // Form row pattern (DECISIONS #18): label + input + helper. Captured from the pattern story.
    p.push({ component: 'inputtext', story: 'components-inputtext--with-label-and-helper', args: {}, name: ['pattern', 'formrow'], states: ['default'], cell: 'formrow' });
    p.push({ component: 'inputtext', story: 'components-inputtext--with-label-and-helper', args: {}, name: ['pattern', 'formrow', 'invalid'], states: ['default'], cell: 'formrow__invalid' });
    return p;
}

function tagPlan() {
    const p = [];
    for (const severity of ['none', 'secondary', 'success', 'info', 'warn', 'danger', 'contrast'])
        for (const icon of [false, true])
            for (const rounded of [false, true])
                p.push({
                    component: 'tag',
                    story: 'components-tag--playground',
                    // severity 'none' = arg omitted (story default '(none)' = severity not set in code)
                    args: { ...(severity === 'none' ? {} : { severity }), ...(icon ? { icon: 'pi pi-check' } : {}), rounded },
                    name: ['tag', `severity-${severity}`, `icon-${icon ? 'yes' : 'no'}`, `rounded-${rounded ? 'yes' : 'no'}`],
                    states: ['static']
                });
    return p;
}


// ---- Batch 1 (scale-up, DECISIONS #60). Same naming rules: <component>__<prop>-<value>__...__state-<s>__<mode>.png
const FIELD = ['default', 'hover', 'focus'];
const pl = (component, story, args, name, states, cell) => ({ component, story: `components-${story}--playground`, args, name: [component, ...name], states, ...(cell ? { cell } : {}) });
function textareaPlan() {
    const p = [];
    for (const variant of ['outlined', 'filled']) {
        for (const pSize of SIZES) p.push(pl('textarea', 'textarea', { variant, pSize, value: '', placeholder: 'Placeholder' }, [`variant-${variant}`, `psize-${pSize}`, 'content-placeholder'], FIELD));
        p.push(pl('textarea', 'textarea', { variant, pSize: 'base', value: 'Text value' }, [`variant-${variant}`, 'psize-base', 'content-value'], FIELD));
        p.push(pl('textarea', 'textarea', { variant, pSize: 'base', value: 'Text value', disabled: true }, [`variant-${variant}`, 'psize-base', 'content-value'], ['disabled']));
        p.push(pl('textarea', 'textarea', { variant, pSize: 'base', value: '', placeholder: 'Placeholder', invalid: true }, [`variant-${variant}`, 'psize-base', 'content-placeholder', 'invalid'], FIELD));
    }
    return p;
}
function passwordPlan() {
    const p = [];
    for (const variant of ['outlined', 'filled']) for (const size of SIZES) p.push(pl('password', 'password', { variant, size }, [`variant-${variant}`, `size-${size}`, 'content-placeholder'], FIELD));
    p.push(pl('password', 'password', { value: 'secret12', toggleMask: true }, ['variant-outlined', 'size-base', 'content-value', 'togglemask'], ['default']));
    p.push(pl('password', 'password', { invalid: true }, ['variant-outlined', 'size-base', 'content-placeholder', 'invalid'], ['default']));
    p.push(pl('password', 'password', { disabled: true }, ['variant-outlined', 'size-base', 'content-placeholder'], ['disabled']));
    for (const [strength, value] of [['weak', 'abc'], ['medium', 'abc12345'], ['strong', 'Abc!12345']])
        p.push({ ...pl('password', 'password', { feedback: true, value }, ['variant-outlined', 'size-base', `feedback-${strength}`], ['open'], 'playground'), story: 'components-password--open' });
    return p;
}
function iconfieldPlan() {
    const p = [];
    for (const iconPosition of ['left', 'right']) for (const pSize of SIZES) p.push(pl('iconfield', 'iconfield', { iconPosition, pSize }, [`iconposition-${iconPosition}`, `psize-${pSize}`, 'variant-outlined'], FIELD));
    p.push(pl('iconfield', 'iconfield', { variant: 'filled' }, ['iconposition-left', 'psize-base', 'variant-filled'], ['default']));
    p.push(pl('iconfield', 'iconfield', { disabled: true }, ['iconposition-left', 'psize-base', 'variant-outlined'], ['disabled']));
    return p;
}
function inputnumberPlan() {
    const p = [];
    for (const variant of ['outlined', 'filled']) for (const size of SIZES) p.push(pl('inputnumber', 'inputnumber', { variant, size }, [`variant-${variant}`, `size-${size}`, 'buttons-none'], FIELD));
    for (const layout of ['stacked', 'horizontal', 'vertical'])
        for (const size of SIZES) p.push(pl('inputnumber', 'inputnumber', { showButtons: true, buttonLayout: layout, size }, ['variant-outlined', `size-${size}`, `buttons-${layout}`], ['default', 'hover', 'focus']));
    p.push(pl('inputnumber', 'inputnumber', { prefix: '$ ' }, ['variant-outlined', 'size-base', 'buttons-none', 'prefix'], ['default']));
    p.push(pl('inputnumber', 'inputnumber', { invalid: true }, ['variant-outlined', 'size-base', 'buttons-none', 'invalid'], ['default']));
    p.push(pl('inputnumber', 'inputnumber', { showButtons: true, disabled: true }, ['variant-outlined', 'size-base', 'buttons-stacked'], ['disabled']));
    return p;
}
function choicePlan(component, story) {
    const p = [];
    const variants = component === 'toggleswitch' ? [null] : ['outlined', 'filled'];
    for (const variant of variants)
        for (const size of SIZES)
            for (const checked of [false, true]) {
                const v = variant ? { variant } : {};
                const vn = variant ? [`variant-${variant}`] : [];
                p.push(pl(component, story, { ...v, size, checked }, [...vn, `size-${size}`, `checked-${checked ? 'yes' : 'no'}`], ['default', 'hover', 'focus']));
                if (size === 'base') {
                    p.push(pl(component, story, { ...v, size, checked, disabled: true }, [...vn, 'size-base', `checked-${checked ? 'yes' : 'no'}`], ['disabled']));
                    p.push(pl(component, story, { ...v, size, checked, invalid: true }, [...vn, 'size-base', `checked-${checked ? 'yes' : 'no'}`, 'invalid'], ['default']));
                }
            }
    if (component === 'checkbox') p.push(pl('checkbox', 'checkbox', { indeterminate: true }, ['variant-outlined', 'size-base', 'checked-indeterminate'], ['default']));
    return p;
}
function selectPlan() {
    const p = [];
    for (const variant of ['outlined', 'filled'])
        for (const size of SIZES)
            for (const selected of [false, true]) p.push(pl('select', 'select', { variant, size, selected }, [`variant-${variant}`, `size-${size}`, `content-${selected ? 'value' : 'placeholder'}`], FIELD));
    p.push(pl('select', 'select', { selected: true, showClear: true }, ['variant-outlined', 'size-base', 'content-value', 'showclear'], ['default']));
    p.push(pl('select', 'select', { invalid: true }, ['variant-outlined', 'size-base', 'content-placeholder', 'invalid'], ['default']));
    p.push(pl('select', 'select', { disabled: true }, ['variant-outlined', 'size-base', 'content-placeholder'], ['disabled']));
    for (const checkmark of [false, true])
        p.push({ ...pl('select', 'select', { selected: true, checkmark }, ['variant-outlined', 'size-base', 'content-value', `checkmark-${checkmark ? 'yes' : 'no'}`], ['open'], 'playground'), story: 'components-select--open' });
    // Group C panel extras (#74): filter, option groups, empty message
    p.push({ ...pl('select', 'select', { selected: true, filter: true }, ['variant-outlined', 'size-base', 'content-value', 'filter'], ['open'], 'playground'), story: 'components-select--open' });
    p.push({ ...pl('select', 'select', { selected: true, grouped: true }, ['variant-outlined', 'size-base', 'content-value', 'grouped'], ['open'], 'playground'), story: 'components-select--open' });
    p.push({ ...pl('select', 'select', { empty: true }, ['variant-outlined', 'size-base', 'content-placeholder', 'empty'], ['open'], 'playground'), story: 'components-select--open' });
    return p;
}
// Batch 2 (#80–#83): DataTable (Sakai CRUD replica) + Paginator
function datatablePlan() {
    const p = [];
    for (const size of SIZES) p.push(pl('datatable', 'datatable', { size }, [`size-${size}`], ['default']));
    p.push({ ...pl('datatable', 'datatable', {}, ['size-base', 'row-2'], ['hover']), hoverSel: 'tbody tr:nth-child(2) td:nth-child(3)' });
    p.push({ ...pl('datatable', 'datatable', {}, ['size-base', 'header-price'], ['hover']), hoverSel: 'th[psortablecolumn="price"]' });
    p.push(pl('datatable', 'datatable', { selected: true }, ['size-base', 'selected'], ['default']));
    p.push(pl('datatable', 'datatable', { sorted: true }, ['size-base', 'sorted-name'], ['default']));
    p.push(pl('datatable', 'datatable', { striped: true }, ['size-base', 'striped'], ['default']));
    p.push(pl('datatable', 'datatable', { gridlines: true }, ['size-base', 'gridlines'], ['default']));
    return p;
}
function paginatorPlan() {
    const p = [];
    p.push(pl('paginator', 'paginator', { first: 0 }, ['page-1'], ['default']));
    p.push(pl('paginator', 'paginator', { first: 20 }, ['page-3'], ['default']));
    p.push({ ...pl('paginator', 'paginator', { first: 20 }, ['page-3', 'page-4'], ['hover']), hoverSel: '.p-paginator-page:not(.p-paginator-page-selected) >> nth=2' });
    p.push(pl('paginator', 'paginator', { first: 20, report: true }, ['page-3', 'report'], ['default']));
    return p;
}
// Batch 2 (#89/#90): Toolbar (Sakai CRUD + UI Kit replicas) + SplitButton
function toolbarPlan() {
    return ['crud', 'uikit'].map((layout) => pl('toolbar', 'toolbar', { layout }, [`layout-${layout}`], ['default']));
}
function splitbuttonPlan() {
    const p = [];
    for (const severity of SEVERITIES) p.push(pl('splitbutton', 'splitbutton', { severity }, [`severity-${severity}`, 'size-base', 'variant-solid'], ['default']));
    for (const severity of ['primary', 'secondary']) for (const v of ['outlined', 'text']) p.push(pl('splitbutton', 'splitbutton', { severity, [v]: true }, [`severity-${severity}`, 'size-base', `variant-${v}`], ['default']));
    for (const size of ['small', 'large']) p.push(pl('splitbutton', 'splitbutton', { size }, ['severity-primary', `size-${size}`, 'variant-solid'], ['default']));
    p.push(pl('splitbutton', 'splitbutton', { rounded: true }, ['severity-primary', 'size-base', 'variant-solid', 'rounded'], ['default']));
    p.push(pl('splitbutton', 'splitbutton', { outlined: true, rounded: true }, ['severity-primary', 'size-base', 'variant-outlined', 'rounded'], ['default']));
    p.push(pl('splitbutton', 'splitbutton', { raised: true }, ['severity-primary', 'size-base', 'variant-solid', 'raised'], ['default']));
    p.push(pl('splitbutton', 'splitbutton', { disabled: true }, ['severity-primary', 'size-base', 'variant-solid'], ['disabled']));
    p.push({ ...pl('splitbutton', 'splitbutton', {}, ['severity-primary', 'size-base', 'variant-solid', 'main'], ['hover']), hoverSel: '.p-splitbutton-button' });
    p.push({ ...pl('splitbutton', 'splitbutton', {}, ['severity-primary', 'size-base', 'variant-solid', 'dropdown'], ['hover']), hoverSel: '.p-splitbutton-dropdown' });
    p.push({ ...pl('splitbutton', 'splitbutton', { outlined: true }, ['severity-primary', 'size-base', 'variant-outlined', 'main'], ['hover']), hoverSel: '.p-splitbutton-button' });
    return p;
}
// Batch 2 (#91–#93): Dialog + ConfirmDialog (overlays: the root is the dialog box, the mask is not captured)
function dialogPlan() {
    const p = [];
    for (const layout of ['product', 'simple']) p.push(pl('dialog', 'dialog', { layout }, [`layout-${layout}`], ['default']));
    p.push(pl('dialog', 'dialog', { layout: 'simple', closable: false }, ['layout-simple', 'no-close'], ['default']));
    p.push(pl('dialog', 'dialog', { layout: 'simple', header: false }, ['layout-simple', 'no-header'], ['default']));
    p.push({ ...pl('dialog', 'dialog', { layout: 'simple' }, ['layout-simple', 'close'], ['hover']), hoverSel: '.p-dialog-close-button' });
    return p;
}
function confirmdialogPlan() {
    return [pl('confirmdialog', 'confirmdialog', {}, ['crud-delete'], ['default'])];
}
// Batch 2 (#94): Toast — one sticky toast; the root is the message box (.p-toast-message)
function toastPlan() {
    const p = [];
    for (const severity of ['info', 'success', 'warn', 'error', 'secondary', 'contrast']) p.push(pl('toast', 'toast', { severity }, [`severity-${severity}`], ['default']));
    p.push(pl('toast', 'toast', { severity: 'info', detail: false }, ['severity-info', 'no-detail'], ['default']));
    p.push(pl('toast', 'toast', { severity: 'info', closable: false }, ['severity-info', 'no-close'], ['default']));
    p.push({ ...pl('toast', 'toast', { severity: 'info' }, ['severity-info', 'close'], ['hover']), hoverSel: '.p-toast-close-button' });
    return p;
}
function messagePlan() {
    const p = [];
    for (const severity of ['success', 'info', 'warn', 'error', 'secondary', 'contrast'])
        for (const variant of ['default', 'outlined', 'simple']) p.push(pl('message', 'message', { severity, variant }, [`severity-${severity}`, `variant-${variant}`, 'size-base'], ['static']));
    for (const size of ['small', 'large']) p.push(pl('message', 'message', { severity: 'info', size }, ['severity-info', 'variant-default', `size-${size}`], ['static']));
    p.push(pl('message', 'message', { severity: 'info', closable: true }, ['severity-info', 'variant-default', 'size-base', 'closable'], ['static']));
    p.push(pl('message', 'message', { severity: 'info', icon: 'pi pi-info-circle' }, ['severity-info', 'variant-default', 'size-base', 'icon'], ['static']));
    return p;
}
function datepickerPlan() {
    const p = [];
    for (const icon of ['none', 'input', 'button'])
        for (const size of SIZES) p.push(pl('datepicker', 'datepicker', { icon, size }, [`icon-${icon}`, `size-${size}`, 'variant-outlined', 'content-placeholder'], FIELD));
    p.push(pl('datepicker', 'datepicker', { icon: 'button', selected: true }, ['icon-button', 'size-base', 'variant-outlined', 'content-value'], ['default']));
    p.push(pl('datepicker', 'datepicker', { icon: 'input', variant: 'filled' }, ['icon-input', 'size-base', 'variant-filled', 'content-placeholder'], ['default']));
    p.push(pl('datepicker', 'datepicker', { icon: 'button', invalid: true }, ['icon-button', 'size-base', 'variant-outlined', 'content-placeholder', 'invalid'], ['default']));
    p.push(pl('datepicker', 'datepicker', { icon: 'button', disabled: true }, ['icon-button', 'size-base', 'variant-outlined', 'content-placeholder'], ['disabled']));
    // panel (inline day view): static, plus hover on one date (the 10th) and on the next-month arrow
    p.push({ ...pl('datepicker', 'datepicker', {}, ['panel', 'dayview'], ['default'], 'playground'), story: 'components-datepicker--panel' });
    p.push({ ...pl('datepicker', 'datepicker', {}, ['panel', 'dayview', 'date-10'], ['hover'], 'playground'), story: 'components-datepicker--panel', hoverSel: 'td:not(.p-datepicker-other-month) span:text-is("10")' });
    p.push({ ...pl('datepicker', 'datepicker', {}, ['panel', 'dayview', 'next'], ['hover'], 'playground'), story: 'components-datepicker--panel', hoverSel: '.p-datepicker-next-button' });
    return p;
}
const PLANS = { button: buttonPlan, inputtext: inputtextPlan, tag: tagPlan, textarea: textareaPlan, password: passwordPlan, iconfield: iconfieldPlan, inputnumber: inputnumberPlan,
    checkbox: () => choicePlan('checkbox', 'checkbox'), radiobutton: () => choicePlan('radiobutton', 'radiobutton'), toggleswitch: () => choicePlan('toggleswitch', 'toggleswitch'), select: selectPlan, message: messagePlan, datepicker: datepickerPlan, datatable: datatablePlan, paginator: paginatorPlan, toolbar: toolbarPlan, splitbutton: splitbuttonPlan, dialog: dialogPlan, confirmdialog: confirmdialogPlan, toast: toastPlan };

// ---------------------------------------------------------------------------
// Storybook URL building. Arg values: '!undefined' / '!true' / '!false' are Storybook URL specials.
// ---------------------------------------------------------------------------
const enc = (v) => {
    if (v === true) return '!true';
    if (v === false) return '!false';
    if (typeof v === 'string' && v.startsWith('!')) return v;
    return String(v).replace(/ /g, '+');
};
const storyUrl = (base, story, args, mode) => {
    const a = Object.entries(args)
        .map(([k, v]) => `${k}:${enc(v)}`)
        .join(';');
    return `${base}/iframe.html?id=${story}&viewMode=story&globals=theme:${mode};surface:${SURFACE}${a ? `&args=${a}` : ''}`;
};

// ---------------------------------------------------------------------------
// Tiny static server for the built Storybook.
// ---------------------------------------------------------------------------
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.png': 'image/png', '.ico': 'image/x-icon' };
function serve(root) {
    return new Promise((ok) => {
        const srv = createServer(async (req, res) => {
            try {
                const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
                const file = join(root, path.endsWith('/') ? path + 'index.html' : path);
                if (!file.startsWith(root)) throw new Error('outside root');
                const body = await readFile(file);
                res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
                res.end(body);
            } catch {
                res.writeHead(404);
                res.end();
            }
        });
        srv.listen(0, '127.0.0.1', () => ok(srv));
    });
}

// ---------------------------------------------------------------------------
// Capture one plan entry in one mode.
// ---------------------------------------------------------------------------
const ROOTS = '.p-button, .p-inputtext, .p-tag, .p-textarea, .p-select, .p-inputnumber, .p-checkbox, .p-radiobutton, .p-toggleswitch, .p-password, .p-iconfield, .p-message, .p-datepicker, .p-datatable, .p-paginator, .p-toolbar, .p-splitbutton, .p-dialog, .p-toast-message'; // component roots (outer first in document order)
const rootSel = (cell) => ROOTS.split(', ').map((r) => `${cell} ${r}`).join(', ');
const FREEZE_CSS = '*,*::before,*::after{animation-play-state:paused!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}';

async function captureEntry(context, base, entry, mode) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    try {
        await page.goto(storyUrl(base, entry.story, entry.args, mode), { waitUntil: 'load' });
        const cellSel = `[data-cell="${entry.cell ?? 'playground'}"]`;
        await page.waitForSelector(rootSel(cellSel), { timeout: 15000 });
        await page.evaluate(() => document.fonts.ready);
        const lato = await page.evaluate(() => [...document.fonts].some((f) => /lato/i.test(f.family) && f.status === 'loaded') && document.fonts.check('14px Lato'));
        if (!lato && !ALLOW_MISSING_FONT) throw new Error('Lato did not load (fonts.cdnfonts.com unreachable?). Refusing to capture invalid references.');
        // let finite enter animations (e.g. p-message fade-in) finish before freezing; infinite ones (spinner) are skipped
        await page.evaluate(() => Promise.race([Promise.all(document.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, 2000))]));
        await page.addStyleTag({ content: FREEZE_CSS });
        const dark = await page.evaluate(() => document.documentElement.classList.contains('app-dark'));
        if (dark !== (mode === 'dark')) throw new Error(`theme global not applied (expected ${mode})`);

        const comp = page.locator(rootSel(cellSel)).first();
        const target = entry.cell ? page.locator(cellSel) : comp;
        const files = [];
        for (const state of entry.states) {
            await page.mouse.move(0, 0);
            await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
            if (state === 'hover') await (entry.hoverSel ? page.locator(`${cellSel} ${entry.hoverSel}`).first() : target).hover(); // hoverSel: hover a part (e.g. one date cell)
            if (state === 'open') { await comp.click(); await page.waitForTimeout(400); } // Select panel / Password meter, kept inside the cell (appendTo self)
            if (state === 'focus') {
                await page.keyboard.press('Tab');
                const ok = await target.evaluate((e) => e.matches(':focus-visible') || e.contains(document.activeElement));
                if (!ok) throw new Error('keyboard focus did not land on the component');
                // Tabbing into a text input selects its text; put the caret at the end so the reference shows no selection
                await target.evaluate((e) => {
                    if (typeof e.setSelectionRange === 'function' && typeof e.value === 'string') e.setSelectionRange(e.value.length, e.value.length);
                });
            }
            if (state === 'active') {
                const b = await target.boundingBox();
                await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
                await page.mouse.down();
            }
            await page.waitForTimeout(120);
            const box = await target.boundingBox();
            const clip = { x: Math.max(0, box.x - PAD), y: Math.max(0, box.y - PAD), width: box.width + PAD * 2, height: box.height + PAD * 2 };
            const name = [...entry.name, ...(state === 'static' ? [] : [`state-${state}`]), mode].join('__') + '.png';
            const file = join(OUT, entry.component, name);
            await page.screenshot({ path: file, clip });
            if (state === 'active') await page.mouse.up();
            files.push({ file: `${entry.component}/${name}`, state, w: Math.round(box.width * 100) / 100, h: Math.round(box.height * 100) / 100 });
        }
        if (errors.length) throw new Error(errors.join(' | '));
        return files.map((f) => ({ ...f, mode, story: entry.story, args: entry.args, lato }));
    } finally {
        await page.close();
    }
}

// ---------------------------------------------------------------------------
async function main() {
    for (const o of ONLY || []) if (!PLANS[o]) throw new Error(`No capture plan for ${o}`);
    const plan = Object.entries(PLANS).flatMap(([c, f]) => (ONLY && !ONLY.includes(c) ? [] : f()));
    const jobs = plan.flatMap((entry) => MODES.map((mode) => ({ entry, mode })));
    const total = jobs.reduce((n, j) => n + j.entry.states.length, 0);
    console.log(`Capture plan: ${plan.length} story setups × ${MODES.length} modes = ${jobs.length} page loads, ${total} images → ${OUT}`);
    if (DRY) {
        for (const { entry, mode } of jobs) for (const s of entry.states) console.log([...entry.name, ...(s === 'static' ? [] : [`state-${s}`]), mode].join('__') + '.png');
        return;
    }
    try {
        await stat(join(STATIC, 'iframe.html'));
    } catch {
        throw new Error(`No built Storybook at ${STATIC}. Run "npm run build-storybook" first (or use "npm run capture").`);
    }
    const { chromium } = await import('playwright');
    for (const c of new Set(plan.map((p) => p.component))) await mkdir(join(OUT, c), { recursive: true });
    const srv = await serve(STATIC);
    const base = `http://127.0.0.1:${srv.address().port}`;
    const browser = await chromium.launch({ executablePath: CHROME, args: CHROME ? ['--no-sandbox'] : [] });
    const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DPR, reducedMotion: 'reduce', colorScheme: 'light' });
    const results = [];
    const failures = [];
    let done = 0;
    const queue = [...jobs];
    const worker = async () => {
        while (queue.length) {
            const job = queue.shift();
            try {
                results.push(...(await captureEntry(context, base, job.entry, job.mode)));
            } catch (e) {
                failures.push({ name: job.entry.name.join('__'), mode: job.mode, error: String(e.message ?? e) });
                if (/Lato did not load/.test(String(e.message))) queue.length = 0; // stop early: every capture would fail
            }
            done++;
            if (done % 25 === 0 || done === jobs.length) process.stdout.write(`  ${done}/${jobs.length} page loads\r`);
        }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    await browser.close();
    srv.close();
    console.log('');

    const capturedNow = results.length;
    if (ONLY && !ALLOW_MISSING_FONT && OUT === resolve(APP, '../../screenshots')) {
        // partial run: merge into the existing manifest (replace only the components captured now)
        try {
            const old = JSON.parse(await readFile(join(OUT, 'manifest.json'), 'utf8'));
            results.push(...old.images.filter((r) => !ONLY.includes(r.file.split('/')[0])));
        } catch {}
    }
    results.sort((a, b) => a.file.localeCompare(b.file));
    const manifest = {
        generated: new Date().toISOString(),
        settings: { viewport: VIEWPORT, deviceScaleFactor: DPR, padding: PAD, surface: SURFACE, rootFontSize: '14px', fontVerified: !ALLOW_MISSING_FONT },
        versions: await versions(),
        count: results.length,
        images: results
    };
    if (!ONLY || OUT === resolve(APP, '../../screenshots')) await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    const csv = ['file,component,mode,state,width_css_px,height_css_px,story,args', ...results.map((r) => [r.file, r.file.split('/')[0], r.mode, r.state, r.w, r.h, r.story, JSON.stringify(JSON.stringify(r.args))].join(','))];
    if (!ONLY || OUT === resolve(APP, '../../screenshots')) await writeFile(join(OUT, 'manifest.csv'), csv.join('\n') + '\n');

    console.log(`Captured ${capturedNow} of ${total} images${results.length !== capturedNow ? ` (manifest now lists ${results.length})` : ''}.`);
    if (ALLOW_MISSING_FONT) console.log('WARNING: --allow-missing-font was used. These images are NOT valid references.');
    if (failures.length) {
        console.error(`${failures.length} failed:`);
        for (const f of failures.slice(0, 20)) console.error(`  ${f.name} [${f.mode}]: ${f.error}`);
        process.exitCode = 1;
    }
}

async function versions() {
    const v = async (p) => {
        try {
            return JSON.parse(await readFile(join(APP, 'node_modules', p, 'package.json'), 'utf8')).version;
        } catch {
            return null;
        }
    };
    return { primeng: await v('primeng'), '@primeuix/themes': await v('@primeuix/themes'), '@angular/core': await v('@angular/core'), storybook: await v('storybook') };
}

main().catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
});
