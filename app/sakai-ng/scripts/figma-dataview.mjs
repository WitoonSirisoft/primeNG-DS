#!/usr/bin/env node
/**
 * Extras group 3 → Figma (DECISIONS #102): DataView + Sakai List demo items (list / grid). Plugin code in figma-dataview.body.js.
 * Header: dataview/header/* + SelectButton (bars / table icons); list item p-6 gap-4, image 140 (md:w-40), border-t; grid card p-6 border, image box p-4 surface-50, 3 columns gap 14 + p-2.
 * Colours: existing variables (text/muted-color, surface/0|50|100|900, yellow/500, content/*); text styles DataView/* (layout/dataview/* tokens).
 * Usage (from app/sakai-ng): npm run figma:dataview [-- --fresh]   Writes calls/33-dataview-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['dataview/header/padding-y', 'dataview/header/padding-x', 'dataview/header/background', 'dataview/header/border-color', 'dataview/header/border-width-top', 'dataview/header/border-width-right', 'dataview/header/border-width-bottom', 'dataview/header/border-width-left', 'dataview/content/background', 'dataview/content/color', 'content/background', 'content/border-color', 'text/muted-color', 'surface/0', 'surface/50', 'surface/100', 'surface/900', 'yellow/500', 'icon-size', 'DataView/Meta', 'DataView/Name', 'DataView/Price', 'DataView/Price lg'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-dataview.body.js'), 'utf8');
const code = BODY.replaceAll('/*HELPERS*/', HELPERS).replaceAll('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '33-dataview-1.js'), code);
console.log(`Extras 3 (DataView): variables found in plan.json. Call: 33-dataview-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
