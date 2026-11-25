#!/usr/bin/env node
/**
 * Values-only theme update: PILOT_CHECKLIST Day 6.1 (and the Stage 3 "update in place" path).
 * Compares the variable calls of the Base plan (tokens/figma/calls) with a theme plan made by
 *   npm run figma:plan -- --theme=<theme.json> --out=<dir>
 * and writes ONE small use_figma call that changes only the variable values that differ.
 * Never creates, renames or deletes variables: a missing variable is an error (the theme must not add tokens, SPEC 5.3).
 * Also writes 11-restore-base.js: the Base values of the same variables, to undo the theme on that file.
 * Text and effect styles: if the theme's style call differs from the Base one, run that call from <dir>/calls as-is (it upserts).
 * Usage (from app/sakai-ng): node scripts/figma-theme-diff.mjs --dir=../../tokens/figma/theme-a
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const BASE = resolve(HERE, '../../../tokens/figma/calls');
const DIR = resolve(HERE, '..', arg('dir') || '');
const VAR_CALL = /^0[1-4]-.*\.js$/;

const readD = async (f) => { const s = await readFile(f, 'utf8'); return JSON.parse(s.slice(s.indexOf('=') + 1, s.indexOf('\n')).replace(/;$/, '')); };
const load = async (dir) => {
    const m = new Map();
    for (const f of (await readdir(dir)).filter((x) => VAR_CALL.test(x)).sort()) {
        const D = await readD(join(dir, f));
        for (const [n, , , vals] of D.vars) m.set(n, { col: D.col, modes: D.modes, vals });
    }
    return m;
};
const base = await load(BASE), theme = await load(join(DIR, 'calls'));
const changes = [];
for (const [n, t] of theme) {
    const b = base.get(n);
    if (!b) throw new Error(`Theme plan has a variable the Base plan does not: ${n}`);
    if (JSON.stringify(b.vals) !== JSON.stringify(t.vals)) changes.push([n, t.col, t.modes, t.vals]);
}
if (theme.size !== base.size) throw new Error(`Variable count differs: base ${base.size}, theme ${theme.size}`);
const styles = [];
for (const f of ['05-effect-styles.js', '06-text-styles.js']) {
    const [a, b] = await Promise.all([readFile(join(BASE, f), 'utf8'), readFile(join(DIR, 'calls', f), 'utf8')]);
    if (a !== b) styles.push(f);
}
const CODE = `const all=await figma.variables.getLocalVariablesAsync();const byName=new Map(all.map(v=>[v.name,v]));
const cols=new Map((await figma.variables.getLocalVariableCollectionsAsync()).map(c=>[c.name,c]));const errors=[];let set=0;
// a font-family variable bound to text: Figma needs the new family loaded before the value changes
const fam=[...new Set(D.changes.filter(c=>{const v=byName.get(c[0]);return v&&v.scopes.includes('FONT_FAMILY');}).flatMap(c=>typeof c[3]==='object'?Object.values(c[3]):[c[3]]))];
if(fam.length){const av=await figma.listAvailableFontsAsync();for(const f of fam){const fs=av.filter(a=>a.fontName.family===f);if(!fs.length){errors.push('font not available: '+f);continue;}await Promise.all(fs.map(a=>figma.loadFontAsync(a.fontName)));}if(errors.length)return {errors};}
for(const [n,cn,modes,vals] of D.changes){const v=byName.get(n),c=cols.get(cn);if(!v||!c){errors.push(n+': missing');continue;}
 for(const m of modes){const mo=c.modes.find(x=>x.name===m);if(!mo){errors.push(n+': mode '+m);continue;}
  const raw=(vals&&typeof vals==='object'&&!Array.isArray(vals)&&!('a' in vals))?vals[m]:vals;let val;
  if(raw&&typeof raw==='object'&&!Array.isArray(raw)){const tg=byName.get(raw.a);if(!tg){errors.push(n+': alias '+raw.a);continue;}val={type:'VARIABLE_ALIAS',id:tg.id};}
  else if(Array.isArray(raw))val={r:raw[0],g:raw[1],b:raw[2],a:raw[3]};else val=raw;
  v.setValueForMode(mo.modeId,val);set++;}}
return {changedVariables:D.changes.length,valuesSet:set,variablesInFile:all.length,errors};`;
const out = join(DIR, 'calls', '10-theme-values.js');
const code = `const D=${JSON.stringify({ changes })};\n${CODE}`;
if (code.length > 45000) throw new Error(`Diff call too long (${code.length}); split needed`);
await writeFile(out, code);
// the way back: Base values for the same variables (run before applying another theme to the same file)
const back = changes.map(([n]) => { const x = base.get(n); return [n, x.col, x.modes, x.vals]; });
await writeFile(join(DIR, 'calls', '11-restore-base.js'), `const D=${JSON.stringify({ changes: back })};\n${CODE}`);
console.log(`Theme diff: ${changes.length} of ${base.size} variables change → ${out.split('/').slice(-3).join('/')} (${code.length} chars). Style calls to run as-is: ${styles.join(', ') || 'none'}`);
