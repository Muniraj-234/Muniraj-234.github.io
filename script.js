/* ============================================
   MUNIRAJ K — PORTFOLIO SCRIPTS v2
   ============================================ */

/* ===== EMAILJS INIT — Replace with your real keys ===== */
// Sign up free at https://www.emailjs.com
// Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID below
const EMAILJS_PUBLIC_KEY  = 'qklIRydyGAm9JApWV';   // from EmailJS → Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_t28iqy7';   // from EmailJS → Email Services
const EMAILJS_TEMPLATE_ID = 'template_6w0atyy';  // from EmailJS → Email Templates

(function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();


/* ===== ANIMATED PARTICLE BACKGROUND ===== */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 90;
  const COLORS = ['rgba(167,139,250,', 'rgba(232,121,249,', 'rgba(96,165,250,', 'rgba(196,181,253,'];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.life = Math.random();
      this.maxLife = 0.6 + Math.random() * 0.4;
      this.clr = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life += 0.003;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) { this.reset(); }
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.vx += (dx / dist) * force * 0.3;
        this.vy += (dy / dist) * force * 0.3;
      }
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) { this.vx *= 0.9; this.vy *= 0.9; }
    }
    draw() {
      const alpha = Math.sin(this.life / this.maxLife * Math.PI) * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.clr + alpha + ')';
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function init() { resize(); particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle()); }
  function animate() { ctx.clearRect(0, 0, W, H); drawConnections(); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  init();
  animate();
})();


/* ===== CURSOR GLOW ===== */
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function smoothCursor() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(smoothCursor);
  }
  smoothCursor();
})();


/* ===== TYPEWRITER EFFECT ===== */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  const words = [
    'amazing web apps',
    'full-stack solutions',
    'scalable backends',
    'stunning UIs',
    'REST APIs',
    'the future of web',
  ];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const current = words[wi];
    if (!deleting) {
      el.textContent = current.substring(0, ci++);
      if (ci > current.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = current.substring(0, ci--);
      if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; setTimeout(type, 300); return; }
    }
    setTimeout(type, deleting ? 50 : 85);
  }
  type();
})();


/* ===== NAVIGATION ===== */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  sections.forEach(sec => {
    const id   = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}


/* ===== INTERSECTION OBSERVER (section reveal + timeline) ===== */
const sectionObs = new IntersectionObserver(
  entries => entries.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting)),
  { threshold: 0.1 }
);
document.querySelectorAll('.section, .timeline-item').forEach(el => sectionObs.observe(el));


/* ===== COUNTER ANIMATION ===== */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el  = e.target;
      const tgt = parseInt(el.dataset.target);
      if (tgt === 0) { el.textContent = '0'; counterObs.unobserve(el); return; }
      let cur = 0;
      const step = tgt / 50;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, tgt);
        el.textContent = Math.floor(cur);
        if (cur >= tgt) clearInterval(timer);
      }, 30);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));


/* ===== PROJECTS: EXPAND "MORE PROJECTS" ===== */
function expandProjects() {
  const btn   = document.getElementById('more-projects-btn');
  const extra = document.getElementById('extra-projects');
  const isOpen = extra.classList.toggle('open');
  btn.classList.toggle('expanded', isOpen);
  btn.querySelector('span').textContent = isOpen ? 'Less Projects' : 'More Projects';
  if (isOpen) {
    setTimeout(() => extra.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }
}


/* ===== CONTACT FORM — Formspree ===== */
async function handleContactSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn     = document.getElementById('contact-submit-btn');
  const btnSpan = btn.querySelector('span');

  // Check Formspree ID is configured
  const action = form.getAttribute('action');
  if (!action || action.includes('YOUR_FORM_ID')) {
    alert('⚠️ Please set up Formspree first! See instructions below.');
    return;
  }

  btnSpan.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const data = new FormData(form);
    const res  = await fetch(action, {
      method : 'POST',
      body   : data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.style.display = 'none';
      success.style.display = 'flex';
    } else {
      const json = await res.json();
      const msg  = json.errors ? json.errors.map(e => e.message).join(', ') : 'Something went wrong.';
      alert('❌ Error: ' + msg);
      btnSpan.textContent = 'Send Message';
      btn.disabled = false;
    }
  } catch (err) {
    alert('❌ Network error. Please try again.');
    btnSpan.textContent = 'Send Message';
    btn.disabled = false;
  }
}


/* ===== RESUME DOWNLOAD ===== */
function downloadResume() {
  const link = document.createElement('a');
  link.href     = 'resume.pdf';
  link.download = 'Muniraj_K_Resume.pdf';
  link.click();
}


/* ===== SMOOTH SCROLL for nav links ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').substring(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});


/* ===== LIKE BUTTON SYSTEM ===== */
(function initLike() {
  const likeBtn   = document.getElementById('like-btn');
  const likeCount = document.getElementById('like-count');
  const heartIcon = document.getElementById('heart-icon');

  // Load count from localStorage
  let count = parseInt(localStorage.getItem('mk_portfolio_likes') || '0', 10);
  let liked = localStorage.getItem('mk_portfolio_liked') === 'true';

  likeCount.textContent = count;
  if (liked) {
    likeBtn.classList.add('liked');
    heartIcon.setAttribute('fill', 'currentColor');
  }

  window.handleLike = function () {
    // Prevent multiple likes from same browser session
    if (liked) {
      // Already liked — just show the review popup again
      openReview();
      return;
    }
    count++;
    liked = true;
    localStorage.setItem('mk_portfolio_likes', count);
    localStorage.setItem('mk_portfolio_liked', 'true');

    likeCount.textContent = count;
    likeBtn.classList.add('liked');
    heartIcon.setAttribute('fill', 'currentColor');

    // Heartbeat animation
    heartIcon.classList.remove('beating');
    void heartIcon.offsetWidth; // reflow
    heartIcon.classList.add('beating');

    // Show review popup after short delay
    setTimeout(() => openReview(), 500);
  };
})();


/* ===== INTERACTIVE STAR RATING ===== */
let currentRating = 5;

function setStars(n) {
  currentRating = n;
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.classList.toggle('lit', i < n);
  });
}


/* ===== REVIEW POPUP ===== */
function openReview() {
  // Reset stars to 5 every time popup opens (don't remember)
  currentRating = 5;
  setStars(5);
  // Clear previous review text
  const ta = document.getElementById('review-text');
  if (ta) ta.value = '';

  const overlay = document.getElementById('review-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeReview() {
  const overlay = document.getElementById('review-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function closeReviewOnOverlay(e) {
  if (e.target === document.getElementById('review-overlay')) {
    closeReview();
  }
}

function sendReview() {
  const text    = document.getElementById('review-text').value.trim();
  const stars   = '★'.repeat(currentRating) + '☆'.repeat(5 - currentRating);
  const btn     = document.getElementById('review-send-btn');
  const btnSpan = btn.querySelector('span');

  // Check if EmailJS is configured
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || typeof emailjs === 'undefined') {
    // Fallback to mailto if EmailJS not set up yet
    const subject = encodeURIComponent('Portfolio Review');
    const body    = encodeURIComponent(`Rating: ${stars}\n\n${text || 'Great portfolio! Keep it up.'}`);
    window.open(`mailto:kmuniraj234@gmail.com?subject=${subject}&body=${body}`, '_blank');
    closeReview();
    return;
  }

  btnSpan.textContent = 'Sending...';
  btn.disabled = true;

  const templateParams = {
    rating  : stars,
    message : text || 'Great portfolio! Keep it up.',
    from_name: 'Portfolio Visitor',
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      btnSpan.textContent = '✅ Sent!';
      setTimeout(() => {
        closeReview();
        btn.disabled = false;
        btnSpan.textContent = 'Send Review';
      }, 1500);
    })
    .catch(() => {
      // Fallback to mailto on error
      const subject = encodeURIComponent('Portfolio Review');
      const body    = encodeURIComponent(`Rating: ${stars}\n\n${text || 'Great portfolio! Keep it up.'}`);
      window.open(`mailto:kmuniraj234@gmail.com?subject=${subject}&body=${body}`, '_blank');
      closeReview();
      btn.disabled = false;
      btnSpan.textContent = 'Send Review';
    });
}


/* ===== INITIAL PAGE LOAD ===== */
window.addEventListener('DOMContentLoaded', () => {
  const homeSection = document.querySelector('#home');
  if (homeSection) homeSection.classList.add('in-view');
  updateActiveNav();
});
