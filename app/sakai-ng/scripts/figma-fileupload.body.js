// Plugin code for figma-fileupload.mjs (FileUpload; DECISIONS #101). /*HELPERS*/ and /*FRESH*/ are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;await figma.loadFontAsync(TS['Body/Base'].fontName);
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const P4=['Top','Right','Bottom','Left'];const CR=['topLeftRadius','topRightRadius','bottomRightRadius','bottomLeftRadius'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const rad=(f,n)=>{for(const k of CR)f.setBoundVariable(k,V(n));};
const txt=async(parent,str,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS['Body/Base'].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const fr=(parent,name,dir)=>{const f=figma.createFrame();f.name=name;parent.appendChild(f);f.layoutMode=dir;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.fills=[];f.clipsContent=false;return f;};
/*HELPERS*/
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const sync=async(c,fn,it)=>{if(/*FRESH*/){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const SETF=n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing '+n);return s;};
const BTN=SETF('Button'),BI=SETF('Button Icon'),BG=SETF('Badge');
const bv=(S,name)=>{const v=S.children.find(c=>c.name===name);if(!v)throw new Error(S.name+': no '+name);return v;};
const button=(parent,name,sev,state,label,ic)=>{const b=bv(BTN,'Severity='+sev+', Variant=solid, Size=base, State='+state+', Rounded=false').createInstance();b.name=name;parent.appendChild(b);b.isExposedInstance=true;P(b,{Label:label,'Icon left':true,Icon:IC(ic).id});return b;};
const out={};

// ---------- FileUpload File (one row of the file list) ----------
let FF=pg.findOne(x=>x.type==='COMPONENT'&&x.name==='FileUpload File');if(!FF){FF=figma.createComponent();FF.name='FileUpload File';pg.appendChild(FF);FF.x=0;FF.y=below();}
FF.description='PrimeNG: <p-fileupload> file row (.p-fileupload-file: thumbnail, name, size, status badge, remove button) | Story: components-fileupload--playground (files) | Version: 0.1.0 | Status: experimental (#101) | Thumbnail = image fill placeholder (previewWidth 50; images only) | Badge "Pending" = warn badge before upload | Last row: Show divider off (border-block-end 0)';
K=props(FF,[['Name','TEXT','product-photo.png'],['Size','TEXT','70.000 B'],['Show thumbnail','BOOLEAN',true],['Show divider','BOOLEAN',true]]);
await sync(FF,async c=>{CUR=c;c.layoutMode='HORIZONTAL';c.resize(476,80);c.primaryAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.counterAxisAlignItems='CENTER';c.clipsContent=false;c.fills=[];
 const fp='fileupload/file/padding';pad(c,fp,fp,fp,fp);c.setBoundVariable('itemSpacing',V('fileupload/file/gap'));
 const dv=figma.createRectangle();dv.name='Divider';c.appendChild(dv);dv.layoutPositioning='ABSOLUTE';dv.resize(476,1);dv.x=0;dv.y=c.height-1;dv.constraints={horizontal:'STRETCH',vertical:'MAX'};dv.fills=[paint(V('fileupload/file/border-color'))];REF(dv,{visible:K['Show divider']});
 const th=figma.createFrame();th.name='Thumbnail';c.appendChild(th);th.resize(50,50);th.fills=[paint(V('content/hover-background'))];REF(th,{visible:K['Show thumbnail']}); // image placeholder: replace with an image fill
 const inf=fr(c,'Info','VERTICAL');inf.setBoundVariable('itemSpacing',V('fileupload/file/info/gap'));
 const n=await txt(inf,'product-photo.png','fileupload/color','Name');REF(n,{characters:K['Name']});const z=await txt(inf,'70.000 B','fileupload/color','Size');REF(z,{characters:K['Size']});
 const b=bv(BG,'Severity=warn, Circle=false').createInstance();b.name='Status';c.appendChild(b);b.isExposedInstance=true;P(b,{Value:'Pending'});
 const sp=figma.createFrame();sp.name='Spacer';c.appendChild(sp);sp.fills=[];sp.resize(1,1);sp.layoutGrow=1;
 const x=bv(BI,'Severity=danger, Variant=text, Size=base, State=default, Rounded=true').createInstance();x.name='Remove';c.appendChild(x);x.isExposedInstance=true;try{P(x,{Icon:IC('Icon/times').id});}catch(e){}},{});
out.file=FF.width+'x'+FF.height;

// ---------- FileUpload ----------
let S=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='FileUpload');
if(!S){const c=figma.createComponent();c.name='Mode=advanced, Files=false';pg.appendChild(c);S=figma.combineAsVariants([c],pg);S.name='FileUpload';S.x=FF.x+FF.width+120;S.y=FF.y;}
S.description='PrimeNG: <p-fileupload mode="advanced" | "basic"> | Story: components-fileupload--playground | Version: 0.1.0 | Status: experimental (#101) | Advanced: header buttons Choose / Upload / Cancel (Upload + Cancel disabled until files are chosen), content = empty text or progress bar + file rows | Basic: Choose button + chosen file name | Buttons and rows are exposed (labels, icons, files) | Highlight (dragover dashed primary border) not built';
K=props(S,[['Empty text','TEXT','Drag and drop files to here to upload.'],['File name','TEXT','No file chosen']]);
async function build(c,it){CUR=c;c.clipsContent=false;
 if(it.m==='basic'){c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.fills=[];c.setBoundVariable('itemSpacing',V('fileupload/basic/gap'));
  button(c,'Choose','primary','default','Choose','Icon/upload');const t=await txt(c,'No file chosen','fileupload/color','File name');REF(t,{characters:K['File name']});return;}
 c.layoutMode='VERTICAL';c.resize(544,100);c.counterAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.itemSpacing=0;
 c.fills=[paint(V('fileupload/background'))];c.strokes=[paint(V('fileupload/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;rad(c,'fileupload/border-radius');
 const h=fr(c,'Header','HORIZONTAL');h.layoutAlign='STRETCH';h.counterAxisAlignItems='CENTER';const hp='fileupload/header/padding';pad(h,hp,hp,hp,hp);h.setBoundVariable('itemSpacing',V('fileupload/header/gap'));
 const st=it.f?'default':'disabled';button(h,'Choose','primary','default','Choose','Icon/plus');button(h,'Upload','secondary',st,'Upload','Icon/upload');button(h,'Cancel','secondary',st,'Cancel','Icon/times');
 const ct=fr(c,'Content','VERTICAL');ct.layoutSizingHorizontal='FILL';pad(ct,'fileupload/content/padding-top','fileupload/content/padding-right','fileupload/content/padding-bottom','fileupload/content/padding-left');ct.setBoundVariable('itemSpacing',V('fileupload/content/gap'));
 if(!it.f){const t=await txt(ct,'Drag and drop files to here to upload.','fileupload/color','Empty text');REF(t,{characters:K['Empty text']});return;}
 const pb=figma.createFrame();pb.name='Progress';ct.appendChild(pb);pb.layoutAlign='STRETCH';pb.resize(500,3.5);pb.setBoundVariable('height',V('fileupload/progressbar/height'));pb.fills=[paint(V('progressbar/background'))];rad(pb,'progressbar/border-radius');
 const L=fr(ct,'File list','VERTICAL');L.layoutSizingHorizontal='FILL';L.setBoundVariable('itemSpacing',V('fileupload/file-list/gap'));
 for(const [n,name,last] of [['File 1','product-photo.png'],['File 2','banner.png',1]]){const r=FF.createInstance();r.name=n;L.appendChild(r);r.layoutSizingHorizontal='FILL';r.isExposedInstance=true;P(r,{Name:name});if(last)P(r,{'Show divider':false});}}
const by={};for(const c of S.children)by[c.name]=c;
for(const [n,it] of [['Mode=advanced, Files=false',{m:'advanced',f:false}],['Mode=advanced, Files=true',{m:'advanced',f:true}],['Mode=basic, Files=false',{m:'basic',f:false}]]){let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}await sync(c,build,it);}
S.layoutMode='VERTICAL';S.primaryAxisSizingMode='AUTO';S.counterAxisSizingMode='AUTO';S.itemSpacing=24;P4.forEach(s=>S['padding'+s]=24);
out.set=S.id;out.sizes=S.children.map(c=>c.name+' '+c.width+'x'+c.height);out.file_id=FF.id;
return out;
