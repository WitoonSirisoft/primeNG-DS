#!/usr/bin/env node
/**
 * Token export: PILOT_CHECKLIST Day 3.1.
 * Reads the INSTALLED Aura preset (@primeuix/themes) and writes tokens/base/tokens.json
 * with three collections (primitives, semantic, components) and the alias structure preserved.
 * Typography (font-family, typography.*) comes from Sakai's layout SCSS, because Aura has no font tokens.
 * Naming and format rules: tokens/README.md. Figma px conversion: 1rem = 14px (DECISIONS #15).
 *
 * Usage (from app/sakai-ng):  npm run tokens   |   node scripts/export-tokens.mjs [--out=<file>] [--components=button,inputtext,tag]
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Aura from '@primeuix/themes/aura';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..');
const arg = (n, d) => {
    const a = process.argv.find((x) => x.startsWith(`--${n}=`));
    return a ? a.slice(n.length + 3) : d;
};
const OUT = resolve(APP, arg('out', '../../tokens/base/tokens.json'));
const COMPONENTS = arg('components', 'button,inputtext,tag,badge,textarea,select,inputnumber,checkbox,radiobutton,toggleswitch,password,iconfield,message,datepicker,datatable,paginator,toolbar,splitbutton,dialog,confirmdialog,toast,menu,tabs,accordion,divider,avatar,chip,breadcrumb,menubar,inputgroup,togglebutton,selectbutton,multiselect,autocomplete,fileupload,progressbar,tooltip,timeline,stepper,tree,treetable,dataview').split(','); // batch 2: datatable + paginator (#80), toolbar + splitbutton (#89/#90), dialog + confirmdialog (#91–#93), toast (#94), menu (#95), tabs (#98), batch 3 accordion/divider/avatar/chip/breadcrumb/menubar (#100), forms 2 (#101) // batch 1 added 2026-11-24 (#60)
const ROOT_FONT_PX = 14; // DECISIONS #15
const MODES = ['light', 'dark'];

// ---------- naming ----------
const kebab = (k) => String(k).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
/** Fully dotted form, the way PrimeNG writes aliases: formField.paddingX -> form.field.padding.x */
const dotted = (path) => path.split('.').flatMap((seg) => seg.split('-')).join('.');
const cssVar = (path) => '--p-' + path.replace(/\./g, '-');

// ---------- flatten a preset subtree into { path: value } ----------
function flatten(obj, prefix, out, { dropRoot = false } = {}) {
    for (const [k, v] of Object.entries(obj ?? {})) {
        if (k === 'colorScheme' || k === 'css') continue;
        const seg = dropRoot && k === 'root' ? null : kebab(k);
        const p = [prefix, seg].filter(Boolean).join('.');
        if (v && typeof v === 'object') flatten(v, p, out);
        else out[p] = String(v);
    }
    return out;
}

/** Build one collection: { path: { common?, light?, dark? } } */
function collect(prefix, node, { dropRoot = false } = {}) {
    const res = {};
    const common = flatten(node, prefix, {}, { dropRoot });
    for (const [p, v] of Object.entries(common)) res[p] = { common: v };
    for (const m of MODES) {
        const scheme = node?.colorScheme?.[m];
        if (!scheme) continue;
        const mode = flatten(scheme, prefix, {}, { dropRoot });
        for (const [p, v] of Object.entries(mode)) {
            res[p] ??= {};
            if (res[p].common !== undefined) throw new Error(`Token ${p} is defined both outside and inside colorScheme.${m}`);
            res[p][m] = v;
        }
    }
    return res;
}

const primitives = collect('', Aura.primitive);
const semantic = collect('', Aura.semantic);
const components = {};
for (const c of COMPONENTS) {
    if (!Aura.components[c]) throw new Error(`Aura has no component "${c}"`);
    components[c] = collect(c, Aura.components[c], { dropRoot: true });
}

// ---------- Sakai typography (not in Aura: Aura has no font tokens; DECISIONS #28) ----------
// Parsed from the Sakai layout SCSS so a Sakai update is picked up on re-run. Fails loudly if a rule moves.
const SAKAI_CORE = 'src/assets/layout/_core.scss';
const SAKAI_TYPO = 'src/assets/layout/_typography.scss';
const sakaiSource = {}; // path -> "file: selector { prop }"
async function sakaiTypography() {
    const files = { [SAKAI_CORE]: await readFile(join(APP, SAKAI_CORE), 'utf8'), [SAKAI_TYPO]: await readFile(join(APP, SAKAI_TYPO), 'utf8') };
    const decl = (file, selector, prop) => {
        const sel = selector.split(',').map((x) => x.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join(',\\s*');
        // every top-level rule whose selector list is exactly `selector` (a grouped `h5,\nh6 {` is not `h6 {`)
        const blocks = [...files[file].matchAll(new RegExp(`(?:^|\\n)(?<!,\\r?\\n)${sel}\\s*\\{([^}]*)`, 'g'))];
        const m = blocks.map((b) => b[1].match(new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([^;]+);`))).find(Boolean);
        if (!m) throw new Error(`Sakai typography: "${selector} { ${prop} }" not found in ${file}. Sakai changed; update export-tokens.mjs.`);
        return m[1].trim();
    };
    const t = {};
    const add = (path, value, src) => ((t[path] = { common: value }), (sakaiSource[path] = src));
    const family = decl(SAKAI_CORE, 'body', 'font-family'); // 'Lato', sans-serif
    const families = family.split(',').map((f) => f.trim().replace(/^['"]|['"]$/g, ''));
    add('font-family', families[0], `${SAKAI_CORE}: body { font-family: ${family} }`);
    const rootSize = decl(SAKAI_CORE, 'html', 'font-size');
    if (rootSize !== `${ROOT_FONT_PX}px`) throw new Error(`Sakai html font-size is ${rootSize}, but ROOT_FONT_PX is ${ROOT_FONT_PX} (DECISIONS #15)`);
    add('typography.base.font-size', rootSize, `${SAKAI_CORE}: html { font-size }`);
    add('typography.base.line-height', decl(SAKAI_CORE, 'html', 'line-height'), `${SAKAI_CORE}: html { line-height } (inherited by all component text)`);
    add('typography.base.font-weight', '400', 'browser default (Sakai sets no body font-weight)');
    add('typography.paragraph.line-height', decl(SAKAI_TYPO, 'p', 'line-height'), `${SAKAI_TYPO}: p { line-height }`);
    const H = 'h1, h2, h3, h4, h5, h6';
    add('typography.heading.font-weight', decl(SAKAI_TYPO, H, 'font-weight'), `${SAKAI_TYPO}: h1-h6 { font-weight }`);
    add('typography.heading.line-height', decl(SAKAI_TYPO, H, 'line-height'), `${SAKAI_TYPO}: h1-h6 { line-height }`);
    for (const h of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) add(`typography.heading.${h}.font-size`, decl(SAKAI_TYPO, h, 'font-size'), `${SAKAI_TYPO}: ${h} { font-size }`);
    // PrimeNG component CSS sets a few line-heights that are not design tokens; read them from the style so a text style can use them
    const menuCss = await readFile('node_modules/@primeuix/styles/dist/menu/index.mjs', 'utf8');
    const mlh = menuCss.match(/\.p-menu-item-label\s*\{[^}]*?line-height:\s*([^;]+);/);
    if (!mlh) throw new Error('PrimeNG menu: .p-menu-item-label { line-height } not found. PrimeNG changed; update export-tokens.mjs.');
    add('typography.menu-item-label.line-height', mlh[1].trim(), '@primeuix/styles menu: .p-menu-item-label { line-height }');
    // Sakai layout sidebar menu (#97): nested SCSS, read with targeted patterns from _menu.scss
    const SAKAI_MENU = 'src/assets/layout/_menu.scss';
    const mcss = await readFile(SAKAI_MENU, 'utf8');
    const mget = (re, what) => { const m = mcss.match(re); if (!m) throw new Error(`Sakai menu: ${what} not found in ${SAKAI_MENU}. Sakai changed; update export-tokens.mjs.`); return m[1].trim(); };
    const block = (sel) => mget(new RegExp(`${sel}\\s*\\{([^{}]*)`), `${sel} { }`);
    const prop = (b, pr, what) => { const m = b.match(new RegExp(`(?:^|[;\\s])${pr}\\s*:\\s*([^;]+);`)); if (!m) throw new Error(`Sakai menu: ${what} { ${pr} } not found. Sakai changed; update export-tokens.mjs.`); return m[1].trim(); };
    const side = block('\\.layout-sidebar'), root = block('\\.layout-menuitem-root-text');
    const link = mget(/\n\s*a \{\s*(display: flex;[^{}]*)/, 'ul a { display: flex }');
    const S = (p, v, css) => add(p, v, `${SAKAI_MENU}: ${css}`);
    S('layout.sidebar.width', prop(side, 'width', '.layout-sidebar'), '.layout-sidebar { width }');
    S('layout.sidebar.padding', prop(side, 'padding', '.layout-sidebar'), '.layout-sidebar { padding }');
    S('layout.menu.root-text.font-size', prop(root, 'font-size', 'root-text'), '.layout-menuitem-root-text { font-size }');
    S('layout.menu.root-text.font-weight', prop(root, 'font-weight', 'root-text'), '.layout-menuitem-root-text { font-weight }');
    S('layout.menu.root-text.text-transform', prop(root, 'text-transform', 'root-text'), '.layout-menuitem-root-text { text-transform }');
    S('layout.menu.root-text.margin', prop(root, 'margin', 'root-text'), '.layout-menuitem-root-text { margin }');
    S('layout.menu.item.padding', prop(link, 'padding', 'ul a'), 'ul a { padding }');
    S('layout.menu.item.icon-gap', mget(/\.layout-menuitem-icon\s*\{[^}]*?margin-right:\s*([^;]+);/, '.layout-menuitem-icon { margin-right }'), '.layout-menuitem-icon { margin-right }');
    const tog = mget(/\.layout-submenu-toggler\s*\{\s*font-size:\s*([^;]+);/, '.layout-submenu-toggler { font-size }');
    if (!/^\d+(\.\d+)?%$/.test(tog)) throw new Error(`Sakai menu: toggler font-size ${tog} is not a percent; update export-tokens.mjs`);
    S('layout.menu.toggler.size', `${parseFloat(tog) / 100}rem`, `.layout-submenu-toggler { font-size: ${tog} } of the 1rem link text`);
    S('layout.menu.item.active-font-weight', mget(/&\.active-route\s*\{\s*font-weight:\s*([^;]+);/, '.active-route { font-weight }'), 'ul a.active-route { font-weight }');
    S('layout.menu.submenu.indent', mget(/overflow: hidden;[\s\S]*?li\s*\{\s*a\s*\{\s*margin-left:\s*([^;]+);/, 'ul ul li a { margin-left }'), 'ul ul li a { margin-left } (first nested level)');
    add('typography.strong.font-weight', '700', 'browser default: b, strong { font-weight: bold } (Sakai content uses <b>, e.g. the Divider "OR")');
    // Sakai layout card (#100): .card in _utils.scss; card title = the Tailwind classes Sakai pages use ('font-semibold text-xl mb-4')
    const SAKAI_UTILS = 'src/assets/layout/_utils.scss';
    const ucss = await readFile(SAKAI_UTILS, 'utf8');
    const card = (ucss.match(/\n\.card\s*\{([^{}]*)/) || [])[1];
    if (!card) throw new Error(`Sakai card: .card { } not found in ${SAKAI_UTILS}. Sakai changed; update export-tokens.mjs.`);
    const cprop = (pr) => { const m = card.match(new RegExp(`(?:^|[;\\s])${pr}\\s*:\\s*([^;]+);`)); if (!m) throw new Error(`Sakai card: .card { ${pr} } not found`); return m[1].trim(); };
    add('layout.card.padding', cprop('padding'), `${SAKAI_UTILS}: .card { padding }`);
    add('layout.card.gap', cprop('margin-bottom'), `${SAKAI_UTILS}: .card { margin-bottom } (space between stacked cards)`);
    const TW = 'Sakai page markup (Tailwind): <div class="font-semibold text-xl mb-4"> card title';
    add('layout.card.title.font-size', '1.25rem', `${TW}: text-xl font-size`);
    add('layout.card.title.line-height', '1.4', `${TW}: text-xl line-height 1.75rem / 1.25rem`);
    add('layout.card.title.font-weight', '600', `${TW}: font-semibold`);
    add('layout.card.title.margin-bottom', '1rem', `${TW}: mb-4`);
    // Sakai DataView demo (#102): item text = Tailwind classes in listdemo (text-sm / text-lg / text-xl / text-2xl, font-medium / font-semibold)
    const DV = 'Sakai List demo (Tailwind)';
    add('layout.dataview.meta.font-size', '0.875rem', `${DV}: text-sm (category, rating)`);
    add('layout.dataview.meta.line-height', '1.4286', `${DV}: text-sm line-height 1.25rem / 0.875rem`);
    add('layout.dataview.meta.font-weight', '500', `${DV}: font-medium`);
    add('layout.dataview.name.font-size', '1.125rem', `${DV}: text-lg (product name)`);
    add('layout.dataview.name.line-height', '1.5556', `${DV}: text-lg line-height 1.75rem / 1.125rem`);
    add('layout.dataview.name.font-weight', '500', `${DV}: font-medium`);
    add('layout.dataview.price.font-size', '1.25rem', `${DV}: text-xl (list price)`);
    add('layout.dataview.price.line-height', '1.4', `${DV}: text-xl line-height 1.75rem / 1.25rem`);
    add('layout.dataview.price.font-weight', '600', `${DV}: font-semibold`);
    add('layout.dataview.price-lg.font-size', '1.5rem', `${DV}: text-2xl (grid price)`);
    add('layout.dataview.price-lg.line-height', '1.3333', `${DV}: text-2xl line-height 2rem / 1.5rem`);
    // Charts (#102): Chart.js draws its own text (Chart.defaults.font: 12px, line-height 1.2); Figma uses Lato (user choice) and the docs tell devs to set Chart.defaults.font.family
    const CJ = 'Chart.js defaults (canvas text, not CSS)';
    add('layout.chart.font-size', '12px', `${CJ}: Chart.defaults.font.size`);
    add('layout.chart.line-height', '1.2', `${CJ}: Chart.defaults.font.lineHeight`);
    add('layout.chart.tick-font-weight', '500', 'Sakai Chart demo: bar x-axis ticks font { weight: 500 }');
    return { tokens: t, fallback: families.slice(1).join(', ') };
}
const sakai = await sakaiTypography();
for (const [p, v] of Object.entries(sakai.tokens)) {
    if (semantic[p]) throw new Error(`Sakai typography token ${p} clashes with an Aura semantic token`);
    semantic[p] = v;
}

// ---------- path index for alias resolution ----------
const index = new Map(); // dotted -> { collection, path }
const register = (collection, tokens) => {
    for (const p of Object.keys(tokens)) {
        const d = dotted(p);
        if (index.has(d)) throw new Error(`Ambiguous token path ${p} (${collection}) clashes with ${index.get(d).path} (${index.get(d).collection})`);
        index.set(d, { collection, path: p });
    }
};
register('primitives', primitives);
register('semantic', semantic);
for (const [c, t] of Object.entries(components)) register(`components.${c}`, t);

const REF = /\{([^}]+)\}/g;
const report = { unresolved: [], componentToPrimitive: [], composite: [], semanticWithRaw: [] };

function rewrite(value, where) {
    return value.replace(REF, (_, ref) => {
        const hit = index.get(ref);
        if (!hit) {
            report.unresolved.push({ token: where, ref });
            return `{${ref}}`;
        }
        return `{${hit.path}}`;
    });
}
const refsOf = (v) => [...v.matchAll(REF)].map((m) => m[1]);
const isPureAlias = (v) => /^\{[^}]+\}$/.test(v.trim());

// ---------- value resolution (for $type, px and validation) ----------
const lookup = (path) => primitives[path] ?? semantic[path] ?? Object.values(components).find((t) => t[path])?.[path];
function resolveValue(path, mode, seen = []) {
    if (seen.includes(path)) throw new Error(`Alias cycle: ${[...seen, path].join(' -> ')}`);
    const t = lookup(path);
    if (!t) return undefined;
    const raw = t[mode] ?? t.common;
    if (raw === undefined) return undefined;
    // raw values still use PrimeNG's dotted alias form ({form.field.padding.x}); map to our path first
    return raw.replace(REF, (_, ref) => resolveValue(index.get(ref)?.path ?? ref, mode, [...seen, path]) ?? `{${ref}}`);
}

function typeOf(path, resolved) {
    const leaf = path.split('.').pop();
    if (/shadow/.test(path)) return 'shadow';
    if (/font-weight/.test(path)) return 'fontWeight';
    if (/font-family/.test(path)) return 'fontFamily';
    if (/line-height/.test(path)) return 'number';
    if (/opacity/.test(path)) return 'number';
    if (/duration/.test(path)) return 'duration';
    if (/(^|-)style$/.test(leaf)) return 'strokeStyle';
    if (/^(#|rgba?\(|hsla?\(|color-mix\(|transparent$)/i.test(resolved)) return 'color';
    if (/^-?[\d.]+(rem|px|em)?$/.test(resolved) && /width|height|size|radius|padding|gap|offset|gutter|margin|blur|indent/.test(path)) return 'dimension'; // blur: toast.blur (#94); indent: layout.menu.submenu.indent (#97)
    if (/^(-?[\d.]+(rem|px|em)?\s+)+-?[\d.]+(rem|px|em)?$/.test(resolved)) return 'dimension';
    return 'string';
}
const toPx = (v) => {
    const parts = v.trim().split(/\s+/).map((x) => {
        const m = x.match(/^(-?[\d.]+)(rem|px|em)?$/);
        if (!m) return null;
        const n = parseFloat(m[1]);
        return m[2] === 'rem' || m[2] === 'em' ? +(n * ROOT_FONT_PX).toFixed(3) : n;
    });
    if (parts.some((x) => x === null)) return undefined;
    return parts.length === 1 ? parts[0] : parts;
};

// ---------- build output tree ----------
function setDeep(tree, path, leaf) {
    const segs = path.split('.');
    let n = tree;
    for (const s of segs.slice(0, -1)) {
        n[s] ??= {};
        if ('$value' in n[s]) throw new Error(`Token ${path} would nest under another token`);
        n = n[s];
    }
    n[segs.at(-1)] = leaf;
}

const counts = {};
function build(collection, tokens) {
    const tree = {};
    let n = 0;
    for (const [path, t] of Object.entries(tokens).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))) {
        const modes = t.common !== undefined ? null : MODES.filter((m) => t[m] !== undefined);
        const raw = modes ? Object.fromEntries(modes.map((m) => [m, rewrite(t[m], path)])) : rewrite(t.common, path);
        const resolved = Object.fromEntries(MODES.map((m) => [m, resolveValue(path, m)]));
        const type = typeOf(path, resolved.light ?? resolved.dark);
        const ext = sakaiSource[path]
            ? { cssVar: null, source: 'sakai', sakai: sakaiSource[path], ...(path === 'font-family' && sakai.fallback ? { fallback: sakai.fallback } : {}) }
            : { cssVar: cssVar(path) };
        if (type === 'dimension') {
            const px = Object.fromEntries(MODES.map((m) => [m, toPx(resolved[m])]));
            ext.px = JSON.stringify(px.light) === JSON.stringify(px.dark) ? px.light : px;
        }
        ext.resolved = resolved.light === resolved.dark ? resolved.light : resolved;
        const values = modes ? Object.values(raw) : [raw];
        if (values.some((v) => !isPureAlias(v) && refsOf(v).length)) {
            ext.composite = true;
            report.composite.push(path);
        } else if (type === 'dimension' && values.some((v) => !isPureAlias(v) && v.trim().includes(' '))) {
            ext.composite = true;
            report.composite.push(path);
        }
        if (collection.startsWith('components')) {
            for (const v of values) for (const r of refsOf(v)) if (index.get(r)?.collection === 'primitives' || primitives[r]) report.componentToPrimitive.push({ token: path, ref: r });
        }
        setDeep(tree, path, { $type: type, $value: raw, $extensions: { primeng: ext } });
        n++;
    }
    counts[collection] = n;
    return tree;
}

const out = {
    $description: 'PrimeNG Aura design tokens for the Base design system. Generated by app/sakai-ng/scripts/export-tokens.mjs. Do not edit by hand; change the preset or the script and re-run.',
    $metadata: {
        generated: new Date().toISOString(),
        source: '@primeuix/themes/aura (+ Sakai layout SCSS for font-family and typography.*, marked source: "sakai")',
        versions: await versions(),
        rootFontSizePx: ROOT_FONT_PX,
        modes: MODES,
        components: COMPONENTS,
        format: 'See tokens/README.md. $value is either one value (same in all modes) or { light, dark }. Aliases use {path} with paths as written in this file.'
    },
    primitives: build('primitives', primitives),
    semantic: build('semantic', semantic),
    components: Object.assign({}, ...Object.entries(components).map(([c, t]) => build(`components.${c}`, t)))
};
out.$metadata.counts = counts;
out.$metadata.findings = {
    componentTokensReferencingPrimitives: report.componentToPrimitive,
    compositeValues: report.composite,
    unresolvedAliases: report.unresolved
};

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`Wrote ${OUT}`);
console.log(`Tokens: ${total}  ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join('  ')}`);
console.log(`Findings: ${report.componentToPrimitive.length} component→primitive refs, ${report.composite.length} composite values, ${report.unresolved.length} unresolved aliases`);
if (report.unresolved.length) {
    console.error('Unresolved aliases:', report.unresolved);
    process.exitCode = 1;
}

async function versions() {
    const v = async (p) => JSON.parse(await readFile(join(APP, 'node_modules', p, 'package.json'), 'utf8')).version;
    return { '@primeuix/themes': await v('@primeuix/themes'), primeng: await v('primeng') };
}
