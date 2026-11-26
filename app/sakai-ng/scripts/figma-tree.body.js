// Plugin code for figma-tree.mjs (Tree, TreeTable; DECISIONS #102). Placeholders HELPERS / FRESH (in comment markers) are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Body/Base','DataTable/Column title']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
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
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const icon=(parent,name,col,nm)=>{const i=IC(name).createInstance();parent.appendChild(i);i.name=nm;i.setBoundVariable('width',V('icon-size'));i.setBoundVariable('height',V('icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const CB=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='Checkbox');const cbv=ck=>{const v=CB.children.find(c=>c.name==='Size=base, Variant=outlined, State=default, Invalid=false, Checked='+ck);if(!v)throw new Error('Checkbox variant '+ck);return v;};
const tbox=(parent,sizeVar)=>{const f=figma.createFrame();f.name='Toggle button';parent.appendChild(f);f.layoutMode='HORIZONTAL';f.primaryAxisAlignItems='CENTER';f.counterAxisAlignItems='CENTER';f.primaryAxisSizingMode='FIXED';f.counterAxisSizingMode='FIXED';f.setBoundVariable('width',V(sizeVar));f.setBoundVariable('height',V(sizeVar));f.fills=[];f.cornerRadius=9999;f.clipsContent=false;return f;}; // circle (#47)
const bline=(f,col)=>{f.strokes=[paint(V(col))];f.strokeAlign='INSIDE';f.strokeTopWeight=0;f.strokeRightWeight=0;f.strokeLeftWeight=0;f.strokeBottomWeight=1;}; // border-width 0 0 1px 0 (theme CSS)
const bgLayer=(c,bgv,radv)=>{const bg=figma.createRectangle();bg.name='Background';c.insertChild(0,bg);bg.layoutPositioning='ABSOLUTE';bg.resize(c.width,c.height);bg.x=0;bg.y=0;bg.constraints={horizontal:'STRETCH',vertical:'STRETCH'};if(radv)rad(bg,radv);bg.fills=[paint(V(bgv))];bg.setBoundVariable('opacity',V(bgv+'-opacity'));return bg;}; // color-mix → layer opacity (#25)
const wrapW=(c,t,w)=>{c.primaryAxisSizingMode='FIXED';c.resize(w,c.height);c.counterAxisSizingMode='AUTO';t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';}; // long text wraps
const comp=n=>{let c=pg.children.find(x=>x.type==='COMPONENT'&&x.name===n);if(!c){c=figma.createComponent();c.name=n;pg.appendChild(c);}return c;};
const cbox=(c,show)=>{const cb=cbv('no').createInstance();c.appendChild(cb);cb.name='Checkbox';cb.visible=false;REF(cb,{visible:show});cb.isExposedInstance=true;return cb;};

// ---------- Tree Node ----------
const TN=set('Tree Node','Toggle=expanded, State=default');
TN.description='PrimeNG: <p-tree> node content (.p-tree-node-content: toggle button, checkbox, icon, label) | Story: components-tree--playground | Version: 0.1.0 | Status: experimental (#102) | Toggle leaf keeps the toggle space (visibility hidden) | State selected = selectionMode single; checkbox mode = Show checkbox + the exposed Checkbox (Checked yes / indeterminate) | Indent: put children in a Children frame with padding-left tree/indent';
K=props(TN,[['Label','TEXT','Documents'],['Show checkbox','BOOLEAN',false],['Show icon','BOOLEAN',true],['Icon','INSTANCE_SWAP',IC('Icon/folder').id]]);
async function tnBuild(c,it){CUR=c;const {tg,st}=it;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.setBoundVariable('itemSpacing',V('tree/node/gap'));pad(c,'tree/node/padding-y','tree/node/padding-x','tree/node/padding-y','tree/node/padding-x');rad(c,'tree/node/border-radius');c.clipsContent=false;
 c.fills=st==='hover'?[paint(V('tree/node/hover-background'))]:[];
 const tb=tbox(c,'tree/node-toggle-button/size');if(tg!=='leaf')icon(tb,tg==='expanded'?'Icon/chevron-down':'Icon/chevron-right',st==='selected'?'tree/node/selected-color':'tree/node-toggle-button/color','Toggle icon');
 cbox(c,K['Show checkbox']);
 const ic=icon(c,'Icon/folder',{default:'tree/node-icon/color',hover:'tree/node-icon/hover-color',selected:'tree/node-icon/selected-color'}[st],'Icon');REF(ic,{visible:K['Show icon'],mainComponent:K['Icon']});
 const t=await txt(c,'Documents','Body/Base',{default:'tree/node/color',hover:'tree/node/hover-color',selected:'tree/node/selected-color'}[st],'Label');REF(t,{characters:K['Label']});wrapW(c,t,200);if(st==='selected')bgLayer(c,'tree/node/selected-background','tree/node/border-radius');}
const TNV=[];for(const tg of ['expanded','collapsed','leaf'])for(const st of ['default','hover','selected'])TNV.push(['Toggle='+tg+', State='+st,{tg,st}]);
await variants(TN,TNV,tnBuild);row(TN);out.node=[...new Set(TN.children.map(c=>c.width+'x'+c.height))];

// ---------- Tree ----------
const TR=set('Tree','Selection=single');
TR.description='PrimeNG: <p-tree [value] selectionMode> | Story: components-tree--playground | Version: 0.1.0 | Status: experimental (#102) | Prefilled with the Sakai files demo (Documents > Work > Expenses.doc, Resume.doc; Home; Events; Movies); Resume.doc selected | Nodes are exposed: set Label, Icon, Toggle, State, Checkbox | Collapse a node: Toggle collapsed + hide its Children frame';
const NODES=[['Documents','folder','expanded',[['Work','cog','expanded',[['Expenses.doc','file','leaf'],['Resume.doc','file','leaf',null,true]]],['Home','home','collapsed']]],['Events','calendar','collapsed'],['Movies','star-fill','collapsed']];
async function trBuild(c,it){CUR=c;const ck=it.s==='checkbox';c.layoutMode='VERTICAL';c.counterAxisSizingMode='FIXED';c.resize(384,100);c.primaryAxisSizingMode='AUTO';pad(c,'tree/padding','tree/padding','tree/padding','tree/padding');c.fills=[paint(V('tree/background'))];c.clipsContent=false;
 const list=(parent,name,child)=>{const f=fr(parent,name,'VERTICAL');f.layoutSizingHorizontal='FILL';f.setBoundVariable('itemSpacing',V('tree/gap'));f.setBoundVariable('paddingTop',V('tree/gap'));if(child)f.setBoundVariable('paddingLeft',V('tree/indent'));return f;};
 const walk=(parent,nodes)=>{for(const [l,ic,tg,kids,sel] of nodes){const n=fr(parent,'Node · '+l,'VERTICAL');n.layoutSizingHorizontal='FILL';
  const v=TN.children.find(x=>x.name==='Toggle='+tg+', State='+(sel&&!ck?'selected':'default'));const i=v.createInstance();n.appendChild(i);i.layoutSizingHorizontal='FILL';i.name=l;i.isExposedInstance=true;P(i,{Label:l,Icon:IC('Icon/'+ic).id,'Show checkbox':ck});
  if(ck&&sel)P(i.findOne(x=>x.name==='Checkbox'),{Checked:'yes'});if(kids)walk(list(n,'Children',true),kids);}};
 walk(list(c,'Root',false),NODES);}
await variants(TR,[['Selection=single',{s:'single'}],['Selection=checkbox',{s:'checkbox'}]],trBuild);row(TR);out.tree=TR.children.map(c=>c.name+' '+c.width+'x'+c.height);

// ---------- TreeTable cells ----------
const cellBase=(c,kind)=>{c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.setBoundVariable('itemSpacing',V('treetable/'+kind+'/gap'));pad(c,'treetable/'+kind+'/padding-y','treetable/'+kind+'/padding-x','treetable/'+kind+'/padding-y','treetable/'+kind+'/padding-x');bline(c,'treetable/'+kind+'/border-color');c.clipsContent=false;};
const HC=comp('TreeTable Header Cell');HC.description='PrimeNG: <p-treetable> header cell (th) | Version: 0.1.0 | Status: experimental (#102) | Text style DataTable/Column title (column-title font-weight 600)';K=props(HC,[['Text','TEXT','Name']]);
await sync(HC,async c=>{CUR=c;cellBase(c,'header-cell');c.fills=[paint(V('treetable/header-cell/background'))];const t=await txt(c,'Name','DataTable/Column title','treetable/header-cell/color','Text');REF(t,{characters:K['Text']});wrapW(c,t,208);});
const BC=comp('TreeTable Body Cell');BC.description='PrimeNG: <p-treetable> body cell (td) | Version: 0.1.0 | Status: experimental (#102) | Row background / colour come from TreeTable Row';K=props(BC,[['Text','TEXT','100kb']]);
await sync(BC,async c=>{CUR=c;cellBase(c,'body-cell');c.fills=[];const t=await txt(c,'100kb','Body/Base','treetable/row/color','Text');REF(t,{characters:K['Text']});wrapW(c,t,208);});
const TC=set('TreeTable Toggler Cell','Toggle=expanded, Level=0');
TC.description='PrimeNG: <p-treetable> first cell with <p-treetable-toggler> (+ <p-treetable-checkbox>) | Version: 0.1.0 | Status: experimental (#102) | Level indent = 16px per level (PrimeNG inline margin, not a token) | Toggle leaf keeps the space (visibility hidden) | Show checkbox + exposed Checkbox (yes / indeterminate)';
K=props(TC,[['Text','TEXT','Applications'],['Show checkbox','BOOLEAN',false]]);
async function tcBuild(c,it){CUR=c;const {tg,lv}=it;cellBase(c,'body-cell');c.fills=[];
 const ind=fr(c,'Indent','HORIZONTAL');ind.counterAxisAlignItems='CENTER';if(lv>0){const sp=figma.createFrame();sp.name='Spacer';ind.appendChild(sp);sp.resize(16*lv,1);sp.fills=[];}
 const tb=tbox(ind,'treetable/node-toggle-button/size');if(tg!=='leaf')icon(tb,tg==='expanded'?'Icon/chevron-down':'Icon/chevron-right','treetable/node-toggle-button/color','Toggle icon');
 cbox(c,K['Show checkbox']);const t=await txt(c,'Applications','Body/Base','treetable/row/color','Text');REF(t,{characters:K['Text']});wrapW(c,t,208);}
const TCV=[];for(const tg of ['expanded','collapsed','leaf'])for(const lv of [0,1,2])TCV.push(['Toggle='+tg+', Level='+lv,{tg,lv}]);
await variants(TC,TCV,tcBuild);row(TC);

// ---------- TreeTable Row ----------
const RW=set('TreeTable Row','State=default');
RW.description='PrimeNG: <p-treetable> body row (tr) | Version: 0.1.0 | Status: experimental (#102) | 3 exposed cells (Name = toggler cell, Size, Type); add / remove cells for other columns | State hover / selected = row background + text colour';
async function rwBuild(c,it){CUR=c;const st=it.st;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(624,46.5);c.counterAxisSizingMode='AUTO';c.clipsContent=false;
 c.fills=[paint(V(st==='hover'?'treetable/row/hover-background':'treetable/row/background'))];
 const cells=[TC.children.find(x=>x.name==='Toggle=expanded, Level=0').createInstance(),BC.createInstance(),BC.createInstance()];['Name','Size','Type'].forEach((n,i)=>{const x=cells[i];c.appendChild(x);x.name=n;x.layoutSizingHorizontal='FILL';x.layoutSizingVertical='FILL';x.isExposedInstance=true;});
 P(cells[2],{Text:'Folder'});
 if(st!=='default'){const col=V(st==='hover'?'treetable/row/hover-color':'treetable/row/selected-color');for(const t of c.findAll(x=>x.type==='TEXT'))t.fills=[paint(col)];if(st==='selected'){const s=c.findOne(x=>x.name==='Toggle icon');if(s)s.findOne(x=>x.name==='Shape').fills=[paint(col)];bgLayer(c,'treetable/row/selected-background',null);}}}
await variants(RW,['default','hover','selected'].map(st=>['State='+st,{st}]),rwBuild);RW.layoutMode='VERTICAL';RW.primaryAxisSizingMode='AUTO';RW.counterAxisSizingMode='AUTO';RW.itemSpacing=24;P4.forEach(s=>RW['padding'+s]=24);

// ---------- TreeTable ----------
const TT=set('TreeTable','Selection=plain');
TT.description='PrimeNG: <p-treetable [value] [columns]> | Story: components-treetable--playground | Version: 0.1.0 | Status: experimental (#102) | Prefilled with the Sakai files demo (Name / Size / Type; Applications expanded) | Rows are exposed: set cell Text, Toggle, Level, Checkbox | Selection checkbox = Show checkbox on the Name cells (Applications indeterminate, Editor checked)';
const DATA=[['Applications','100kb','Folder',0,'expanded','indeterminate'],['Angular','25kb','Folder',1,'leaf','no'],['Editor','25kb','Application',1,'leaf','yes'],['Music','50kb','Application',1,'leaf','no'],['Cloud','20kb','Folder',0,'collapsed','no'],['Desktop','150kb','Folder',0,'collapsed','no']];
async function ttBuild(c,it){CUR=c;const ck=it.s==='checkbox';c.layoutMode='VERTICAL';c.counterAxisSizingMode='FIXED';c.resize(624,100);c.primaryAxisSizingMode='AUTO';c.fills=[];c.clipsContent=false;
 const h=fr(c,'Header row','HORIZONTAL');h.layoutSizingHorizontal='FILL';for(const n of ['Name','Size','Type']){const x=HC.createInstance();h.appendChild(x);x.name=n;x.layoutSizingHorizontal='FILL';P(x,{Text:n});}
 for(const [l,s,t,lv,tg,cs] of DATA){const r=RW.children.find(x=>x.name==='State=default').createInstance();c.appendChild(r);r.name=l;r.layoutSizingHorizontal='FILL';r.isExposedInstance=true;
  const nm=r.findOne(x=>x.name==='Name');P(nm,{Toggle:tg,Level:String(lv),Text:l,'Show checkbox':ck});if(ck&&cs!=='no')P(r.findOne(x=>x.name==='Name').findOne(x=>x.name==='Checkbox'),{Checked:cs});
  P(r.findOne(x=>x.name==='Size'),{Text:s});P(r.findOne(x=>x.name==='Type'),{Text:t});}}
await variants(TT,[['Selection=plain',{s:'plain'}],['Selection=checkbox',{s:'checkbox'}]],ttBuild);TT.layoutMode='VERTICAL';TT.primaryAxisSizingMode='AUTO';TT.counterAxisSizingMode='AUTO';TT.itemSpacing=32;P4.forEach(s=>TT['padding'+s]=24);
out.treetable=TT.children.map(c=>c.name+' '+c.width+'x'+c.height);out.row=RW.children.map(c=>c.height);
for(const n of [TN,TR,HC,BC,TC,RW,TT])if(n.y<1)place(n);
return {ids:{node:TN.id,tree:TR.id,header:HC.id,body:BC.id,toggler:TC.id,row:RW.id,treetable:TT.id},...out};
