#!/usr/bin/env node
/**
 * Figma variable verification: PILOT_CHECKLIST Day 4.3 review aid.
 * Derives the EXPECTED final value of every Figma variable directly from tokens.json
 * (`$extensions.primeng.resolved`, i.e. what the browser renders), independently of the
 * figma-variables.mjs plan, and writes tokens/figma/calls/99-verify.js: read-only code for the
 * Figma MCP `use_figma` tool that resolves every variable's alias chain per mode and diffs it.
 * Expected result: match = number of variables, mismatches/missing/extra empty.
 *
 * Usage (from app/sakai-ng): npm run figma:verify [-- --tokens=<file>] [--out=<file>]
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEXT_STYLES, WEIGHT_STYLE } from './text-styles.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..');
const arg = (n, d) => {
    const a = process.argv.find((x) => x.startsWith(`--${n}=`));
    return a ? a.slice(n.length + 3) : d;
};
const TOKENS = resolve(APP, arg('tokens', '../../tokens/base/tokens.json'));
const OUT = resolve(APP, arg('out', '../../tokens/figma/calls/99-verify.js'));
const tok = JSON.parse(await readFile(TOKENS, 'utf8'));
const PX = tok.$metadata.rootFontSizePx;

const hex8 = (s) => {
    s = s.trim();
    if (s === 'transparent') return '00000000';
    let m = s.match(/^#([0-9a-f]{3,8})$/i);
    if (m) {
        let h = m[1];
        if (h.length <= 4) h = [...h].map((c) => c + c).join('');
        return (h + (h.length === 6 ? 'ff' : '')).toLowerCase();
    }
    m = s.match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
        const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
        const h2 = (x) => Math.round(x).toString(16).padStart(2, '0');
        return h2(p[0]) + h2(p[1]) + h2(p[2]) + h2((p[3] ?? 1) * 255);
    }
    throw new Error(`color ${s}`);
};
const MIX = /^color-mix\(in srgb, (#[0-9a-f]+|rgba?\([^)]*\)), transparent (\d+(?:\.\d+)?)%\)$/i;
const px = (s) => s.trim().split(/\s+/).map((x) => { const m = x.match(/^(-?[\d.]+)(rem|px|em)?$/); const n = parseFloat(m[1]); return m[2] === 'rem' || m[2] === 'em' ? +(n * PX).toFixed(4) : n; });
const sec = (s) => (s.endsWith('ms') ? parseFloat(s) / 1000 : parseFloat(s));

const rows = [];
const walk = (t, col, p = '') => {
    for (const [k, v] of Object.entries(t)) {
        if (k.startsWith('$')) continue;
        if (v && typeof v === 'object' && '$value' in v) rows.push({ col, path: p + k, v });
        else if (v && typeof v === 'object') walk(v, col, p + k + '.');
    }
};
for (const c of ['primitives', 'semantic', 'components']) walk(tok[c], c);
const C = { primitives: 'P', semantic: 'S', components: 'C' };
const lines = [];
for (const { col, path, v } of rows) {
    const r = v.$extensions.primeng.resolved;
    const res = r && typeof r === 'object' ? r : { light: r, dark: r };
    const name = path.replace(/\./g, '/');
    const t = v.$type;
    if (t === 'shadow') continue; // effect styles, checked by count only
    if (t === 'color') {
        const vals = [], op = [];
        for (const m of ['light', 'dark']) {
            const mm = res[m].match(MIX);
            vals.push(mm ? hex8(mm[1]) : hex8(res[m]));
            op.push(mm ? +(1 - parseFloat(mm[2]) / 100).toFixed(4) : 1);
        }
        lines.push(`${C[col]}|${name}|C|${vals[0]}|${vals[1]}`);
        if (op.some((o) => o !== 1)) lines.push(`${C[col]}|${name}-opacity|F|${+(op[0] * 100).toFixed(4)}|${+(op[1] * 100).toFixed(4)}`); // percent in Figma (#41)
    } else if (t === 'dimension') {
        const l = px(res.light), d = px(res.dark);
        if (l.length === 1) lines.push(`${C[col]}|${name}|F|${l[0]}|${d[0]}`);
        else (l.length === 2 ? ['y', 'x'] : ['top', 'right', 'bottom', 'left']).forEach((s, i) => lines.push(`${C[col]}|${name}-${s}|F|${l[i]}|${d[i]}`));
    } else if (t === 'fontWeight' || t === 'number') { const k = /opacity/.test(name.split('/').pop()) ? 100 : 1; lines.push(`${C[col]}|${name}|F|${+(Number(res.light) * k).toFixed(4)}|${+(Number(res.dark) * k).toFixed(4)}`); } // opacity: percent in Figma (#41)
    else if (t === 'duration') lines.push(`${C[col]}|${name}|F|${sec(res.light)}|${sec(res.dark)}`);
    else if (t === 'strokeStyle' || t === 'fontFamily') lines.push(`${C[col]}|${name}|S|${res.light}|${res.dark}`);
}

// derived focus-ring radius (DECISIONS #34), from resolved values
{
    const v = (p) => { const r = rows.find((x) => x.path === p).v.$extensions.primeng.resolved; return r && typeof r === 'object' ? r : { light: r, dark: r }; };
    for (const [name, base] of [['button/focus-ring-radius', 'button.border-radius'], ['button/rounded-focus-ring-radius', 'button.rounded-border-radius']]) {
        const val = (m) => +(px(v(base)[m])[0] + px(v('button.focus-ring.offset')[m])[0] + px(v('button.focus-ring.width')[m])[0]).toFixed(4);
        lines.push(`C|${name}|F|${val('light')}|${val('dark')}`);
    }
}
{
    const v = (p) => { const r = rows.find((x) => x.path === p).v.$extensions.primeng.resolved; return r && typeof r === 'object' ? r : { light: r, dark: r }; };
    for (const [name, size] of [['button/line-height', 'typography.base.font-size'], ['button/sm/line-height', 'button.sm.font-size'], ['button/lg/line-height', 'button.lg.font-size']]) {
        const val = (m) => +(px(v(size)[m])[0] * Number(v('typography.base.line-height')[m])).toFixed(4);
        lines.push(`C|${name}|F|${val('light')}|${val('dark')}`);
    }
}
// text styles: expected values from the browser-resolved values, independent of the generator
const byPath = new Map(rows.map((r) => [r.path, r.v]));
const resOf = (p) => { const r = byPath.get(p).$extensions.primeng.resolved; return r && typeof r === 'object' ? r.light : r; };
const tsLines = TEXT_STYLES.map((t) => [t.name, resOf(t.family), WEIGHT_STYLE[Number(resOf(t.weight))], px(resOf(t.size))[0], +(Number(resOf(t.lineHeight)) * 100).toFixed(4),
    [t.family, t.size, t.weight].map((p) => p.replace(/\./g, '/')).join(',')].join('|'));

const code = `const EXP=${JSON.stringify(lines.join('\n'))};
const cols=await figma.variables.getLocalVariableCollectionsAsync();const colById=new Map(cols.map(c=>[c.id,c]));
const all=await figma.variables.getLocalVariablesAsync();const byId=new Map(all.map(v=>[v.id,v]));const byName=new Map(all.map(v=>[v.name,v]));
const hex=c=>[c.r,c.g,c.b,c.a??1].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');
function res(v,mode,d=0){if(d>20)return 'CYCLE';const c=colById.get(v.variableCollectionId);const m=c.modes.find(x=>x.name===mode)||c.modes[0];const val=v.valuesByMode[m.modeId];
if(val&&typeof val==='object'&&val.type==='VARIABLE_ALIAS'){const t=byId.get(val.id);return t?res(t,mode,d+1):'MISSING';}if(val&&typeof val==='object'&&'r' in val)return hex(val);return val;}
const same=(t,a,e)=>t==='F'?Math.abs(Number(a)-Number(e))<1e-4:String(a)===String(e);
const mism=[],missing=[],wrongCol=[];let ok=0;const seen=new Set();
for(const line of EXP.split('\\n')){const [c,n,t,l,d]=line.split('|');seen.add(n);const v=byName.get(n);if(!v){missing.push(n);continue;}
if(colById.get(v.variableCollectionId).name[0]!==c)wrongCol.push(n);
const al=res(v,'Light'),ad=res(v,'Dark');if(same(t,al,l)&&same(t,ad,d))ok++;else mism.push([n,'exp',l,d,'got',al,ad].join(' '));}
const extra=all.filter(v=>!seen.has(v.name)).map(v=>v.name);
const effects=(await figma.getLocalEffectStylesAsync()).length;
const TS=${JSON.stringify(tsLines.join('\n'))};const ts=new Map((await figma.getLocalTextStylesAsync()).map(s=>[s.name,s]));const tsBad=[];let tsOk=0;
for(const line of TS.split('\\n')){const [n,f,st,sz,lh,b]=line.split('|');const s=ts.get(n);if(!s){tsBad.push(n+': missing');continue;}
const bv=['fontFamily','fontSize','fontWeight'].map(k=>{const x=s.boundVariables&&s.boundVariables[k];return x&&byId.get(x.id)?byId.get(x.id).name:'-';}).join(',');
const got=[s.fontName.family,s.fontName.style,s.fontSize,s.lineHeight.unit==='PERCENT'?Math.round(s.lineHeight.value*1e4)/1e4:s.lineHeight.unit,bv];
if(got[0]===f&&got[1]===st&&Math.abs(got[2]-Number(sz))<1e-4&&Math.abs(Number(got[3])-Number(lh))<1e-3&&got[4]===b)tsOk++;else tsBad.push(n+' exp '+[f,st,sz,lh,b].join(' ')+' got '+got.join(' '));}
return {expected:EXP.split('\\n').length,figmaVariables:all.length,match:ok,mismatchCount:mism.length,mismatches:mism.slice(0,30),missing,extra,wrongCollection:wrongCol,effectStyles:effects,textStyles:{expected:TS.split('\\n').length,match:tsOk,problems:tsBad}};`;
if (code.length > 50000) throw new Error(`verify code is ${code.length} chars (limit 50,000)`);
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, code + '\n');
console.log(`Verify call → ${OUT} (${lines.length} expected variables, ${code.length} chars)`);
