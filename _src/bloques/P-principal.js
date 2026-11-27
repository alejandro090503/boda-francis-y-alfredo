/* INSERTAR: script nuevo antes de </body> */
(function(){
  /* brillo del hero */
  var h=document.getElementById('hero');
  if(h){
    var g=document.createElement('div');g.className='hx-glow';g.setAttribute('aria-hidden','true');g.innerHTML='<i></i><i></i><i></i><i></i>';
    var sw=document.createElement('div');sw.className='hx-sweep';sw.setAttribute('aria-hidden','true');
    var v=document.createElement('div');v.className='hx-vign';v.setAttribute('aria-hidden','true');
    var d=document.createElement('div');d.className='hx-dust';d.setAttribute('aria-hidden','true');
    for(var i=0;i<16;i++){var b=document.createElement('b');var z=2+Math.random()*2;
      b.style.cssText='left:'+(4+Math.random()*92)+'%;width:'+z+'px;height:'+z+'px;animation-duration:'+(14+Math.random()*12)+'s;animation-delay:'+(-Math.random()*24)+'s';d.appendChild(b);}
    var first=h.querySelector('.h-ov')||h.firstChild;
    h.insertBefore(v,first);h.insertBefore(sw,first);h.insertBefore(g,first);h.appendChild(d);
  }
  /* levitación */
  var n=0;
  ['.loc-card','.fam-col','.fam-god','.wx-card','#gifts .gf-card','.cal','.story-card'].forEach(function(q){
    document.querySelectorAll(q).forEach(function(el){el.classList.add('lev','lev-'+((n++%4)+1));});
  });
  /* menú */
  var btn=document.getElementById('mnBtn'),pn=document.getElementById('mnPanel'),x=document.getElementById('mnX');
  if(btn&&pn){
    var open=function(){pn.classList.add('on');}, close=function(){pn.classList.remove('on');};
    btn.addEventListener('click',open);x.addEventListener('click',close);
    pn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(e){
      e.preventDefault();close();var t=document.querySelector(a.getAttribute('href'));
      if(t) setTimeout(function(){window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-10,behavior:'smooth'});},250);
    });});
  }
  /* menú y vinilo aparecen tras abrir el sobre */
  function shown(){document.body.classList.add('fa-open');}
  var env=document.getElementById('envelope-screen');
  if(!env){shown();return;}
  var mo=new MutationObserver(function(){
    if(env.style.display==='none'||!document.body.classList.contains('env-locked')){shown();mo.disconnect();}
  });
  mo.observe(env,{attributes:true,attributeFilter:['style']});
  mo.observe(document.body,{attributes:true,attributeFilter:['class']});
})();
