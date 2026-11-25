#!/usr/bin/env node
/**
 * Figma variable procedure: PILOT_CHECKLIST Day 4.3 / 4.4, Day 6.1.
 * Turns tokens/base/tokens.json (optionally + a theme file) into:
 *   tokens/figma/plan.json           every variable / effect style that will exist in Figma (human-readable)
 *   tokens/figma/calls/NN-*.js       exact code for the Figma MCP `use_figma` tool, run in file order
 * The Figma code UPSERTS BY NAME: it creates what is missing and updates what changed, never duplicates,
 * never deletes (variables not in the plan are only reported). Re-running it is the "update in place" test.
 * Rules (tokens/README.md section 7):
 *   name      = token path with '.' -> '/'
 *   color-mix = alias to the mixed color + a FLOAT '<name>-opacity' variable per mode (DECISIONS #24)
 *   'a b' / 'a b c d' paddings = split into '<name>-y'/'-x' or '-top'/'-right'/'-bottom'/'-left' (DECISIONS #24)
 *   shadow    = effect style (Figma has no shadow variables); 'none' = no style
 *   typography = font-family STRING + size/weight FLOAT variables, and text styles bound to them (text-styles.mjs, DECISIONS #28)
 *
 * Usage (from app/sakai-ng): npm run figma:plan [-- --tokens=<file>] [--theme=<file>] [--out=<dir>]
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEXT_STYLES, WEIGHT_STYLE } from './text-styles.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..');
const arg = (n, d) => {
    const a = process.argv.find((x) => x.startsWith(`--${n}=`));
    return a ? a.slice(n.length + 3) : d;
};
const TOKENS = resolve(APP, arg('tokens', '../../tokens/base/tokens.json'));
const THEME = arg('theme', '') ? resolve(APP, arg('theme')) : null;
const OUT = resolve(APP, arg('out', '../../tokens/figma'));
const MAX_CHARS = 44000; // use_figma code limit is 50,000 characters

const tokens = JSON.parse(await readFile(TOKENS, 'utf8'));
const PX = tokens.$metadata.rootFontSizePx;

// ---------- collect leaves ----------
const leaves = []; // { col, path, node }
const walk = (t, col, p = '') => {
    for (const [k, v] of Object.entries(t)) {
        if (k.startsWith('$')) continue;
        if (v && typeof v === 'object' && '$value' in v) leaves.push({ col, path: p + k, node: v });
        else if (v && typeof v === 'object') walk(v, col, p + k + '.');
    }
};
for (const col of ['primitives', 'semantic', 'components']) walk(tokens[col], col);

// ---------- theme overrides (values only) ----------
if (THEME) {
    const theme = JSON.parse(await readFile(THEME, 'utf8'));
    const byKey = new Map(leaves.map((l) => [`${l.col}:${l.path}`, l]));
    const tw = (t, col, p = '') => {
        for (const [k, v] of Object.entries(t)) {
            if (k.startsWith('$')) continue;
            if (v && typeof v === 'object' && '$value' in v) {
                const l = byKey.get(`${col}:${p + k}`);
                if (!l) throw new Error(`Theme overrides unknown token ${col}.${p + k}`);
                const isModes = (x) => x && typeof x === 'object';
                if (isModes(v.$value) !== isModes(l.node.$value)) throw new Error(`Theme changes the shape of ${p + k}`);
                l.node = { ...l.node, $value: v.$value };
            } else if (v && typeof v === 'object') tw(v, col, p + k + '.');
        }
    };
    for (const col of ['primitives', 'semantic', 'components']) if (theme[col]) tw(theme[col], col);
}

const COLLECTION = { primitives: 'Primitives', semantic: 'Semantic', components: 'Components' };
const MODES = { primitives: ['Value'], semantic: ['Light', 'Dark'], components: ['Light', 'Dark'] };
const fname = (path) => path.replace(/\./g, '/');
const known = new Set(leaves.map((l) => l.path));

// ---------- value parsing ----------
const ALIAS = /^\{([^}]+)\}$/;
const MIX = /^color-mix\(in srgb,\s*\{([^}]+)\},\s*transparent\s+(\d+(?:\.\d+)?)%\)$/; // spacing varies in Aura (message tokens have none)
const r4 = (x) => Math.round(x * 10000) / 10000;
function color(s) {
    s = s.trim();
    if (s === 'transparent') return [0, 0, 0, 0];
    let m = s.match(/^#([0-9a-f]{3,8})$/i);
    if (m) {
        let h = m[1];
        if (h.length <= 4) h = [...h].map((c) => c + c).join('');
        const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
        return [r4(n(0)), r4(n(2)), r4(n(4)), h.length === 8 ? r4(n(6)) : 1];
    }
    m = s.match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
        const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
        return [r4(p[0] / 255), r4(p[1] / 255), r4(p[2] / 255), p[3] ?? 1];
    }
    m = s.match(/^color-mix\(in srgb,\s*(.+?),\s*transparent\s+(\d+(?:\.\d+)?)%\)$/i);
    if (m) { const c = color(m[1]); return [c[0], c[1], c[2], r4(c[3] * (1 - Number(m[2]) / 100))]; } // resolved shadow colours (batch 1)
    throw new Error(`Unsupported color "${s}"`);
}
const dims = (s) =>
    s.trim().split(/\s+/).map((x) => {
        const m = x.match(/^(-?[\d.]+)(rem|px|em)?$/);
        if (!m) throw new Error(`Unsupported dimension "${s}"`);
        return r4(m[2] === 'rem' || m[2] === 'em' ? parseFloat(m[1]) * PX : parseFloat(m[1]));
    });
const seconds = (s) => {
    const m = s.trim().match(/^([\d.]+)(ms|s)$/);
    if (!m) throw new Error(`Unsupported duration "${s}"`);
    return m[2] === 'ms' ? parseFloat(m[1]) / 1000 : parseFloat(m[1]);
};

// ---------- scopes (key -> Figma scopes, expanded in the Figma code) ----------
function scopeKey(col, path, type) {
    const leaf = path.split('.').at(-1);
    if (col === 'primitives') return 'h';
    if (type === 'COLOR') {
        if (col === 'semantic') return 'sem';
        if (/border-color$|^border-color|focus-ring\.color$/.test(path) || /border-color/.test(leaf)) return 'st';
        if (/background/.test(leaf)) return 'bg';
        return 'tx';
    }
    if (type === 'STRING') return /font-family/.test(leaf) ? 'ff' : 'h';
    if (/opacity/.test(leaf)) return 'op';
    if (/font-weight/.test(leaf)) return 'fw';
    if (/font-size/.test(leaf)) return 'fs';
    if (/line-height/.test(leaf)) return 'h'; // ratio, not px: keep out of pickers
    if (/duration/.test(leaf)) return 'h';
    if (/radius/.test(leaf)) return 'r';
    if (/focus-ring\.width$/.test(path)) return 'sw';
    if (/offset/.test(leaf)) return 'h';
    if (/padding|gap|gutter/.test(path.split('.').slice(-2).join('.'))) return 'g';
    if (/width|height|size/.test(leaf)) return 'wh';
    return 'h';
}

// ---------- build plan ----------
const plan = { collections: {}, effectStyles: [], skipped: [], derived: [] };
for (const c of Object.keys(COLLECTION)) plan.collections[c] = [];

const add = (col, v) => {
    if (plan.collections[col].some((x) => x.name === v.name)) throw new Error(`Duplicate Figma name ${v.name}`);
    plan.collections[col].push(v);
};
const perMode = (col, val) => {
    const modes = MODES[col];
    if (val && typeof val === 'object') {
        // tokens use light/dark keys
        return Object.fromEntries(modes.map((m) => [m, val[m.toLowerCase()]]));
    }
    return Object.fromEntries(modes.map((m) => [m, val]));
};
const aliasName = (ref) => {
    if (!known.has(ref)) throw new Error(`Alias to unknown token ${ref}`);
    return fname(ref);
};
const shadowFx = (s) => {
    if (s.trim() === 'none') return [];
    const parts = [];
    let depth = 0, cur = '';
    for (const ch of s) {
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
    }
    parts.push(cur);
    return parts
        .map((p) => {
            const t = p.trim();
            const inset = /^inset\s/.test(t);
            const body = t.replace(/^inset\s+/, '');
            const cm = body.match(/(color-mix\(in srgb,[^()]*(?:\([^)]*\))?[^()]*\)|#[0-9a-f]{3,8}|rgba?\([^)]*\)|transparent)\s*$/i);
            const col = cm ? color(cm[1]) : [0, 0, 0, 1];
            const nums = dims(body.slice(0, cm ? cm.index : undefined).trim() || '0');
            const [x, y, blur = 0, spread = 0] = nums;
            return { type: inset ? 'INNER_SHADOW' : 'DROP_SHADOW', x, y, blur, spread, color: col };
        })
        .filter((e) => !(e.color[3] === 0 && e.x === 0 && e.y === 0 && e.blur === 0 && e.spread === 0));
};
const resolvedOf = (l) => l.node.$extensions.primeng.resolved;

for (const l of leaves) {
    const { col, path, node } = l;
    const name = fname(path);
    const type = node.$type;
    const raw = node.$value;
    const css = node.$extensions.primeng.cssVar;
    const modes = MODES[col];
    const vals = perMode(col, raw);
    const src = node.$extensions.primeng.source === 'sakai' ? `Not a PrimeNG token (no CSS variable). Source: ${node.$extensions.primeng.sakai}.` : '';

    if (type === 'shadow') {
        // resolve aliases through the token set's resolved values (shadows can't alias in Figma)
        const res = perMode(col, resolvedOf(l));
        const fx = Object.fromEntries(modes.map((m) => [m, shadowFx(res[m])]));
        const same = modes.every((m) => JSON.stringify(fx[m]) === JSON.stringify(fx[modes[0]]));
        if (modes.every((m) => fx[m].length === 0)) {
            plan.skipped.push({ token: path, reason: 'shadow is "none": no effect style needed' });
            continue;
        }
        const desc = `Token ${path} (${css})` + (ALIAS.test(String(raw)) ? `, alias of ${String(raw).slice(1, -1)}` : '');
        if (same) plan.effectStyles.push({ name, effects: fx[modes[0]], description: desc });
        else for (const m of modes) plan.effectStyles.push({ name: `${name} (${m})`, effects: fx[m], description: `${desc}, ${m} mode` });
        continue;
    }

    if (type === 'color') {
        let opacity = null;
        const out = {};
        for (const m of modes) {
            const v = vals[m];
            let mm;
            if ((mm = v.match(ALIAS))) out[m] = { a: aliasName(mm[1]) };
            else if ((mm = v.match(MIX))) {
                out[m] = { a: aliasName(mm[1]) };
                opacity ??= Object.fromEntries(modes.map((x) => [x, 1]));
                opacity[m] = r4(1 - parseFloat(mm[2]) / 100);
            } else if (/color-mix/.test(v)) throw new Error(`Unsupported color-mix in ${path}: ${v}`);
            else out[m] = color(v);
        }
        const desc = opacity ? `Aura: ${css} uses color-mix (transparent overlay). Apply with layer opacity bound to ${name}-opacity.` : '';
        add(col, { name, type: 'COLOR', scope: scopeKey(col, path, 'COLOR'), values: out, codeSyntax: css, description: desc });
        if (opacity) {
            const oname = `${path}-opacity`;
            if (known.has(oname)) throw new Error(`Derived name clash ${oname}`);
            add(col, { name: fname(oname), type: 'FLOAT', scope: 'op', values: opacity, codeSyntax: null, description: `Derived from ${css}: opacity of the color-mix per mode (100 = no mix).` });
            plan.derived.push({ token: path, derived: oname, rule: 'color-mix opacity' });
        }
        continue;
    }

    if (type === 'dimension') {
        const outs = {};
        let parts = null;
        for (const m of modes) {
            const v = vals[m];
            const mm = v.match(ALIAS);
            if (mm) {
                const target = leaves.find((x) => x.path === mm[1]);
                const tv = target && (typeof target.node.$value === 'object' ? target.node.$value[m.toLowerCase()] : target.node.$value);
                const tn = tv ? String(tv).trim().split(/\s+/).length : 1;
                if (tn > 1) {
                    // alias to a multi-value token (e.g. padding "y x"): alias each part to the target's split variables
                    const ts = tn === 2 ? ['y', 'x'] : tn === 4 ? ['top', 'right', 'bottom', 'left'] : null;
                    if (!ts) throw new Error(`${path} aliases ${tn}-value ${mm[1]}`);
                    aliasName(mm[1]);
                    outs[m] = ts.map((s) => ({ a: fname(`${mm[1]}-${s}`) }));
                } else outs[m] = [{ a: aliasName(mm[1]) }];
            } else outs[m] = dims(v);
            const n = outs[m].length;
            if (parts !== null && parts !== n) throw new Error(`${path}: different value counts per mode`);
            parts = n;
        }
        if (parts === 1) {
            add(col, { name, type: 'FLOAT', scope: scopeKey(col, path, 'FLOAT'), values: Object.fromEntries(modes.map((m) => [m, outs[m][0]])), codeSyntax: css, description: src });
            continue;
        }
        const sides = parts === 2 ? ['y', 'x'] : parts === 4 ? ['top', 'right', 'bottom', 'left'] : null;
        if (!sides) throw new Error(`${path}: ${parts}-value dimension not supported`);
        sides.forEach((s, i) => {
            const dpath = `${path}-${s}`;
            if (known.has(dpath)) throw new Error(`Derived name clash ${dpath}`);
            add(col, { name: fname(dpath), type: 'FLOAT', scope: 'g', values: Object.fromEntries(modes.map((m) => [m, outs[m][i]])), codeSyntax: null, description: `Derived from ${css} (${parts}-value shorthand, ${s}).` });
            plan.derived.push({ token: path, derived: dpath, rule: `${parts}-value split` });
        });
        continue;
    }

    if (type === 'string' && /border-radius$/.test(path) && Object.values(vals).every((v) => /^\d+(\.\d+)?%$/.test(String(v).trim()))) {
        // percent radius (50% = circle): Figma variables can't hold percent; the component draws the circle itself (like Badge Circle, #47)
        plan.skipped.push({ token: path, reason: `percent radius ${Object.values(vals)[0]}: built as a circle in the component` });
        continue;
    }
    const conv = { fontWeight: Number, number: Number, duration: seconds, strokeStyle: String, fontFamily: String }[type];
    if (!conv) throw new Error(`No Figma rule for $type ${type} (${path})`);
    const ftype = type === 'strokeStyle' || type === 'fontFamily' ? 'STRING' : 'FLOAT';
    const out = {};
    for (const m of modes) {
        const v = vals[m];
        const mm = v.match(ALIAS);
        out[m] = mm ? { a: aliasName(mm[1]) } : conv(v);
    }
    const desc = [
        type === 'duration' ? 'Seconds. Not used by static Figma components; kept for code parity.' : '',
        /line-height/.test(path) ? 'CSS unitless ratio. Text styles use it as a percent line height (1.5 = 150%).' : '',
        src
    ].filter(Boolean).join(' ');
    add(col, { name, type: ftype, scope: scopeKey(col, path, ftype), values: out, codeSyntax: css, description: desc });
}

// ---------- derived: focus-ring corner radius (DECISIONS #34) ----------
// The browser draws `outline: <width> solid; outline-offset: <offset>` around a rounded box with radius + offset + width.
{
    // follow aliases through the (possibly themed) $value, per mode: a theme that changes the radius must move the ring too (Day 6.1 finding)
    const num = (p, m) => { const l = leaves.find((x) => x.path === p); if (!l) throw new Error(`Derived focus radius: ${p} missing`); let v = l.node.$value; if (v && typeof v === 'object') v = v[m.toLowerCase()]; const mm = String(v).match(ALIAS); return mm ? num(mm[1], m) : dims(v)[0]; };
    for (const [name, base] of [['button.focus-ring-radius', 'button.border-radius'], ['button.rounded-focus-ring-radius', 'button.rounded-border-radius']]) {
        if (known.has(name)) throw new Error(`Derived name clash ${name}`);
        const values = Object.fromEntries(MODES.components.map((m) => [m, r4(num(base, m) + num('button.focus-ring.offset', m) + num('button.focus-ring.width', m))]));
        add('components', { name: fname(name), type: 'FLOAT', scope: 'r', values, codeSyntax: null, description: `Derived (no CSS variable): ${base} + button.focus-ring.offset + button.focus-ring.width. Radius of the focus outline as the browser draws it.` });
        plan.derived.push({ token: base, derived: name, rule: 'focus-ring radius' });
    }
}
// derived (Group B, DECISIONS #70/#71): Checkbox focus-ring radius (same rule as Button) and ToggleSwitch design-only sizes
{
    const num = (p, m, i = 0) => { const l = leaves.find((x) => x.path === p); if (!l) throw new Error(`Derived Group B: ${p} missing`); let v = l.node.$value; if (v && typeof v === 'object') v = v[m.toLowerCase()]; const mm = String(v).match(ALIAS); if (mm) return num(mm[1], m, i); const d = dims(v); return d[Math.min(i, d.length - 1)]; };
    const STEP = 3.5; // 0.25rem
    for (const [name, f, scope, rule] of [
        ['checkbox.focus-ring-radius', (m) => num('checkbox.border-radius', m) + num('checkbox.focus-ring.offset', m) + num('checkbox.focus-ring.width', m), 'r', 'checkbox.border-radius + checkbox.focus-ring.offset + checkbox.focus-ring.width. Radius of the focus outline as the browser draws it'],
        ['select.option.check-padding-left', (m) => num('select.option.padding', m, 1) + num('select.checkmark.gutter-start', m), 'g', 'select.option.padding (x) + select.checkmark.gutter-start (negative). Left padding of an option row in checkmark mode (.p-select-option-check-icon margin-inline-start)'],
        ['toggleswitch.sm.width', (m) => num('toggleswitch.width', m) - 2 * STEP, 'wh', 'DESIGN-ONLY, not in Aura or code (#71): toggleswitch.width − 0.5rem'],
        ['toggleswitch.sm.height', (m) => num('toggleswitch.height', m) - STEP, 'wh', 'DESIGN-ONLY, not in Aura or code (#71): toggleswitch.height − 0.25rem'],
        ['toggleswitch.sm.handle-size', (m) => num('toggleswitch.handle.size', m) - STEP, 'wh', 'DESIGN-ONLY, not in Aura or code (#71): toggleswitch.handle.size − 0.25rem'],
        ['toggleswitch.lg.width', (m) => num('toggleswitch.width', m) + 2 * STEP, 'wh', 'DESIGN-ONLY, not in Aura or code (#71): toggleswitch.width + 0.5rem'],
        ['toggleswitch.lg.height', (m) => num('toggleswitch.height', m) + STEP, 'wh', 'DESIGN-ONLY, not in Aura or code (#71): toggleswitch.height + 0.25rem'],
        ['toggleswitch.lg.handle-size', (m) => num('toggleswitch.handle.size', m) + STEP, 'wh', 'DESIGN-ONLY, not in Aura or code (#71): toggleswitch.handle.size + 0.25rem']
    ]) {
        if (known.has(name)) throw new Error(`Derived name clash ${name}`);
        add('components', { name: fname(name), type: 'FLOAT', scope, values: Object.fromEntries(MODES.components.map((m) => [m, r4(f(m))])), codeSyntax: null, description: `Derived (no CSS variable): ${rule}.` });
        plan.derived.push({ token: name, derived: name, rule: 'group b' });
    }
}
// derived: padding of a field next to an inline icon or button (Group A, DECISIONS #61). Aura CSS uses base form-field values for every size.
{
    const num = (p, m) => { const l = leaves.find((x) => x.path === p); if (!l) throw new Error(`Derived field padding: ${p} missing`); let v = l.node.$value; if (v && typeof v === 'object') v = v[m.toLowerCase()]; const mm = String(v).match(ALIAS); return mm ? num(mm[1], m) : dims(v)[0]; };
    for (const [name, f, rule] of [
        ['iconfield.input-padding', (m) => num('form-field.padding-x', m) * 2 + num('icon-size', m), 'form-field.padding-x × 2 + icon-size (.p-iconfield .p-inputtext padding on the icon side)'],
        ['password.input-padding', (m) => num('form-field.padding-x', m) * 2 + num('icon-size', m), 'form-field.padding-x × 2 + icon-size (.p-password:has(toggle-mask) .p-password-input padding-inline-end)'],
        ['datepicker.input-padding', (m) => num('form-field.padding-x', m) * 2 + num('icon-size', m), 'form-field.padding-x × 2 + icon-size (.p-datepicker:has(.p-datepicker-input-icon-container) .p-datepicker-input padding-inline-end)'],
        ['inputnumber.stacked-input-padding', (m) => num('inputnumber.button.width', m) + num('form-field.padding-x', m), 'inputnumber.button.width + form-field.padding-x (.p-inputnumber-stacked .p-inputnumber-input padding-inline-end)']
    ]) {
        if (known.has(name)) throw new Error(`Derived name clash ${name}`);
        add('components', { name: fname(name), type: 'FLOAT', scope: 'g', values: Object.fromEntries(MODES.components.map((m) => [m, r4(f(m))])), codeSyntax: null, description: `Derived (no CSS variable): ${rule}.` });
        plan.derived.push({ token: name, derived: name, rule: 'field padding' });
    }
}
// derived: label line height in px per size = font-size × typography.base.line-height (PrimeNG keeps it on icon-only
// buttons with a hidden ::after nbsp; Figma keeps it with an icon slot bound to this height). DECISIONS #34.
{
    const res = (p, m) => { const l = leaves.find((x) => x.path === p); if (!l) throw new Error(`Derived line height: ${p} missing`); let v = l.node.$value; if (v && typeof v === 'object') v = v[m.toLowerCase()]; const mm = String(v).match(ALIAS); return mm ? res(mm[1], m) : v; }; // themed $value, as above
    for (const [name, size] of [['button.line-height', 'typography.base.font-size'], ['button.sm.line-height', 'button.sm.font-size'], ['button.lg.line-height', 'button.lg.font-size']]) {
        if (known.has(name)) throw new Error(`Derived name clash ${name}`);
        const values = Object.fromEntries(MODES.components.map((m) => [m, r4(dims(res(size, m))[0] * Number(res('typography.base.line-height', m)))]));
        add('components', { name: fname(name), type: 'FLOAT', scope: 'h', values, codeSyntax: null, description: `Derived (no CSS variable): ${size} × typography.base.line-height, in px. Height of the label line; keeps icon-only buttons as tall as in code.` });
        plan.derived.push({ token: size, derived: name, rule: 'label line height' });
    }
}

// ---------- colors that alias a color-mix token inherit its opacity (as an alias to the source's -opacity) ----------
for (let changed = true; changed; ) {
    changed = false;
    const opacityNames = new Set(Object.values(plan.collections).flat().filter((v) => v.type === 'FLOAT' && v.name.endsWith('-opacity')).map((v) => v.name));
    for (const col of Object.keys(plan.collections)) {
        for (const v of [...plan.collections[col]]) {
            if (v.type !== 'COLOR' || opacityNames.has(`${v.name}-opacity`)) continue;
            const modes = MODES[col];
            const src = modes.map((m) => v.values[m]?.a && opacityNames.has(`${v.values[m].a}-opacity`) ? `${v.values[m].a}-opacity` : null);
            if (src.every((s) => !s)) continue;
            add(col, { name: `${v.name}-opacity`, type: 'FLOAT', scope: 'op', values: Object.fromEntries(modes.map((m, i) => [m, src[i] ? { a: src[i] } : 1])), codeSyntax: null, description: `Derived: opacity of ${v.name}, inherited from the color-mix token it aliases.` });
            v.description = `Aliases a color-mix token. Apply with layer opacity bound to ${v.name}-opacity.`;
            plan.derived.push({ token: v.name.replace(/\//g, '.'), derived: `${v.name.replace(/\//g, '.')}-opacity`, rule: 'inherited color-mix opacity' });
            changed = true;
        }
    }
}

// ---------- text styles (bound to the variables above) ----------
const leafOf = (p) => {
    const l = leaves.find((x) => x.path === p);
    if (!l) throw new Error(`Text style token ${p} not in tokens.json`);
    return l;
};
const final = (p, kind) => {
    // follow aliases through the (possibly themed) $value; light mode (typography is mode-independent)
    const l = leafOf(p);
    let v = l.node.$value;
    if (v && typeof v === 'object') {
        if (v.light !== v.dark) throw new Error(`Text style token ${p} differs per mode; text styles can't`);
        v = v.light;
    }
    const mm = String(v).match(ALIAS);
    if (mm) return final(mm[1], kind);
    return kind === 'dim' ? dims(v)[0] : kind === 'num' ? Number(v) : String(v);
};
plan.textStyles = TEXT_STYLES.map((t) => {
    const weight = final(t.weight, 'num');
    const style = WEIGHT_STYLE[weight];
    if (!style) throw new Error(`${t.name}: no Figma font style for weight ${weight}`);
    const ratio = final(t.lineHeight, 'num');
    const ref = (p) => `${fname(p)}${leafOf(p).node.$extensions.primeng.cssVar ? ` (${leafOf(p).node.$extensions.primeng.cssVar})` : ''}`;
    return {
        name: t.name,
        family: final(t.family, 'str'),
        style,
        size: final(t.size, 'dim'),
        lineHeightPercent: r4(ratio * 100),
        bind: { fontFamily: fname(t.family), fontSize: fname(t.size), fontWeight: fname(t.weight) },
        description: `CSS: ${t.css}. Size ${ref(t.size)}, weight ${ref(t.weight)}, line-height ${ratio} (${fname(t.lineHeight)}).`
    };
});

// ---------- opacity in percent (DECISIONS #41) ----------
// Figma applies a variable bound to layer opacity as a PERCENT (0-100); CSS opacity is a fraction (0-1). Like rem -> px,
// OPACITY-scoped variables are written x100 (0.6 -> 60). Aliases stay aliases (their target is converted too).
for (const vars of Object.values(plan.collections)) for (const v of vars) {
    if (v.type !== 'FLOAT' || v.scope !== 'op') continue;
    for (const m of Object.keys(v.values)) if (typeof v.values[m] === 'number') v.values[m] = r4(v.values[m] * 100);
    v.description = `${v.description ? v.description + ' ' : ''}Percent in Figma (CSS fraction x100).`.trim();
}

// ---------- order: alias targets inside a collection come first (so chunks never point forward) ----------
for (const col of Object.keys(plan.collections)) {
    const list = plan.collections[col];
    const byName = new Map(list.map((v) => [v.name, v]));
    const done = new Set(), out = [];
    const visit = (v, stack = []) => {
        if (done.has(v.name)) return;
        if (stack.includes(v.name)) throw new Error(`Alias cycle ${[...stack, v.name].join(' -> ')}`);
        for (const x of Object.values(v.values)) if (x && x.a && byName.has(x.a)) visit(byName.get(x.a), [...stack, v.name]);
        done.add(v.name);
        out.push(v);
    };
    list.forEach((v) => visit(v));
    plan.collections[col] = out;
}

// ---------- Figma-side code ----------
const UPSERT = `const SC={h:[],ff:['FONT_FAMILY'],sem:['ALL_FILLS','STROKE_COLOR'],bg:['FRAME_FILL','SHAPE_FILL'],tx:['TEXT_FILL','SHAPE_FILL'],st:['STROKE_COLOR'],r:['CORNER_RADIUS'],g:['GAP'],wh:['WIDTH_HEIGHT'],fs:['FONT_SIZE'],sw:['STROKE_FLOAT'],fw:['FONT_WEIGHT'],op:['OPACITY']};
const T={C:'COLOR',F:'FLOAT',S:'STRING'};
let col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===D.col);
let newCol=false;
if(!col){col=figma.variables.createVariableCollection(D.col);col.renameMode(col.modes[0].modeId,D.modes[0]);newCol=true;}
for(const m of D.modes) if(!col.modes.some(x=>x.name===m)) col.addMode(m);
const mid=Object.fromEntries(col.modes.map(m=>[m.name,m.modeId]));
const all=await figma.variables.getLocalVariablesAsync();
const byName=new Map();const dup=[];
for(const v of all){if(byName.has(v.name))dup.push(v.name);byName.set(v.name,v);}
const inCol=new Map(all.filter(v=>v.variableCollectionId===col.id).map(v=>[v.name,v]));
const errors=[];let created=0,updated=0,unchanged=0;const fresh=new Set();
for(const [n,t] of D.vars){let v=inCol.get(n);if(!v){if(byName.has(n)){errors.push(n+': name exists in another collection');continue;}v=figma.variables.createVariable(n,col,T[t]);inCol.set(n,v);byName.set(n,v);fresh.add(n);created++;}else if(v.resolvedType!==T[t])errors.push(n+': type '+v.resolvedType+' != '+T[t]);}
const k4=x=>Math.round(x*10000)/10000;
const eq=(a,b)=>{if(a&&typeof a==='object'&&a.type==='VARIABLE_ALIAS')return !!(b&&b.type==='VARIABLE_ALIAS'&&a.id===b.id);if(a&&typeof a==='object'&&'r' in a)return !!(b&&typeof b==='object'&&'r' in b)&&['r','g','b','a'].every(c=>k4(a[c])===k4(b[c]));if(typeof a==='number'&&typeof b==='number')return Math.abs(a-b)<1e-6;return a===b;};
for(const [n,t,sk,vals,cs,desc] of D.vars){const v=inCol.get(n);if(!v)continue;let ch=false;
const sc=SC[sk];if(JSON.stringify([...v.scopes].sort())!==JSON.stringify([...sc].sort())){v.scopes=sc;ch=true;}
const d=desc||'';if(v.description!==d){v.description=d;ch=true;}
const web=cs?'var('+cs+')':null;const curWeb=(v.codeSyntax&&v.codeSyntax.WEB)||null;
if(web&&curWeb!==web){v.setVariableCodeSyntax('WEB',web);ch=true;}else if(!web&&curWeb){v.removeVariableCodeSyntax('WEB');ch=true;}
for(const m of D.modes){const raw=(vals&&typeof vals==='object'&&!Array.isArray(vals)&&!('a' in vals))?vals[m]:vals;let val;
if(raw&&typeof raw==='object'&&!Array.isArray(raw)){const tg=byName.get(raw.a);if(!tg){errors.push(n+': alias target '+raw.a+' missing');continue;}val={type:'VARIABLE_ALIAS',id:tg.id};}
else if(Array.isArray(raw))val={r:raw[0],g:raw[1],b:raw[2],a:raw[3]};else val=raw;
if(!eq(val,v.valuesByMode[mid[m]])){v.setValueForMode(mid[m],val);ch=true;}}
if(!fresh.has(n)){ch?updated++:unchanged++;}}
const planNames=new Set(D.vars.map(x=>x[0]));
return {collection:D.col,chunk:D.chunk,modes:col.modes.map(m=>m.name),newCollection:newCol,inPlan:D.vars.length,created,updated,unchanged,collectionTotal:col.variableIds.length,errors,duplicateNames:dup.slice(0,10)};`;

const EFFECTS = `const styles=await figma.getLocalEffectStylesAsync();const byName=new Map(styles.map(s=>[s.name,s]));let created=0,updated=0,unchanged=0;const ids=[];
for(const [n,fx,desc,behind] of D.styles){let s=byName.get(n);let isNew=false;if(!s){s=figma.createEffectStyle();s.name=n;created++;isNew=true;}
const effects=fx.map(e=>({type:e[0],offset:{x:e[1],y:e[2]},radius:e[3],spread:e[4],color:{r:e[5][0],g:e[5][1],b:e[5][2],a:e[5][3]},visible:true,blendMode:'NORMAL',...(e[0]==='DROP_SHADOW'?{showShadowBehindNode:!!behind}:{})}));
const same=JSON.stringify(s.effects.map(e=>[e.type,e.offset.x,e.offset.y,e.radius,e.spread||0,!!e.showShadowBehindNode,Math.round(e.color.a*1e4)/1e4,Math.round(e.color.r*1e4)/1e4]))===JSON.stringify(effects.map(e=>[e.type,e.offset.x,e.offset.y,e.radius,e.spread,!!e.showShadowBehindNode,Math.round(e.color.a*1e4)/1e4,Math.round(e.color.r*1e4)/1e4]));
let ch=false;if(!same){s.effects=effects;ch=true;}if(s.description!==desc){s.description=desc;ch=true;}ids.push(s.id);if(!isNew){ch?updated++:unchanged++;}}
return {effectStyles:D.styles.length,created,updated,unchanged,styleIds:ids};`;

const TEXT = `const vars=await figma.variables.getLocalVariablesAsync();const vByName=new Map(vars.map(v=>[v.name,v]));
const avail=await figma.listAvailableFontsAsync();const errors=[];
const fonts=[...new Set(D.styles.map(s=>s[1]+'|'+s[2]))].map(x=>{const [family,style]=x.split('|');return {family,style};});
for(const f of fonts){if(!avail.some(a=>a.fontName.family===f.family&&a.fontName.style===f.style))errors.push('font not available: '+f.family+' '+f.style);}
if(errors.length)return {errors};
await Promise.all(fonts.map(f=>figma.loadFontAsync(f)));
const styles=await figma.getLocalTextStylesAsync();const byName=new Map(styles.map(s=>[s.name,s]));let created=0,updated=0,unchanged=0;const ids=[];const bound={};
for(const [n,family,style,size,lh,bind,desc] of D.styles){let s=byName.get(n);let isNew=false;if(!s){s=figma.createTextStyle();s.name=n;created++;isNew=true;}
let ch=false;
if(s.fontName.family!==family||s.fontName.style!==style){s.fontName={family,style};ch=true;}
if(Math.abs(s.fontSize-size)>1e-4){s.fontSize=size;ch=true;}
if(s.lineHeight.unit!=='PERCENT'||Math.abs(s.lineHeight.value-lh)>1e-3){s.lineHeight={unit:'PERCENT',value:lh};ch=true;}
if(s.letterSpacing.unit!=='PERCENT'||s.letterSpacing.value!==0){s.letterSpacing={unit:'PERCENT',value:0};ch=true;}
if(s.description!==desc){s.description=desc;ch=true;}
bound[n]={};
for(const [field,vn] of Object.entries(bind)){const v=vByName.get(vn);if(!v){errors.push(n+': variable '+vn+' missing');continue;}
const cur=s.boundVariables&&s.boundVariables[field];if(!cur||cur.id!==v.id){try{s.setBoundVariable(field,v);ch=true;}catch(e){errors.push(n+': bind '+field+' failed: '+e.message);continue;}}
bound[n][field]=vn;}
ids.push(s.id);if(!isNew){ch?updated++:unchanged++;}}
const after=(await figma.getLocalTextStylesAsync()).filter(s=>D.styles.some(x=>x[0]===s.name)).map(s=>[s.name,s.fontName.family,s.fontName.style,s.fontSize,s.lineHeight.value,Object.keys(s.boundVariables||{}).join(',')]);
return {textStyles:D.styles.length,created,updated,unchanged,errors,after};`;

const compactVal = (v) => (v && typeof v === 'object' && !Array.isArray(v) && !('a' in v) ? v : v);
function collapse(values, modes) {
    const first = JSON.stringify(values[modes[0]]);
    return modes.every((m) => JSON.stringify(values[m]) === first) ? values[modes[0]] : values;
}
const TYPE = { COLOR: 'C', FLOAT: 'F', STRING: 'S' };
const calls = [];
for (const col of Object.keys(plan.collections)) {
    const modes = MODES[col];
    const rows = plan.collections[col].map((v) => [v.name, TYPE[v.type], v.scope, compactVal(collapse(v.values, modes)), v.codeSyntax || 0, v.description || 0]);
    let chunk = [], n = 1;
    const flush = () => {
        if (!chunk.length) return;
        const D = { col: COLLECTION[col], chunk: n, modes, vars: chunk };
        calls.push({ file: `${String(calls.length + 1).padStart(2, '0')}-${col}-${n}.js`, code: `const D=${JSON.stringify(D)};\n${UPSERT}` });
        chunk = [];
        n++;
    };
    for (const r of rows) {
        chunk.push(r);
        if (JSON.stringify(chunk).length + UPSERT.length + 200 > MAX_CHARS) {
            chunk.pop();
            flush();
            chunk.push(r);
        }
    }
    flush();
}
// Shadows drawn on elements that can be see-through (outlined/text buttons) need Figma's 'show behind transparent areas',
// or Figma draws no shadow at all (CSS box-shadow still draws around a transparent element). DECISIONS #40.
const SHOW_BEHIND = new Set([]); // #40 used it for button/raised-shadow; superseded by #42 (Raised is solid-only in Figma)
const styleRows = plan.effectStyles.map((s) => [s.name, s.effects.map((e) => [e.type, e.x, e.y, e.blur, e.spread, e.color]), s.description, SHOW_BEHIND.has(s.name)]);
calls.push({ file: `${String(calls.length + 1).padStart(2, '0')}-effect-styles.js`, code: `const D=${JSON.stringify({ styles: styleRows })};\n${EFFECTS}` });

const textRows = plan.textStyles.map((t) => [t.name, t.family, t.style, t.size, t.lineHeightPercent, t.bind, t.description]);
calls.push({ file: `${String(calls.length + 1).padStart(2, '0')}-text-styles.js`, code: `const D=${JSON.stringify({ styles: textRows })};\n${TEXT}` });

for (const c of calls) if (c.code.length > 50000) throw new Error(`${c.file} is ${c.code.length} chars (limit 50,000)`);

await mkdir(join(OUT, 'calls'), { recursive: true });
for (const c of calls) await writeFile(join(OUT, 'calls', c.file), c.code + '\n');
// overwrite in place (no delete); flag generated files this run no longer produces (99-verify.js is figma-verify.mjs's)
const stale = (await readdir(join(OUT, 'calls'))).filter((f) => /^\d\d-.*\.js$/.test(f) && f !== '99-verify.js' && !f.startsWith('06-icons') && !/^1[2-9]-/.test(f) && !f.startsWith('07-button') && !f.startsWith('07-badge') && !f.startsWith('08-inputtext') && !f.startsWith('09-tag') && !f.startsWith('10-theme') && !f.startsWith('10-textarea') && !f.startsWith('11-composite') && !f.startsWith('11-restore') && !calls.some((c) => c.file === f));
if (stale.length) console.warn(`Stale call files (not produced by this run, do NOT run them; delete by hand): ${stale.join(', ')}`);
const summary = {
    generated: new Date().toISOString(),
    source: { tokens: TOKENS.split('/').slice(-3).join('/'), theme: THEME ? THEME.split('/').slice(-2).join('/') : null },
    counts: { ...Object.fromEntries(Object.entries(plan.collections).map(([k, v]) => [COLLECTION[k], v.length])), effectStyles: plan.effectStyles.length, textStyles: plan.textStyles.length, derived: plan.derived.length, skipped: plan.skipped.length },
    calls: calls.map((c) => ({ file: `calls/${c.file}`, chars: c.code.length }))
};
await writeFile(join(OUT, 'plan.json'), JSON.stringify({ ...summary, plan }, null, 2) + '\n');
console.log(`Figma plan → ${OUT}`);
console.log(JSON.stringify(summary.counts));
for (const c of summary.calls) console.log(`  ${c.file} (${c.chars} chars)`);
