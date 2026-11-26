// 17-scrollbar-example.js — DataTable overflow examples on 99 Sandbox (DECISIONS #88). Re-running replaces them.
// Uses the rows of the Sakai CRUD example (16-datatable-example.js must have run). Scrollbar = design-only macOS overlay look.
// A: horizontal — table 986 wide in a 600 container (PrimeNG responsive scroll / [scrollable]): caption + paginator stay 600, rows scroll.
// B: vertical — scrollHeight 200: header row stays on top, body rows scroll.
const sb=figma.root.children.find(p=>p.name==='99 Sandbox');const cp=figma.root.children.find(p=>p.name==='02 Components');await cp.loadAsync();await figma.setCurrentPageAsync(sb);
const SB=cp.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='Scrollbar');if(!SB)throw new Error('Run 17-scrollbar-1.js first');
const BAR=d=>SB.children.find(c=>c.name==='Direction='+d);
const EX=sb.findOne(x=>x.type==='FRAME'&&x.name==='DataTable — Example (Sakai CRUD)');if(!EX)throw new Error('Run 16-datatable-example.js first');
for(const n of [...sb.children])if(n.name.startsWith('DataTable — Overflow'))n.remove();
let y0=40;for(const n of sb.children)y0=Math.max(y0,n.y+n.height+200);
const vstack=(name,parent)=>{const f=figma.createFrame();f.name=name;(parent||sb).appendChild(f);f.layoutMode='VERTICAL';f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.fills=[];f.clipsContent=false;return f;};
const rowsOf=(filter)=>EX.children.filter(filter);
// thumb fills the bar; its start / end are the instance padding (layers inside an instance can't be resized)
const setBar=(bar,visible,total,offset)=>{const H=bar.width>bar.height;const track=(H?bar.width:bar.height)-4;const r2=x=>Math.round(x*100)/100;
 const start=r2(2+track*offset/total),end=r2(2+track*(total-visible-offset)/total);
 if(H){bar.paddingLeft=start;bar.paddingRight=end;}else{bar.paddingTop=start;bar.paddingBottom=end;}
 const th=bar.findOne(x=>x.name==='Thumb');return {thumb:H?th.width:th.height,expect:r2(track*visible/total),start,end};};
const out={};
// ---- A: horizontal
{const W=600;const A=vstack('DataTable — Overflow A (horizontal)');A.x=0;A.y=y0;A.resize(W,A.height);A.counterAxisSizingMode='FIXED';
 const cap=EX.findChild(x=>x.name==='Caption').clone();A.appendChild(cap);cap.layoutSizingHorizontal='FILL';
 const box=figma.createFrame();box.name='Table container (overflow-x: auto)';A.appendChild(box);box.layoutMode='HORIZONTAL';box.primaryAxisSizingMode='FIXED';box.counterAxisSizingMode='AUTO';box.layoutSizingHorizontal='FILL';box.clipsContent=true;box.fills=[];
 const content=vstack('Content (scrolled 0)',box);content.layoutSizingHorizontal='HUG';
 for(const r of rowsOf(x=>x.name==='Header row'||x.name.startsWith('Row ')))content.appendChild(r.clone());
 const bar=BAR('horizontal').createInstance();box.appendChild(bar);bar.layoutPositioning='ABSOLUTE';bar.resize(W,bar.height);bar.x=0;bar.y=box.height-bar.height;bar.constraints={horizontal:'STRETCH',vertical:'MAX'};
 out.A={content:content.width,box:box.width,bar:setBar(bar,W,content.width,0)};
 const pag=EX.findChild(x=>x.name==='Paginator').clone();A.appendChild(pag);pag.layoutSizingHorizontal='FILL';}
// ---- B: vertical (scrollHeight 200)
{const H=200;const B=vstack('DataTable — Overflow B (vertical, scrollHeight 200px)');B.x=700;B.y=y0;
 const head=EX.findChild(x=>x.name==='Header row').clone();B.appendChild(head); // sticky thead stays visible
 const box=figma.createFrame();box.name='Table container (scrollHeight 200px)';B.appendChild(box);box.layoutMode='VERTICAL';box.primaryAxisSizingMode='FIXED';box.counterAxisSizingMode='AUTO';box.clipsContent=true;box.fills=[];box.resize(box.width,H);
 const content=vstack('Content (scrolled 0)',box);for(const r of rowsOf(x=>x.name.startsWith('Row ')))content.appendChild(r.clone());
 const bar=BAR('vertical').createInstance();box.appendChild(bar);bar.layoutPositioning='ABSOLUTE';bar.resize(bar.width,H);bar.x=box.width-bar.width;bar.y=0;bar.constraints={horizontal:'MAX',vertical:'STRETCH'};
 out.B={content:content.height,box:box.height,bar:setBar(bar,H,content.height,0)};}
return out;
