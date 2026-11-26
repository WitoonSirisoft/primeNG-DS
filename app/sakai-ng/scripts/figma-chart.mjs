#!/usr/bin/env node
/**
 * Extras group 4 → Figma (DECISIONS #102): Chart (line / bar / pie / doughnut) + Chart Legend Item. Plugin code in figma-chart.body.js.
 * Static picture of the Sakai Chart demo on a 504 × 340 canvas: geometry measured on the Chart.js captures; line = Chart.js splineCurve (tension 0.4);
 * bars categoryPercentage 0.8 × barPercentage 0.9; arcs = ellipse arcData (cutout 50% for doughnut). Text Chart/Label (Lato 12; set Chart.defaults.font.family).
 * Usage (from app/sakai-ng): npm run figma:chart [-- --fresh]   Writes calls/34-chart-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['primary/500', 'primary/200', 'indigo/500', 'purple/500', 'teal/500', 'surface/0', 'text/color', 'text/muted-color', 'content/border-color', 'Chart/Label', 'Chart/Label medium'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-chart.body.js'), 'utf8');
const code = BODY.replaceAll('/*HELPERS*/', HELPERS).replaceAll('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '34-chart-1.js'), code);
console.log(`Extras 4 (Chart): variables found in plan.json. Call: 34-chart-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
