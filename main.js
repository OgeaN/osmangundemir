/* ============================================================
   Osman Gündemir — Portfolio (terminal / gaming)
   Bilingual TR/EN · role rotator · counters · reveal · galleries
   ============================================================ */
(function(){
"use strict";
var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

var I={
 tr:{
  "meta.title":"Osman Gündemir — Yazılım Geliştirici",
  "meta.desc":"Osman Gündemir — Unity oyun geliştirici ve backend mühendisi. Yayınlanan mobil oyunlar, VR simülasyonları ve FastAPI backend projeleri.",
  "nav.skip":"İçeriğe geç","nav.about":"hakkımda","nav.exp":"deneyim","nav.work":"projeler","nav.play":"oyun","nav.skills":"yetenekler","nav.contact":"iletişim",
  "hero.lead":"// rol:","hero.roles":"Unity Geliştirici|Backend Mühendisi|Oyun Geliştirici|VR Geliştirici",
  "hero.pitch":"Oyun geliştirme, backend API ve yapay zeka alanlarında deneyimli bir yazılım geliştiriciyim. Google Play'de mobil oyunlar yayınladım, FastAPI ile RESTful API'ler kurdum ve Aselsan'da VR simülasyonları geliştirdim.",
  "hero.cta1":"./projeler","hero.cta2":"./iletişim",
  "s.dl":"indirme","s.co":"şirket","s.gpa":"gpa / 4.0","s.pr":"proje",
  "about.body":"Konya Teknik Üniversitesi Bilgisayar Mühendisliği mezunuyum. Freelance ve ekip ortamlarında; Unity ile oyun ve simülasyon, Python/FastAPI ile backend servisleri, PyTorch ile yapay zeka modelleri üzerine çalıştım. İşin hem istemci hem sunucu tarafını uçtan uca kurmayı seviyorum.",
  "about.school":"Konya Teknik Üniversitesi · Bilgisayar Müh.","about.langs":"Türkçe (ana dil) · İngilizce (B1)",
  "exp.a.r":"Freelance Unity & Backend Geliştirici","exp.a.p1":"Unity ile tüm istemci tarafını geliştirdim: sınav ekranları, UI/UX akışı, zamanlayıcı ve çoktan seçmeli soru yapısı.","exp.a.p2":"Joystick girişiyle uçuş simülasyonu modülü kurdum; gerçek zamanlı horizon ekranı üzerinden irtifa/yön/hız kontrolü sağladım.","exp.a.p3":"Python/FastAPI ile RESTful API geliştirip Railway'de deploy ettim.",
  "exp.b.r":"Unity Geliştirici — Simülasyon Ekibi","exp.b.p1":"Savunma sektörü senaryoları için Unity ile VR tabanlı eğitim simülasyonları geliştirdim.","exp.b.p2":"HTC Vive ve XR Toolkit entegrasyonu ile sürükleyici kullanıcı etkileşimi sağladım.","exp.b.p3":"Yüksek gerçeklikli gerçek zamanlı ortamlarda performans optimizasyonları yaptım.",
  "exp.c.r":"Stajyer Yapay Zeka Geliştirici","exp.c.p1":"PyTorch ve HuggingFace Transformers ile Türkçe GPT-2 dil modellerini fine-tune ettim.","exp.c.p2":"Eğitilmiş modelleri yerel cihazlara deploy ederek çıkarım (inference) testleri gerçekleştirdim.",
  "exp.d.r":"Stajyer Mobil Oyun Geliştirici","exp.d.p1":"Flutter ile mobil uygulamalar geliştirdim; arayüz ve kullanıcı deneyimine odaklandım.","exp.d.p2":"C# ile API entegrasyonları kurup istemciyi backend servislerine bağladım; veri için MongoDB kullandım.",
  "work.lead":"// Yayınlanan oyunlardan savunma simülasyonlarına — seçili projeler.",
  "p.avio.sub":"Cadet Pilot · Psikometrik Sınav","pill.free":"freelance","p.avio.desc":"Cadet pilot adayları için sınav ve uçuş simülasyonu. Unity istemci + FastAPI backend; joystick ile gerçek zamanlı irtifa/yön/hız kontrolü. iOS, Android, web ve masaüstünde çalışıyor.","store.web":"🌐 web","store.dl":"⬇ indir",
  "p.asel.t":"VR Savunma Simülasyonu","p.asel.sub":"Aselsan Konya · Simülasyon Ekibi","p.asel.desc":"Savunma eğitimi için Unity ve HTC Vive ile geliştirilen VR tabanlı simülasyon. Gerçekçi ortamlar, kullanıcı etkileşim sistemleri ve performans optimizasyonları.",
  "p.melon.sub":"Mobil Oyun · 2000+ indirme","p.melon.desc":"Birleştirme mekaniğine dayalı mobil oyun. 2.000'den fazla indirmeye ulaştı. Fizik tabanlı etkileşimler ve Android için optimize edilmiş oynanış.",
  "p.mine.sub":"Mobil Oyun · Dikey Platform","p.mine.desc":"Google Play'de yayınlanan dikey platform oyunu. Seviye tasarımı, fizik tabanlı zıplama, checkpoint sistemi ve dinamik kamera kontrolü.",
  "p.dual.sub":"Mezuniyet Projesi · 2D Nişancı","pill.grad":"mezuniyet","p.dual.desc":"Unity ve URP ile geliştirilen 2D dalga tabanlı nişancı oyunu. Çift atış sistemi, envanter yönetimi ve boss yapay zekâ davranışı.",
  "sk.game":"oyunGeliştirme","sk.back":"backend","sk.vr":"vrAr","sk.ai":"yapayZeka","sk.db":"veritabanları","sk.tools":"araçlar",
  "c.body":"// Yeni bir proje, freelance iş ya da tam zamanlı bir fırsat için ulaşabilirsiniz."
 },
 en:{
  "meta.title":"Osman Gündemir — Software Developer",
  "meta.desc":"Osman Gündemir — Unity game developer and backend engineer. Published mobile games, VR simulations and FastAPI backend projects.",
  "nav.skip":"Skip to content","nav.about":"about","nav.exp":"experience","nav.work":"work","nav.play":"game","nav.skills":"skills","nav.contact":"contact",
  "hero.lead":"// role:","hero.roles":"Unity Developer|Backend Engineer|Game Developer|VR Developer",
  "hero.pitch":"A software developer experienced in game development, backend APIs and AI. I've published mobile games on Google Play, built RESTful APIs with FastAPI, and developed VR simulations at Aselsan.",
  "hero.cta1":"./work","hero.cta2":"./contact",
  "s.dl":"downloads","s.co":"companies","s.gpa":"gpa / 4.0","s.pr":"projects",
  "about.body":"I'm a Computer Engineering graduate from Konya Technical University. Across freelance and team settings I've built games and simulations with Unity, backend services with Python/FastAPI, and AI models with PyTorch. I enjoy owning both the client and server sides end to end.",
  "about.school":"Konya Technical University · Computer Eng.","about.langs":"Turkish (native) · English (B1)",
  "exp.a.r":"Freelance Unity & Backend Developer","exp.a.p1":"Built the entire client side in Unity: exam screens, UI/UX flow, timer system and multiple-choice structure.","exp.a.p2":"Developed a flight-sim module with joystick input; real-time altitude/heading/speed control via a live horizon.","exp.a.p3":"Built a RESTful API with Python/FastAPI deployed on Railway.",
  "exp.b.r":"Unity Developer — Simulation Team","exp.b.p1":"Developed VR-based training simulations in Unity for defense-sector scenarios.","exp.b.p2":"Delivered immersive interaction through HTC Vive and XR Toolkit.","exp.b.p3":"Performed performance optimizations for high-fidelity real-time environments.",
  "exp.c.r":"Intern AI Developer","exp.c.p1":"Fine-tuned Turkish GPT-2 language models using PyTorch and HuggingFace Transformers.","exp.c.p2":"Deployed trained models to local devices and ran inference tests.",
  "exp.d.r":"Intern Mobile Game Developer","exp.d.p1":"Built mobile apps with Flutter, focusing on UI and user experience.","exp.d.p2":"Connected the client to backend services via C# API integrations; used MongoDB for storage.",
  "work.lead":"// From published games to defense simulations — selected projects.",
  "p.avio.sub":"Cadet Pilot · Psychometric Exam","pill.free":"freelance","p.avio.desc":"Exam and flight-simulation app for cadet pilot candidates. Unity client + FastAPI backend; real-time altitude/heading/speed control via joystick. Runs on iOS, Android, web and desktop.","store.web":"🌐 web","store.dl":"⬇ download",
  "p.asel.t":"VR Defense Simulation","p.asel.sub":"Aselsan Konya · Simulation Team","p.asel.desc":"A VR-based simulation for defense training built with Unity and HTC Vive. Realistic environments, interaction systems and performance optimizations.",
  "p.melon.sub":"Mobile Game · 2000+ downloads","p.melon.desc":"A merge-mechanic mobile game that reached 2,000+ downloads. Physics-based interactions and gameplay optimized for Android.",
  "p.mine.sub":"Mobile Game · Vertical Platformer","p.mine.desc":"A vertical platformer published on Google Play. Level design, physics-based jumping, checkpoint system and dynamic camera control.",
  "p.dual.sub":"Graduation Project · 2D Shooter","pill.grad":"graduation","p.dual.desc":"A 2D wave-based shooter built with Unity and URP. Dual-shot system, inventory management and boss AI behavior.",
  "sk.game":"gameDev","sk.back":"backend","sk.vr":"vrAr","sk.ai":"ai","sk.db":"databases","sk.tools":"tools",
  "c.body":"// Reach out for a new project, freelance work or a full-time opportunity."
 }
};

var btn=document.getElementById("lang"), rotT=null;

function applyRoles(l){
  var el=document.getElementById("rot"); if(!el) return;
  var r=(I[l]["hero.roles"]||"").split("|").filter(Boolean);
  if(rotT){clearInterval(rotT);rotT=null;}
  if(!r.length) return;
  el.textContent=r[0];
  if(reduce||r.length<2) return;
  var i=0;
  rotT=setInterval(function(){
    i=(i+1)%r.length;
    el.style.opacity="0";
    setTimeout(function(){el.textContent=r[i];el.style.opacity="1";},220);
  },2400);
}

function setLang(l){
  if(!I[l]) l="tr";
  var d=I[l];
  document.documentElement.lang=l;
  document.querySelectorAll("[data-i18n]").forEach(function(e){
    var v=d[e.getAttribute("data-i18n")];
    if(v==null) return;
    if(e.tagName==="TITLE"){document.title=v;return;}
    if(e.tagName==="META"){e.setAttribute("content",v);return;}
    e.textContent=v;
  });
  applyRoles(l);
  if(btn){btn.textContent=(l==="tr"?"EN":"TR");btn.setAttribute("aria-label",l==="tr"?"Switch to English":"Türkçe'ye geç");}
  try{localStorage.setItem("og_lang",l);}catch(e){}
}

var saved=null; try{saved=localStorage.getItem("og_lang");}catch(e){}
setLang(saved||((navigator.language||"tr").toLowerCase().indexOf("tr")===0?"tr":"en"));
if(btn) btn.addEventListener("click",function(){setLang(document.documentElement.lang==="tr"?"en":"tr");});

var yr=document.getElementById("yr"); if(yr) yr.textContent=String(new Date().getFullYear());

/* reveal */
var rev=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window && rev.length){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target);}});},{threshold:.08,rootMargin:"0px 0px -6% 0px"});
  rev.forEach(function(el){io.observe(el);});
}else{rev.forEach(function(el){el.classList.add("is-visible");});}

/* counters */
var cs=document.querySelectorAll(".stats b[data-count]");
function anim(el){
  var target=parseFloat(el.getAttribute("data-count")),dec=parseInt(el.getAttribute("data-dec")||"0",10),suf=el.getAttribute("data-suffix")||"";
  function put(v){
    var s=v.toFixed(dec);
    if(suf) s+='<span class="x">'+suf+'</span>';
    el.innerHTML=s;
  }
  if(reduce){put(target);return;}
  var dur=1100,st=performance.now();
  function tick(now){var p=Math.min((now-st)/dur,1),e=1-Math.pow(1-p,3);put(target*e);if(p<1)requestAnimationFrame(tick);else put(target);}
  requestAnimationFrame(tick);
}
if(cs.length&&"IntersectionObserver" in window){
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){anim(e.target);cio.unobserve(e.target);}});},{threshold:.6});
  cs.forEach(function(el){cio.observe(el);});
}else{cs.forEach(anim);}

/* galleries */
document.querySelectorAll("[data-gal]").forEach(function(g){
  var t=g.querySelector("[data-track]"); if(!t) return;
  var s=[].slice.call(t.children);
  var dots=g.querySelector("[data-dots]"),cnt=g.querySelector("[data-count]"),pv=g.querySelector("[data-prev]"),nx=g.querySelector("[data-next]");
  if(s.length<=1){pv&&(pv.hidden=true);nx&&(nx.hidden=true);cnt&&(cnt.style.display="none");return;}
  var db=s.map(function(_,i){if(!dots)return null;var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Görsel "+(i+1));b.addEventListener("click",function(){go(i);});dots.appendChild(b);return b;});
  function cur(){return Math.round(t.scrollLeft/t.clientWidth);}
  function go(i){i=Math.max(0,Math.min(s.length-1,i));t.scrollTo({left:i*t.clientWidth,behavior:reduce?"auto":"smooth"});}
  function sy(){var i=cur();db.forEach(function(d,k){d&&d.setAttribute("aria-current",k===i?"true":"false");});if(cnt)cnt.textContent=(i+1)+"/"+s.length;}
  sy();
  pv&&pv.addEventListener("click",function(){go(cur()-1);});
  nx&&nx.addEventListener("click",function(){go(cur()+1);});
  t.addEventListener("scroll",function(){requestAnimationFrame(sy);},{passive:true});
  t.addEventListener("keydown",function(e){if(e.key==="ArrowRight"){e.preventDefault();go(cur()+1);}if(e.key==="ArrowLeft"){e.preventDefault();go(cur()-1);}});
  window.addEventListener("resize",function(){go(cur());});
});
})();
