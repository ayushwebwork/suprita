/* ---------- Parallax (no GSAP, rAF driven) ---------- */
const parallaxEls = document.querySelectorAll('.parallax-el');
function updateParallax(){
  const sy = window.scrollY;
  parallaxEls.forEach(el=>{
    const speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
    el.style.transform = `translateY(${sy*speed*0.25}px)`;
  });
  requestAnimationFrame(updateParallax);
}
requestAnimationFrame(updateParallax);

/* ---------- Count-up stats on view ---------- */
const statNums = document.querySelectorAll('.stat-num');
const countIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target;
      const target = parseInt(el.getAttribute('data-count'),10);
      const suffix = el.getAttribute('data-suffix')||'';
      let cur = 0;
      const step = Math.max(1, Math.round(target/60));
      const timer = setInterval(()=>{
        cur += step;
        if(cur >= target){cur = target; clearInterval(timer);}
        el.textContent = cur + suffix;
      }, 22);
      countIO.unobserve(el);
    }
  });
}, {threshold:0.4});
statNums.forEach(el=>countIO.observe(el));

/* ---------- Hero typing effect across 3 banners ---------- */
const slides = [
  {
    html: 'Reliable Housekeeping &amp; <span class="accent">Security Manpower.</span>',
    sub: 'Empowering government offices, PSUs, and institutional clients with 100% verified, background-checked professional staff.'
  },
  {
    html: '500+ Verified Staff. <span class="accent">Zero Compliance Risk.</span>',
    sub: 'Every professional is background-checked, insured under PF &amp; ESI, and trained to government-grade standards.'
  },
  {
    html: 'Rapid Deployment. <span class="accent">Government-Grade Trust.</span>',
    sub: 'ISO 9001:2015 certified, PSARA licensed, and ready to deploy 50–500+ staff within 7–14 days.'
  }
];
let slideIdx = 0;
const headlineEl = document.getElementById('typeHeadline');
const subEl = document.getElementById('typeSub');
const dotsWrap = document.getElementById('heroDots');
slides.forEach((_,i)=>{
  const b = document.createElement('button');
  if(i===0) b.classList.add('active');
  b.addEventListener('click', ()=>{ clearTimeout(cycleTimer); runSlide(i); });
  dotsWrap.appendChild(b);
});

function setActiveDot(i){
  dotsWrap.querySelectorAll('button').forEach((b,idx)=>b.classList.toggle('active', idx===i));
}

function typeText(el, htmlOrText, isHTML, speed, done){
  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  let plain = isHTML ? htmlOrText.replace(/<[^>]+>/g,'§SPLIT§').split('§SPLIT§') : null;
  // simpler approach: type plain text version, then set final HTML with cursor removed after
  const temp = document.createElement('div');
  temp.innerHTML = htmlOrText;
  const fullText = temp.textContent;
  let i = 0;
  el.appendChild(cursor);
  const interval = setInterval(()=>{
    i++;
    el.textContent = fullText.slice(0,i);
    el.appendChild(cursor);
    if(i >= fullText.length){
      clearInterval(interval);
      el.innerHTML = htmlOrText; // restore accent styling
      if(done) done();
    }
  }, speed);
}

let cycleTimer;
function runSlide(i){
  slideIdx = i;
  setActiveDot(i);
  typeText(headlineEl, slides[i].html, true, 38, ()=>{
    typeText(subEl, slides[i].sub, false, 14, ()=>{
      cycleTimer = setTimeout(()=>{
        runSlide((slideIdx+1) % slides.length);
      }, 3800);
    });
  });
}
runSlide(0);

