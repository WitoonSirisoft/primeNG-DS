#!/usr/bin/env node
/**
 * Batch 4 pattern 1 → Figma (DECISIONS #103): App shell. Plugin code in figma-appshell.body.js.
 * 02 Components: Topbar Action (default / hover / highlight), App Logo (slot), Topbar (desktop / mobile), Layout Footer. 03 Patterns: App Shell (desktop 1440 × 900, mobile 390 × 844).
 * Values: layout/topbar/*, layout/main/*, layout/footer/*, layout/sidebar/*, layout/surface-ground (read from Sakai _topbar / _main / _footer / _menu / _responsive / variables).
 * Usage (from app/sakai-ng): npm run figma:appshell [-- --fresh]   Writes calls/35-appshell-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['layout/topbar/height', 'layout/topbar/padding-x', 'layout/topbar/padding-y', 'layout/topbar/logo-container/width', 'layout/topbar/logo/gap', 'layout/topbar/logo/size', 'layout/topbar/action/size', 'layout/topbar/action/icon-size', 'layout/topbar/actions/gap', 'layout/topbar/menu-button/margin-right', 'layout/main/padding-top', 'layout/main/padding-right', 'layout/main/padding-bottom', 'layout/main/padding-left', 'layout/main/content/padding-bottom', 'layout/main/offset', 'layout/footer/gap', 'layout/footer/padding-top', 'layout/footer/padding-bottom', 'layout/sidebar/top', 'layout/sidebar/left', 'layout/surface-ground', 'content/background', 'content/hover-background', 'content/border-color', 'primary/color', 'primary/contrast-color', 'text/color', 'icon-size', 'Body/Base', 'Body/Strong', 'Topbar/Logo'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-appshell.body.js'), 'utf8');
const code = BODY.replaceAll('/*HELPERS*/', HELPERS).replaceAll('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '35-appshell-1.js'), code);
console.log(`Batch 4 · App shell: variables found in plan.json. Call: 35-appshell-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
