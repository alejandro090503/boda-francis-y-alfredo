/* INSERTAR: <script> propio antes de </body>. Sin GSAP ni ScrollTrigger. El bloque viejo buildTimelinePath() y el ScrollTrigger de '#itinerary' dentro de scrollAnims() quedan inertes (ids tlWrap/tlSvg/tlPath ya no existen); mejor borrarlos. */
(function(){
  var wrap=document.getElementById('itnWrap'),svg=document.getElementById('itnSvg'),path=document.getElementById('itnPath');
  var pearl=document.getElementById('itnPearl');
  if(!wrap||!svg||!path) return;
  var rows=[].slice.call(wrap.querySelectorAll('.itn-row'));
  var ids=['itnPath','itnPathHalo','itnPathBeam','itnPathCore','itnPathBg'];
  var len=0;
  function build(){
    var W=wrap.offsetWidth,H=wrap.offsetHeight; if(!W||!H) return;
    var top=wrap.getBoundingClientRect().top;
    svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('width',W);svg.setAttribute('height',H);
    var pts=rows.map(function(r){
      var b=r.getBoundingClientRect();
      return {x:r.dataset.side==='left'?29:W-29,y:b.top-top+b.height/2};
    });
    var d='M '+pts[0].x+' '+pts[0].y;
    for(var i=1;i<pts.length;i++){
      var a=pts[i-1],b=pts[i],m=(a.y+b.y)/2;
      d+=' C '+a.x+' '+m+', '+b.x+' '+m+', '+b.x+' '+b.y;
    }
    ids.forEach(function(id){var el=document.getElementById(id);if(el)el.setAttribute('d',d);});
    len=path.getTotalLength();
  }
  build();
  var rz;window.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(build,140);},{passive:true});
  window.addEventListener('load',build);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(build);

  /* perla ambiental: recorre el camino en bucle, solo mientras la sección está en pantalla */
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!pearl||reduce) return;
  var vis=false,raf=0,t0=0;
  function tick(ts){
    if(!vis||!len){raf=0;return;}
    if(!t0)t0=ts;
    var p=((ts-t0)/11000)%1,pt=path.getPointAtLength(len*p);
    pearl.style.transform='translate('+pt.x+'px,'+pt.y+'px)';
    pearl.style.opacity=String(Math.min(1,Math.sin(p*Math.PI)*3));
    raf=requestAnimationFrame(tick);
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      vis=es[0].isIntersecting;
      if(vis&&!raf)raf=requestAnimationFrame(tick);
    },{threshold:0}).observe(wrap);
  }
})();
