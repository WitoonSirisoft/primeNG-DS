#!/usr/bin/env node
/**
 * Forms 2 group 3 → Figma (DECISIONS #101): FileUpload (advanced + basic). Plugin code in figma-fileupload.body.js.
 * Advanced: 1px fileupload/border-color, radius, background; header padding / gap with Button instances (Choose primary + plus; Upload, Cancel secondary, disabled without files);
 *   content padding (0 1.125rem 1.125rem), gap: empty text, or progress bar (fileupload/progressbar/height, progressbar/background) + file list (gap file-list/gap).
 * FileUpload File: padding file/padding, gap file/gap, thumbnail 50 (previewWidth, image placeholder), name + size (gap file/info/gap), Badge warn "Pending", Button Icon danger text (remove);
 *   border-bottom file/border-color except the last row (Show divider).
 * Basic: Choose button (upload icon) + file name text, gap basic/gap.
 * Usage (from app/sakai-ng): npm run figma:fileupload [-- --fresh]   Writes calls/30-fileupload-1.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const FRESH = process.argv.includes('--fresh');
const VARS = ['fileupload/background', 'fileupload/border-color', 'fileupload/border-radius', 'fileupload/color', 'fileupload/header/padding', 'fileupload/header/gap', 'fileupload/content/gap', 'fileupload/content/padding-top', 'fileupload/content/padding-left',
    'fileupload/file-list/gap', 'fileupload/file/padding', 'fileupload/file/gap', 'fileupload/file/info/gap', 'fileupload/file/border-color', 'fileupload/basic/gap', 'fileupload/progressbar/height', 'progressbar/background', 'progressbar/border-radius', 'content/hover-background', 'Body/Base'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const HELPERS = FRESH ? `const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();` : `${SYNC}${WRAP}`;
const BODY = await readFile(join(HERE, 'figma-fileupload.body.js'), 'utf8');
const code = BODY.replace('/*HELPERS*/', HELPERS).replace('/*FRESH*/', String(FRESH));
await writeFile(join(OUT, 'calls', '30-fileupload-1.js'), code);
console.log(`FileUpload: variables found in plan.json. Call: 30-fileupload-1.js (${code.length})${FRESH ? ' [fresh]' : ''}`);
