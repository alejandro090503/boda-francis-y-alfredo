/* INSERTAR: antes de </body>, como <script> propio y DESPUÉS de los scripts de P-/C- (necesita el HTML final de #itinerary y #dresscode).
   Orden interno: 1) marcado Luz Premium  2) LP_CONFIG  3) luz-premium.js copia TAL CUAL  4) motores D (medallón, brillo, itinerario). */

/* ── 1 · Marcado de Luz Premium (sin tocar index.html) ── */
(function(){
  function el(tag,cls,attrs){var e=document.createElement(tag);if(cls)e.className=cls;if(attrs)for(var k in attrs)e.setAttribute(k,attrs[k]);e.setAttribute('aria-hidden','true');return e}
  function $(s){return document.querySelector(s)}
  var hero=$('#hero'),pie=$('#footer');
  var SPR='assets/caida-1.webp,assets/caida-3.webp,assets/oro-hoja-1.webp,assets/caida-2.webp,assets/oro-hoja-2.webp';
  /* portada: destello con fantasmas, caída temática (pétalos de la paleta + hoja de oro) y niebla abajo */
  if(hero){
    var fl=el('div','lp-flare',{'data-x':'20%','data-y':'17%','data-s':'1'});hero.appendChild(fl);
    hero.insertBefore(el('canvas','lp-caida',{'data-sprites':SPR,'data-n':'10'}),hero.firstChild);
    hero.insertBefore(el('div','lp-niebla'),hero.firstChild);
    /* diamantes en los nombres y cascada letra por letra (fondo claro) */
    hero.querySelectorAll('.h-name-wrap').forEach(function(w){w.classList.add('lp-glints')});
    ['hN1','hN2'].forEach(function(id){var n=document.getElementById(id);if(n)n.classList.add('lp-cascada','lp-claro')});
  }
  if(pie){
    pie.insertBefore(el('canvas','lp-caida',{'data-sprites':SPR,'data-n':'8'}),pie.firstChild);
    pie.insertBefore(el('div','lp-niebla'),pie.firstChild);
    var fn=pie.querySelector('.ft-nms');if(fn)fn.classList.add('lp-cascada','lp-claro');
  }
  /* tarjeta principal: segundo destello con fantasmas (máx. 2 en la página) */
  var rc=$('.rsvp-card');if(rc)rc.appendChild(el('div','lp-flare',{'data-x':'14%','data-y':'7%','data-s':'.8'}));
  /* 14 · seda alternada con las tintas (hero y galería quedan como están); en estas se quita la tinta */
  ['countdown','calendar','gifts','dresscode','rsvp'].forEach(function(id){
    var s=document.getElementById(id);if(!s)return;
    s.classList.add('dx-seda-sec');
    [].slice.call(s.children).forEach(function(c){if(c.classList.contains('ink-bg'))c.remove()});
    s.insertBefore(el('canvas','lp-seda'),s.firstChild);
  });
  /* 17 · cortina de seda en la unión, antes de la ceremonia y del RSVP */
  ['location','rsvp'].forEach(function(id){var s=document.getElementById(id);if(s)s.setAttribute('data-lp-union','seda')});
})();

/* ── 2 · Configuración de la paleta (Clásico elegante: marino, champán, oro antiguo) ── */
window.LP_CONFIG={
  flareMini:'assets/flare-oro-mini.webp',
  seda:{sombra:'#E9D5AE',base:'#F7E7CE',luz:'#FFFDF6'},
  borde:'#FCF8F1',
  fundido:220,
  cortina:{sombra:'#996515',base:'#D9B57A',luz:'#FBEDCF'},
  niebla:'236,214,170'
};

/* ── 3 · luz-premium.js · copia TAL CUAL del kit ── */
/* ═══ Luz Premium Elysium · aprobados (1, 2, 3, 8, 10, 12, 14) ═══
   Copiar TAL CUAL al final del <body> (después del HTML de las secciones).
   Configuración por invitación, ANTES de este script:
     window.LP_CONFIG = {
       flareMini: 'assets/flare-mini.webp',
       seda:    { sombra:'#3B2F4A', base:'#B9A6C9', luz:'#FFF4E6' },  // 3 tonos de la paleta (oscuro, medio, brillo)
       borde:   '#F6F2EC',      // color de borde que comparten TODAS las secciones claras (la seda se funde desde aquí)
       fundido: 220,            // alto en px del fundido de la seda
       cortina: { sombra:'#7A5A33', base:'#C9A86E', luz:'#FFF4DC' },  // metálico para data-lp-union="seda"
       niebla:  '236,240,246',  // r,g,b de la niebla
       causticas: '#FFF8E4'     // color de la luz de las cáusticas
     };
   Todo se pausa fuera de pantalla y con la pestaña oculta; con prefers-reduced-motion queda en un cuadro fijo. */
(function(){
  var C=window.LP_CONFIG||{}, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function vis(el,cb){if(!('IntersectionObserver' in window)){cb(true);return}new IntersectionObserver(function(es){es.forEach(function(e){cb(e.isIntersecting)})},{rootMargin:'120px'}).observe(el)}
  function hidden(){return document.hidden}
  function hex(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');return[parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255]}
  function fit(c,scale,max){var r=c.getBoundingClientRect(),d=Math.min(max||2,devicePixelRatio||1)*(scale||1);c.width=Math.max(1,Math.round(r.width*d));c.height=Math.max(1,Math.round(r.height*d));return d}
  function img(s){var i=new Image();i.src=s;return i}
  var FM=img(C.flareMini||'assets/flare-mini.webp');

  /* 1 · destello + fantasmas a lo largo del eje que cruza el centro del contenedor */
  document.querySelectorAll('.lp-flare').forEach(function(host,idx){
    var box=host.parentElement, wrap=document.createElement('div');wrap.className='lp-flare-wrap';box.appendChild(wrap);host.remove();
    var del=(-idx*2.9)+'s', s=parseFloat(host.dataset.s||1);
    function build(){wrap.innerHTML='';var W=box.clientWidth,H=box.clientHeight,fx=W*parseFloat(host.dataset.x||18)/100,fy=H*parseFloat(host.dataset.y||20)/100,cx=W/2,cy=H/2;
      var f=document.createElement('div');f.className='lp-fl';f.style.cssText='left:'+fx+'px;top:'+fy+'px;--s:'+s+';--del:'+del;f.innerHTML='<b></b>';wrap.appendChild(f);
      [[.55,14,'255,236,200',.4,0],[.85,34,'170,220,255',.28,1],[1.15,10,'255,255,255',.45,0],[1.4,56,'255,190,210',.22,1],[1.7,22,'200,255,230',.3,0]].forEach(function(q){
        var g=document.createElement('i');g.className='lp-ghost'+(q[4]?' hex':'');var k=q[0]*1.67,x=fx+(cx-fx)*k,y=fy+(cy-fy)*k,z=q[1]*s;
        g.style.cssText='left:'+(x-z/2)+'px;top:'+(y-z/2)+'px;width:'+z+'px;height:'+z+'px;--o:'+q[3]+';--del:'+del+';background:radial-gradient(circle,rgba('+q[2]+',.9) 0 40%,transparent 72%)';wrap.appendChild(g)})}
    build();addEventListener('resize',build)});

  /* 2 · chispas de diamante en el filo superior de las letras, una a la vez */
  document.querySelectorAll('.lp-glints').forEach(function(gb,idx){var on=false;vis(gb,function(v){on=v});
    function glint(){ if(on&&!reduce&&!hidden()){var w=gb.clientWidth,h=gb.clientHeight,d=document.createElement('i');d.className='lp-glint';
      d.style.left=(w*.12+Math.random()*w*.76)+'px';d.style.top=(h*.22+Math.random()*h*.3)+'px';gb.appendChild(d);
      d.animate([{opacity:0,transform:'scale(.2) rotate(-25deg)'},{opacity:1,transform:'scale(1) rotate(0)'},{opacity:0,transform:'scale(.2) rotate(25deg)'}],{duration:1100,easing:'ease-in-out'}).onfinish=function(){d.remove()}}
      setTimeout(glint,700+Math.random()*900)}
    setTimeout(glint,idx*400)});

  /* 3 · caída temática: giro 3D + destello cuando la cara mira a la luz */
  document.querySelectorAll('.lp-caida').forEach(function(c){
    var x=c.getContext('2d'),d=fit(c),on=false,S=(c.dataset.sprites||'').split(',').filter(Boolean).map(img),n=parseInt(c.dataset.n||(innerWidth<600?14:20)),P=[];
    for(var i=0;i<n;i++){var z=Math.random();P.push({x:Math.random(),y:Math.random()*1.1-.1,z:z,v:.025+z*.035,s:16+z*22,r:Math.random()*6.28,sp:(Math.random()-.5)*.8,a:Math.random()*6.28,w:1.2+Math.random()*1.8,k:i,ph:Math.random()*6.28})}
    vis(c,function(v){on=v});addEventListener('resize',function(){d=fit(c)});
    (function loop(t){ if(on&&!hidden()&&S.length){var W=c.width,H=c.height;x.clearRect(0,0,W,H);
      P.forEach(function(p){ if(!reduce){p.y+=p.v/60;if(p.y>1.1){p.y=-.1;p.x=Math.random()}p.a+=p.w/60;p.r+=p.sp/60}
        var im=S[p.k%S.length];if(!im.complete||!im.naturalWidth)return;
        var X=(p.x+Math.sin(t/1800+p.ph)*.03)*W,Y=p.y*H,sz=p.s*d,ar=im.naturalHeight/im.naturalWidth,fl=Math.cos(p.a),face=Math.pow(Math.max(0,fl),14);
        x.save();x.translate(X,Y);x.rotate(p.r);x.scale(Math.max(.14,Math.abs(fl))*(fl<0?-1:1),1);
        x.globalAlpha=.5+p.z*.4;x.drawImage(im,-sz/2,-sz*ar/2,sz,sz*ar);
        if(face>.05){x.globalCompositeOperation='lighter';x.globalAlpha=face*.7;x.drawImage(im,-sz/2,-sz*ar/2,sz,sz*ar);x.globalCompositeOperation='source-over'}
        x.restore();
        if(face>.7&&FM.complete){x.globalAlpha=(face-.7)/.3;var zz=sz*1.6;x.drawImage(FM,X-zz/2+sz*.15,Y-zz/2-sz*.15,zz,zz)}});
      x.globalAlpha=1} requestAnimationFrame(loop)})(0)});

  /* WebGL: utilidades */
  function prog(gl,fs){var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
    var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    var l=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);return pr}
  var HP='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';

  /* 8 · cáusticas en GPU (una sola canvas por escena) */
  document.querySelectorAll('.lp-causticas').forEach(function(c){
    var gl=c.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false});if(!gl){c.remove();return}
    var pr=prog(gl,HP+'uniform vec2 res;uniform float t;uniform vec3 col;void main(){vec2 uv=gl_FragCoord.xy/res;float time=t*.35+23.;vec2 p=uv*6.28318*vec2(1.4*res.x/res.y/1.5,1.)-250.;vec2 i=p;float c=1.;float inten=.005;'+
      'for(int n=0;n<5;n++){float tt=time*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/inten),p.y/(cos(i.y+tt)/inten)));}'+
      'c/=5.;c=1.17-pow(c,1.4);float v=clamp(pow(abs(c),8.),0.,1.);gl_FragColor=vec4(col*v,v*.92);}');
    var uR=gl.getUniformLocation(pr,'res'),uT=gl.getUniformLocation(pr,'t'),uC=gl.getUniformLocation(pr,'col'),on=false,col=hex(C.causticas||'#FFF8E4');
    function size(){fit(c,.75,1.5);gl.viewport(0,0,c.width,c.height)}size();addEventListener('resize',size);vis(c,function(v){on=v});
    (function loop(t){ if((on&&!hidden())||t===0){gl.uniform2f(uR,c.width,c.height);gl.uniform1f(uT,reduce?0:t/1000);gl.uniform3f(uC,col[0],col[1],col[2]);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
      requestAnimationFrame(loop)})(0)});

  /* 10 · cascada: separa el texto en letras */
  document.querySelectorAll('.lp-cascada').forEach(function(el){var t=el.textContent;el.textContent='';el.setAttribute('aria-label',t);
    t.split('').forEach(function(ch,i){var s=document.createElement('span');s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i);if(ch===' '){s.className='sp';s.innerHTML='&nbsp;'}else s.textContent=ch;el.appendChild(s)})});

  /* 12 · niebla: textura generada UNA vez y compartida por todas las capas */
  var nieblas=document.querySelectorAll('.lp-niebla');
  if(nieblas.length){var w=512,h=160,cv=document.createElement('canvas');cv.width=w;cv.height=h;var g=cv.getContext('2d'),tono=C.niebla||'236,240,246';
    function blob(x,y,r,a){var gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba('+tono+','+a+')');gr.addColorStop(1,'rgba('+tono+',0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.29);g.fill()}
    /* blobs dentro del alto de la textura: ninguna orilla queda cortada en seco */
    for(var i=0;i<150;i++){var X=Math.random()*w,Y=h*.32+Math.random()*h*.36,R=16+Math.random()*(Math.min(Y,h-Y)-6),A=.05+Math.random()*.12;blob(X,Y,R,A);blob(X-w,Y,R,A);blob(X+w,Y,R,A)}
    var url='url('+cv.toDataURL()+')';nieblas.forEach(function(n){for(var k=0;k<3;k++){var l=document.createElement('i');l.style.backgroundImage=url;n.appendChild(l)}})}

  /* 15 · velo de luz y 17 · cortina de seda en la unión: data-lp-union="velo" | "seda" en la sección de ABAJO */
  var velos=[];
  document.querySelectorAll('[data-lp-union]').forEach(function(sec){
    var tipo=sec.getAttribute('data-lp-union'),u=document.createElement('div');u.className='lp-union lp-union--'+tipo;u.setAttribute('aria-hidden','true');
    if(getComputedStyle(sec).position==='static')sec.style.position='relative';
    if(tipo==='seda'){var cs=C.cortina||{},cv=document.createElement('canvas');cv.className='lp-seda';
      if(cs.sombra)cv.dataset.sombra=cs.sombra;if(cs.base)cv.dataset.base=cs.base;if(cs.luz)cv.dataset.luz=cs.luz;u.appendChild(cv)}
    else velos.push(u);
    sec.insertBefore(u,sec.firstChild)});
  if(velos.length){var vt=0;function velo(){vt=0;var mid=innerHeight/2;velos.forEach(function(v){var r=v.getBoundingClientRect(),c=r.top+r.height/2,d=Math.abs(c-mid)/(innerHeight*.5);v.style.opacity=reduce?.5:Math.max(0,1-d*1.4).toFixed(3)})}
    addEventListener('scroll',function(){if(!vt)vt=requestAnimationFrame(velo)},{passive:true});addEventListener('resize',velo);velo()}

  /* 14b · fundido de la seda: la transición va COMPLETA dentro de la sección con seda, desde el color EXACTO del borde
     de la sección vecina (LP_CONFIG.borde, p. ej. el marfil que comparten todas las secciones claras) → transparente.
     Así la línea de unión es del mismo color de los dos lados y no queda franja gris ni corte.
     Por sección: data-lp-borde-top / data-lp-borde-bot = otro color o "none" (sin fundido de ese lado). */
  /* el color viaja del borde hacia el tono medio de la seda mientras se vuelve transparente: no pasa por gris */
  function smooth(col,dir,tint){var c=col.split(',').map(Number),b=(tint||col).split(',').map(Number),st=[];
    for(var i=0;i<=8;i++){var t=i/8,a=1-t*t*(3-2*t),k=t*.7,m=c.map(function(v,j){return Math.round(v+(b[j]-v)*k)}).join(',');st.push('rgba('+m+','+a.toFixed(3)+') '+(t*100).toFixed(1)+'%')}
    return 'linear-gradient('+dir+','+st.join(',')+')'}
  function rgb(c){if(!c)return null;if(c.indexOf('rgb')===0)return c.replace(/rgba?\(|\)/g,'').split(',').slice(0,3).map(function(x){return x.trim()}).join(',');var h=hex(c);return h.map(function(v){return Math.round(v*255)}).join(',')}
  document.querySelectorAll('.lp-seda').forEach(function(cv){var sec=cv.parentElement;if(!sec||sec.classList.contains('lp-union'))return;
    /* en secciones cortas el fundido no pasa del 30% del alto, para que la seda se siga viendo */
    var fades=[];function alto(){var h=Math.round(Math.min(C.fundido||220,sec.offsetHeight*.3))+'px';fades.forEach(function(f){f.style.height=h})}
    addEventListener('resize',alto);setTimeout(alto,0);addEventListener('load',alto);
    var H=(C.fundido||220)+'px';[['top','to bottom'],['bot','to top']].forEach(function(s){
      var v=sec.getAttribute('data-lp-borde-'+s[0]);if(v==='none')return;var col=rgb(v||C.borde);if(!col)return;
      var tint=rgb(cv.dataset.base||(C.seda||{}).base);
      var f=document.createElement('div');f.className='lp-sfade lp-sfade--'+s[0];f.setAttribute('aria-hidden','true');f.style.height=H;f.style.backgroundImage=smooth(col,s[1],tint);sec.insertBefore(f,cv.nextSibling);fades.push(f)});alto()});

  /* 14 · seda iluminada: UN contexto WebGL compartido que dibuja cada sección visible y la copia a su canvas 2D */
  var sedas=[].slice.call(document.querySelectorAll('.lp-seda'));
  if(sedas.length){var G=document.createElement('canvas'),gl=G.getContext('webgl',{preserveDrawingBuffer:true,antialias:false});
    if(!gl){sedas.forEach(function(s){s.remove()})}else{
      var pr=prog(gl,HP+'uniform vec2 res;uniform float t;uniform float seed;uniform vec3 cS,cB,cL;'+
        'float h(vec2 p){return sin(p.x*3.1+p.y*1.3+t*.6)*.55+sin(p.x*1.7-p.y*2.2-t*.45)*.35+sin(p.x*5.3+p.y*.7+t*.8)*.12;}'+
        'void main(){vec2 uv=gl_FragCoord.xy/res;vec2 p=vec2(uv.x*2.,uv.y*1.4*(res.y/res.x)*1.4)+seed;float e=.01;'+
        'float hx=(h(p+vec2(e,0.))-h(p-vec2(e,0.)))/(2.*e),hy=(h(p+vec2(0.,e))-h(p-vec2(0.,e)))/(2.*e);'+
        'vec3 n=normalize(vec3(-hx*.35,-hy*.35,1.));vec3 l=normalize(vec3(cos(t*.25)*.7,.5,.6));float dif=max(0.,dot(n,l));'+
        'vec3 hv=normalize(l+vec3(0.,0.,1.));float spec=pow(max(0.,dot(n,hv)),40.);'+
        'vec3 col=mix(cS,cB,.25+dif*.75)+cL*spec*.32+cL*pow(dif,8.)*.06;gl_FragColor=vec4(min(col,vec3(1.)),1.);}');
      var u={r:gl.getUniformLocation(pr,'res'),t:gl.getUniformLocation(pr,'t'),s:gl.getUniformLocation(pr,'seed'),S:gl.getUniformLocation(pr,'cS'),B:gl.getUniformLocation(pr,'cB'),L:gl.getUniformLocation(pr,'cL')};
      var items=sedas.map(function(cv,i){var pal=Object.assign({sombra:'#4A3B2E',base:'#C9A97E',luz:'#FFF4E0'},C.seda||{},{sombra:cv.dataset.sombra||(C.seda||{}).sombra,base:cv.dataset.base||(C.seda||{}).base,luz:cv.dataset.luz||(C.seda||{}).luz});
        Object.keys(pal).forEach(function(k){if(!pal[k])delete pal[k]});pal=Object.assign({sombra:'#4A3B2E',base:'#C9A97E',luz:'#FFF4E0'},pal);
        var it={cv:cv,x:cv.getContext('2d'),on:false,seed:i*3.7,S:hex(pal.sombra),B:hex(pal.base),L:hex(pal.luz),first:true};
        function sz(){var r=cv.getBoundingClientRect();cv.width=Math.max(2,Math.round(r.width*.5));cv.height=Math.max(2,Math.round(r.height*.5))}sz();addEventListener('resize',function(){sz();it.first=true});
        vis(cv,function(v){it.on=v});return it});
      var fr=0;
      (function loop(t){ if(!hidden()&&((fr++&1)===0)){items.forEach(function(it){ if(!(it.on||it.first))return; if(reduce&&!it.first)return; it.first=false;
          var w=it.cv.width,h=it.cv.height;if(G.width!==w||G.height!==h){G.width=w;G.height=h}gl.viewport(0,0,w,h);
          gl.uniform2f(u.r,w,h);gl.uniform1f(u.t,reduce?0:t/1000);gl.uniform1f(u.s,it.seed);gl.uniform3fv(u.S,it.S);gl.uniform3fv(u.B,it.B);gl.uniform3fv(u.L,it.L);
          gl.drawArrays(gl.TRIANGLE_STRIP,0,4);it.x.drawImage(G,0,0)})}
        requestAnimationFrame(loop)})(0)}}
})();

/* ── 4 · Motores D ── */
(function(){
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IO='IntersectionObserver' in window;

  /* Visibilidad por sección: los bucles CSS (destellos, foil, filos) solo corren en lo que está en pantalla */
  var secs=[].slice.call(document.querySelectorAll('section,#footer'));
  if(IO){var vio=new IntersectionObserver(function(E){E.forEach(function(e){e.target.classList.toggle('dx-on',e.isIntersecting)})},{rootMargin:'120px 0px'});
    secs.forEach(function(s){vio.observe(s)})}
  else secs.forEach(function(s){s.classList.add('dx-on')});

  /* ═══ D-vivo · medallón de filigrana: relieve calculado una vez, luz por píxel en cada cuadro ═══ */
  function crearMedallon(S){
    var cv=document.createElement('canvas');cv.width=cv.height=S;
    var ctx=cv.getContext('2d');if(!ctx)return null;
    var img=ctx.createImageData(S,S),D=img.data,TAU=Math.PI*2;
    function rid(d,w){if(d>=w)return 0;var q=d/w;return Math.sqrt(1-q*q)}
    function petalo(r,t,a,b,p,w,k){
      var c=Math.abs(Math.cos(4*t)),f=b*Math.pow(c,p),rc=a+f,e=.004,g=(b*Math.pow(Math.abs(Math.cos(4*(t+e))),p)-f)/e/Math.max(r,.05);
      return k*rid(Math.abs(r-rc)/Math.sqrt(1+Math.min(g*g,25)),w)}
    function altura(x,y){
      var r=Math.sqrt(x*x+y*y);if(r>.995)return 0;
      var t=Math.atan2(y,x),h=rid(Math.abs(r-.93),.058),st,tb;
      st=TAU/40;tb=Math.round(t/st)*st;h=Math.max(h,.9*rid(Math.hypot(x-.835*Math.cos(tb),y-.835*Math.sin(tb)),.036));   /* perlas */
      h=Math.max(h,.72*rid(Math.abs(r-.765),.026));
      h=Math.max(h,petalo(r,t,.33,.37,.7,.034,.82),petalo(r,t,.33,.22,1.1,.026,.64));                                    /* pétalos de filigrana */
      st=TAU/8;tb=Math.round((t-st/2)/st)*st+st/2;var dc=Math.hypot(x-.6*Math.cos(tb),y-.6*Math.sin(tb));
      h=Math.max(h,.72*rid(Math.abs(dc-.072),.026),.88*rid(dc,.04));                                                       /* volutas */
      tb=Math.round(t/st)*st;h=Math.max(h,.86*rid(Math.hypot(x-.735*Math.cos(tb),y-.735*Math.sin(tb)),.036));
      h=Math.max(h,.8*rid(Math.abs(r-.3),.028));
      st=TAU/24;tb=Math.round(t/st)*st;h=Math.max(h,.56*rid(Math.hypot(x-.255*Math.cos(tb),y-.255*Math.sin(tb)),.02));
      h=Math.max(h,.66*rid(Math.abs(r-(.09+.12*Math.pow(Math.abs(Math.cos(6*t)),1.3))),.024));                             /* roseta */
      if(r<.085)h=Math.max(h,1.1*Math.sqrt(1-(r/.085)*(r/.085)));
      return h}
    var H=new Float32Array(S*S),x,y,i;
    for(y=0;y<S;y++)for(x=0;x<S;x++)H[y*S+x]=altura((x+.5)/S*2-1,(y+.5)/S*2-1);
    var L=[],K=1.7;
    for(y=1;y<S-1;y++)for(x=1;x<S-1;x++){i=y*S+x;var h=H[i];if(h<=0)continue;
      var gx=(H[i+1]-H[i-1])*.5*K,gy=(H[i+S]-H[i-S])*.5*K,l=Math.sqrt(gx*gx+gy*gy+1);
      L.push(i,-gx/l,-gy/l,1/l,.55+.45*Math.min(1,h),Math.min(1,h*5))}
    var P=new Float32Array(L),n=P.length;
    /* rampa del oro antiguo: sombra → #5e3c08 → #996515 → #C99A52 → #F3DDB0 → #FBEDCF */
    var st=[[0,46,29,3],[.35,94,60,8],[.6,153,101,21],[.85,201,154,82],[1.05,243,221,176],[1.25,251,237,207]],LR=new Uint8ClampedArray(256),LG=new Uint8ClampedArray(256),LB=new Uint8ClampedArray(256);
    for(i=0;i<256;i++){var v=i/255*1.25,k=1;while(k<st.length-1&&st[k][0]<v)k++;var a=st[k-1],b=st[k],f=Math.max(0,Math.min(1,(v-a[0])/(b[0]-a[0])));
      LR[i]=a[1]+(b[1]-a[1])*f;LG[i]=a[2]+(b[2]-a[2])*f;LB[i]=a[3]+(b[3]-a[3])*f}
    var F=[-.45,-.55,.7],fl=Math.hypot(F[0],F[1],F[2]);F=[F[0]/fl,F[1]/fl,F[2]/fl];
    return {cv:cv,pinta:function(t){
      var az=t*.6,lx=Math.cos(az)*.8,ly=Math.sin(az)*.8,lz=.6,ll=Math.hypot(lx,ly,lz);lx/=ll;ly/=ll;lz/=ll;
      var hx=lx,hy=ly,hz=lz+1,hl=Math.hypot(hx,hy,hz);hx/=hl;hy/=hl;hz/=hl;
      var gx=F[0],gy=F[1],gz=F[2]+1,gl=Math.hypot(gx,gy,gz);gx/=gl;gy/=gl;gz/=gl;
      for(var j=0;j<n;j+=6){
        var nx=P[j+1],ny=P[j+2],nz=P[j+3],ao=P[j+4];
        var d1=nx*lx+ny*ly+nz*lz,d2=nx*F[0]+ny*F[1]+nz*F[2];if(d1<0)d1=0;if(d2<0)d2=0;
        var s1=nx*hx+ny*hy+nz*hz,s2=nx*gx+ny*gy+nz*gz;if(s1<0)s1=0;if(s2<0)s2=0;
        s1*=s1;s1*=s1;s1*=s1;s1*=s1;s1*=s1;s1*=s1;          /* ^64: el brillo que recorre la filigrana */
        s2*=s2;s2*=s2;s2*=s2;s2*=s2;s2*=s2;                  /* ^32: reflejo fijo de la ventana */
        var I=(.2+d2*.42+d1*.58)*ao,q=Math.min(255,I/1.25*255)|0,sp=s1*1.25+s2*.3,o=P[j]*4;
        D[o]=Math.min(255,LR[q]+sp*255);D[o+1]=Math.min(255,LG[q]+sp*240);D[o+2]=Math.min(255,LB[q]+sp*205);D[o+3]=P[j+5]*255}
      ctx.putImageData(img,0,0)}}
  }

  function flare(padre,x,y,s,mini,k){
    var f=document.createElement('i'),b=document.createElement('b');
    f.className='dx-flare'+(mini?' is-mini':'');f.setAttribute('aria-hidden','true');
    f.style.setProperty('--x',x);f.style.setProperty('--y',y);f.style.setProperty('--s',s||1);
    var dur=mini?5.5+(k%3)*.9:8+(k%3);                       /* desfase áureo: nunca florecen dos juntos */
    f.style.setProperty('--dur',dur+'s');f.style.setProperty('--del',(-((k*.618034)%1)*dur).toFixed(2)+'s');
    f.appendChild(b);padre.appendChild(f)}
  var nf=0;

  (function initMedallones(){
    var sitios=[['story','r'],['calendar','l'],['dresscode','r'],['footer','l']],hosts=[];
    sitios.forEach(function(s){var h=document.getElementById(s[0]);if(h)hosts.push([h,s[1]])});
    if(!hosts.length)return;
    var S=Math.round(104*Math.min(2,window.devicePixelRatio||1)),M=crearMedallon(S);if(!M)return;
    var meds=hosts.map(function(h,i){
      var sec=h[0];sec.classList.add('dx-med-host');
      var w=document.createElement('div');w.className='dx-med dx-med--'+h[1];w.setAttribute('aria-hidden','true');
      var sw=document.createElement('div');sw.className='dx-med-sway';sw.style.setProperty('--d',(-i*2.3)+'s');
      var c=document.createElement('canvas');c.width=c.height=S;sw.appendChild(c);w.appendChild(sw);sec.appendChild(w);
      [['30%','26%',.7],['68%','60%',.85]].forEach(function(p){flare(sw,p[0],p[1],p[2],true,nf++)});
      var x=c.getContext('2d');if(i%2)x.setTransform(-1,0,0,1,S,0);   /* el siguiente va espejado */
      return {el:c,ctx:x,ve:!IO}});
    function copia(todas){meds.forEach(function(m){if(!todas&&!m.ve)return;m.ctx.clearRect(0,0,S,S);m.ctx.drawImage(M.cv,0,0)})}
    var th=.9,raf=0,last=0,par=0;
    M.pinta(th);copia(true);
    if(RM)return;
    function hay(){return meds.some(function(m){return m.ve})}
    function loop(now){raf=0;if(document.hidden||!hay()){last=0;return}
      var dt=last?Math.min((now-last)/1000,.05):.016;last=now;th+=dt;
      if((par++&1)===0){M.pinta(th);copia(false)}       /* 30 cuadros por segundo bastan */
      raf=requestAnimationFrame(loop)}
    function arranca(){if(!raf&&!document.hidden&&hay())raf=requestAnimationFrame(loop)}
    if(IO){var io=new IntersectionObserver(function(E){E.forEach(function(e){meds.forEach(function(m){if(m.el===e.target)m.ve=e.isIntersecting})});arranca()},{rootMargin:'60px 0px'});
      meds.forEach(function(m){io.observe(m.el)})}
    document.addEventListener('visibilitychange',arranca);arranca();
  })();

  /* ═══ D-brillo · filos de luz, vidrio y destellos en tarjetas; foil y polvo en títulos ═══ */
  (function initBrillo(){
    function capa(padre,cl,hijo,k){var e=document.createElement('i');e.className=cl;e.setAttribute('aria-hidden','true');
      if(hijo){var h=document.createElement('i');h.style.setProperty('--del',(-(k*3.1)).toFixed(1)+'s');e.appendChild(h)}padre.appendChild(e)}
    var tarjetas='.story-card,.loc-card,.wx-card,.cal,#gifts .gf-card,.fam-grid,.fam-god,.rsvp-card,.rsvp-gracias,#rsvp .gf-card';
    document.querySelectorAll(tarjetas).forEach(function(c,k){
      if(c.querySelector(':scope > .dx-rim'))return;
      [].slice.call(c.children).forEach(function(ch){if(getComputedStyle(ch).position==='static')ch.classList.add('dx-up')});
      c.classList.add('dx-card');
      capa(c,'dx-halo');capa(c,'dx-sheen',true,k);
      if(!c.classList.contains('rsvp-card')&&!c.classList.contains('cal'))capa(c,'dx-line');   /* esas ya traen filete propio */
      capa(c,'dx-rim',true,k);
      var chica=c.classList.contains('rsvp-gracias')||c.classList.contains('fam-god');
      if(!c.classList.contains('rsvp-card'))flare(c,'7%','0',chica?.8:.95,false,nf++);         /* la del RSVP ya lleva el destello con fantasmas */
      flare(c,'91%','100%',chica?.62:.78,false,nf++);
    });
    var principales={countdown:1,location:1,itinerary:1,rsvp:1};
    document.querySelectorAll('.ttl').forEach(function(t,k){
      if(t.querySelector('.dx-ttl-in'))return;
      var w=document.createElement('span');w.className='dx-ttl-in dx-foil';w.style.setProperty('--fd',(-k*.9)+'s');
      while(t.firstChild)w.appendChild(t.firstChild);t.appendChild(w);
      flare(w,'7%','30%',.42,false,nf++);flare(w,'95%','34%',1,true,nf++);
      var sec=t.closest('section');
      if(sec&&principales[sec.id]){var d=document.createElement('span');d.className='dx-dust';d.setAttribute('aria-hidden','true');
        for(var i=0;i<8;i++){var p=document.createElement('i');
          p.style.cssText='left:'+(4+Math.random()*92).toFixed(1)+'%;top:'+(Math.random()*100).toFixed(1)+'%;--t:'+(2.8+Math.random()*2.4).toFixed(2)+'s;--dl:'+(-Math.random()*5).toFixed(2)+'s';d.appendChild(p)}
        w.appendChild(d)}
    });
    var amp=document.getElementById('hAmp');if(amp){amp.classList.add('dx-foil');amp.style.setProperty('--fd','-2.4s')}
    document.querySelectorAll('#countdown .cd-num').forEach(function(n,k){n.classList.add('dx-foil');n.style.setProperty('--fd',(-k*1.3-.5)+'s')});
  })();

  /* ═══ D-itinerario · estela de luz que recorre el camino en bucle (el cliente pidió nada ligado al scroll) ═══ */
  (function initItinerario(){
    var wrap=document.getElementById('itnWrap'),line=document.getElementById('itnPath');
    if(!wrap||!line)return;
    var rows=[].slice.call(wrap.querySelectorAll('.itn-row'));
    wrap.querySelectorAll('.itn-t').forEach(function(h){
      var tx=h.textContent.trim(),m=tx.match(/^(\d{1,2}:\d{2})\s*([ap]\.?\s?m\.?)$/i);
      if(!m){h.classList.add('dx-tbd');return}
      h.setAttribute('aria-label',tx);h.classList.add('dx-hora');
      h.innerHTML='<span class="dx-n"></span><span class="dx-m"></span>';h.firstChild.textContent=m[1];h.lastChild.textContent=m[2];
    });
    if(RM){rows.forEach(function(r){r.classList.add('dx-lit')});return}
    var NS='http://www.w3.org/2000/svg',svg=line.ownerSVGElement;
    function poly(cl){var p=document.createElementNS(NS,'path');p.setAttribute('class',cl);p.setAttribute('pathLength','1');svg.appendChild(p);return p}
    var colas=[{el:poly('dx-t1'),px:120},{el:poly('dx-t2'),px:76},{el:poly('dx-t3'),px:36}];
    var head=document.createElement('i');head.className='dx-head';head.setAttribute('aria-hidden','true');head.appendChild(document.createElement('b'));wrap.appendChild(head);
    var firma='',total=1,hitos=[];
    function geo(){var d=line.getAttribute('d')||'';if(d===firma)return;firma=d;
      colas.forEach(function(c){c.el.setAttribute('d',d)});if(!d)return;
      total=line.getTotalLength()||1;
      var W=wrap.offsetWidth,top=wrap.getBoundingClientRect().top,N=240,M=[];
      for(var i=0;i<=N;i++){var q=line.getPointAtLength(total*i/N);M.push([q.x,q.y])}
      hitos=rows.map(function(r){var b=r.getBoundingClientRect(),cx=r.dataset.side==='left'?29:W-29,cy=b.top-top+b.height/2,best=0,bd=1e9;
        M.forEach(function(q,i){var dd=(q[0]-cx)*(q[0]-cx)+(q[1]-cy)*(q[1]-cy);if(dd<bd){bd=dd;best=i}});return best/N})}
    function punto(p){var a=line.getPointAtLength(total*p),b=line.getPointAtLength(Math.min(total,total*p+2));
      return {x:a.x,y:a.y,ang:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}}
    /* ciclo de 10 s: la luz viaja 7.5 s (arranca y frena suave), descansa con todo encendido y vuelve a empezar */
    var CICLO=10,VIAJE=7.5,t0=0,raf=0,vis=!IO,giro=null,pPrev=0;
    function pinta(now){
      raf=0;if(!vis||document.hidden){t0=0;return}
      geo();if(!firma){raf=requestAnimationFrame(pinta);return}
      if(!t0)t0=now-pPrev*1000;
      var s=((now-t0)/1000)%CICLO;pPrev=s;
      var k=Math.min(1,s/VIAJE),p=k*k*(3-2*k),vel=s<VIAJE?6*k*(1-k)/VIAJE:0,d=p*total,q=punto(p);
      colas.forEach(function(c){var largo=Math.min(d,c.px)/total;c.el.style.strokeDasharray=largo+' 2';c.el.style.strokeDashoffset=-(p-largo);
        c.el.style.opacity=(p>.002&&s<VIAJE+.6)?1:0});
      if(giro===null)giro=q.ang;giro+=(((q.ang-giro+540)%360)-180)*.16;
      var esc=.8+Math.min(.42,vel*1.6);
      head.style.transform='translate3d('+q.x.toFixed(2)+'px,'+q.y.toFixed(2)+'px,0) rotate('+giro.toFixed(2)+'deg) scale('+esc.toFixed(3)+')';
      head.classList.toggle('is-on',p>.003&&s<VIAJE+.4);
      var apaga=s>CICLO-.7;
      rows.forEach(function(r,i){r.classList.toggle('dx-lit',!apaga&&p>=(hitos[i]||0)-.008)});
      raf=requestAnimationFrame(pinta)}
    function arranca(){if(!raf&&vis&&!document.hidden)raf=requestAnimationFrame(pinta)}
    if(IO)new IntersectionObserver(function(E){vis=E[0].isIntersecting;if(!vis)t0=0;arranca()},{rootMargin:'60px 0px'}).observe(wrap);
    document.addEventListener('visibilitychange',arranca);
    addEventListener('resize',function(){firma=''});
    arranca();
  })();
})();
