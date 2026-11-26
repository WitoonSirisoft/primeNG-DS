#!/usr/bin/env node
/**
 * Batch 3 group 2 → Figma (DECISIONS #100): Avatar, Avatar Group, Chip. Plugin code in figma-display.body.js.
 * Avatar (p-avatar): size avatar/width|height (lg, xl), background avatar/background, colour avatar/color, radius avatar/border-radius (circle = 50 %, drawn as 9999);
 *   label text styles Avatar/Label (sm 14 / lg 21 / xl 28), icon avatar/icon/size. In a group: 2px border avatar/group/border-color (inside, border-box) + negative offset.
 * Chip (p-chip): padding chip/padding-y|x (removable: right = padding-y), gap chip/gap, radius chip/border-radius, icon chip/icon/*, remove icon times-circle chip/remove-icon/*.
 * Usage (from app/sakai-ng): npm run figma:display [-- --fresh]   Writes calls/26-display-1.js.
 *
 * (group 1 notes kept below for the shared helper layout)
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
const VARS = ['avatar/width', 'avatar/height', 'avatar/lg/width', 'avatar/lg/height', 'avatar/xl/width', 'avatar/xl/height', 'avatar/icon/size', 'avatar/lg/icon/size', 'avatar/xl/icon/size', 'avatar/background', 'avatar/color', 'avatar/border-radius',
    'avatar/group/border-color', 'avatar/group/offset', 'avatar/lg/group/offset', 'avatar/xl/group/offset', 'chip/background', 'chip/color', 'chip/border-radius', 'chip/padding-x', 'chip/padding-y', 'chip/gap', 'chip/icon/color', 'chip/icon/size', 'chip/remove-icon/color', 'chip/remove-icon/size',
    'Avatar/Label', 'Avatar/Label lg', 'Avatar/Label xl', 'Body/Base'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-display.body.js'), 'utf8');
const code = BODY.replace('/*HELPERS*/', HELPERS).replace('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '26-display-1.js'), code);
console.log(`Display (Avatar, Avatar Group, Chip): variables found in plan.json. Call: 26-display-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
