// Plugin code for figma-formfield.mjs (Form Field + Form Layout pattern; DECISIONS #102). Placeholders HELPERS / FRESH (in comment markers) are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Body/Base','Form/Help','Card/Title']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
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
const SETF=n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing '+n);return s;};
const pick=(S,want)=>{const v=S.children.find(c=>Object.entries(want).every(([k,val])=>c.variantProperties&&c.variantProperties[k]===val));if(!v)throw new Error(S.name+': no variant '+JSON.stringify(want));return v;};
const IT=SETF('InputText'),TA=SETF('Textarea'),SE=SETF('Select'),MS=SETF('Message'),BT=SETF('Button');
const CTRL=(S,inv,content)=>pick(S,{Size:'base',Variant:'outlined',State:'default',Invalid:inv?'true':'false',Content:content||'empty'});
const PREF=['InputText','Textarea','Select','InputNumber','Password','DatePicker','MultiSelect','AutoComplete'].map(n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);return s?{type:'COMPONENT_SET',key:s.key}:null;}).filter(Boolean);
const LW=70.83; // horizontal label column = 2 of 12 grid columns (gap 0.5rem) at 460 wide; Sakai: col-span-2 / col-span-10
const W=460;

// ---------- Form Field ----------
const FF=set('Form Field','Layout=vertical, State=default');
FF.description='Form row (label + control + help / error) | Sakai Form Layout markup + PrimeNG forms docs (error = <p-message severity="error" size="small" variant="simple">) | Version: 0.1.0 | Status: experimental (#103) | Control = swap slot (InputText default; preferred Textarea, Select, InputNumber, Password, DatePicker, MultiSelect, AutoComplete); set the control Invalid in State=invalid | Layout horizontal: label 2/12 columns, aligned to the control | Help text Form/Help 11.2px (80% of the 14px root, 1:1 with the browser) | Error = exposed Message (edit its Text) | Show label off = visually hidden label (sr-only, Inline form)';
K=props(FF,[['Label','TEXT','Username'],['Show label','BOOLEAN',true],['Help text','TEXT','Enter your username to reset your password.'],['Show help','BOOLEAN',false]]);
if(!K['Control'])K['Control']=FF.addComponentProperty('Control','INSTANCE_SWAP',CTRL(IT,false).id,{preferredValues:PREF});
async function ffBuild(c,it){CUR=c;const hz=it.l==='horizontal',inv=it.s==='invalid';c.layoutMode=hz?'HORIZONTAL':'VERTICAL';c.primaryAxisSizingMode=hz?'FIXED':'AUTO';c.counterAxisSizingMode=hz?'AUTO':'FIXED';c.resize(W,40);if(hz)c.counterAxisSizingMode='AUTO';else c.primaryAxisSizingMode='AUTO';
 c.itemSpacing=7;c.counterAxisAlignItems='MIN';c.fills=[];c.clipsContent=false; // gap-2
 let lab;if(hz){const lc=fr(c,'Label column','VERTICAL');lc.primaryAxisSizingMode='AUTO';lc.counterAxisSizingMode='FIXED';lc.resize(LW,20);lc.counterAxisSizingMode='FIXED';lc.paddingTop=8; // centre of a 32.8 control: (32.8 − 16.8) / 2
  lab=await txt(lc,'Username','Body/Base','text/color','Label');REF(lc,{visible:K['Show label']});}
 else{lab=await txt(c,'Username','Body/Base','text/color','Label');REF(lab,{visible:K['Show label']});}
 REF(lab,{characters:K['Label']});
 const body=hz?fr(c,'Field','VERTICAL'):c;if(hz){body.layoutSizingHorizontal='FILL';body.itemSpacing=7;}
 const ctl=CTRL(IT,inv,inv?'value':'empty').createInstance();body.appendChild(ctl);ctl.name='Control';ctl.layoutSizingHorizontal='FILL';ctl.isExposedInstance=true;if(inv)P(ctl,{Value:'ab'});REF(ctl,{mainComponent:K['Control']});
 const hp=await txt(body,'Enter your username to reset your password.','Form/Help','text/color','Help');hp.layoutSizingHorizontal='FILL';hp.textAutoResize='HEIGHT';hp.visible=false;REF(hp,{characters:K['Help text'],visible:K['Show help']});
 if(inv){const m=pick(MS,{Severity:'error',Variant:'simple',Size:'small'}).createInstance();body.appendChild(m);m.name='Error';m.layoutSizingHorizontal='FILL';m.isExposedInstance=true;P(m,{'Show icon':false,Text:'Username must be at least 3 characters.'});}} // error text: edit the exposed Error message
await variants(FF,[['vertical','default'],['vertical','invalid'],['horizontal','default'],['horizontal','invalid']].map(([l,s])=>['Layout='+l+', State='+s,{l,s}]),ffBuild);row(FF);
out.ff=FF.children.map(c=>c.name+' '+c.width+'x'+c.height);

// ---------- Form Layout (pattern, 03 Patterns) ----------
const PP=figma.root.children.find(p=>p.name==='03 Patterns');await PP.loadAsync();
let FL=PP.findOne(x=>x.type==='COMPONENT'&&x.name==='Form Layout');if(!FL){FL=figma.createComponent();FL.name='Form Layout';pg.appendChild(FL);}
FL.description='Sakai Form Layout page (formlayoutdemo.ts) | Version: 0.1.0 | Status: experimental (#103) | 6 cards built from Form Field: Vertical, Vertical Grid, Horizontal, Inline, Help Text, Advanced | 1060 wide (desktop App Shell content) | Cards use the Card look (layout/card/*) as frames so their content can be edited in place';
const CARD=pg.findOne(x=>x.type==='COMPONENT'&&x.name==='Card');
const cardFrame=async(parent,title,gap)=>{const f=fr(parent,'Card · '+title,'VERTICAL');f.layoutSizingHorizontal='FILL';f.itemSpacing=gap;
 for(const k of ['paddingTop','paddingRight','paddingBottom','paddingLeft','topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']){const b=CARD.boundVariables&&CARD.boundVariables[k];if(b)f.setBoundVariable(k,await figma.variables.getVariableByIdAsync(b.id));else f[k]=CARD[k];}
 f.fills=CARD.fills;f.strokes=CARD.strokes;f.effects=CARD.effects;
 await txt(f,title,'Card/Title','text/color','Title');return f;};
const field=(parent,label,opts)=>{const o=opts||{};const v=pick(FF,{Layout:o.h?'horizontal':'vertical',State:'default'}).createInstance();parent.appendChild(v);v.name=label;if(o.fill!==false)v.layoutSizingHorizontal='FILL';
 P(v,{Label:label,...(o.help?{'Show help':true,'Help text':o.help}:{}),...(o.hide?{'Show label':false}:{})});
 if(o.ctrl)P(v,{Control:o.ctrl.id});
 if(o.ph){const c=v.findOne(x=>x.name==='Control');P(c,{Content:'placeholder',Placeholder:o.ph});}
 return v;};
await sync(FL,async c=>{CUR=c;c.layoutMode='VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.resize(1060,800);c.primaryAxisSizingMode='AUTO';c.itemSpacing=28;c.fills=[paint(V('layout/surface-ground'))];c.clipsContent=false;
 const rw=fr(c,'Columns','HORIZONTAL');rw.layoutSizingHorizontal='FILL';rw.itemSpacing=28; // gap-8
 const c1=fr(rw,'Column 1','VERTICAL');c1.layoutSizingHorizontal='FILL';c1.setBoundVariable('itemSpacing',V('layout/card/gap'));
 const c2=fr(rw,'Column 2','VERTICAL');c2.layoutSizingHorizontal='FILL';c2.setBoundVariable('itemSpacing',V('layout/card/gap'));
 let k=await cardFrame(c1,'Vertical',14);for(const l of ['Name','Email','Age'])field(k,l);
 k=await cardFrame(c1,'Vertical Grid',14);let g=fr(k,'Grid','HORIZONTAL');g.layoutSizingHorizontal='FILL';g.itemSpacing=21;field(g,'Name');field(g,'Email');
 k=await cardFrame(c2,'Horizontal',14);field(k,'Name',{h:true});field(k,'Email',{h:true});
 k=await cardFrame(c2,'Inline',14);g=fr(k,'Inline','HORIZONTAL');g.itemSpacing=21;g.counterAxisAlignItems='MIN';field(g,'Firstname',{hide:true,ph:'Firstname',fill:false});field(g,'Lastname',{hide:true,ph:'Lastname',fill:false});
 for(const n of g.children){n.layoutSizingHorizontal='FIXED';n.resize(159.5,n.height);}
 const sb=pick(BT,{Severity:'primary',Variant:'solid',Size:'base',State:'default',Rounded:'false'}).createInstance();g.appendChild(sb);sb.name='Submit';P(sb,{Label:'Submit','Icon left':false,'Icon right':false});
 k=await cardFrame(c2,'Help Text',14);field(k,'Username',{help:'Enter your username to reset your password.'});
 k=await cardFrame(c,'Advanced',21);g=fr(k,'Row 1','HORIZONTAL');g.layoutSizingHorizontal='FILL';g.itemSpacing=21;field(g,'Firstname');field(g,'Lastname');
 const ad=field(k,'Address',{ctrl:CTRL(TA,false)});ad.itemSpacing=0; // Sakai: flex flex-wrap without gap
 g=fr(k,'Row 3','HORIZONTAL');g.layoutSizingHorizontal='FILL';g.itemSpacing=21;field(g,'State',{ctrl:CTRL(SE,false,'placeholder')});field(g,'Zip');
 const st=g.children[0].findOne(x=>x.name==='Control');P(st,{Placeholder:'Select One'});});
if(FL.parent!==PP){PP.appendChild(FL);let y=40;for(const n of PP.children)if(n!==FL)y=Math.max(y,n.y+n.height+200);FL.x=0;FL.y=y;}
out.fl=FL.width+'x'+FL.height;out.cards=FL.findAll(x=>x.name.startsWith('Card · ')).map(x=>x.name.slice(7)+' '+Math.round(x.width*100)/100+'x'+Math.round(x.height*100)/100);
for(const n of [FF])if(n.y<1)place(n);
return {ids:{field:FF.id,layout:FL.id},...out};
