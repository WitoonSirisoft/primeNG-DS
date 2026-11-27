#!/usr/bin/env node
/**
 * Batch 4 pattern 2 → Figma (DECISIONS #103): Form Field (02 Components) + Form Layout (03 Patterns, the 6 Sakai Form Layout cards). Plugin code in figma-formfield.body.js.
 * Field: label (Body/Base) + Control swap slot + help (Form/Help 11.2) + error (Message simple sm), gap 0.5rem; horizontal = 2/12 label column.
 * Usage (from app/sakai-ng): npm run figma:formfield [-- --fresh]   Writes calls/36-formfield-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['text/color', 'layout/surface-ground', 'layout/card/gap', 'layout/form/help/font-size', 'Body/Base', 'Form/Help', 'Card/Title'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-formfield.body.js'), 'utf8');
const code = BODY.replaceAll('/*HELPERS*/', HELPERS).replaceAll('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '36-formfield-1.js'), code);
console.log(`Batch 4 · Form Field + Form Layout: variables found in plan.json. Call: 36-formfield-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
