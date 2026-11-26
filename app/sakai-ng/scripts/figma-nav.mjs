#!/usr/bin/env node
/**
 * Batch 3 group 3 → Figma (DECISIONS #100): Breadcrumb, Menubar. Plugin code in figma-nav.body.js.
 * Breadcrumb (p-breadcrumb): padding breadcrumb/padding, gap breadcrumb/gap, item link gap item/gap, colours item/color|hover-color, icons item/icon/*, separator chevron-right separator/color.
 * Menubar (p-menubar): bar padding menubar/padding-y|x, gap menubar/gap, 1px border, radius; root items base-item padding/radius; submenu items item padding/radius;
 *   hover = focus colours (menubar/item/focus-*), open parent = active colours; label line-height 1 (text style Menu/Item label, as .p-menubar-item-label);
 *   submenu panel min-width 12.5rem, padding/gap submenu, border, radius, shadow menubar/submenu/shadow. End slot = IconField (Sakai demo search).
 * Usage (from app/sakai-ng): npm run figma:nav [-- --fresh]   Writes calls/27-nav-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['breadcrumb/background', 'breadcrumb/padding', 'breadcrumb/gap', 'breadcrumb/item/gap', 'breadcrumb/item/border-radius', 'breadcrumb/item/color', 'breadcrumb/item/hover-color', 'breadcrumb/item/icon/color', 'breadcrumb/item/icon/hover-color', 'breadcrumb/separator/color',
    'menubar/background', 'menubar/border-color', 'menubar/border-radius', 'menubar/padding-y', 'menubar/padding-x', 'menubar/gap', 'menubar/base-item/padding-y', 'menubar/base-item/padding-x', 'menubar/base-item/border-radius',
    'menubar/item/padding-y', 'menubar/item/padding-x', 'menubar/item/border-radius', 'menubar/item/gap', 'menubar/item/color', 'menubar/item/focus-color', 'menubar/item/active-color', 'menubar/item/focus-background', 'menubar/item/active-background',
    'menubar/item/icon/color', 'menubar/item/icon/focus-color', 'menubar/item/icon/active-color', 'menubar/submenu/icon/color', 'menubar/submenu/icon/focus-color', 'menubar/submenu/icon/active-color', 'menubar/submenu/icon/size',
    'menubar/submenu/background', 'menubar/submenu/border-color', 'menubar/submenu/border-radius', 'menubar/submenu/padding-y', 'menubar/submenu/padding-x', 'menubar/submenu/gap', 'icon-size', 'Body/Base', 'Menu/Item label'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-nav.body.js'), 'utf8');
const code = BODY.replace('/*HELPERS*/', HELPERS).replace('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '27-nav-1.js'), code);
console.log(`Nav (Breadcrumb, Menubar): variables found in plan.json. Call: 27-nav-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
