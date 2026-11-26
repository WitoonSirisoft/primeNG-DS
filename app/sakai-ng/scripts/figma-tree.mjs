#!/usr/bin/env node
/**
 * Extras group 2 → Figma (DECISIONS #102): Tree, TreeTable. Plugin code in figma-tree.body.js.
 * Tree: node content (toggle 24.5 circle, checkbox, icon, label; padding 3.5/7, gap 3.5); lists gap 2 + padding-top 2, children padding-left tree/indent; tree padding 14.
 * TreeTable: header cell (DataTable/Column title) / body cell (padding 10.5/14, border-bottom 1) / toggler cell (indent 16px per level, toggle 24.5, checkbox, gap 7); row = 3 cells; Sakai files demo.
 * Usage (from app/sakai-ng): npm run figma:tree [-- --fresh]   Writes calls/32-tree-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['tree/background', 'tree/padding', 'tree/gap', 'tree/indent', 'tree/node/gap', 'tree/node/padding-y', 'tree/node/padding-x', 'tree/node/border-radius', 'tree/node/hover-background', 'tree/node/selected-background', 'tree/node/color', 'tree/node/hover-color', 'tree/node/selected-color', 'tree/node-icon/color', 'tree/node-icon/hover-color', 'tree/node-icon/selected-color', 'tree/node-toggle-button/size', 'tree/node-toggle-button/color', 'treetable/header-cell/gap', 'treetable/header-cell/padding-y', 'treetable/header-cell/padding-x', 'treetable/header-cell/border-color', 'treetable/header-cell/background', 'treetable/header-cell/color', 'treetable/body-cell/gap', 'treetable/body-cell/padding-y', 'treetable/body-cell/padding-x', 'treetable/body-cell/border-color', 'treetable/node-toggle-button/size', 'treetable/node-toggle-button/color', 'treetable/row/background', 'treetable/row/hover-background', 'treetable/row/selected-background', 'treetable/row/color', 'treetable/row/hover-color', 'treetable/row/selected-color', 'tree/node/selected-background-opacity', 'treetable/row/selected-background-opacity', 'icon-size', 'Body/Base'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-tree.body.js'), 'utf8');
const code = BODY.replaceAll('/*HELPERS*/', HELPERS).replaceAll('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '32-tree-1.js'), code);
console.log(`Extras 2 (Tree, TreeTable): variables found in plan.json. Call: 32-tree-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
