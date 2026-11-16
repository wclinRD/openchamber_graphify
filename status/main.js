(()=>{var u="openchamber.sdk",T=1;var Ze=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [data-oc-scrolling] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [data-oc-scrolling] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [data-oc-scrolling]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [data-oc-scrolling] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function Zt(e){let r=e.documentElement;if(r.hasAttribute("data-oc-scrollbar-activity"))return;r.setAttribute("data-oc-scrollbar-activity","");let s=new WeakMap;e.addEventListener("scroll",(p)=>{let E=p.target===e?r:p.target;if(!(E instanceof Element))return;if(!E.hasAttribute("data-oc-scrolling"))E.setAttribute("data-oc-scrolling","");let A=s.get(E);if(A!==void 0)clearTimeout(A);s.set(E,setTimeout(()=>{s.delete(E),E.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var Ko=`(${Zt.toString()})(document);`;var qe=128,et=65536;var Ie=128;var xe=65536;var tt=8000,ot=192000,rt=120000;var qt=(e)=>{let r=[],s=0,p=0;return{push:(E)=>{r.push(E),p+=E.length;while(p-s>e&&r.length>1){let A=r.shift();p-=A?.length??0,s=0}},pull:(E)=>{let A=0;while(A<E.length&&r.length>0){let C=r[0],b=Math.min(E.length-A,C.length-s);if(E.set(C.subarray(s,s+b),A),A+=b,s+=b,s>=C.length)r.shift(),p-=C.length,s=0}E.fill(0,A)},clear:()=>{r.length=0,s=0,p=0},get size(){return p-s}}};var ro=/^[a-z][a-z0-9-]{0,39}$/;var eo=(e)=>Object(e)===e&&!Array.isArray(e),nt=(e,r)=>Object.keys(e).every((s)=>r.includes(s)),to=(e)=>String(e)===e&&e.length>=1&&e.length<=60,oo=(e)=>String(e)===e&&e.length>=1&&e.length<=80,no=(e)=>{if(!Array.isArray(e)||e.length>4)return!1;let r=new Set;for(let s of e){if(!eo(s)||!ro.test(s.id)||!to(s.label))return!1;if(s.disabled!==void 0&&s.disabled!==!0&&s.disabled!==!1)return!1;if(r.has(s.id))return!1;if(r.add(s.id),s.kind==="button"){if(!nt(s,["kind","id","label","disabled"]))return!1;continue}if(s.kind!=="select"||!nt(s,["kind","id","label","value","options","disabled"]))return!1;if(!oo(s.value)||!Array.isArray(s.options)||s.options.length<1||s.options.length>16)return!1;let p=new Set;for(let E of s.options){if(!eo(E)||!nt(E,["value","label"])||!oo(E.value)||!to(E.label)||p.has(E.value))return!1;p.add(E.value)}if(!p.has(s.value))return!1}return!0};var so=["{id}","{segment}","{segments+}"];var xr=new Set(so);var io=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var Cr=new Set(io);var ge=20000000,Ce=256;var st=(e)=>("bytes"in e)?e.bytes.byteLength:e.content.length,ao=(e,r)=>{if(e.path!==r.path||e.readOnly!==r.readOnly)return!1;if(e.encoding==="text"||r.encoding==="text")return e.encoding==="text"&&r.encoding==="text"&&e.content===r.content;if(e.bytes.byteLength!==r.bytes.byteLength)return!1;for(let s=0;s<e.bytes.byteLength;s+=1)if(e.bytes[s]!==r.bytes[s])return!1;return!0};var co=/^[A-Za-z0-9_-]{1,80}$/;var lo=["left","right","top","bottom"];var _o=(e,r=0,s={remaining:16000})=>{if(--s.remaining<0||r>=32)return!1;if(e===null)return!0;let p=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let E of p)if(!_o(E,r+1,s))return!1;return!0},it=(e)=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every((r)=>/^(0|[1-9]\d*)$/.test(r)&&Number(r)<e.length)&&e.every(it);if(Object(e)===e){let r=Object.getPrototypeOf(e);return(r===null||r===Object.prototype)&&Object.values(e).every(it)}return String(e)===e||Number.isFinite(e)},at=(e)=>{try{if(String(e.id)!==e.id||!co.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!lo.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!_o(e.data)||!it(e.data))return!1;return JSON.stringify(e.data).length<=16000}catch{return!1}};var dt=2000;var Eo=["file","directory","other","missing"],lt=(e)=>Boolean(e&&"sessionId"in e),_t=(e)=>Boolean(e&&"sent"in e&&!("sessionId"in e));var uo=/^[0-9a-f]{7,64}$/i,pt=(e)=>uo.test(e),Ue=500,be=32000,To=16000,So=128,fo=200,Ao=2000,Oo=16000,Ro=80,ho=200,mo=16000;var Io=2000;var Et=20000,ke=1024,Me=2000000;var ye=64000,Ne=8000,ut=4000;var Tt=960000;var xo=999,go=1e4,pe=500,Co=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],Uo=["stopped","starting","ready","failed"],jo=new Set(Co),bo=(e)=>jo.has(e),ko=(e)=>e&&bo(e)?e:"HOST_REJECTED",ee=(e)=>{if(e===void 0)return!1;if(e===null||e===!0||e===!1)return!0;if(String(e)===e)return!0;if(Number(e)===e)return Number.isFinite(e);if(Array.isArray(e))return e.every(ee);if(Object(e)===e)return Object.values(e).every(ee);return!1},Mo=(e)=>ee(e)&&JSON.stringify(e).length<=mo,po=(e)=>e?.trim().slice(0,ho)??"",te=(e)=>{let r=e.id.trim().slice(0,So),s=e.title.trim().slice(0,fo),p=e.url.trim().slice(0,Ao),E=e.text?.trim().slice(0,Oo),A=e.author?.trim().slice(0,Ro),C=e.kind==="pull"?"pull":"issue",b={providerId:e.providerId.trim(),id:r,title:s||r,url:p,kind:C};if(E)b.text=E;if(A)b.author=A;if(C==="pull"){let K=po(e.branches?.head),W=po(e.branches?.base);if(K&&W)b.branches={head:K,base:W}}if(Mo(e.data))b.data=e.data;return b},St=(e)=>{let r=te(e);if(e.projectId)r.projectId=e.projectId;if(e.navigation)r.navigation=e.navigation;if(e.worktree)r.worktree=e.worktree;return r},ft=(e)=>{let r={text:e.text.trim().slice(0,To)};if(e.send)r.send=!0;return r},At=(e)=>{if(e===null||!Number.isFinite(e))return null;return Math.min(xo,Math.max(0,Math.round(e)))},Ot=(e)=>{if(!Number.isFinite(e))return 0;return Math.min(go,Math.max(0,Math.ceil(e)))};var oe=(e)=>e.length>0&&e.length<=ke&&!e.includes("\x00")&&!e.includes("\\");var Le=(e)=>{if(!e.startsWith("/")||e.includes("\x00")||e.includes("\\")||e.includes("://"))return!1;if(e.length>Io)return!1;return!e.split("/").some((s)=>s==="."||s==="..")},zo=new Set(Uo),Rt=(e)=>Boolean(e&&"status"in e&&zo.has(String(e.status))&&!("body"in e)),ve=(e)=>Boolean(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),ht=(e)=>Boolean(e&&"content"in e&&String(e.content)===e.content),mt=(e)=>Boolean(e&&"written"in e&&e.written===!0),It=(e)=>Boolean(e&&"entries"in e&&Array.isArray(e.entries)),Jo=new Set(Eo),xt=(e)=>Boolean(e&&"kind"in e&&"size"in e&&Jo.has(String(e.kind))&&Number.isFinite(e.size)),gt=(e)=>Boolean(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),Yo=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),Qo=(e)=>Object(e)===e?e:null,ct=(e)=>String(e)===e&&e.length>0,Zo=(e)=>{if(!ct(e.id))return null;if(e.ok===!0){let r={channel:u,v:T,type:"result",id:e.id,ok:!0};if(Object(e.payload)===e.payload)r.payload=e.payload;return r}if(e.ok===!1&&ct(e.error))return{channel:u,v:T,type:"result",id:e.id,ok:!1,error:e.error,code:ko(ct(e.code)?e.code:void 0)};return null},Ct=(e)=>{let r=Qo(e);if(!r||r.channel!==u||r.v!==T)return null;if(r.type==="result")return Zo(r);if(!Yo.has(String(r.type))||Object(r.payload)!==r.payload)return null;return r};var yo=(e)=>("key"in e)&&("metaKey"in e)&&("ctrlKey"in e),qo=(e)=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s";class c extends Error{code;constructor(e,r){super(r);this.name="HostRequestError",this.code=e}}var No=()=>Promise.reject(new c("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),Pe=()=>Promise.reject(new c("BAD_PATH",`File path must be 1 to ${ke} characters without NUL or backslash.`)),we=(e)=>{if(e===void 0)return;if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new c("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0},_=(e)=>(e.value+=1,`oc-${e.value}`),Ut=(e={})=>{let r=e.target??("window"in globalThis?window:null);if(!r)throw new c("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let s=e.acceptSource??((t)=>t===r.parent),p=e.requestTimeoutMs??Et,E=new Set,A=new Set,C=new Set,b=new Set,K=new Set,W=new Set,se=new Set,ue=new Set,Te=new Set,Se=new Set,fe=new Set,J=new Set,We=[],ie=null,ae=null,Ae=new Set,Oe=new Set,ce=null,de=null,je=!1,Y=new Map,Q=new Map,Z=new Map,D=!1,l={value:0},d=null,H=null,le=!1,_e=!1,Ht=null,v=null,Vt=(t)=>{if(!t)return null;return{sessionId:t.id,phase:t.busy?"started":"completed"}},M=(t)=>{r.parent.postMessage(t,"*")},$t=()=>{if(D||r.parent===r||J.size===0||d?.features?.lateGenerateResults!==!0)return;M({channel:u,v:T,type:"generate-late-listen"})},O=(t,o)=>{for(let a of t)try{a(o)}catch(i){console.error(i)}},Ft=(t)=>{if(!(t instanceof MessageEvent))return;if(!s(t.source))return;let o=Ct(t.data);if(!o)return;if(o.type==="workspace"){let i=Q.get(o.payload.subscriptionId);if(i)O([i],o.payload.snapshot);return}if(o.type==="shells"){let i=Z.get(o.payload.subscriptionId);if(i)O([i],o.payload.snapshot);return}if(o.type==="microphone-audio"){v?.queue.push(o.payload.samples);return}if(o.type==="microphone-ended"){let i=v;if(!i)return;v=null,i.release(),O(i.endedListeners,o.payload.reason);return}if(o.type==="ready"){if(d=o.payload,H=Vt(o.payload.session),O(E,o.payload),O(A,o.payload.directory),O(C,o.payload.session),H)O(b,H);if(O(K,o.payload.connection),O(W,o.payload.settings),O(se,o.payload.item),o.payload.block)O(ue,o.payload.block);$t();return}if(o.type==="service-event"){O(Te,o.payload);return}if(o.type==="generate-late"){if(J.size===0)We.push(o.payload);else O(J,o.payload);return}if(o.type==="directory"){if(d)d={...d,directory:o.payload.directory};O(A,o.payload.directory);return}if(o.type==="session"){if(d)d={...d,session:o.payload.session};if(!o.payload.session)H=null;else if(H?.sessionId!==o.payload.session.id)H=Vt(o.payload.session);O(C,o.payload.session);return}if(o.type==="session-lifecycle"){H=o.payload,O(b,o.payload);return}if(o.type==="connection"){if(d)d={...d,connection:o.payload.connection};O(K,o.payload.connection);return}if(o.type==="settings"){if(d)d={...d,settings:o.payload.settings};O(W,o.payload.settings);return}if(o.type==="item"){if(d)d={...d,item:o.payload.item};O(se,o.payload.item);return}if(o.type==="status-control-event"){O(Se,o.payload);return}if(o.type==="popover-closed"){O(fe,o.payload);return}if(o.type==="action"){let i=(f)=>{if(!D)M({channel:u,v:T,type:"action-result",id:o.id,payload:f})},S=ae;if(!S){i({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>S(o.payload)).then(()=>i({ok:!0}),(f)=>{let R=(f instanceof Error?f.message:String(f)).trim();i({ok:!1,error:(R||"Action failed.").slice(0,pe)})});return}if(o.type==="file-open"){let i=o.payload;if(de&&ao(de,i))return;de=i,O(Ae,o.payload);return}if(o.type==="file-saved"){O(Oe,o.payload.version);return}if(o.type==="file-snapshot"){let i=(R)=>{if(!D)M({channel:u,v:T,type:"file-snapshot-result",id:o.id,payload:R})},S=(R)=>i({error:(R.trim()||"Could not read the edited file.").slice(0,pe)}),f=ce;if(!f){S("This extension does not edit files.");return}Promise.resolve().then(()=>f(o.payload.purpose)).then((R)=>{if(st(R)>ge){S(`The file is over ${ge} ${"bytes"in R?"bytes":"characters"}.`);return}if(R.version.length>Ce){S(`The snapshot version is over ${Ce} characters.`);return}i({snapshot:"bytes"in R?{bytes:R.bytes,version:R.version}:{content:R.content,version:R.version}})},(R)=>S(R instanceof Error?R.message:String(R)));return}if(o.type==="resolve"){let i=(f)=>{M({channel:u,v:T,type:"resolve-result",id:o.id,payload:f})},S=ie;if(!S){i({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>S(o.payload)).then((f)=>i({item:f?te(f):null}),(f)=>{let R=(f instanceof Error?f.message:String(f)).trim();i({error:(R||"Command failed.").slice(0,pe)})});return}let a=Y.get(o.id);if(!a)return;if(clearTimeout(a.timer),Y.delete(o.id),o.ok){a.resolve(o.payload);return}a.reject(new c(o.code,o.error))};r.addEventListener("message",Ft),M({channel:u,v:T,type:"hello"});let U=(t,o=p)=>{if(D||r.parent===r)return Promise.reject(new c("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((a,i)=>{let S=setTimeout(()=>{Y.delete(t.id),i(new c("HOST_TIMEOUT","Host did not answer in time."))},o);Y.set(t.id,{resolve:a,reject:i,timer:S}),M(t)})},g=(t)=>U(t).then(()=>{return}),m={channel:u,v:T},ze=(t)=>{if(!D&&r.parent!==r)M(t)},Bt=()=>ze({...m,type:"file-save"}),Je=()=>{if(!D&&r.parent!==r)M({...m,type:"microphone-close",id:_(l)})},Fo=async()=>{if(v)throw new c("HOST_REJECTED","The microphone is already open in this frame.");if(d?.features?.microphone!==!0)throw new c("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let t=globalThis.AudioContext;if(typeof t!=="function")throw new c("UNSUPPORTED","This frame has no Web Audio.");let o=new t;if(o.sampleRate<tt||o.sampleRate>ot)throw o.close().catch(()=>{return}),new c("UNSUPPORTED",`Audio at ${o.sampleRate} Hz is not supported.`);let a=o.state==="suspended"?o.resume().catch(()=>{return}):void 0,i=qt(Math.round(o.sampleRate/4)),S=o.createScriptProcessor(1024,1,1);S.onaudioprocess=(G)=>i.pull(G.outputBuffer.getChannelData(0));let f=o.createMediaStreamDestination();S.connect(f);let R=new Set,q={queue:i,endedListeners:R,release:()=>{S.onaudioprocess=null,S.disconnect(),i.clear();for(let G of f.stream.getTracks())G.stop();o.close().catch(()=>{return})}};v=q;try{let G=await U({...m,type:"microphone-open",id:_(l),payload:{sampleRate:o.sampleRate}},rt);if(!G||!("opened"in G)||G.opened!==!0)throw new c("HOST_REJECTED","Host did not open the microphone.");if(await a,v!==q)throw new c("DISCONNECTED","The microphone closed while it was opening.")}catch(G){if(v===q)v=null;throw q.release(),Je(),G}return{stream:f.stream,close:()=>{if(v!==q)return;v=null,q.release(),Je()},onEnded:(G)=>(R.add(G),()=>{R.delete(G)})}},Kt=(t)=>{if(!yo(t)||!qo(t))return;t.preventDefault(),Bt()},Wt=(t)=>{if(!yo(t)||t.key!=="Escape"||d?.surface!=="popover"||!d.popover)return;t.preventDefault(),Yt(d.popover.id,"escape").catch(()=>{return})},Re=()=>{let t=d?.surface==="popover"?d.popover:void 0;if(!t)return;let o=le||_e;if(Ht===o)return;Ht=o,Qt(t.id,o).catch(()=>{return})},he=()=>{if(d?.surface!=="popover"||le)return;le=!0,Re()},jt=(t)=>{if(d?.surface!=="popover"||t.relatedTarget!==null||!le)return;le=!1,Re()},zt=()=>{if(d?.surface!=="popover"||_e)return;_e=!0,Re()},Jt=()=>{if(d?.surface!=="popover"||!_e)return;_e=!1,Re()},X=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new c("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},Ye=async(t)=>{if(t.kind!=="projects")X(t.projectId);let o=await U({...m,type:"workspace-read",id:_(l),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new c("HOST_REJECTED","Host did not return workspace data.");return o},Qe=async(t,o)=>{if(t.kind!=="projects")X(t.projectId);let a=_(l);Q.set(a,o);try{await g({...m,type:"workspace-subscribe",id:_(l),payload:{subscriptionId:a,query:t}})}catch(i){if(Q.delete(a),!D)M({...m,type:"workspace-unsubscribe",id:_(l),payload:{subscriptionId:a}});throw i}return()=>{if(!Q.delete(a)||D)return;M({...m,type:"workspace-unsubscribe",id:_(l),payload:{subscriptionId:a}})}},Bo=async(t,o)=>{if(t.kind==="session")X(t.sessionId);if(t.kind==="project")X(t.projectId);let a=_(l);Z.set(a,o);try{await g({...m,type:"shells-subscribe",id:_(l),payload:{subscriptionId:a,scope:t}})}catch(i){if(Z.delete(a),!D)M({...m,type:"shells-unsubscribe",id:_(l),payload:{subscriptionId:a}});throw i}return()=>{if(!Z.delete(a)||D)return;M({...m,type:"shells-unsubscribe",id:_(l),payload:{subscriptionId:a}})}},me=async(t)=>{if("key"in t&&(t.key.length===0||t.key.length>qe))throw new c("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!ee(t.value))throw new c("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>et)throw new c("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&d?.features?.deviceStorage!==!0)throw new c("UNSUPPORTED","This host does not support device storage.");let o=await U({...m,type:"storage",id:_(l),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new c("HOST_REJECTED","Host did not return storage data.");return o},Yt=(t,o)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===t)?Promise.reject(new c("UNSUPPORTED","This host does not support popovers.")):g({...m,type:"popover-close",id:_(l),payload:o?{id:t,reason:o}:{id:t}}),Qt=(t,o)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===t)?Promise.reject(new c("UNSUPPORTED","This host does not support popovers.")):g({...m,type:"popover-anchor",id:_(l),payload:{id:t,active:o}});return r.addEventListener("keydown",Wt,!0),r.addEventListener("pointerover",he),r.addEventListener("pointermove",he),r.addEventListener("pointerout",jt),r.addEventListener("focus",zt),r.addEventListener("blur",Jt),{onAction:(t)=>(ae=t,()=>{if(ae===t)ae=null}),listProjects:async()=>{let t=await Ye({kind:"projects"});if(t.kind!=="projects")throw new c("HOST_REJECTED","Expected projects.");return t},listWorktrees:async(t)=>{let o=await Ye({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new c("HOST_REJECTED","Expected worktrees.");return o},listSessions:async(t)=>{let o=await Ye({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new c("HOST_REJECTED","Expected sessions.");return o},onProjects:(t)=>Qe({kind:"projects"},(o)=>{if(o.kind==="projects")t(o)}),onWorktrees:(t,o)=>Qe({kind:"worktrees",projectId:t},(a)=>{if(a.kind==="worktrees")o(a)}),onSessions:(t,o)=>Qe({kind:"sessions",projectId:t},(a)=>{if(a.kind==="sessions")o(a)}),onRunningShells:(t,o)=>Bo(t,o),readShellOutput:async(t,o)=>{X(t,Ie);let a=o?.cursor;if(a!==void 0&&(!Number.isInteger(a)||a<0))throw new c("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let i=o?.tailBytes;if(i!==void 0&&(!Number.isInteger(i)||i<1||i>xe))throw new c("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${xe}.`);let f=await U({...m,type:"shell-output",id:_(l),payload:{shellId:t,cursor:a,tailBytes:i}});if(!f||typeof f.output!=="string"||!Number.isFinite(f.cursor))throw new c("HOST_REJECTED","Host did not return shell output.");return f},stopShell:async(t)=>{if(X(t,Ie),(await U({...m,type:"shell-stop",id:_(l),payload:{shellId:t}}))?.stopped!==!0)throw new c("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(t)=>{X(t),await g({...m,type:"open-session",id:_(l),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let a=we(o),i={op:"get",key:t};if(a)i.scope=a;let S=await me(i);return S.op==="get"&&S.found?S.value:void 0},set:async(t,o,a)=>{let i=we(a),S={op:"set",key:t,value:o};if(i)S.scope=i;await me(S)},delete:async(t,o)=>{let a=we(o),i={op:"delete",key:t};if(a)i.scope=a;await me(i)},keys:async(t)=>{let o=we(t),a={op:"keys"};if(o)a.scope=o;let i=await me(a);if(i.op!=="keys")throw new c("HOST_REJECTED","Expected storage keys.");return i.keys}},onReady:(t)=>{if(E.add(t),d)t(d);return()=>{E.delete(t)}},onDirectory:(t)=>{if(A.add(t),d)t(d.directory);return()=>{A.delete(t)}},onSession:(t)=>{if(C.add(t),d)t(d.session);return()=>{C.delete(t)}},onSessionLifecycle:(t)=>{if(b.add(t),H)t(H);return()=>{b.delete(t)}},onConnection:(t)=>{if(K.add(t),d)t(d.connection);return()=>{K.delete(t)}},onSettings:(t)=>{if(W.add(t),d)t(d.settings);return()=>{W.delete(t)}},onItem:(t)=>{if(se.add(t),d)t(d.item);return()=>{se.delete(t)}},onBlock:(t)=>{if(ue.add(t),d?.block)t(d.block);return()=>{ue.delete(t)}},onServiceEvent:(t)=>(Te.add(t),()=>{Te.delete(t)}),onStatusControl:(t)=>(Se.add(t),()=>{Se.delete(t)}),onPopoverClosed:(t)=>(fe.add(t),()=>{fe.delete(t)}),setStatusControls:(t)=>{if(d?.features?.statusControls!==!0)return Promise.reject(new c("UNSUPPORTED","This host does not support status controls."));if(!no(t))return Promise.reject(new c("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return g({...m,type:"status-controls",id:_(l),payload:{controls:t}})},openPopover:(t)=>{if(d?.features?.popovers!==!0)return Promise.reject(new c("UNSUPPORTED","This host does not support popovers."));if(!at(t))return Promise.reject(new c("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return g({...m,type:"popover-open",id:_(l),payload:t})},closePopover:Yt,setPopoverAnchorActive:Qt,onResolve:(t)=>(ie=t,()=>{if(ie===t)ie=null}),toast:(t)=>{let o=t.message.trim();if(!o||o.length>Ue)return Promise.reject(new c("HOST_REJECTED",`Toast message must contain 1 to ${Ue} characters.`));if(t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>be))return Promise.reject(new c("HOST_REJECTED",`Toast copy text must contain 1 to ${be} characters.`));return g({channel:u,v:T,type:"toast",id:_(l),payload:{...t,message:o}})},openUrl:(t)=>g({channel:u,v:T,type:"open-url",id:_(l),payload:{url:t}}),openCommit:(t)=>pt(t)?g({channel:u,v:T,type:"open-commit",id:_(l),payload:{sha:t}}):Promise.reject(new c("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),answerBlock:(t)=>g({channel:u,v:T,type:"block-answer",id:_(l),payload:{text:t.trim().slice(0,dt)}}),openSurface:(t)=>g({channel:u,v:T,type:"open-surface",id:_(l),payload:{surfaceId:t}}),writeClipboard:(t)=>g({channel:u,v:T,type:"clipboard-write",id:_(l),payload:{text:t}}),compose:(t)=>g({channel:u,v:T,type:"compose",id:_(l),payload:t}),attach:(t)=>g({channel:u,v:T,type:"attach",id:_(l),payload:te(t)}),startSession:async(t)=>{if(t.projectId!==void 0)X(t.projectId);let o=t.worktree;if(o&&o!==!0)if(o.kind==="existing")X(o.directory);else{if(o.name!==void 0)X(o.name,200);if(o.baseBranch!==void 0)X(o.baseBranch,200)}let a=await U({channel:u,v:T,type:"start-session",id:_(l),payload:St(t)},e.requestTimeoutMs??180000);if(!lt(a))throw new c("HOST_REJECTED","Host did not return a session.");return a},prompt:(t)=>U({channel:u,v:T,type:"prompt",id:_(l),payload:ft(t)}).then((o)=>{if(!_t(o))throw new c("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:(t)=>g({channel:u,v:T,type:"session-link",id:_(l),payload:te(t)}),close:()=>g({channel:u,v:T,type:"close",id:_(l)}),oauthStart:()=>g({channel:u,v:T,type:"oauth-start",id:_(l)}),oauthDisconnect:()=>g({channel:u,v:T,type:"oauth-disconnect",id:_(l)}),request:(t)=>(Le(t.path)?U({channel:u,v:T,type:"request",id:_(l),payload:t}):No()).then((o)=>{if(!ve(o))throw new c("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:(t)=>(Le(t.path)?U({channel:u,v:T,type:"service-request",id:_(l),payload:t}):No()).then((o)=>{if(!ve(o))throw new c("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>U({channel:u,v:T,type:"service-status",id:_(l)}).then((t)=>{if(!Rt(t))throw new c("HOST_REJECTED","Host did not return service status.");return t}),readFile:(t)=>(oe(t)?U({channel:u,v:T,type:"file-read",id:_(l),payload:{path:t}}):Pe()).then((o)=>{if(!ht(o))throw new c("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>{if(!oe(t))return Pe();if(o.length>Me)return Promise.reject(new c("FILE_TOO_LARGE",`Content is over ${Me} characters.`));return U({channel:u,v:T,type:"file-write",id:_(l),payload:{path:t,content:o}}).then((a)=>{if(!mt(a))throw new c("HOST_REJECTED","Host did not confirm the write.");return a})},listDir:(t)=>(oe(t)?U({channel:u,v:T,type:"file-list",id:_(l),payload:{path:t}}):Pe()).then((o)=>{if(!It(o))throw new c("HOST_REJECTED","Host did not return directory entries.");return o}),stat:(t)=>(oe(t)?U({channel:u,v:T,type:"file-stat",id:_(l),payload:{path:t}}):Pe()).then((o)=>{if(!xt(o))throw new c("HOST_REJECTED","Host did not return file status.");return o}),generate:(t)=>{let o=t.prompt.trim(),a=t.system?.trim();if(o.length===0||o.length>ye)return Promise.reject(new c("HOST_REJECTED",`Prompt must be 1 to ${ye} characters.`));if(a!==void 0&&(a.length===0||a.length>Ne))return Promise.reject(new c("HOST_REJECTED",`System prompt must be 1 to ${Ne} characters.`));let i=t.maxOutputTokens===void 0?void 0:Math.min(ut,Math.max(1,Math.floor(t.maxOutputTokens)));if(i!==void 0&&!Number.isFinite(i))return Promise.reject(new c("HOST_REJECTED","maxOutputTokens must be a number."));let S={prompt:o};if(a!==void 0)S.system=a;if(i!==void 0)S.maxOutputTokens=i;return U({channel:u,v:T,type:"generate",id:_(l),payload:S},e.requestTimeoutMs??Tt).then((f)=>{if(!gt(f))throw new c("HOST_REJECTED","Host did not return generated text.");return f})},onLateGenerateResult:(t)=>{J.add(t);for(let o of We.splice(0))O([t],o);return $t(),()=>{J.delete(t)}},openMicrophone:Fo,setBadge:(t)=>g({channel:u,v:T,type:"badge",id:_(l),payload:{count:At(t)}}),setHeight:(t)=>g({channel:u,v:T,type:"resize",id:_(l),payload:{height:Ot(t)}}),onFileOpen:(t)=>{if(Ae.add(t),!je)je=!0,r.addEventListener("keydown",Kt,!0);if(de)t(de);return()=>{Ae.delete(t)}},onFileSnapshot:(t)=>(ce=t,()=>{if(ce===t)ce=null}),onFileSaved:(t)=>(Oe.add(t),()=>{Oe.delete(t)}),reportFileChange:(t)=>ze({...m,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:Bt,reportFileUnsupported:()=>ze({...m,type:"file-unsupported"}),dispose:()=>{for(let t of Q.keys())M({...m,type:"workspace-unsubscribe",id:_(l),payload:{subscriptionId:t}});Q.clear();for(let t of Z.keys())M({...m,type:"shells-unsubscribe",id:_(l),payload:{subscriptionId:t}});if(Z.clear(),v)Je(),v.release(),v=null;if(D=!0,ie=null,ae=null,ce=null,Ae.clear(),Oe.clear(),je)r.removeEventListener("keydown",Kt,!0);r.removeEventListener("message",Ft),r.removeEventListener("keydown",Wt,!0),r.removeEventListener("pointerover",he),r.removeEventListener("pointermove",he),r.removeEventListener("pointerout",jt),r.removeEventListener("focus",zt),r.removeEventListener("blur",Jt);for(let t of Y.values())clearTimeout(t.timer),t.reject(new c("HOST_UNAVAILABLE","Host client was disposed."));Y.clear(),E.clear(),A.clear(),C.clear(),b.clear(),K.clear(),W.clear(),se.clear(),ue.clear(),Te.clear(),Se.clear(),fe.clear(),J.clear(),We.length=0}}};var Lo=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var Fr=new Set(Lo);var vo=["none","agent","user"];var Kr=new Set(vo);var er=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],tr=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],Po=(e,r)=>{r.style.colorScheme=e.mode;for(let[s,p]of er)r.style.setProperty(s,e.tokens[p]);for(let[s,p,E]of tr){let A=e.tokens[E]??"";r.style.setProperty(s,A),r.style.setProperty(p,A)}r.style.setProperty("font-family",e.tokens.font),r.style.setProperty("font-size",e.tokens.fontSize??"0.875rem"),r.style.setProperty("line-height","1.45"),r.style.setProperty("color",e.tokens.foreground)},bt=(e,r)=>{if(Po(e.theme,r),r.dataset)r.dataset.ocSurface=e.surface,r.dataset.ocTheme=e.theme.mode};var or={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},h=(e,r)=>`var(--${e}, var(--oc-${or[e]}, ${r}))`,F=h("surface-background","transparent"),De=h("surface-elevated","transparent"),re=h("surface-elevated-foreground","inherit"),P=h("surface-foreground","inherit"),I=h("surface-muted-foreground","gray"),rr=h("surface-muted","transparent"),j=h("interactive-border","currentColor"),y=h("interactive-hover","transparent"),z=h("interactive-active","transparent"),kt=h("interactive-selection","transparent"),Mt=h("interactive-selection-foreground","inherit"),V=h("primary","currentColor"),yt=h("primary-text","inherit"),Nt=h("error-text","inherit"),nr=h("font-sans","inherit"),Lt=h("font-mono","monospace"),Xo=h("radius","9px"),vt=`calc(${Xo} - 2px)`,wo=`calc(${Xo} - 4px)`,x=(e,r,s="transparent")=>`color-mix(in srgb, ${e} ${r}%, ${s})`,Go=`background-image: linear-gradient(${y}, ${y});`,Pt=(e,r="0.5px")=>`box-shadow: inset 0 0 0 ${r} ${e}, var(--oc-sdk-field-lift);`,wt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",Do="box-shadow: var(--oc-sdk-lit);",Gt=`inset 0 0.5px 0 0 ${x(P,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,sr=`
:root {
  --oc-sdk-edge: ${x(P,16)};
  --oc-sdk-field-bg: ${De};
  --oc-sdk-raised-bg: ${F};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${x(P,14)};
  --oc-sdk-field-bg: ${x(F,50,De)};
  --oc-sdk-raised-bg: ${De};
  --oc-sdk-field-lift: ${Gt};
  --oc-sdk-raised-lift: ${Gt};
  --oc-sdk-lit: ${Gt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,Ge=(e)=>{let r=h(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${r}; --oc-sdk-tone-text: ${h(`${e}-text`,"inherit")}; }`},n=(e)=>`calc(${e}rem / 14)`,ir=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${n(8)}; height: ${n(32)}; padding: 0 ${n(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${n(6)}; height: ${n(28)}; padding: 0 ${n(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${n(4)}; height: ${n(24)}; padding: 0 ${n(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${n(14)}; height: ${n(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${n(32)}; padding: 0 ${n(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${n(8)} ${n(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${n(34)}; padding-right: ${n(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${n(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${n(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${n(24)}; height: ${n(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${n(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${n(28)}; padding: 0 ${n(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${n(2)}; min-width: ${n(160)}; max-width: calc(100vw - ${n(16)}); max-height: min(${n(320)}, calc(100vh - ${n(16)})); overflow: auto; padding: ${n(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${n(2)} ${n(2)} ${n(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${n(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${n(8)}; width: 100%; padding: ${n(6)} ${n(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${n(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${n(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${n(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${n(14)}; height: ${n(14)}; margin-top: ${n(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${n(36)}; height: ${n(20)}; --oc-sdk-thumb-travel: ${n(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${n(2)}; left: ${n(2)}; width: ${n(16)}; height: ${n(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${n(2)}; padding: ${n(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${n(6)}; height: ${n(28)}; padding: 0 ${n(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${n(1)} ${n(6)}; font-size: ${n(11)}; font-weight: 500; line-height: ${n(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${n(8)}; width: 100%; padding: ${n(6)} ${n(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${n(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${n(16)} ${n(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${n(4)}; padding: ${n(40)} ${n(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${n(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${n(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${n(16)}; height: ${n(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${n(12)}; height: ${n(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${n(12)}; padding: ${n(8)} ${n(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${n(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${n(8)}; width: 100%; margin: ${n(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${n(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${n(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${n(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${n(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${n(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${n(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${n(36)}; height: ${n(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${n(44)}; }
  .oc-sdk-check { min-height: ${n(36)}; padding: ${n(8)} 0; }
}
`,Ho=`${sr}
.oc-sdk { color: ${P}; font-family: ${nr}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Go} }
.oc-sdk-mono { font-family: ${Lt}; }
.oc-sdk-muted { color: ${I}; }
${Ge("success")}${Ge("warning")}${Ge("error")}${Ge("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${V}; --oc-sdk-tone-text: ${yt}; }

.oc-sdk-btn { border-radius: ${vt}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${wo}; }
.oc-sdk-btn[data-variant="default"] { color: ${yt}; background: ${x(V,10,F)}; border-color: ${x(V,12)}; ${Do} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${x(V,16,F)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${x(V,22,F)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${rr}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${y}, ${y}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${z}, ${z}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${re}; ${wt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${y}, ${y}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${z}, ${z}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${y}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${z}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${h("status-error","red")}; color: ${Nt}; background: ${x("var(--oc-sdk-tone)",7,F)}; border-color: ${x("var(--oc-sdk-tone)",12)}; ${Do} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${x("var(--oc-sdk-tone)",9,F)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${x("var(--oc-sdk-tone)",11,F)}; box-shadow: none; }

.oc-sdk-field-note { color: ${I}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${Nt}; }
.oc-sdk-input { border-radius: ${vt}; background: var(--oc-sdk-field-bg); color: ${re}; ${Pt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${I}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${y}, ${y}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${Pt(x(P,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${Pt(h("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${Lt}; }

.oc-sdk-search-icon { color: ${I}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${V}; }
.oc-sdk-search-clear { border-radius: ${wo}; color: ${I}; }
.oc-sdk-search-clear:hover { background: ${y}; color: ${P}; }

.oc-sdk-trigger { border-radius: ${vt}; background: var(--oc-sdk-raised-bg); color: ${re}; ${wt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${y}, ${y}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${z}, ${z}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${I}; }
.oc-sdk-trigger-chevron { color: ${I}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${re}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${De}; background-clip: padding-box; color: ${re}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${y}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${kt}; color: ${Mt}; }
.oc-sdk-option-check { color: ${P}; }
.oc-sdk-option[data-destructive="true"] { color: ${Nt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${x(h("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${I}; }
.oc-sdk-popup-empty { color: ${I}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${j}; border-radius: 4px; color: ${P}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${x(P,60,j)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${j}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${F}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${V}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Go} }
.oc-sdk-check-desc { color: ${I}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${x(P,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${I}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${P}; }
.oc-sdk-tab[aria-selected="true"] { color: ${Mt}; background: ${kt}; border-color: ${j}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${re}; background: var(--oc-sdk-raised-bg); ${wt} }
.oc-sdk-tab-count { color: ${I}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${x(P,6)}; color: ${I}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${x("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${y}; }
.oc-sdk-row[aria-selected="true"] { background: ${kt}; color: ${Mt}; }
.oc-sdk-row-lead { font-family: ${Lt}; color: ${I}; }
.oc-sdk-row-sub { color: ${I}; }
.oc-sdk-row-meta { color: ${I}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${I}; }

.oc-sdk-empty-body { color: ${I}; }

.oc-sdk-spinner { color: ${I}; }
.oc-sdk-spinner-ring { border-color: ${j}; border-top-color: ${V}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${x("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${I}; }

.oc-sdk-separator { color: ${I}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${x(j,40)}; }

.oc-sdk-progress-label { color: ${I}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${x(P,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${V}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${h("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${h("success-text","inherit")}; }

.oc-sdk-text a { color: ${yt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${x(j,60)}; }
`,k=`
${Ze}
${ir}
${Ho}`;var Vo="https://unpkg.com/vis-network@9.1.6/standalone/umd/vis-network.min.js",Ke=Ut(),w,Fe=null,$o=(e)=>{let r=-1;new ResizeObserver(()=>{let s=Math.ceil(e.getBoundingClientRect().height);if(s!==r)r=s,Ke.setHeight(s).catch(()=>{})}).observe(e)};Ke.onReady((e)=>{if(bt(e,document.documentElement),w=document.getElementById("root")||null,w)$o(w),Xt()});Ke.onDirectory((e)=>{if(Fe=e,w)Xt()});function Be(e){if(!w)return;w.replaceChildren();let r=document.createElement("div");r.classList.add("note"),r.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--oc-muted);font-size:12px;padding:20px;box-sizing:border-box",r.textContent=e,w.appendChild(r)}function _r(e,r){if(!w)return;try{w.replaceChildren();let s=document.createElement("div");s.style.cssText="width:100%;height:100%;overflow:hidden;",s.innerHTML='<div id="graph" style="width:100%;height:100%"></div>',w.appendChild(s),requestAnimationFrame(()=>{let p=s.querySelector("#graph");if(!p)throw Error("Graph container element not found.");if(typeof vis>"u")throw Error("vis-network library failed to load.");let E={physics:{enabled:!0,solver:"forceAtlas2Based",forceAtlas2Based:{gravitationalConstant:-60,centralGravity:0.005,springLength:120,springConstant:0.08,damping:0.4,avoidOverlap:0.8},stabilization:{iterations:200,fit:!0}},interaction:{hover:!0,tooltipDelay:100,hideEdgesOnDrag:!0},nodes:{shape:"dot",borderWidth:1.5},edges:{smooth:{type:"continuous",roundness:0.2},selectionWidth:3}},A={nodes:new vis.DataSet(e),edges:new vis.DataSet(r)},C=new vis.Network(p,A,E);if(C.once("stabilizationIterationsDone",()=>{C.setOptions({physics:{enabled:!1}})}),w)$o(w)})}catch(s){Be(s?.message||"Failed to draw the graph.")}}async function pr(e){let r=await Ke.serviceRequest({method:"GET",path:"/graph/data",query:{directory:e}});return JSON.parse(r.body)}async function Er(e){if(typeof vis<"u")return;if(e&&e.length>0)return new Promise((r,s)=>{let p=document.createElement("script");p.textContent=e,p.onload=()=>r(),p.onerror=()=>s(Error("vis-network inline injection failed.")),document.head.appendChild(p)});return new Promise((r,s)=>{let p=document.createElement("script");p.src=Vo,p.crossOrigin="anonymous",p.onload=()=>r(),p.onerror=()=>s(Error(`vis-network failed to load from ${Vo}`)),document.head.appendChild(p)})}async function Xt(){if(!w)return;if(!Fe){Be("Open a project to see its graphify graph.");return}Be("Loading the graph...");try{let e=await pr(Fe);if(e&&typeof e==="object"&&"error"in e)throw Error(String(e.error));let r=e;if(!Array.isArray(r.nodes)||!Array.isArray(r.edges))throw Error("Graphify data is empty or malformed.");await Er(r.visNetworkLibCode),_r(r.nodes,r.edges)}catch(e){let r=e instanceof Error?e.message:String(e),s;if(!Fe||r.includes("graph-not-found")||typeof r==="string"&&/not-found/i.test(r))s="Graphify graph not found in this project. Run `graphify .` first.";else if(r==="parse-error"||r.includes("Graphify data is empty or malformed"))s="graphify data is empty or malformed. Open a project that has run graphify.";else if(r.includes("vis-network failed")||r==="inline injection failed"||r.toLowerCase().includes("network"))s="Failed to load vis-network. Check network access or make sure graphify-out/graph.html was generated.";else if(r.includes("Access denied")||r==="bad-request"||/403/i.test(r))s="Access denied to graphify-out/graph.html.";else if(r==="graph container element not found"||r==="vis-network library failed to load.")s=`Graph rendering issue: ${r}`;else s=e instanceof Error?`Failed to load the graphify graph: ${e.message}`:"Failed to load the graphify graph.";Be(s)}}Xt();})();
