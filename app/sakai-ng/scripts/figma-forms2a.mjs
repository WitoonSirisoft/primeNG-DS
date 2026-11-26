#!/usr/bin/env node
/**
 * Forms 2 group 1 → Figma (DECISIONS #101): InputGroup, SelectButton. Plugin code in figma-forms2a.body.js.
 * InputGroup (p-inputgroup): addon padding / min-width / background / colour / 1px border-color; borders per CSS (first-child + addon+addon left, last-child right), outer corners radius,
 *   inner field corners 0 (.p-inputgroup > .p-component { border-radius: 0 }). Prefilled rows = Sakai Input demo; field = InputText instance (Price uses InputText, InputNumber looks the same).
 * SelectButton (p-selectbutton of p-togglebutton): option padding togglebutton/padding (sm/lg), content padding togglebutton/content/padding-y|x, gap, content radius;
 *   checked content background + effect style togglebutton/content/checked-shadow; colours per state; labels ToggleButton/Label sm|base|lg (500).
 *   Container: 1px togglebutton/border-color around and between options, radius selectbutton/border-radius; invalid = 1px outline (spread-1 effect bound to selectbutton/invalid-border-color).
 * Usage (from app/sakai-ng): npm run figma:forms2a [-- --fresh]   Writes calls/28-forms2a-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['inputgroup/addon/background', 'inputgroup/addon/border-color', 'inputgroup/addon/border-radius', 'inputgroup/addon/color', 'inputgroup/addon/min-width', 'inputgroup/addon/padding',
    'togglebutton/background', 'togglebutton/hover-background', 'togglebutton/checked-background', 'togglebutton/disabled-background', 'togglebutton/border-color', 'togglebutton/color', 'togglebutton/hover-color', 'togglebutton/checked-color', 'togglebutton/disabled-color',
    'togglebutton/icon/color', 'togglebutton/icon/hover-color', 'togglebutton/icon/checked-color', 'togglebutton/icon/disabled-color', 'togglebutton/padding', 'togglebutton/sm/padding', 'togglebutton/lg/padding',
    'togglebutton/content/padding-y', 'togglebutton/content/padding-x', 'togglebutton/content/sm/padding-y', 'togglebutton/content/sm/padding-x', 'togglebutton/content/lg/padding-y', 'togglebutton/content/lg/padding-x',
    'togglebutton/content/border-radius', 'togglebutton/content/checked-background', 'togglebutton/gap', 'selectbutton/border-radius', 'selectbutton/invalid-border-color', 'icon-size',
    'Body/Base', 'ToggleButton/Label sm', 'ToggleButton/Label', 'ToggleButton/Label lg'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-forms2a.body.js'), 'utf8');
const code = BODY.replace('/*HELPERS*/', HELPERS).replace('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '28-forms2a-1.js'), code);
console.log(`Forms 2a (InputGroup, SelectButton): variables found in plan.json. Call: 28-forms2a-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
