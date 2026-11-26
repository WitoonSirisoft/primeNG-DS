// Plugin code for figma-chart.mjs (Chart; DECISIONS #102). Placeholders HELPERS / FRESH (in comment markers) are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Chart/Label','Chart/Label medium']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const P4=['Top','Right','Bottom','Left'];const CR=['topLeftRadius','topRightRadius','bottomRightRadius','bottomLeftRadius'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const rad=(f,n)=>{for(const k of CR)f.setBoundVariable(k,V(n));};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const fr=(parent,name,dir)=>{const f=figma.createFrame();f.name=name;parent.appendChild(f);f.layoutMode=dir;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.fills=[];f.clipsContent=false;return f;};
/*HELPERS*/
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const sync=async(c,fn,it)=>{if(/*FRESH*/){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const set=(n,first)=>{let s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);s=figma.combineAsVariants([c],pg);s.name=n;}return s;};
const variants=async(S,names,fn)=>{const by={};for(const c of S.children)by[c.name]=c;for(const [n,it] of names){let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}await sync(c,fn,it);}};
const row=(S,gap)=>{S.layoutMode='HORIZONTAL';S.layoutWrap='WRAP';S.primaryAxisSizingMode='AUTO';S.counterAxisSizingMode='AUTO';S.itemSpacing=gap||32;S.counterAxisSpacing=32;S.counterAxisAlignItems='CENTER';P4.forEach(s=>S['padding'+s]=24);};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const out={};
// Geometry measured on the Chart.js captures (canvas 504 × 340, Sakai Chart demo data). Shapes are a static picture of the demo.
const W=504,H=340;
const vec=(parent,name,d,strokeVar,sw,fillVar)=>{ // path in canvas coordinates; Figma re-bases the path to the curve's bounds, so re-anchor on the first point
 const v=figma.createVector();parent.appendChild(v);v.name=name;v.vectorPaths=[{windingRule:fillVar?'NONZERO':'NONE',data:d}];
 const o=d.match(/-?\d+(\.\d+)?/g).map(Number),g=v.vectorPaths[0].data.match(/-?\d+(\.\d+)?/g).map(Number);v.x=o[0]-g[0];v.y=o[1]-g[1];
 v.strokes=strokeVar?[paint(V(strokeVar))]:[];if(strokeVar){v.strokeWeight=sw;v.strokeCap='NONE';v.strokeJoin='ROUND';}v.fills=fillVar?[paint(V(fillVar))]:[];return v;};
const label=async(parent,str,style,col,cx,cy,align)=>{const t=await txt(parent,str,style,col,'Tick '+str);t.textAutoResize='WIDTH_AND_HEIGHT';t.x=align==='right'?cx-t.width:cx-t.width/2;t.y=cy-t.height/2;return t;};
const group=(parent,name)=>{const f=figma.createFrame();parent.appendChild(f);f.name=name;f.resize(W,H);f.x=0;f.y=0;f.fills=[];f.clipsContent=false;return f;};

// ---------- Chart Legend Item ----------
const LG=set('Chart Legend Item','Style=box');
LG.description='Chart.js legend item (canvas) | Version: 0.1.0 | Status: experimental (#102) | Style box = bar dataset (filled 40 × 12), outlined = line dataset (fill + 3px border), point = pie / doughnut (usePointStyle circle, 2px border) | Label prop; override the Swatch colour per dataset | Text Chart/Label, text/color (Sakai: legend labels color --text-color)';
K=props(LG,[['Label','TEXT','First Dataset']]);
async function lgBuild(c,it){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.itemSpacing=it.s==='point'?6:7;c.fills=[];c.clipsContent=false;
 let sw;if(it.s==='point'){sw=figma.createEllipse();c.appendChild(sw);sw.resize(12,12);sw.strokes=[paint(V('surface/0'))];sw.strokeWeight=2;sw.strokeAlign='CENTER';}
 else{sw=figma.createRectangle();c.appendChild(sw);sw.resize(40,12);if(it.s==='outlined'){sw.strokes=[paint(V('primary/500'))];sw.strokeWeight=3;sw.strokeAlign='CENTER';}}
 sw.name='Swatch';sw.fills=[paint(V(it.s==='outlined'?'primary/100':'primary/500'))]; // outlined default: light fill + border so the style reads; the Chart sets fill = border (Sakai data)
 const t=await txt(c,'First Dataset','Chart/Label','text/color','Label');REF(t,{characters:K['Label']});}
await variants(LG,['box','outlined','point'].map(s=>['Style='+s,{s}]),lgBuild);row(LG);

// ---------- Chart ----------
const CH=set('Chart','Type=line');
CH.description='PrimeNG: <p-chart [type] [data] [options]> (Chart.js canvas) | Story: components-chart--playground | Version: 0.1.0 | Status: experimental (#102) | A static picture of the Sakai Chart demo (504 × 340): redraw the series for other data | Colours = Sakai lookups: primary/500 + primary/200 (line, bar), indigo / purple / teal 500 (pie, doughnut), ticks text/muted-color, grid content/border-color, legend text/color | Font Lato via Chart.defaults.font.family (Chart.js default is Helvetica)';
const MONTHS=['January','February','March','April','May','June','July'];const D1=[65,59,80,81,56,55,40],D2=[28,48,40,19,86,27,90];
const legend=async(c,items,style)=>{const lf=fr(c,'Legend','HORIZONTAL');lf.itemSpacing=10;lf.counterAxisAlignItems='CENTER';
 for(const [lab,col] of items){const i=LG.children.find(x=>x.name==='Style='+style).createInstance();lf.appendChild(i);i.name=lab;i.isExposedInstance=true;P(i,{Label:lab});const s=i.findOne(x=>x.name==='Swatch');s.fills=[paint(V(col))];if(style==='outlined')s.strokes=[paint(V(col))];}
 lf.layoutWrap='WRAP';lf.primaryAxisSizingMode='FIXED';lf.resize(W,lf.height);lf.counterAxisSizingMode='AUTO';lf.primaryAxisAlignItems='CENTER';lf.counterAxisSpacing=10;lf.x=0;lf.y=16-lf.height/2;return lf;}; // full width, centred, wraps like Chart.js
const spline=(pts,t,top,bot)=>{let d='M '+pts[0][0]+' '+pts[0][1];const cp=[];
 for(let i=0;i<pts.length;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1]||pts[i];const d01=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),d12=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);
  const s01=d01/(d01+d12||1),s12=d12/(d01+d12||1),fa=t*s01,fb=t*s12;const cl=v=>Math.max(top,Math.min(bot,v));
  cp.push({prev:[p1[0]-fa*(p2[0]-p0[0]),cl(p1[1]-fa*(p2[1]-p0[1]))],next:[p1[0]+fb*(p2[0]-p0[0]),cl(p1[1]+fb*(p2[1]-p0[1]))]});}
 const r=v=>Math.round(v*100)/100;for(let i=1;i<pts.length;i++){d+=' C '+r(cp[i-1].next[0])+' '+r(cp[i-1].next[1])+' '+r(cp[i].prev[0])+' '+r(cp[i].prev[1])+' '+r(pts[i][0])+' '+r(pts[i][1]);}return d;}; // Chart.js splineCurve, tension 0.4, capped to the chart area
async function chBuild(c,it){CUR=c;c.layoutMode='NONE';c.resize(W,H);c.fills=[];c.clipsContent=false;const ty=it.t;
 if(ty==='line'||ty==='bar'){
  const L=27.5,R=ty==='line'?490:504,T=32,B=311.5,min=ty==='line'?10:0,max=90,step=10;const yv=v=>B-(v-min)/(max-min)*(B-T);
  const n=7,xc=ty==='line'?(i=>L+i*(R-L)/(n-1)):(i=>L+(i+0.5)*(R-L)/n);
  const g=group(c,'Grid');for(let v=min;v<=max;v+=step)vec(g,'y '+v,'M '+(L-8)+' '+yv(v)+' L '+R+' '+yv(v),'content/border-color',1);
  if(ty==='line'){for(let i=0;i<n;i++)vec(g,'x '+MONTHS[i],'M '+xc(i)+' '+T+' L '+xc(i)+' '+(B+8),'content/border-color',1);}
  const tk=group(c,'Ticks');for(let v=min;v<=max;v+=step)await label(tk,String(v),'Chart/Label','text/muted-color',L-10,yv(v),'right');
  for(let i=0;i<n;i++)await label(tk,MONTHS[i],ty==='bar'?'Chart/Label medium':'Chart/Label','text/muted-color',xc(i),329);
  const S=[[ty==='line'?'First Dataset':'My First dataset',D1,'primary/500'],[ty==='line'?'Second Dataset':'My Second dataset',D2,'primary/200']];
  for(const [si,[lab,data,col]] of S.entries()){const sg=group(c,'Series '+(si+1)+' · '+lab);
   if(ty==='line'){vec(sg,'Line',spline(data.map((v,i)=>[xc(i),yv(v)]),0.4,T,B),col,3);data.forEach((v,i)=>{const e=figma.createEllipse();sg.appendChild(e);e.name='Point '+MONTHS[i];e.resize(7,7);e.x=xc(i)-3.5;e.y=yv(v)-3.5;e.fills=[paint(V(col))];});}
   else{const cw=(R-L)/n,bw=cw*0.8/2*0.9;data.forEach((v,i)=>{const r=figma.createRectangle();sg.appendChild(r);r.name='Bar '+MONTHS[i];const x0=xc(i)-bw+si*bw;r.resize(bw,B-yv(v));r.x=x0;r.y=yv(v);r.fills=[paint(V(col))];});}}
  await legend(c,S.map(s=>[s[0],s[2]]),ty==='line'?'outlined':'box');}
 else{const cx=252,cy=186,R=151,vals=[540,325,702],cols=['indigo/500','purple/500','teal/500'],tot=vals.reduce((a,b)=>a+b,0);let a=-Math.PI/2;const sg=group(c,'Series · A B C');
  vals.forEach((v,i)=>{const e=figma.createEllipse();sg.appendChild(e);e.name='Arc '+'ABC'[i];e.resize(2*R,2*R);e.x=cx-R;e.y=cy-R;const a2=a+v/tot*2*Math.PI;e.arcData={startingAngle:a,endingAngle:a2,innerRadius:ty==='doughnut'?0.5:0};a=a2;
   e.fills=[paint(V(cols[i]))];e.strokes=[paint(V('surface/0'))];e.strokeWeight=2;e.strokeAlign='CENTER';}); // Chart.js arc border #fff (2px)
  await legend(c,[['A',cols[0]],['B',cols[1]],['C',cols[2]]],'point');}}
await variants(CH,['line','bar','pie','doughnut'].map(t=>['Type='+t,{t}]),chBuild);row(CH);
out.chart=CH.children.map(c=>c.name+' '+c.width+'x'+c.height);out.legend=LG.children.map(c=>c.name+' '+c.width+'x'+c.height);
for(const n of [LG,CH])if(n.y<1)place(n);
return {ids:{legend:LG.id,chart:CH.id},...out};
