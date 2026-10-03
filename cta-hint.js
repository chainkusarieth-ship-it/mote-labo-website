/* ボタンの「押せます」ヒント（2026-10-03）
   data-hint="finger" … 画面に入ったら、指がタップ＋ボタンが光る（1回だけ）
   data-hint="shine"  … 画面に入ったら、ボタンが光るだけ（1回だけ）
   ・ページを開くたびに各ボタン1回まで。動きを減らす設定の端末では動かさない */
(function(){
  try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
  if(!('IntersectionObserver' in window)) return;
  var els=[].slice.call(document.querySelectorAll('[data-hint]'));
  if(!els.length) return;

  var css=''+
  '.cta-hint-on{ position:relative; overflow:hidden; animation:ctaPop .6s ease-out; }'+
  '.cta-hint-on::after{ content:""; position:absolute; top:0; bottom:0; left:-60%; width:45%; background:linear-gradient(110deg,transparent,rgba(255,255,255,.65),transparent); animation:ctaShine .7s ease-out forwards; pointer-events:none; }'+
  '@keyframes ctaPop{ 0%{ transform:scale(1); } 35%{ transform:scale(1.06); } 100%{ transform:scale(1); } }'+
  '@keyframes ctaShine{ to{ left:120%; } }'+
  '.cta-finger{ position:absolute; z-index:40; font-size:26px; line-height:1; pointer-events:none; opacity:0; filter:drop-shadow(0 2px 4px rgba(0,0,0,.5)); transition:opacity .3s; }'+
  '.cta-finger.on{ opacity:1; }'+
  '.cta-finger.tap{ animation:ctaTap .45s ease-out; }'+
  '@keyframes ctaTap{ 0%{ transform:translateY(0); } 45%{ transform:translateY(-8px) scale(.9); } 100%{ transform:translateY(0); } }';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  function shine(el){
    el.classList.remove('cta-hint-on'); void el.offsetWidth; el.classList.add('cta-hint-on');
    setTimeout(function(){ el.classList.remove('cta-hint-on'); },800);
  }
  function finger(el){
    var f=document.createElement('span'); f.className='cta-finger'; f.setAttribute('aria-hidden','true'); f.textContent='👆';
    document.body.appendChild(f);
    function place(){ var r=el.getBoundingClientRect();
      f.style.left=(r.left+window.scrollX+r.width*0.62-12)+'px';
      f.style.top=(r.top+window.scrollY+r.height-14)+'px'; }
    place(); f.classList.add('on');
    var n=0;
    (function tap(){
      if(n>=2){ setTimeout(function(){ f.classList.remove('on'); setTimeout(function(){ f.remove(); },350); },500); return; }
      place(); f.classList.remove('tap'); void f.offsetWidth; f.classList.add('tap'); shine(el);
      n++; setTimeout(tap,1100);
    })();
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      var el=en.target; io.unobserve(el);
      setTimeout(function(){ el.getAttribute('data-hint')==='finger' ? finger(el) : shine(el); },350);
    });
  },{threshold:0.9});
  els.forEach(function(el){ io.observe(el); });
})();
