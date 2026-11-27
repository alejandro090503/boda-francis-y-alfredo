/* INSERTAR: <script> propio antes de </body>, DESPUÉS del IIFE "MÚSICA AMBIENTAL" (no toca el audio: solo sigue la clase .on que ya pone ese código; no reinicia la canción) */
(function(){
  'use strict';
  var btn=document.getElementById('musicBtn'),audio=document.getElementById('bgMusic');
  if(!btn||!audio) return;
  var spin=btn.querySelector('.vinyl-spin'),needle=btn.querySelector('.vinyl-needle');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var on=false,rafId=0,brakeTimer=0;
  if(needle){
    var fail=function(){btn.classList.add('no-needle-img');};
    needle.addEventListener('error',fail);
    if(needle.complete&&needle.naturalWidth===0)fail();
  }
  function getAnim(){
    if(!spin||!spin.getAnimations)return null;
    var a=spin.getAnimations();
    for(var i=0;i<a.length;i++){if(a[i].animationName==='vinylSpin')return a[i];}
    return null;
  }
  /* arranque suave y frenado con inercia */
  function ramp(to,ms,done){
    var a=getAnim();
    if(!a||reduce){if(done)done();return;}
    cancelAnimationFrame(rafId);
    var from=a.playbackRate,t0=performance.now();
    (function step(now){
      var k=Math.min(1,(now-t0)/ms);
      var e=to<from?1-Math.pow(1-k,2.4):k*k*(3-2*k);
      a.playbackRate=Math.max(0.001,from+(to-from)*e);
      if(k<1){rafId=requestAnimationFrame(step);}else if(done){done();}
    })(t0);
  }
  function stopBrake(){btn.classList.remove('is-braking');var a=getAnim();if(a)a.playbackRate=1;}
  function setOn(v){
    v=!!v;if(v===on)return;on=v;clearTimeout(brakeTimer);
    btn.setAttribute('aria-label',on?'Pausar música':'Reproducir música');
    btn.setAttribute('aria-pressed',on?'true':'false');
    if(on){
      btn.classList.remove('is-braking');btn.classList.add('is-playing');
      var a0=getAnim();if(a0&&!reduce)a0.playbackRate=0.05;
      ramp(1,500);
    }else{
      btn.classList.add('is-braking');btn.classList.remove('is-playing');
      ramp(0.02,1300,stopBrake);
      brakeTimer=setTimeout(stopBrake,1600);
    }
  }
  /* fuente de verdad: la clase .on del JS de la plantilla */
  new MutationObserver(function(list){
    var was=/ on /.test(' '+(list[0].oldValue||'')+' ');
    var now=btn.classList.contains('on');
    if(was!==now)setOn(now);
  }).observe(btn,{attributes:true,attributeFilter:['class'],attributeOldValue:true});
  audio.addEventListener('play',function(){setOn(true);});
  audio.addEventListener('pause',function(){if(!btn.classList.contains('on'))setOn(false);});
  setOn(btn.classList.contains('on')||!audio.paused);
})();
