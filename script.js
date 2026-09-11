/* ============================================
   MUNIRAJ K — PORTFOLIO SCRIPTS v2
   ============================================ */

/* ===== EMAILJS INIT — Replace with your real keys ===== */
// Sign up free at https://www.emailjs.com
// Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID below
const EMAILJS_PUBLIC_KEY  = 'qklIRydyGAm9JApWV';   // from EmailJS → Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_t28iqy7';   // from EmailJS → Email Services
const EMAILJS_TEMPLATE_ID = 'template_6w0atyy';  // from EmailJS → Email Templates

/* ===== GEMINI AI CHATBOT — free tier, get a key at https://aistudio.google.com/apikey ===== */
// NOTE: this key is visible to anyone who views the page source (unavoidable for a
// static site with no backend). Restrict it to your domain in Google AI Studio /
// Google Cloud Console (API key → Application restrictions → HTTP referrers) once live.
const GEMINI_API_KEY = 'AQ.Ab8RN6L7qqgyajqj4jMu2iLFHLMdsS_n9ci3DEnnGgxRsmcWoQ';
const GEMINI_MODEL    = 'gemini-3.6-flash';

/* ===== SUPABASE — real, shared like counter (see supabase-likes-schema.sql) ===== */
const SUPABASE_URL      = 'https://aealzulqocmlcidayhwh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYWx6dWxxb2NtbGNpZGF5aHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMzc4NzMsImV4cCI6MjEwNDcxMzg3M30.DnA2uCA_xJ8Qb6wpVghoM9y9puLQ-vcDPx4VDCvhlG0';

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
    'AI-powered applications',
    'scalable backends',
    'stunning UIs',
    'REST APIs',
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


/* ===== LIKE BUTTON SYSTEM — real, shared count via Supabase ===== */
(function initLike() {
  const likeBtn   = document.getElementById('like-btn');
  const likeCount = document.getElementById('like-count');
  const heartIcon = document.getElementById('heart-icon');

  const sb = (typeof window.supabase !== 'undefined')
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  // This browser's own "have I liked it" flag (separate from the shared count)
  let liked = localStorage.getItem('mk_portfolio_liked') === 'true';
  if (liked) {
    likeBtn.classList.add('liked');
    heartIcon.setAttribute('fill', 'currentColor');
  }

  async function loadCount() {
    if (!sb) return;
    const { data, error } = await sb.from('portfolio_likes').select('like_count').eq('id', 1).single();
    if (!error && data) likeCount.textContent = data.like_count;
  }
  loadCount();

  window.handleLike = async function () {
    if (liked) {
      // Already liked from this browser — just show the review popup again
      openReview();
      return;
    }
    if (!sb) { openReview(); return; }

    const { data, error } = await sb.rpc('increment_portfolio_like');
    if (!error && typeof data === 'number') likeCount.textContent = data;

    liked = true;
    localStorage.setItem('mk_portfolio_liked', 'true');
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


/* ===== AI CHATBOT — Gemini (free tier) ===== */
(function initChatbot() {
  const fab      = document.getElementById('chat-fab');
  const win      = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const form     = document.getElementById('chat-form');
  const input    = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  // Everything the assistant is allowed to know and say about Muniraj.
  const SYSTEM_INSTRUCTION = `
You are the friendly AI assistant embedded on Muniraj K's personal portfolio website.
You represent Muniraj to recruiters, hiring managers, collaborators, and visitors.

Always speak ABOUT Muniraj in the third person (never pretend to literally be him),
and always speak of him warmly, confidently, and positively — like an assistant who
genuinely rates him and is glad to introduce his work. Never invent facts, numbers,
job titles, employers, or claims that aren't in the profile below. If asked something
you don't know, say so honestly, stay upbeat, and redirect to what he does bring —
never say anything negative or discouraging about him.

=== MUNIRAJ K — PROFILE ===
Role: Full Stack Developer, Team Leader, and aspiring Generative AI Engineer —
actively building AI-powered web applications and learning every day.
Education: B.Tech (2nd year) in Computer Science & Engineering at Mahendra
Institute of Technology (Autonomous), Jul 2025–Jul 2029. Completed Higher
Secondary (2023–2025) and Secondary Education (2022–2023) under the Tamil Nadu
State Board, with a strong foundation in Mathematics, Physics, and Computer
Science.
Location: Tamil Nadu, India.
Core skills: Python, HTML5, CSS3, JavaScript, React, MongoDB, Express.js, Node.js
(the MERN stack).
AI & cloud skills: Generative AI application development, Google AI Studio,
Gemini API integration, Google Cloud, Microsoft Copilot — backed by several 2026
certifications (see below).
Additional skills: Java, UI/UX design & Figma, SQL, Flutter, Dart.
Tools & soft skills: Git & GitHub, MS Office, Team Leadership, Problem Solving,
Communication, Project Management.
Strengths: a natural team leader who coordinates cross-functional teams, breaks
down complex problems, and delivers projects on time; enjoys pixel-perfect UI work
as much as backend architecture and AI experimentation.

Recent certifications (2026): "Build Real World AI Applications with Gemini and
Imagen" (Google Cloud skill badge), "Develop AI-Powered Prototypes in Google AI
Studio" (Google Cloud skill badge), "Create Your First Gemini Enterprise
Application" (Google Cloud skill badge), "AI Tools & Claude Workshop" (be10x),
7 Microsoft Learn modules on Generative AI & Copilot (via ICT Academy Learnathon
2026), a 3-hour SQL Hiring Secrets Bootcamp (NoviTech R&D), and AI training at
Innoknowvex Pvt. Ltd. This chatbot itself — built with the Gemini API — is a live
example of his AI-integration skills.

Real projects:
1. Nexora — Smart Waste Management Platform: built for Smart India Hackathon 2026.
   A full-stack platform made of three progressive web apps — a citizen app, a
   waste-collector app, and a municipal dashboard. Tech: JavaScript, HTML, CSS.
   Repo: github.com/Muniraj-234/nexora-sih2026
2. MIT Club Platform: a full-stack website for his college tech club, live in
   production, backed by Supabase. Tech: JavaScript, Supabase. Live at
   mit-club.vercel.app, repo: github.com/Muniraj-234/MIT-CLUB
3. Flappy Bird: a classic Flappy Bird clone built from scratch with vanilla HTML,
   CSS, and JavaScript, playable live in the browser via GitHub Pages.
   Repo: github.com/Muniraj-234/flappy-bird

Contact: email kmuniraj234@gmail.com, GitHub github.com/Muniraj-234, LinkedIn
linkedin.com/in/mr-muniraj-k-04bb21383. He's currently open to opportunities.

Style rules: keep answers short and conversational (2-4 sentences unless asked for
detail). Reply in plain conversational text only — do NOT use markdown of any kind
(no **bold**, no bullet points, no headers, no asterisks). If a visitor seems like a
recruiter, feel free to proactively mention he's available for opportunities and
suggest they reach out via the Contact section or email.
`.trim();

  if (!fab || !win) return;

  let history = [];
  let isOpen = false;

  function toggleChat(open) {
    isOpen = open;
    fab.classList.toggle('open', open);
    win.classList.toggle('open', open);
    if (open) setTimeout(() => input.focus(), 250);
  }

  fab.addEventListener('click', () => toggleChat(!isOpen));
  closeBtn.addEventListener('click', () => toggleChat(false));

  function addMessage(text, cls) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + cls;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'chat-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  async function askGemini(userText) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      throw new Error('missing-key');
    }
    history.push({ role: 'user', parts: [{ text: userText }] });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: history,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
          thinkingConfig: { thinkingLevel: 'low' },
        },
      }),
    });

    if (!res.ok) throw new Error('api-error-' + res.status);
    const data = await res.json();
    let reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    if (!reply) throw new Error('empty-response');
    // Safety net in case the model slips in markdown despite instructions
    reply = reply.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');

    history.push({ role: 'model', parts: [{ text: reply }] });
    // Keep history bounded so requests don't grow unbounded over a long chat
    if (history.length > 20) history = history.slice(-20);
    return reply;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'chat-msg-user');
    input.value = '';
    input.disabled = true;

    const typing = addTyping();
    try {
      const reply = await askGemini(text);
      typing.remove();
      addMessage(reply, 'chat-msg-bot');
    } catch (err) {
      typing.remove();
      const msg = err.message === 'missing-key'
        ? 'The AI assistant isn\'t configured yet — add a free Gemini API key in script.js.'
        : 'Sorry, I couldn\'t reach the AI assistant right now. Please try again in a moment.';
      addMessage(msg, 'chat-msg-error');
    } finally {
      input.disabled = false;
      input.focus();
    }
  });
})();
