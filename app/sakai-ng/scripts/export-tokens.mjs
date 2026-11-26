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
const COMPONENTS = arg('components', 'button,inputtext,tag,badge,textarea,select,inputnumber,checkbox,radiobutton,toggleswitch,password,iconfield,message,datepicker,datatable,paginator,toolbar,splitbutton,dialog,confirmdialog,toast,menu').split(','); // batch 2: datatable + paginator (#80), toolbar + splitbutton (#89/#90), dialog + confirmdialog (#91–#93), toast (#94), menu (#95) // batch 1 added 2026-11-24 (#60)
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
    if (/^-?[\d.]+(rem|px|em)?$/.test(resolved) && /width|height|size|radius|padding|gap|offset|gutter|margin|blur/.test(path)) return 'dimension'; // blur: toast.blur (#94)
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
