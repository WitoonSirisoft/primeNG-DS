#!/usr/bin/env node
/**
 * Extras group 1 → Figma (DECISIONS #102): Tooltip, Timeline, Stepper. Plugin code in figma-extras1.body.js.
 * Tooltip: text box padding / background / radius / shadow (tooltip/*), max-width; arrow = triangle of the gutter size (CSS border trick), pointing at the target.
 * Timeline: event = opposite (flex 1) | separator (marker 15.75 ring 2px + 5.25 primary dot, connector 2px) | content (flex 1); min-height 70 except the last;
 *   right / alternate = row-reverse; horizontal = column with content padding 1rem 0.
 * Stepper: step = header (number circle 28, border 2px, shadow, Stepper/Number; title Stepper/Title, gap) + separator (2px, flex 1; primary before the active step); panels padding.
 * Usage (from app/sakai-ng): npm run figma:extras1 [-- --fresh]   Writes calls/31-extras1-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['tooltip/background', 'tooltip/color', 'tooltip/border-radius', 'tooltip/padding-y', 'tooltip/padding-x', 'tooltip/max-width', 'timeline/event-marker/size', 'timeline/event-marker/border-width', 'timeline/event-marker/content/size', 'timeline/event-connector/size',
    'timeline/event/min-height', 'timeline/vertical/event-content/padding-x', 'timeline/horizontal/event-content/padding-y', 'stepper/step/padding', 'stepper/step/gap', 'stepper/step-number/size', 'stepper/separator/size', 'stepper/separator/active-background', 'stepper/steppanels/padding-top',
    'Body/Base', 'Stepper/Number', 'Stepper/Title'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-extras1.body.js'), 'utf8');
const code = BODY.replaceAll('/*HELPERS*/', HELPERS).replaceAll('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '31-extras1-1.js'), code);
console.log(`Extras 1 (Tooltip, Timeline, Stepper): variables found in plan.json. Call: 31-extras1-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
