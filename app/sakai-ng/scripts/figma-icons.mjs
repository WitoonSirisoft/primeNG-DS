#!/usr/bin/env node
/**
 * PrimeIcons → Figma icon components: PILOT_CHECKLIST Day 5 (DECISIONS #26, #31).
 * Source = the PrimeIcons FONT (what renders in code), not primeicons/raw-svg (a different, padded 24px drawing).
 * Measured in Storybook: an icon box is (glyph advance × 14/1024) × 14 px at the 14px root size, baseline at the ascent.
 * Plus PrimeNG's own SpinnerIcon (the loading icon of Button), from primeng/fesm2022/primeng-icons-spinner.mjs.
 *
 * Writes:
 *   tokens/figma/icons/manifest.json     name, source, box size, hash per icon (no path data)
 *   tokens/figma/calls/06-icons-N.js     use_figma code with the glyph paths (font units, relative); creates/updates components
 *                                        'Icon/<name>' in frame 'Icons' on '01 Foundations'; upsert by name, unchanged if hash matches
 * (Upload via upload_assets was tried: mcp.figma.com is blocked by network policy, so paths travel inside the calls.)
 * Usage (from app/sakai-ng): npm run figma:icons
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..');
const NM = join(APP, 'node_modules');
const OUT = resolve(APP, '../../tokens/figma');
const SIZE = 14; // icon font-size = 1rem = 14px (DECISIONS #15)

const pkg = JSON.parse(await readFile(join(NM, 'primeicons/package.json'), 'utf8'));
const primengVersion = JSON.parse(await readFile(join(NM, 'primeng/package.json'), 'utf8')).version;
const css = await readFile(join(NM, 'primeicons/primeicons.css'), 'utf8');
const buf = await readFile(join(NM, 'primeicons/fonts/primeicons.ttf'));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const upem = font.unitsPerEm, asc = font.ascender, desc = font.descender;
if (asc - desc !== upem) throw new Error(`Font box ${asc - desc} != unitsPerEm ${upem}; icon height assumption (= font-size) breaks`);
const r3 = (x) => Math.round(x * 1000) / 1000;

/** Glyph outline as a compact RELATIVE svg path in font units (y down, baseline at the ascent).
 *  Deltas are taken between ROUNDED absolute points, so rounding never drifts (max error 0.5 unit = 0.007px). */
function encode(path) {
    const out = [];
    let cx = 0, cy = 0, sx = 0, sy = 0;
    const R = (v) => Math.round(v);
    const nums = (a) => a.map((v, i) => (i && v >= 0 ? ' ' : '') + v).join('');
    for (const c of path.commands) {
        if (c.type === 'M' || c.type === 'L') {
            const x = R(c.x), y = R(c.y);
            if (c.type === 'L' && x === cx && y === cy) continue; // zero-length segment: no geometry
            out.push(c.type.toLowerCase() + nums([x - cx, y - cy]));
            cx = x; cy = y;
            if (c.type === 'M') { sx = x; sy = y; }
        } else if (c.type === 'Q') {
            const x1 = R(c.x1), y1 = R(c.y1), x = R(c.x), y = R(c.y);
            out.push('q' + nums([x1 - cx, y1 - cy, x - cx, y - cy]));
            cx = x; cy = y;
        } else if (c.type === 'C') {
            const x1 = R(c.x1), y1 = R(c.y1), x2 = R(c.x2), y2 = R(c.y2), x = R(c.x), y = R(c.y);
            out.push('c' + nums([x1 - cx, y1 - cy, x2 - cx, y2 - cy, x - cx, y - cy]));
            cx = x; cy = y;
        } else if (c.type === 'Z') {
            out.push('z');
            cx = sx; cy = sy;
        }
    }
    return out.join('');
}

const entries = [...css.matchAll(/\.pi-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([0-9a-f]+)"/g)].map((m) => ({ name: m[1], cp: parseInt(m[2], 16) }));
if (entries.length < 300) throw new Error(`Only ${entries.length} icons found in primeicons.css`);
const icons = [];
for (const { name, cp } of entries) {
    const g = font.charToGlyph(String.fromCodePoint(cp));
    if (!g || g.index === 0) throw new Error(`pi-${name}: no glyph for U+${cp.toString(16)}`);
    const d = encode(g.getPath(0, asc, upem)); // font units, y down
    if (!d) throw new Error(`pi-${name}: empty glyph`);
    const bb = g.getPath(0, asc, upem).getBoundingBox(); // glyphs may overhang their advance box (e.g. user-plus by 0.71px), as in the browser
    icons.push({ name, source: `PrimeIcons ${pkg.version} pi pi-${name} (U+${cp.toString(16).toUpperCase()})`, vb: [g.advanceWidth, upem], width: r3((g.advanceWidth * SIZE) / upem), height: SIZE, d, at: [r3((bb.x1 * SIZE) / upem), r3((bb.y1 * SIZE) / upem)] });
}
// PrimeNG SpinnerIcon (Button loading icon): its own 14x14 SVG path
const spin = await readFile(join(NM, 'primeng/fesm2022/primeng-icons-spinner.mjs'), 'utf8');
const sd = spin.match(/\sd="([^"]+)"/);
const sw = spin.match(/width="(\d+)"/), sh = spin.match(/height="(\d+)"/);
if (!sd || !sw || !sh) throw new Error('PrimeNG SpinnerIcon path not found; PrimeNG changed, update figma-icons.mjs');
icons.push({ name: 'primeng-spinner', source: `PrimeNG ${primengVersion} SpinnerIcon (Button loading icon)`, vb: [+sw[1], +sh[1]], width: +sw[1], height: +sh[1], d: sd[1] });
// FNV-1a 32-bit over the exact data sent to Figma; the Figma code recomputes it and rejects any icon whose data was altered in transit
const fnv = (str) => { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
for (const i of icons) i.hash = fnv(`${i.vb[0]}|${i.vb[1]}|${i.width}|${i.height}|${i.source}|${i.d}`);

// ---------- Figma-side code (upsert by name; unchanged if the hash in the description matches) ----------
const CODE = `const page=figma.root.children.find(p=>p.name==='01 Foundations');if(!page)return {error:'page 01 Foundations missing'};await figma.setCurrentPageAsync(page);
const tv=(await figma.variables.getLocalVariablesAsync('COLOR')).find(v=>v.name==='text/color');if(!tv)return {error:'variable text/color missing'};
let host=page.findChild(n=>n.type==='FRAME'&&n.name==='Icons');
if(!host){host=figma.createFrame();host.name='Icons';page.appendChild(host);host.layoutMode='HORIZONTAL';host.layoutWrap='WRAP';host.itemSpacing=16;host.counterAxisSpacing=16;host.paddingTop=host.paddingBottom=host.paddingLeft=host.paddingRight=24;host.primaryAxisSizingMode='FIXED';host.counterAxisSizingMode='AUTO';host.resize(960,100);host.fills=[];}
const existing=new Map(host.children.filter(n=>n.type==='COMPONENT'&&n.name.startsWith('Icon/')).map(c=>[c.name.slice(5),c]));
let created=0,updated=0,unchanged=0;const errors=[];
const fnv=s=>{let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');};
for(const [name,hash,vw,vh,w,h,src,d] of D.icons){if(fnv(vw+'|'+vh+'|'+w+'|'+h+'|'+src+'|'+d)!==hash){errors.push(name+': checksum mismatch (data altered), skipped');continue;}const tag='hash:'+hash;let comp=existing.get(name);
if(comp&&comp.description.includes(tag)){unchanged++;continue;}
let tmp;try{tmp=figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+vw+' '+vh+'"><path d="'+d+'"/></svg>');}catch(e){errors.push(name+': '+e.message);continue;}
const vecs=tmp.findAll(n=>n.type==='VECTOR');if(!vecs.length){errors.push(name+': no vector');tmp.remove();continue;}
const shape=vecs.length>1?figma.flatten(vecs,tmp):vecs[0];
if(!comp){comp=figma.createComponent();host.appendChild(comp);comp.name='Icon/'+name;created++;}else{for(const c of [...comp.children])c.remove();updated++;}
comp.resize(w,h);comp.fills=[];comp.clipsContent=false;
const sx=shape.x,sy=shape.y;comp.appendChild(shape);shape.x=sx;shape.y=sy;tmp.remove();
shape.name='Shape';shape.constraints={horizontal:'SCALE',vertical:'SCALE'};shape.strokes=[];
shape.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',tv)];
comp.description=src+'. Drawn from the source that renders in code. Box '+w+'x'+h+' px (icon size 14px). Color: text/color, override on instances. '+tag;}
const total=host.children.filter(n=>n.type==='COMPONENT'&&n.name.startsWith('Icon/')).length;
return {chunk:D.chunk,ofChunks:D.of,inChunk:D.icons.length,created,updated,unchanged,errors,iconComponentsNow:total,expectedTotal:D.total};`;

const rows = icons.map((i) => [i.name, i.hash, i.vb[0], i.vb[1], i.width, i.height, i.source, i.d]);
const MAX = 44000;
const chunks = [];
let cur = [];
for (const r of rows) {
    cur.push(r);
    if (JSON.stringify(cur).length + CODE.length + 200 > MAX) { cur.pop(); chunks.push(cur); cur = [r]; }
}
if (cur.length) chunks.push(cur);
await mkdir(join(OUT, 'icons'), { recursive: true });
await mkdir(join(OUT, 'calls'), { recursive: true });
await writeFile(join(OUT, 'icons/manifest.json'), JSON.stringify({ generated: new Date().toISOString(), source: { primeicons: pkg.version, primeng: primengVersion, font: 'primeicons/fonts/primeicons.ttf' }, sizePx: SIZE, count: icons.length, icons: icons.map(({ d, ...i }) => i) }, null, 2) + '\n');
const files = [];
for (const [n, c] of chunks.entries()) {
    const code = `const D=${JSON.stringify({ chunk: n + 1, of: chunks.length, total: icons.length, icons: c })};\n${CODE}\n`;
    if (code.length > 50000) throw new Error(`icons chunk ${n + 1} is ${code.length} chars`);
    const f = `06-icons-${n + 1}.js`;
    await writeFile(join(OUT, 'calls', f), code);
    files.push(`${f} (${c.length} icons, ${code.length} chars)`);
}
// ---------- import route: one SVG sheet the designer drags into Figma, + a short converter call ----------
// Each icon is <g id="<name>__<hash>" transform="translate(x y)"> with an invisible 'bounds' rect (the 14px icon box) and its glyph scaled to px.
// Figma's SVG import drops the invisible (fill=none) bounds rect, so the converter locates each box from sheet origin + translate instead.
const COLS = 20, CELL = 24;
const groups = icons.map((i, n) => {
    const x = (n % COLS) * CELL, y = Math.floor(n / COLS) * CELL;
    const k = i.width / i.vb[0];
    return `<g id="${i.name}__${i.hash}" transform="translate(${x} ${y})"><rect id="bounds" width="${i.width}" height="${i.height}" fill="none"/><path transform="scale(${k} ${i.height / i.vb[1]})" d="${i.d}" fill="#000"/></g>`;
});
const SW = COLS * CELL, SH = Math.ceil(icons.length / COLS) * CELL;
await writeFile(join(OUT, 'icons/icons-sheet.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="${SW}" height="${SH}" viewBox="0 0 ${SW} ${SH}">\n${groups.join('\n')}\n</svg>\n`);
const SHEET = { version: pkg.version, sheet: [SW, SH], icons: icons.map((i, n) => [i.name, i.hash, i.width, i.height, i.source, (n % COLS) * CELL, Math.floor(n / COLS) * CELL, i.at || null]) };
const SHEET_CODE = `const page=figma.root.children.find(p=>p.name==='01 Foundations');if(!page)return {error:'page 01 Foundations missing'};await figma.setCurrentPageAsync(page);
const tv=(await figma.variables.getLocalVariablesAsync('COLOR')).find(v=>v.name==='text/color');if(!tv)return {error:'variable text/color missing'};
const want=new Map(D.icons.map(i=>[i[0],i]));const RX=/^([a-z0-9-]+)__([0-9a-f]{8})$/;
const sheet=page.children.find(n=>'children' in n&&n.findAll&&n.findAll(c=>RX.test(c.name)).length>50);
if(!sheet)return {error:'Imported sheet not found on 01 Foundations. Drag tokens/figma/icons/icons-sheet.svg onto the page first.'};
if(Math.abs(sheet.width-D.sheet[0])>0.01||Math.abs(sheet.height-D.sheet[1])>0.01)return {error:'Sheet is '+sheet.width+'x'+sheet.height+', expected '+D.sheet.join('x')+' (imported scaled?). Re-import at 100%.'};
const ox=sheet.absoluteTransform[0][2],oy=sheet.absoluteTransform[1][2];
let host=page.findChild(n=>n.type==='FRAME'&&n.name==='Icons');
if(!host){host=figma.createFrame();host.name='Icons';page.appendChild(host);host.layoutMode='HORIZONTAL';host.layoutWrap='WRAP';host.itemSpacing=16;host.counterAxisSpacing=16;host.paddingTop=host.paddingBottom=host.paddingLeft=host.paddingRight=24;host.primaryAxisSizingMode='FIXED';host.counterAxisSizingMode='AUTO';host.resize(960,100);host.fills=[];}
const existing=new Map(host.children.filter(n=>n.type==='COMPONENT'&&n.name.startsWith('Icon/')).map(c=>[c.name.slice(5),c]));
let created=0,updated=0,unchanged=0;const errors=[];
for(const g of sheet.findAll(c=>RX.test(c.name))){const [,name,hash]=g.name.match(RX);const spec=want.get(name);
if(!spec){errors.push(name+': not in this generator run');continue;}if(spec[1]!==hash){errors.push(name+': sheet is from another run (hash differs); regenerate');continue;}
let comp=existing.get(name);const tag='hash:'+hash;if(comp&&comp.description.includes(tag)){unchanged++;continue;}
const vecs=g.findAll(c=>c.type==='VECTOR'||c.type==='BOOLEAN_OPERATION');if(!vecs.length){errors.push(name+': no vector in group');continue;}
const bx=ox+spec[5],by=oy+spec[6];
const shape=vecs.length>1?figma.flatten(vecs):(vecs[0].type==='VECTOR'?vecs[0]:figma.flatten(vecs));
const sx=shape.absoluteTransform[0][2]-bx,sy=shape.absoluteTransform[1][2]-by;
const at=spec[7];if(at?(Math.abs(sx-at[0])>0.05||Math.abs(sy-at[1])>0.05):(sx<-0.05||sy<-0.05||sx+shape.width>spec[2]+0.05||sy+shape.height>spec[3]+0.05)){errors.push(name+': glyph at '+[sx,sy].map(v=>v.toFixed(2))+', expected '+(at||'inside box'));continue;}
if(!comp){comp=figma.createComponent();host.appendChild(comp);comp.name='Icon/'+name;created++;existing.set(name,comp);}else{for(const c of [...comp.children])c.remove();updated++;}
comp.resize(spec[2],spec[3]);comp.fills=[];comp.clipsContent=false;comp.appendChild(shape);shape.x=sx;shape.y=sy;shape.name='Shape';
shape.constraints={horizontal:'SCALE',vertical:'SCALE'};shape.strokes=[];
shape.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',tv)];
comp.description=spec[4]+'. Drawn from the source that renders in code. Box '+spec[2]+'x'+spec[3]+' px (icon size 14px). Color: text/color, override on instances. '+tag;}
const total=host.children.filter(n=>n.type==='COMPONENT'&&n.name.startsWith('Icon/')).length;
if(!errors.length)sheet.remove();
return {created,updated,unchanged,errors,iconComponentsNow:total,expected:D.icons.length,sheetRemoved:!errors.length};`;
await writeFile(join(OUT, 'calls/06-icons-from-sheet.js'), `const D=${JSON.stringify(SHEET)};\n${SHEET_CODE}\n`);
console.log(`Icons: ${icons.length} (${icons.length - 1} PrimeIcons ${pkg.version} + PrimeNG spinner) → ${chunks.length} calls`);
for (const f of files) console.log('  calls/' + f);
