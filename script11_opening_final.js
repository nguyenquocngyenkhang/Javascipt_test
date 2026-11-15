const $=id=>document.getElementById(id),cv=$('c'),cx=cv.getContext('2d'),TILT=.5,tip=$('tip'),TH=$('th').getContext('2d');TH.imageSmoothingEnabled=false;
let W,H,zoom=1,px=0,py=0,t=0,sel=null,mxp=null,myp=0;
const C=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const N=(o,a,s)=>Math.sin(o*2+s+Math.sin(a*3+s*2))+.6*Math.sin(o*5-a*3+s*3)+.35*Math.sin(o*9+a*8+s*5);
const cr=t=>Math.sin(t.o*6+1)*Math.sin(t.a*8+2)*Math.sin(t.o*11+t.a*5);
const P={
sun:t=>{const n=N(t.o,t.a,1);return C(t.z>.85?'#fff6c0':n>1.1?'#ff9d1c':n>.3?'#ffc933':'#ffdc55')},
mer:t=>C(cr(t)>.5?'#5f5a54':N(t.o,t.a,2)>.6?'#7f7971':'#a29b92'),
ven:t=>{const n=N(t.o,t.a,3)+Math.sin(t.a*6)*.7;return C(n>.8?'#f1d08e':n>-.2?'#e2b06a':'#cf9748')},
ear:t=>{if(Math.abs(t.a)>1.28)return C('#f4f8ff');const n=N(t.o,t.a,4);return n>.55?C(N(t.o,t.a,9)>.5?'#2f7a3a':'#45a049'):C(n>-.3?'#6cbcf5':'#3a86d8')},
moo:t=>C(cr(t)>.5?'#9a9a9a':N(t.o,t.a,7)>.6?'#b4b4b4':'#e2e2e2'),
mar:t=>{if(Math.abs(t.a)>1.32)return C('#f4f4f4');const n=N(t.o,t.a,5);return C(n>.7?'#8f3320':n>-.2?'#c8512f':'#dd7a48')},
jup:t=>{const dx=Math.atan2(Math.sin(t.o-2),Math.cos(t.o-2)),dy=t.a+.35;if(dx*dx*.6+dy*dy*3<.12)return C('#b8452e');const b=Math.sin(t.a*9+N(t.o,t.a*.5,6)*.35);return C(b>.55?'#f0e2c8':b>0?'#d9b48a':b>-.6?'#b98558':'#a46a45')},
sat:t=>{const b=Math.sin(t.a*8+N(t.o,t.a*.5,8)*.2);return C(b>.4?'#f0e2b0':b>-.3?'#e3cd8c':'#c9ad6a')},
ura:t=>C(N(t.o,t.a,10)>.6?'#9aeef2':'#82d6dd'),
nep:t=>{const n=N(t.o,t.a,11);return C(n>.8?'#6a93ff':n>-.4?'#3a5fd9':'#2c46b0')}};
function gen(b,fr){
 const R=b.rs,g=b.g||0,h=2*(R+g),w=Math.round(h*(b.ring?2.3:1)),c=document.createElement('canvas');
 c.width=w;c.height=h;const x=c.getContext('2d'),im=x.createImageData(w,h),d=im.data,mx=w/2,my=h/2,rot=fr/b.nf*6.2832;
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){
  const nx=(i+.5-mx)/R,ny=(j+.5-my)/R,r2=nx*nx+ny*ny,sph=r2<=1;let col=null;
  if(sph){const nz=Math.sqrt(1-r2);col=b.f({o:Math.atan2(nx,nz)+rot,a:Math.asin(ny),z:nz});
   if(!b.sun){const L=-.75*nx-.3*ny+.55*nz,k=L>.5?1:L>.25?.8:L>0?.6:.35;col=col.map(v=>v*k|0)}}
  else if(b.sun&&r2<1.8){const q=(i*73+j*151+fr*37)%11;col=r2<1.25&&q<5?C('#ff9a1a'):r2<1.55&&q<2?C('#ffb53a'):q<1?C('#ffd35a'):null}
  if(b.ring){const u=(i+.5-mx)/mx,v=(j+.5-my)/(R*.5),e=u*u+v*v;
   if(e<=1&&e>=.3&&!(e>.68&&e<.75)&&(v>0||!sph))col=C(e<.5?'#a8935f':e<.68?'#d9c590':'#c2aa72')}
  if(col){const q=(j*w+i)*4;d[q]=col[0];d[q+1]=col[1];d[q+2]=col[2];d[q+3]=255}}
 x.putImageData(im,0,0);return c}
// name, AU, world radius, sprite radius, texture, frames, spin frames/s
const defs=[['Sun',0,34,26,P.sun,8,2],['Mercury',.39,7,6,P.mer,16,1],['Venus',.72,11,10,P.ven,16,.6],['Earth',1,12,12,P.ear,16,2],['Mars',1.52,9,8,P.mar,16,2],['Jupiter',5.2,22,18,P.jup,16,4],['Saturn',9.58,18,13,P.sat,16,3],['Uranus',19.2,15,11,P.ura,16,3],['Neptune',30.1,15,11,P.nep,16,3],['Moon',0,4.5,5,P.moo,1,0]];
const B=defs.map(([n,a,r,rs,f,nf,sp],i)=>{const b={n,a,r,rs,f,nf,sp,ph:i*2.4+1,or:90*Math.log(1+4.5*a),w:.25/(a||1),x:0,y:0};
 if(n=='Sun'){b.sun=1;b.g=9}if(n=='Saturn')b.ring=1;b.spr=Array.from({length:nf},(_,k)=>gen(b,k));return b});
const SUN=B[0],EARTH=B[3],MOON=B[9];
const ST=Array.from({length:260},()=>({x:Math.random(),y:Math.random(),l:Math.random()*3|0,p:Math.random()*6}));
let AC,mute=false;
function beep(f,d,f2){if(mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const n=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.setValueAtTime(f2,n+d/2);g.gain.setValueAtTime(.04,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(AC.destination);o.start(n);o.stop(n+d)}catch(e){}}
// ---- Opening sequence ----
const INTRO={on:true,t0:null,T:0,nb:.2,last:{}},ease=p=>1-Math.pow(1-p,3),cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const sfx=(f,d,f2)=>{if(AC&&AC.state=='running')beep(f,d,f2)};
function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state!='running')AC.resume()}catch(e){}}
['pointerdown','keydown'].forEach(e=>addEventListener(e,unlock));
B.forEach((b,i)=>b.at=b==SUN?3.4:b==MOON?5.2:4+(i-1)*.45);
ST.forEach(s=>s.at=Math.random()*2.8);
const CUES=B.map((b,i)=>[b.at,()=>sfx(b==SUN?196:300+i*70,b==SUN?.3:.08)]).concat([
 [9,()=>{$('title').classList.add('drop');[523,659,784,1047].forEach((f,i)=>setTimeout(()=>sfx(f,.14),i*110))}],
 [12.5,()=>{const ti=$('title');ti.classList.remove('intro');ti.classList.add('fin');$('typed').classList.add('off');$('sub').classList.add('off');sfx(660,.2)}],
 [13.3,()=>{show(null);sfx(880,.1)}],
 [14.2,()=>$('prompt').classList.add('on')],
 [14.8,()=>endIntro()]]);
function camera(T){const z0=Math.min(W/1100,H/660),p=cl((T-12.5)/2,0,1);
 zoom=z0*(T<3?.12:T<9?.12+1.02*ease((T-3)/6):T<12.5?1.14:1.14-.14*p*p*(3-2*p));px=py=0}
function typ(id,txt,st,cps){const n=cl(Math.floor((INTRO.T-st)*cps),0,txt.length);
 if(n!==INTRO.last[id]){if(n>(INTRO.last[id]||0)&&n%2==0)sfx(1300,.02);INTRO.last[id]=n;$(id).textContent=txt.slice(0,n)}}
function endIntro(){if(!INTRO.on)return;INTRO.on=false;document.body.classList.remove('intro');fit();
 const ti=$('title');ti.classList.remove('intro');ti.classList.add('drop','fin','skip');
 $('typed').classList.add('off');$('sub').classList.add('off');show(null);$('prompt').classList.add('on')}
function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);cx.imageSmoothingEnabled=false}
function fit(){zoom=Math.min(W/1100,H/660);px=py=0}
const pr=(x,y)=>[W/2+px+x*zoom,H/2+py+y*zoom*TILT],ps=y=>Math.max(.6,1+y*.0005);
function zoomAt(mx,my,f){const nz=Math.min(8,Math.max(.3,zoom*f)),k=nz/zoom;px=(mx-W/2)-(mx-W/2-px)*k;py=(my-H/2)-(my-H/2-py)*k;zoom=nz}
function hit(mx,my){let best=null,bd=9;for(const b of B){const[sx,sy]=pr(b.x,b.y),rad=Math.max(b.r*zoom*ps(b.y),b.n=='Moon'?12:9),d=Math.hypot(mx-sx,my-sy)/rad;if(d<=1&&d<bd){bd=d;best=b}}return best}
function ring(x,y,r,n){for(let k=0;k<n;k++){if(k%6>2)continue;const a=k/n*6.2832,[sx,sy]=pr(x+r*Math.cos(a),y+r*Math.sin(a));cx.fillRect(Math.round(sx),Math.round(sy),2,2)}}
function brackets(x,y,r){const a=Math.round(r+8+(Math.sin(t*5)+1)*1.5),l=Math.max(5,Math.round(a*.4)),th=3;x=Math.round(x);y=Math.round(y);
 cx.fillStyle='#ffd23f';for(const s of[-1,1]){const X=x+s*a;cx.fillRect(X-(s>0?th:0),y-a,th,2*a);const T=s>0?X-l:X;cx.fillRect(T,y-a,l,th);cx.fillRect(T,y+a-th,l,th)}}
function loop(ms){t=ms/1000;
 if(INTRO.t0===null)INTRO.t0=t;
 const I=INTRO.on,T=INTRO.T=t-INTRO.t0;
 if(I){camera(T);for(const c of CUES)if(!c.d&&T>=c[0]){c.d=1;c[1]()}
  if(T<3&&T>=INTRO.nb){sfx(880+(Math.random()*880|0),.05);INTRO.nb=T+.3+Math.random()*.3}
  typ('typed','The Solar System — 8 planets, countless mysteries',4.2,24);typ('sub','Your mission begins here',10,18);
  $('snd').hidden=mute||(AC&&AC.state=='running')}
 cx.fillStyle='#000';cx.fillRect(0,0,W,H);
 const zp=I?ease(cl((T-3)/6,0,1)):1;
 for(const s of ST){if(I&&T<s.at)continue;const f=[.04,.1,.22][s.l],k=1-(1-zp)*[.15,.35,.6][s.l];
  let X=((s.x*W+px*f)%W+W)%W,Y=((s.y*H+py*f)%H+H)%H;X=W/2+(X-W/2)*k;Y=H/2+(Y-H/2)*k;
  cx.globalAlpha=(I?cl((T-s.at)/.6,0,1):1)*(.3+.7*(.5+.5*Math.sin(t*(1+s.l)+s.p)));cx.fillStyle=['#8aa0c8','#dfe8ff','#fff'][s.l];cx.fillRect(X|0,Y|0,s.l==2?2:1,s.l==2?2:1)}
 for(const b of B){if(b==SUN)continue;if(b==MOON){const q=t*1.1;b.x=EARTH.x+26*Math.cos(q);b.y=EARTH.y+26*Math.sin(q)}else{const q=b.ph+b.w*t;b.x=b.or*Math.cos(q);b.y=b.or*Math.sin(q)}}
 const al=b=>I?cl((T-b.at+.4)/.5,0,1):1;
 cx.fillStyle='#1a3a8c';
 for(const b of B)if(b.or){cx.globalAlpha=al(b);if(cx.globalAlpha>0)ring(0,0,b.or,3*Math.max(70,Math.min(320,b.or*zoom*.7|0)))}
 cx.globalAlpha=al(MOON);ring(EARTH.x,EARTH.y,26,108);cx.globalAlpha=1;
 const sx0=pr(0,0)[0],la=I?cl((T-12.8)/1.5,0,1):1;cx.textAlign='center';cx.font="8px 'Press Start 2P',monospace";
 for(const b of[...B].sort((p,q)=>p.y-q.y)){
  if(I&&T<b.at)continue;
  if(SEC==2&&b==sel)continue;
  const pop=I?Math.ceil(cl((T-b.at)/.35,0,1)*4)/4:1;if(!pop)continue;
  const[sx,sy]=pr(b.x,b.y),sc=b.r/b.rs*zoom*ps(b.y)*pop*(b==SUN?1+.03*Math.sin(t*3):1),s=b.spr[((t*b.sp)|0)%b.nf],dw=Math.round(s.width*sc),dh=Math.round(s.height*sc);
  cx.save();cx.translate(Math.round(sx),Math.round(sy));if(b!=SUN&&sx<sx0)cx.scale(-1,1);cx.drawImage(s,-dw/2,-dh/2,dw,dh);
  if(b==SUN){cx.globalCompositeOperation='lighter';cx.globalAlpha=.16+.12*Math.sin(t*7);cx.drawImage(s,-dw*.55,-dh*.55,dw*1.1,dh*1.1)}cx.restore();
  if(la>0&&(b!=MOON||zoom>2.2||sel==b)){cx.globalAlpha=la;cx.fillStyle=sel==b?'#ffd23f':'rgba(180,215,255,.7)';cx.fillText(b.n,sx,sy+b.r*zoom*ps(b.y)+(b==SUN?20:14));cx.globalAlpha=1}}
 if(sel&&SEC==1){const[sx,sy]=pr(sel.x,sel.y);brackets(sx,sy,sel.r*zoom*ps(sel.y))}
 if(sel){const s=sel.spr[((t*sel.sp)|0)%sel.nf],k=Math.min(60/s.height,126/s.width),w=Math.round(s.width*k),h=Math.round(s.height*k);TH.clearRect(0,0,130,64);TH.drawImage(s,(130-w)>>1,(64-h)>>1,w,h)}
 const hv=I||SEC==2||dn||mxp==null?null:hit(mxp,myp);cv.style.cursor=dn?'grabbing':hv?'pointer':'grab';
 if(hv){tip.textContent=hv.n;tip.style.display='block';tip.style.transform=`translate(${mxp+14}px,${myp+14}px)`}else tip.style.display='none';
 requestAnimationFrame(loop)}
const DATA={
Sun:{i:[['Type','G-type star'],['Diameter','1.39 million km'],['Surface temp.','~5,500 °C'],['Age','~4.6 billion yrs']],e:'The Sun holds 99.86% of the Solar System’s mass. Its core fuses hydrogen into helium, and its light takes about 8 min 20 s to reach Earth.'},
Mercury:{i:[['Type','Rocky planet'],['Diameter','4,879 km'],['Distance','0.39 AU'],['Year','88 Earth days']],e:'With almost no atmosphere, Mercury swings from about −180 °C at night to 430 °C by day. It is the smallest planet and has no moons.'},
Venus:{i:[['Type','Rocky planet'],['Diameter','12,104 km'],['Distance','0.72 AU'],['Year','225 Earth days']],e:'A thick carbon dioxide atmosphere traps heat, making Venus the hottest planet at about 465 °C. It spins backwards, and its day is longer than its year.'},
Earth:{i:[['Type','Rocky planet'],['Diameter','12,742 km'],['Distance','1 AU'],['Year','365.25 days'],['Moons','1']],e:'About 71% of Earth’s surface is water. Its magnetic field and atmosphere shield life, and its 23.4° axial tilt creates the seasons.'},
Moon:{i:[['Type','Natural satellite'],['Orbits','Earth'],['Diameter','3,474 km'],['Distance','384,400 km'],['Orbit period','27.3 days'],['Gravity','1.62 m/s²']],e:'The Moon is tidally locked, so we always see the same face. Some polar craters never see sunlight; in 1998 Lunar Prospector detected hydrogen there, consistent with water ice.'},
Mars:{i:[['Type','Rocky planet'],['Diameter','6,779 km'],['Distance','1.52 AU'],['Year','687 Earth days'],['Moons','2']],e:'Iron oxide dust makes Mars red. Dry river valleys show liquid water once flowed there, and Olympus Mons is the tallest known volcano in the Solar System.'},
Jupiter:{i:[['Type','Gas giant'],['Diameter','139,820 km'],['Distance','5.2 AU'],['Year','11.9 Earth years'],['Moons','90+']],e:'Jupiter is mostly hydrogen and helium, with more than twice the mass of all other planets combined. Its Great Red Spot is a storm that has raged for centuries.'},
Saturn:{i:[['Type','Gas giant'],['Diameter','116,460 km'],['Distance','9.58 AU'],['Year','29.4 Earth years'],['Moons','140+']],e:'Saturn’s rings are mostly chunks of water ice. It is the least dense planet; less dense than water, it would float in a big enough bathtub.'},
Uranus:{i:[['Type','Ice giant'],['Diameter','50,724 km'],['Distance','19.2 AU'],['Year','84 Earth years']],e:'Uranus is tipped on its side, with an axial tilt of about 98°. Methane gives it a cyan color, and its atmosphere is the coldest of any planet.'},
Neptune:{i:[['Type','Ice giant'],['Diameter','49,244 km'],['Distance','30.1 AU'],['Year','165 Earth years']],e:'Neptune has the fastest winds in the Solar System, over 2,000 km/h. Mathematics predicted its position from Uranus’s orbit before it was first seen in 1846.'}};
const ROW=r=>`<div class="r"><span>${r[0]}</span><span>${r[1]}</span></div>`;
let SEC=1;
// Section 1: pick a target -> Details panel (Info + Education only)
function show(b){const was=sel,d=$('det');sel=b;
 $('prompt').classList.toggle('on',!b&&!INTRO.on);$('th').style.display=b?'':'none';$('hint').classList.remove('hid');
 if(!b){d.classList.add('hid');if(was)beep(392,.12,330);return}
 beep(523,.07,784);if(b==MOON)setTimeout(()=>beep(1047,.12),110);
 const D=DATA[b.n],go=$('go');
 $('dn').textContent=b.n;
 $('db').innerHTML='<h3>Info</h3>'+D.i.map(ROW).join('')+'<h3>Education</h3><p class="edu">'+D.e+'</p>';
 go.disabled=b!=MOON;go.textContent=b==MOON?'Continue to Missions ▸':'Incoming';
 d.scrollTop=0;d.classList.remove('hid')}
// ---- Section 2: detailed pixel Moon + hover effects ----
const MS=192,CR=90;
function hsh(i,j){let h=Math.imul(i,374761393)+Math.imul(j,668265263)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296}
const vn=(x,y)=>{const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return hsh(i,j)*(1-u)*(1-v)+hsh(i+1,j)*u*(1-v)+hsh(i,j+1)*(1-u)*v+hsh(i+1,j+1)*u*v};
const fb=(x,y)=>vn(x,y)*.5+vn(x*2,y*2)*.25+vn(x*4,y*4)*.125+vn(x*8,y*8)*.0625;
let _s=11;const rn=()=>(_s=_s*16807%2147483647)/2147483647;
// craters: x, y, radius (disc coordinates), fresh (bright, with rays). The last four are Tycho, Copernicus, Kepler, Aristarchus.
const CRAT=Array.from({length:150},()=>{const a=rn()*6.283,r=Math.sqrt(rn())*.95,k=rn();return[Math.cos(a)*r,Math.sin(a)*r,.014+k*k*k*.1,0]}).concat([[-.14,.68,.07,1],[-.33,-.17,.05,1],[-.61,-.14,.04,1],[-.67,-.4,.035,1]]);
// maria on the near side: x, y, rx, ry
const MARE=[[-.234,-.53,.3,.26],[.27,-.47,.19,.19],[.51,-.14,.23,.2],[.82,-.29,.11,.08],[.77,.14,.15,.17],[.54,.26,.1,.1],[-.26,.36,.17,.15],[-.575,.41,.1,.1],[-.78,-.22,.26,.4],[0,-.83,.28,.07],[.05,-.22,.09,.09]];
const BAY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const dq=(g,L,i,j)=>{const t=Math.max(0,Math.min(1,g))*L,f=Math.floor(t);return(f+(t-f>BAY[j&3][i&3]/16?1:0))/L};
function mk(draw){const c=document.createElement('canvas');c.width=c.height=MS;const x=c.getContext('2d'),im=x.createImageData(MS,MS);draw(im.data);x.putImageData(im,0,0);return c}
function genBigMoon(){return mk(d=>{const S=MS,R=CR;
 for(let j=0;j<S;j++)for(let i=0;i<S;i++){
  const nx=(i+.5-S/2)/R,ny=(j+.5-S/2)/R,r2=nx*nx+ny*ny;if(r2>1)continue;const nz=Math.sqrt(1-r2),en=fb(nx*7+3,ny*7)-.45;
  let m=0;for(const q of MARE)if(Math.hypot((nx-q[0])/q[2],(ny-q[1])/q[3])<1+.35*en)m=1;
  let g=m?.42+.16*fb(nx*9,ny*9+4):.78+.3*(fb(nx*5+9,ny*5)-.3);
  for(const q of CRAT){const dx=nx-q[0],dy=ny-q[1],dist=Math.hypot(dx,dy),dd=dist/q[2];
   if(dd<1.7){const lit=(-.7*dx-.7*dy)/(dist||1);
    if(dd<.85)g*=q[3]?1.12:(m?.9:.8)-.06*Math.max(0,-lit);
    else if(dd<1.1)g+=.18*lit;
    else g+=.04*(1.7-dd)*(q[3]?3:1)}
   if(q[3]&&dist>q[2]&&dist<.75)g+=.22*Math.pow(Math.max(0,Math.sin(Math.atan2(dy,dx)*7+q[0]*40)),6)*Math.pow(1-dist/.75,1.5)}
  g*=.55+.45*Math.min(1,(-.35*nx-.15*ny+.92*nz)/.8);
  const v=dq(g,10,i,j)*240,o=(j*S+i)*4;d[o]=v*(m?.94:1);d[o+1]=v*(m?.96:.99);d[o+2]=v*(m?1.04:.95);d[o+3]=255}})}
// Pixel-art simulation of a GRAIL-style gravity map (rainbow: blue = lower, red = higher). Approximation, not the real data.
const GRC=['#1a0f6b','#2a2aa8','#2f6fe0','#2fb8e0','#2fe0b0','#5de05a','#c8e03f','#ffd02f','#ff8a1f','#e0301f'];
function genGrav(){const P=GRC.map(C),B2=[[-.234,-.53,.3,1],[.27,-.47,.2,.9],[.82,-.29,.1,1],[.54,.26,.1,.7],[-.575,.41,.1,.7],[-.93,.1,.14,.8],[.51,-.14,.22,.3],[.77,.14,.15,.25],[-.26,.36,.17,.22],[-.78,-.22,.24,.12]];
 return mk(d=>{const S=MS,R=CR;
 for(let j=0;j<S;j++)for(let i=0;i<S;i++){
  const nx=(i+.5-S/2)/R,ny=(j+.5-S/2)/R,r2=nx*nx+ny*ny;if(r2>1)continue;const nz=Math.sqrt(1-r2);
  let v=.27+.1*(fb(nx*10,ny*10)-.45);
  for(const b of B2){const dd=Math.hypot(nx-b[0],ny-b[1])/b[2];v+=b[3]*.55*Math.exp(-dd*dd*1.5)-b[3]*.12*Math.exp(-(dd-1.5)*(dd-1.5)*5)}
  for(const q of CRAT){const dd=Math.hypot(nx-q[0],ny-q[1])/q[2];if(dd<2.2)v+=.05*Math.exp(-dd*dd*2)-.04*Math.exp(-(dd-1.3)*(dd-1.3)*8)}
  const col=P[Math.min(9,Math.round(dq(v,9,i,j)*9))],sh=.82+.18*nz,o=(j*S+i)*4;d[o]=col[0]*sh;d[o+1]=col[1]*sh;d[o+2]=col[2]*sh;d[o+3]=255}})}
// Minerals: six illustrative layers (outer to inner)
const LAY=[['Aluminum','#d0d4d8'],['Silicon','#c9a46a'],['Magnesium','#e6e0a0'],['Titanium','#8fb0c8'],['Thorium','#a06ad8'],['Iron','#c0562a']];
function genCore(){const cols=LAY.map(l=>C(l[1]));
 return mk(d=>{const S=MS,R=CR;
 for(let j=0;j<S;j++)for(let i=0;i<S;i++){
  const nx=(i+.5-S/2)/R,ny=(j+.5-S/2)/R,f=Math.hypot(nx,ny);if(f>1)continue;
  const k=Math.min(5,Math.floor((1-f)*6));let col=cols[k];
  if((i+j)%4==0)col=col.map(v=>v*.86|0);
  if(f>.985||(k>0&&((1-f)*6)%1<.06))col=[26,18,8];
  if(k==5&&Math.hypot(nx+.05,ny+.05)<.05)col=[255,200,160];
  const o=(j*S+i)*4;d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255}})}
// Polar ice: pixel ice blocks in shadowed craters near both poles
function genIce(){const c=document.createElement('canvas');c.width=c.height=MS;const x=c.getContext('2d');let s=5;const r=()=>(s=s*16807%2147483647)/2147483647;
 for(const py of[MS*.14,MS*.86])for(const px of[MS*.5-34,MS*.5,MS*.5+30]){const cy=Math.round(py+(r()-.5)*8),cxp=Math.round(px);
  x.fillStyle='#10182a';for(let dy=-8;dy<=8;dy++){const hw=Math.round(13*Math.sqrt(1-dy*dy/64));x.fillRect(cxp-hw,cy+dy,hw*2,1)}
  for(let n=0;n<9;n++){const bw=3+(r()*4|0),bh=3+(r()*3|0),bx=cxp-9+(r()*(18-bw)|0),by=cy-5+(r()*(10-bh)|0);
   x.fillStyle='#8fd0f0';x.fillRect(bx,by,bw,bh);x.fillStyle='#5aa8dc';x.fillRect(bx,by+bh-1,bw,1);x.fillRect(bx+bw-1,by,1,bh);x.fillStyle='#ffffff';x.fillRect(bx,by,bw-1,1);x.fillRect(bx,by,1,bh-1)}}
 return c}
const BG=genBigMoon(),GV=genGrav();let PAINT=null;
function paintMoon(src){if(PAINT===src)return;PAINT=src;for(const id of['big','big2']){const c=$(id);c.width=c.height=MS;c.getContext('2d').drawImage(src,0,0)}}
paintMoon(BG);for(const[id,src]of[['core',genCore()],['ice',genIce()]]){const c=$(id);c.width=c.height=MS;c.getContext('2d').drawImage(src,0,0)}
// Missions (difficulty weight w is a symbolic estimate) and hotspots
const MIS={
 ice:{n:'Polar Ice',st:'Active',w:2,ins:'Neutron Spectrometer',d:'Search the permanently shadowed polar craters for hydrogen that may signal water ice.'},
 min:{n:'Minerals',st:'Active',w:3,ins:'Gamma-Ray Spectrometer',d:'Map surface elements such as iron, titanium and thorium to learn what the Moon is made of.'},
 alpha:{n:'Alpha Particle',st:'Passive',inc:1,w:1,ins:'Alpha Particle Spectrometer',d:'Detect alpha particles from decaying radon gas to look for signs of gas escaping from inside the Moon.'},
 grav:{n:'Gravity Map',st:'Passive',inc:1,ins:'Doppler Gravity Experiment',d:'Track the spacecraft’s orbit to map the Moon’s gravity and find dense regions called mascons.'},
 mag:{n:'Luna Mini Magneto',st:'Passive',w:1,ins:'Magnetometer and Electron Reflectometer (MAG/ER)',d:'Measure the Moon’s weak magnetic field and the magnetic patches left in its crust.'}};
const HOT=[{m:'ice',s:'Polar Ice',x:50,y:8},{m:'ice',s:'Polar Ice',x:50,y:92},{m:'grav',s:'Gravity Map',x:39,y:26},{m:'min',s:'Minerals',x:50,y:50},{m:'alpha',s:'Alpha Particle',x:19,y:32},{m:'mag',s:'Luna Mini Magneto',x:13,y:46}];
const SEL=new Set();
$('hs').innerHTML=HOT.map((h,i)=>`<button class="hot${MIS[h.m].inc?' inc':''}" id="h${i}" data-h="${i}" aria-label="${MIS[h.m].n}${MIS[h.m].inc?' (Incoming)':''}" style="left:${h.x}%;top:${h.y}%"><span class="mk"></span><span class="hl">${h.s}</span></button>`).join('');
function legend(m){$('lg').innerHTML=m=='min'?LAY.map(l=>`<span><i style="background:${l[1]}"></i>${l[0]}</span>`).join('')+'<em>Illustrative layers</em>':'<span>Lower</span><span>'+GRC.map(c=>`<i style="background:${c};margin:0"></i>`).join('')+'</span><span>Higher gravity</span><em>Pixel-art simulation of GRAIL data</em>'}
// Mission brief lives in the right column so it never covers the Moon
const BR0='<p class="dim">Hover a mission area to read its brief.</p>';
function brief(m){const o=MIS[m];$('bb').innerHTML=`<b class="y">${o.n}</b><span class="tag ${o.st=='Active'?'act':'pas'}">${o.st}</span>${o.inc?'<span class="tag inc">Incoming</span>':''}<p class="nd">${o.d}</p><p class="dim">Instrument: ${o.ins}</p>`}
function fxOn(i){fxOff();const m=HOT[i].m,s=$('surf');$('h'+i).classList.add('hv');brief(m);
 if(m=='min'){s.classList.add('fxon','split');legend('min');document.body.classList.add('fx')}
 else if(m=='grav'){s.classList.add('fxon');paintMoon(GV);legend('grav');document.body.classList.add('fx','fg')}
 else if(m=='mag')document.body.classList.add('fm')
 else if(m=='ice')s.classList.add('fxon','zin',HOT[i].y<50?'zn':'zs')}
function fxOff(){const s=$('surf');s.classList.remove('fxon','split','zin','zn','zs');document.querySelectorAll('.hot.hv').forEach(e=>e.classList.remove('hv'));paintMoon(BG);document.body.classList.remove('fx','fg','fm');$('bb').innerHTML=BR0}
$('hs').querySelectorAll('.hot').forEach((b,i)=>{b.addEventListener('pointerenter',()=>fxOn(i));b.addEventListener('pointerleave',fxOff);b.addEventListener('focus',()=>fxOn(i));b.addEventListener('blur',fxOff)});
$('hs').onclick=e=>{const b=e.target.closest('[data-h]');if(b)toggle(HOT[+b.dataset.h].m)};
// Information panel: tasks, requirements, fuel-gauge difficulty, minerals to scale
const GN=12;
function paintHots(){HOT.forEach((h,i)=>{$('h'+i).querySelector('.mk').className='mk'+(SEL.has(h.m)?' s2':'')})}
function panel(){const ids=Object.keys(MIS).filter(k=>SEL.has(k)),tot=ids.reduce((a,k)=>a+MIS[k].w,0),f=Math.round(tot/6*GN);
 $('tk').innerHTML=ids.length?'<ul class="tl">'+ids.map(k=>`<li>${MIS[k].n} <span class="dim">(${MIS[k].st})</span></li>`).join('')+'</ul>':'<p class="dim">No mission selected</p>';
 $('rq').innerHTML=ids.length?ids.map(k=>`<b class="y">${MIS[k].n}</b>`+[['Instrument',MIS[k].ins]].map(ROW).join('')).join(''):'<p class="dim">Select a mission</p>';
 $('gg').innerHTML='<div class="gauge">'+Array.from({length:GN},(_,i)=>`<i class="${i<f?'on':''}" style="--c:hsl(${Math.round(120-i*120/(GN-1))} 80% 48%)"></i>`).join('')+'</div><div class="ge"><span>Easiest</span><span>Hardest</span></div><p class="gl">'+(f?(f<=3?'Easy':f<=6?'Moderate':f<=9?'Hard':'Very hard'):'No mission')+' <span class="dim">(estimated)</span></p>';
 $('mn').classList.toggle('show',SEL.has('min'));
 $('start').disabled=!(sel==MOON&&ids.length)}
function toggle(m){if(MIS[m].inc){beep(220,.12,180);return}SEL.has(m)?SEL.delete(m):SEL.add(m);paintHots();panel();beep(SEL.has(m)?880:440,.08,SEL.has(m)?1175:330)}
// Minerals shown with area proportional to approximate typical surface content (thorium is a trace, drawn at minimum size)
const MINS=[['Si','#c9a46a',21,'~21%'],['Al','#d0d4d8',13,'~13%'],['Fe','#c0562a',6,'~6%'],['Mg','#e6e0a0',5,'~5%'],['Ti','#8fb0c8',.5,'~0.5%'],['Th','#a06ad8',.0002,'~2 ppm']];
$('mi').innerHTML=MINS.map(m=>{const s=Math.max(3,Math.round(54*Math.sqrt(m[2]/21)));return`<div class="mn"><i class="chip${s>=12?' b':''}" style="width:${s}px;height:${s}px;background:${m[1]}"></i><b>${m[0]}</b><span class="dim">${m[3]}</span></div>`}).join('')+'<p class="dim" style="flex-basis:100%;margin:6px 0 0;font-size:15px">Approximate amounts in the lunar surface, drawn with area to scale. They vary by region.</p>';
// Story text
const STORY=['Scientists have raised many questions about the Moon.','Is there water ice hiding in its dark polar craters?','Which minerals make up its surface?','How is its mass spread beneath the crust?','Choose your missions and help find the answers.'];
let stT=0;function typeStory(){clearInterval(stT);const full=STORY.join('\n');let n=0;$('st').textContent='';stT=setInterval(()=>{n++;$('st').textContent=full.slice(0,n);if(n%3==0)beep(1300,.02,1300);if(n>=full.length)clearInterval(stT)},30)}
// Section switch: 1 = Solar System + Details, 2 = Moon surface with missions
function goSection(n){
 if(INTRO.on||(n==2&&sel!=MOON))return;SEC=n;fxOff();document.body.classList.toggle('s2',n==2);
 const hd=(id,v)=>$(id).classList.toggle('hid',v),sf=$('surf');
 hd('det',n==2);hd('hint',n==2);hd('mpop',true);$('prompt').classList.remove('on');sf.classList.remove('ready','fly');
 if(n==2){paintHots();panel();typeStory();
  sf.style.transform='none';const r=sf.getBoundingClientRect(),[sx,sy]=pr(MOON.x,MOON.y),k=Math.max(12,2*MOON.r*zoom*ps(MOON.y)),z=sf.offsetWidth||1;
  sf.style.transition='none';sf.style.transform=`translate(${sx-(r.left+r.width/2)}px,${sy-(r.top+r.height/2)}px) scale(${k/z})`;void sf.offsetWidth;
  sf.style.transition='';sf.classList.add('fly');sf.style.transform='none';
  clearTimeout(goSection.t);goSection.t=setTimeout(()=>{if(SEC==2)sf.classList.add('ready')},1700);beep(523,.1,1047)}
 else{clearInterval(stT);sf.style.transform='';beep(392,.12,330)}}
$('go').onclick=()=>goSection(2);$('back').onclick=()=>goSection(1);
$('start').onclick=()=>{if($('start').disabled)return;const ids=Object.keys(MIS).filter(k=>SEL.has(k));
 $('mpb').innerHTML='<b class="y big">Missions confirmed</b>'+ids.map(k=>ROW([MIS[k].n,MIS[k].st])).join('')+'<p class="dim">Active missions have playable levels. Passive missions collect data automatically.</p><p class="edu">Rocket launch sequence coming soon.</p>';
 $('mpop').classList.remove('hid');beep(784,.1,1047)};
$('mx').onclick=()=>$('mpop').classList.add('hid');
addEventListener('keydown',e=>{if(INTRO.on||e.key!='Escape')return;if(!$('mpop').classList.contains('hid'))$('mpop').classList.add('hid');else if(SEC==2)goSection(1)});
let dn=0,mv=0,lx,ly;
cv.addEventListener('pointerdown',e=>{if(INTRO.on)return;dn=1;mv=0;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointerleave',()=>{mxp=null});
cv.addEventListener('pointermove',e=>{mxp=e.clientX;myp=e.clientY;if(INTRO.on||!dn)return;
 const dx=e.clientX-lx,dy=e.clientY-ly;mv+=Math.abs(dx)+Math.abs(dy);px+=dx;py+=dy;lx=e.clientX;ly=e.clientY});
cv.addEventListener('pointerup',e=>{if(INTRO.on)return;dn=0;if(mv<6)show(hit(e.clientX,e.clientY))});
cv.addEventListener('wheel',e=>{e.preventDefault();if(INTRO.on)return;zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.0015))},{passive:false});
$('zi').onclick=()=>zoomAt(W/2,H/2,1.3);$('zo').onclick=()=>zoomAt(W/2,H/2,1/1.3);$('zr').onclick=fit;$('sd').onclick=e=>{mute=!mute;e.target.textContent='Sound: '+(mute?'off':'on');beep(660,.08,880)};
$('skip').onclick=endIntro;addEventListener('keydown',e=>{if(INTRO.on&&['Escape',' ','Enter'].includes(e.key))endIntro()});
addEventListener('resize',size);size();fit();requestAnimationFrame(loop);
