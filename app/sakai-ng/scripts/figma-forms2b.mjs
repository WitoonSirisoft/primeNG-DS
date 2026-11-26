#!/usr/bin/env node
/**
 * Forms 2 group 2 → Figma (DECISIONS #101): MultiSelect, AutoComplete. Plugin code in figma-forms2b.body.js (one body, 3 calls by SET).
 * Field rules = Select / InputText (#73): bg / border / text colour by Variant × State × Invalid; shadow except focus; Select/Text sm|base|lg.
 * MultiSelect: label + clear + dropdown (like Select); Content placeholder | chips (display chip: Chip instances, padding calc(padding / 2) = literal) | value (display comma).
 * AutoComplete (dropdown): input (left corners) + dropdown button (autocomplete/dropdown/*, no left border, right corners); Content placeholder | value | chips ([multiple], wraps to 2 rows).
 *   Sizes sm / lg use InputText padding tokens (autocomplete has no sm / lg padding tokens; pSize on the input). Panel = Select Panel (same overlay + list tokens).
 * MultiSelect Option (checkbox + label, State default / focus / selected / selected-focus) + MultiSelect Panel (header: toggle-all checkbox + filter IconField; 5 options + Show option 6).
 * Usage (from app/sakai-ng): npm run figma:forms2b [-- --fresh]   Writes calls/29-forms2b-{multiselect,autocomplete,panel}.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['multiselect/background', 'multiselect/border-color', 'multiselect/border-radius', 'multiselect/chip/border-radius', 'multiselect/clear-icon/color', 'multiselect/dropdown/width', 'multiselect/dropdown/color', 'multiselect/sm/padding-x', 'multiselect/lg/padding-y',
    'multiselect/option/selected-background-opacity', 'multiselect/overlay/background', 'multiselect/list/header/padding-top', 'autocomplete/dropdown/background', 'autocomplete/dropdown/sm/width', 'autocomplete/dropdown/lg/width', 'autocomplete/chip/border-radius',
    'inputtext/sm/padding-x', 'inputtext/sm/padding-y', 'inputtext/lg/padding-x', 'inputtext/lg/padding-y', 'inputtext/sm/font-size', 'inputtext/lg/font-size', 'Select/Text sm', 'Select/Text base', 'Select/Text lg', 'Body/Base'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-forms2b.body.js'), 'utf8');
for (const set of ['multiselect', 'autocomplete', 'panel']) {
    const code = BODY.replace('/*HELPERS*/', HELPERS).replace('/*FRESH*/', String(FRESH)).replace('/*SET*/', JSON.stringify(set));
    await writeFile(join(OUT, 'calls', `29-forms2b-${set}.js`), code);
    console.log(`Forms 2b ${set}: call 29-forms2b-${set}.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
}
