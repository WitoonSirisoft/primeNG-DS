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
 *   --only=button,inputtext,tag   capture only these components
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
const FREEZE_CSS = '*,*::before,*::after{animation-play-state:paused!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}';

async function captureEntry(context, base, entry, mode) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    try {
        await page.goto(storyUrl(base, entry.story, entry.args, mode), { waitUntil: 'load' });
        const cellSel = `[data-cell="${entry.cell ?? 'playground'}"]`;
        await page.waitForSelector(`${cellSel} .p-button, ${cellSel} .p-inputtext, ${cellSel} .p-tag`, { timeout: 15000 });
        await page.evaluate(() => document.fonts.ready);
        const lato = await page.evaluate(() => [...document.fonts].some((f) => /lato/i.test(f.family) && f.status === 'loaded') && document.fonts.check('14px Lato'));
        if (!lato && !ALLOW_MISSING_FONT) throw new Error('Lato did not load (fonts.cdnfonts.com unreachable?). Refusing to capture invalid references.');
        await page.addStyleTag({ content: FREEZE_CSS });
        const dark = await page.evaluate(() => document.documentElement.classList.contains('app-dark'));
        if (dark !== (mode === 'dark')) throw new Error(`theme global not applied (expected ${mode})`);

        const target = entry.cell ? page.locator(cellSel) : page.locator(`${cellSel} .p-button, ${cellSel} .p-inputtext, ${cellSel} .p-tag`).first();
        const files = [];
        for (const state of entry.states) {
            await page.mouse.move(0, 0);
            await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
            if (state === 'hover') await target.hover();
            if (state === 'focus') {
                await page.keyboard.press('Tab');
                const ok = await target.evaluate((e) => e.matches(':focus-visible') || e.contains(document.activeElement));
                if (!ok) throw new Error('keyboard focus did not land on the component');
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
    const plan = [...(ONLY && !ONLY.includes('button') ? [] : buttonPlan()), ...(ONLY && !ONLY.includes('inputtext') ? [] : inputtextPlan()), ...(ONLY && !ONLY.includes('tag') ? [] : tagPlan())];
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

    results.sort((a, b) => a.file.localeCompare(b.file));
    const manifest = {
        generated: new Date().toISOString(),
        settings: { viewport: VIEWPORT, deviceScaleFactor: DPR, padding: PAD, surface: SURFACE, rootFontSize: '14px', fontVerified: !ALLOW_MISSING_FONT },
        versions: await versions(),
        count: results.length,
        images: results
    };
    if (!ONLY) await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    const csv = ['file,component,mode,state,width_css_px,height_css_px,story,args', ...results.map((r) => [r.file, r.file.split('/')[0], r.mode, r.state, r.w, r.h, r.story, JSON.stringify(JSON.stringify(r.args))].join(','))];
    if (!ONLY) await writeFile(join(OUT, 'manifest.csv'), csv.join('\n') + '\n');

    console.log(`Captured ${results.length} of ${total} images.`);
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
