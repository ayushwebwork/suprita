
/* ---------- Custom language switcher (drives Google Translate) ---------- */
function googleTranslateElementInit(){
  new google.translate.TranslateElement({pageLanguage:'en', autoDisplay:false}, 'google_translate_element');
}
document.querySelectorAll('.lang-item').forEach(btn=>{
  btn.addEventListener('click', function(){
    const lang = this.getAttribute('data-lang');
    const label = this.getAttribute('data-label');
    document.getElementById('langLabel').textContent = label;
    const tryTranslate = (attempt)=>{
      const combo = document.querySelector('#google_translate_element select.goog-te-combo');
      if(combo){
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
      } else if(attempt < 10){
        setTimeout(()=>tryTranslate(attempt+1), 400);
      }
    };
    tryTranslate(0);
  });
});

/* ---------- Preloader ---------- */
window.addEventListener('load', function(){
  setTimeout(function(){
    document.getElementById('preloader').classList.add('hide');
  }, 500);
});
// safety fallback
setTimeout(function(){document.getElementById('preloader').classList.add('hide');}, 3500);

/* ---------- Header scroll state ---------- */
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', function(){
  header.classList.toggle('scrolled', window.scrollY > 40);
  const goTop = document.getElementById('goTopBtn');
  goTop.classList.toggle('show', window.scrollY > 500);
});

document.getElementById('goTopBtn').addEventListener('click', function(){
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ---------- Scroll reveal (IntersectionObserver, no GSAP) ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
revealEls.forEach(el=>io.observe(el));