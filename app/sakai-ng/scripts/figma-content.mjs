#!/usr/bin/env node
/**
 * Batch 3 group 1 → Figma (DECISIONS #100): Sakai Card, Divider, Accordion.
 * Card (Sakai .card, _utils.scss): padding layout/card/padding, background content/background (--surface-card), radius content/border-radius;
 *   title = Tailwind 'font-semibold text-xl mb-4' (text style Card/Title, gap layout/card/title/margin-bottom); text p (Body/Paragraph, text/color).
 *   Between stacked cards: layout/card/gap (margin-bottom 2rem) → use as the gap of the frame that stacks cards.
 * Divider (p-divider): horizontal = margin y 14 (as padding here), padding x 14, line 1px at 50 %; vertical = margin x 14, padding y 7, line at 50 %.
 *   Content (<b>OR</b>): background divider/content/background, padding content padding, Body/Strong. Align start/center/end = left/center/right (top/center/bottom).
 *   Type solid/dashed/dotted = stroke dash pattern (approximation of the browser's dashes).
 * Accordion (p-accordion): panel border-bottom 1px; header padding 1.125rem, space-between, 600, toggle chevron (14);
 *   colours per state: default muted, hover = text, expanded (active) = text; content padding 0 1.125rem 1.125rem, Body/Paragraph. Disabled = opacity disabled-opacity.
 *   First/last header radius not drawn (header background = page/card background, invisible).
 * Parts: 'Card' (+ 'Card Slot'), 'Divider' (Layout × Type × Align = 18), 'Accordion Panel' (State default/hover/disabled × Expanded = 6, + 'Accordion Slot'), 'Accordion' (3 panels + Show panel 4/5).
 * Usage (from app/sakai-ng): npm run figma:content [-- --fresh]   Writes calls/25-content-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['content/background', 'content/border-radius', 'text/color', 'layout/card/padding', 'layout/card/title/margin-bottom', 'layout/card/gap', 'icon-size', 'disabled-opacity',
    'divider/border-color', 'divider/content/background', 'divider/content/color', 'divider/horizontal/margin-y', 'divider/horizontal/padding-x', 'divider/horizontal/content/padding-x', 'divider/vertical/margin-x', 'divider/vertical/padding-y', 'divider/vertical/content/padding-y',
    'accordion/panel/border-color', 'accordion/panel/border-width-bottom', 'accordion/header/padding', 'accordion/header/border-radius', 'accordion/header/background', 'accordion/header/hover-background', 'accordion/header/active-background', 'accordion/header/active-hover-background',
    'accordion/header/color', 'accordion/header/hover-color', 'accordion/header/active-color', 'accordion/header/active-hover-color', 'accordion/header/toggle-icon/color', 'accordion/header/toggle-icon/hover-color', 'accordion/header/toggle-icon/active-color', 'accordion/header/toggle-icon/active-hover-color',
    'accordion/content/background', 'accordion/content/color', 'accordion/content/padding-top', 'accordion/content/padding-right', 'accordion/content/padding-bottom', 'accordion/content/padding-left',
    'Card/Title', 'Body/Paragraph', 'Body/Strong', 'Accordion/Header'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-content.body.js'), 'utf8');
const code = BODY.replace('/*HELPERS*/', HELPERS).replace('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '25-content-1.js'), code);
console.log(`Content (Card, Divider, Accordion): variables found in plan.json. Call: 25-content-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
