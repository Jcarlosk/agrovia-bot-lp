/**
 * Agrovia — Premium JS 2026 v2
 * Scroll experience level-up:
 *  ✦ Lenis smooth scroll (mantido)
 *  ✦ Seção-por-seção com reveals DISTINTOS (não mais fade genérico)
 *  ✦ Section progress: background color shift sutil ao scrollar
 *  ✦ Features: cards entram em cascata com clip-path reveal
 *  ✦ How-it-works: steps entram em sequência com linha conectora animada
 *  ✦ Testimonials: stagger diagonal (cada card offset diferente)
 *  ✦ Pricing: reveal com leve scale-up (de baixo para cima)
 *  ✦ CTA: split-text reveal palavra por palavra
 *  ✦ Parallax por seção: elementos internos com velocidades diferentes
 *  ✦ Section progress indicator (linha lateral fina, tipo Linear)
 *  ✦ Tudo o que já existia no v1 preservado
 */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── EASING ─────────────────────────────────────────────── */
  const ease = {
    outExpo:  t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
    outQuart: t => 1 - Math.pow(1 - t, 4),
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    spring:   t => {
      const c4 = (2 * Math.PI) / 2.8;
      return t === 0 ? 0 : t === 1 ? 1 :
        Math.pow(2, -8 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
  };

  /* ─── LERP ───────────────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ─── TWEEN ──────────────────────────────────────────────── */
  function tween(el, {
    props = {},          // { opacity, y, x, scale, rotate, skewY }
    from  = {},
    to    = {},
    duration = 600,
    delay    = 0,
    easeFn   = ease.outExpo,
    onDone
  } = {}) {
    if (prefersReduced) {
      Object.keys(to).forEach(k => { if (el.style) el.style[k] = to[k]; });
      el.style.opacity   = to.opacity   ?? 1;
      el.style.transform = buildTransform(to);
      if (onDone) onDone();
      return;
    }

    let start = null;
    const fromO = from.opacity   ?? 0;
    const toO   = to.opacity     ?? 1;
    const fromY = from.y         ?? 0;
    const toY   = to.y           ?? 0;
    const fromX = from.x         ?? 0;
    const toX   = to.x           ?? 0;
    const fromS = from.scale     ?? 1;
    const toS   = to.scale       ?? 1;
    const fromR = from.rotate    ?? 0;
    const toR   = to.rotate      ?? 0;
    const fromK = from.skewY     ?? 0;
    const toK   = to.skewY       ?? 0;

    function buildTransform(vals) {
      const y = vals.y ?? 0, x = vals.x ?? 0,
            s = vals.scale ?? 1, r = vals.rotate ?? 0, k = vals.skewY ?? 0;
      return `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg) skewY(${k}deg)`;
    }

    function step(ts) {
      if (!start) start = ts + delay;
      const elapsed = ts - start;
      if (elapsed < 0) { requestAnimationFrame(step); return; }
      const p = Math.min(elapsed / duration, 1);
      const e = easeFn(p);

      el.style.opacity   = lerp(fromO, toO, e);
      el.style.transform = buildTransform({
        y: lerp(fromY, toY, e), x: lerp(fromX, toX, e),
        scale: lerp(fromS, toS, e), rotate: lerp(fromR, toR, e),
        skewY: lerp(fromK, toK, e),
      });

      if (p < 1) requestAnimationFrame(step);
      else if (onDone) onDone();
    }
    requestAnimationFrame(step);
  }

  /* ─── INJECT GLOBAL STYLES ───────────────────────────────── */
  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      /* ── Navbar glass ── */
      .navbar {
        transition: background 0.5s cubic-bezier(0.19,1,0.22,1),
                    backdrop-filter 0.5s,box-shadow 0.5s,padding 0.4s;
      }
      .navbar.scrolled {
        position: fixed;
        background: rgba(10,28,14,0.74) !important;
        backdrop-filter: blur(22px) saturate(180%);
        -webkit-backdrop-filter: blur(22px) saturate(180%);
        box-shadow: 0 1px 0 rgba(255,255,255,.07), 0 8px 32px rgba(0,0,0,.2);
        padding: 10px 0;
      }

      /* ── Reveal base states ── */
      [data-reveal] {
        will-change: transform, opacity;
      }

      /* ── Button micro ── */
      .btn-lime {
        transition: background .2s, transform .28s cubic-bezier(0.19,1,0.22,1),
                    box-shadow .28s cubic-bezier(0.19,1,0.22,1) !important;
        will-change: transform, box-shadow;
      }
      .btn-lime:hover {
        transform: scale(1.025) translateY(-1px) !important;
        box-shadow: 0 20px 60px rgba(0,0,0,.09), 0 4px 16px rgba(182,212,48,.38) !important;
      }
      .btn-lime:active {
        transform: scale(0.975) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,.06) !important;
      }
      .btn-outline-white {
        transition: background .2s, transform .28s cubic-bezier(0.19,1,0.22,1),
                    box-shadow .28s, border-color .2s !important;
      }
      .btn-outline-white:hover {
        transform: translateY(-1px) !important;
      }
      .btn-outline-dark {
        transition: background .2s, transform .28s cubic-bezier(0.19,1,0.22,1),
                    box-shadow .28s, border-color .2s !important;
      }
      .btn-outline-dark:hover {
        transform: translateY(-1px) !important;
      }

      /* ── Hero glow overlay ── */
      .hero-overlay::after {
        content: '';
        position: absolute; inset: -60%;
        background:
          radial-gradient(ellipse 70% 55% at 18% 62%, rgba(187,203,46,.07) 0%, transparent 65%),
          radial-gradient(ellipse 50% 70% at 82% 28%, rgba(15,37,19,.08) 0%, transparent 65%);
        animation: heroGlow 22s ease-in-out infinite alternate;
        pointer-events: none;
        will-change: transform;
      }
      @keyframes heroGlow {
        0%   { transform: translate(0%,0%) scale(1); }
        40%  { transform: translate(5%,-4%) scale(1.04); }
        70%  { transform: translate(-3%,6%) scale(.97); }
        100% { transform: translate(4%,2%) scale(1.03); }
      }

      /* ── Feature cards ── */
      .feature-card {
        transform-style: preserve-3d;
        transition: transform .32s cubic-bezier(0.19,1,0.22,1),
                    box-shadow .32s cubic-bezier(0.19,1,0.22,1),
                    background .22s !important;
        will-change: transform;
      }
      .feature-card:hover {
        box-shadow: 0 18px 52px rgba(0,0,0,.13) !important;
      }

      /* ── Steps connector line animated ── */
      .steps-grid::before {
        transform-origin: left center;
        transition: none;
      }
      .steps-grid.line-revealed::before {
        animation: lineGrow 0.9s cubic-bezier(0.19,1,0.22,1) forwards;
      }
      @keyframes lineGrow {
        from { clip-path: inset(0 100% 0 0); }
        to   { clip-path: inset(0 0% 0 0); }
      }

      /* ── Step number pulse ── */
      @keyframes stepPop {
        0%   { transform: scale(0.6); opacity: 0; }
        60%  { transform: scale(1.18); }
        100% { transform: scale(1);   opacity: 1; }
      }
      .step-num.pop {
        animation: stepPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }

      /* ── Plan cards ── */
      .plan-card {
        transition: transform .32s cubic-bezier(0.19,1,0.22,1),
                    box-shadow .32s cubic-bezier(0.19,1,0.22,1) !important;
      }
      .plan-card:hover {
        transform: translateY(-7px) !important;
        box-shadow: 0 22px 64px rgba(0,0,0,.11) !important;
      }
      .plan-card.featured:hover {
        box-shadow: 0 22px 64px rgba(15,37,19,.36) !important;
      }

      /* ── Testimonial cards ── */
      .tcard {
        transition: transform .32s cubic-bezier(0.19,1,0.22,1),
                    box-shadow .32s cubic-bezier(0.19,1,0.22,1) !important;
        will-change: transform;
      }
      .tcard:hover {
        transform: translateY(-6px) !important;
        box-shadow: 0 20px 54px rgba(0,0,0,.13) !important;
      }

      /* ── Progress bar ── */
      #agr-progress {
        position: fixed;
        top: 0; left: 0;
        height: 2px;
        width: 0%;
        background: linear-gradient(90deg, #BBCB2E, #8faa1e);
        z-index: 99999;
        pointer-events: none;
        transition: width 0.1s linear;
        will-change: width;
      }

      /* ── Section accent lines (left border) ── */
      .features::before,
      .testimonials::before,
      .pricing::before {
        content: '';
        position: absolute;
        left: 0; top: 10%; bottom: 10%;
        width: 2px;
        background: linear-gradient(180deg, transparent, rgba(187,203,46,.3), transparent);
        opacity: 0;
        transition: opacity 0.8s;
        pointer-events: none;
      }
      .features { position: relative; overflow: hidden; }
      .testimonials { position: relative; overflow: hidden; }
      .pricing { position: relative; overflow: hidden; }
      .features.in-view::before,
      .testimonials.in-view::before,
      .pricing.in-view::before { opacity: 1; }

      /* ── How section ── */
      .how { position: relative; overflow: hidden; }
      .how::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 55% 75% at 85% 50%, rgba(187,203,46,.04) 0%, transparent 65%);
        pointer-events: none;
      }

      /* ── CTA word reveal ── */
      .cta-word {
        display: inline-block;
        opacity: 0;
        transform: translateY(18px);
        will-change: transform, opacity;
      }

      /* ── Section parallax layers ── */
      .features-left { will-change: transform; }
      .features-right { will-change: transform; }

      /* ── Cursor ── */
      body.agr-cursor { cursor: none !important; }
      body.agr-cursor *, body.agr-cursor a, body.agr-cursor button { cursor: none !important; }

      #agr-dot {
        position: fixed; top: 0; left: 0;
        width: 7px; height: 7px;
        border-radius: 50%;
        background: #BBCB2E;
        pointer-events: none; z-index: 99999;
        transform: translate(-50%,-50%);
        transition: width .16s, height .16s, background .2s, opacity .2s;
        will-change: transform;
      }
      #agr-ring {
        position: fixed; top: 0; left: 0;
        width: 36px; height: 36px;
        border-radius: 50%;
        border: 1.5px solid rgba(187,203,46,.42);
        pointer-events: none; z-index: 99998;
        transform: translate(-50%,-50%);
        transition: width .3s cubic-bezier(0.19,1,0.22,1),
                    height .3s cubic-bezier(0.19,1,0.22,1),
                    border-color .22s, opacity .2s;
        will-change: transform;
      }
      body.cur-hover #agr-dot  { width: 12px; height: 12px; }
      body.cur-hover #agr-ring { width: 52px; height: 52px; border-color: rgba(187,203,46,.65); }
      body.cur-dark  #agr-dot  { background: #0F2513; }
      body.cur-dark  #agr-ring { border-color: rgba(15,37,19,.42); }

      /* ── Input focus ── */
      input:focus, textarea:focus, select:focus {
        border-color: #6FA84F !important;
        box-shadow: 0 0 0 4px rgba(111,168,79,.12) !important;
        outline: none !important;
        transition: border-color .22s, box-shadow .22s !important;
      }

      @media (prefers-reduced-motion: reduce) {
        *, ::before, ::after { animation: none !important; transition: none !important; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ─── LENIS ──────────────────────────────────────────────── */
  let lenis = null;
  function initLenis() {
    if (prefersReduced) return;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
    s.onload = () => {
      lenis = new window.Lenis({
        duration: 1.25,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.88,
        touchMultiplier: 1.4,
      });
      function raf(ts) { lenis.raf(ts); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    };
    document.head.appendChild(s);
  }

  /* ─── PROGRESS BAR ───────────────────────────────────────── */
  function initProgressBar() {
    if (prefersReduced) return;
    const bar = document.createElement('div');
    bar.id = 'agr-progress';
    document.body.prepend(bar);

    function update() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ─── NAVBAR ─────────────────────────────────────────────── */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 55);
    }, { passive: true });
  }

  /* ─── HERO ENTRANCE ──────────────────────────────────────── */
  function heroEntrance() {
    const els = [
      { el: '.navbar',       delay: 60,  fromY: -14 },
      { el: '.hero-title',   delay: 190, fromY: 32  },
      { el: '.hero-sub',     delay: 310, fromY: 24  },
      { el: '.hero-buttons', delay: 420, fromY: 18  },
    ];

    els.forEach(({ el: sel, delay, fromY }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = `translateY(${fromY}px)`;
      el.style.willChange = 'transform, opacity';
      tween(el, {
        from: { opacity: 0, y: fromY },
        to:   { opacity: 1, y: 0 },
        duration: 720, delay, easeFn: ease.outExpo,
        onDone: () => { el.style.willChange = 'auto'; }
      });
    });
  }

  /* ─── HERO PARALLAX ──────────────────────────────────────── */
  function initHeroParallax() {
    if (prefersReduced) return;
    const heroBg  = document.querySelector('.hero-bg');
    const content = document.querySelector('.hero-content');
    const hero    = document.querySelector('.hero');
    if (!heroBg || !content || !hero) return;

    let tBx=0,tBy=0,tCx=0,tCy=0, cBx=0,cBy=0,cCx=0,cCy=0;
    let raf = null;
    heroBg.style.willChange  = 'transform';
    content.style.willChange = 'transform';

    function tick() {
      raf = null;
      const A = 0.065;
      cBx = lerp(cBx,tBx,A); cBy = lerp(cBy,tBy,A);
      cCx = lerp(cCx,tCx,A); cCy = lerp(cCy,tCy,A);
      heroBg.style.transform  = `translate(${cBx}px,${cBy}px) scale(1.05)`;
      content.style.transform = `translate(${cCx}px,${cCy}px)`;
      const moving = Math.abs(tBx-cBx)>.05 || Math.abs(tBy-cBy)>.05 ||
                     Math.abs(tCx-cCx)>.05 || Math.abs(tCy-cCy)>.05;
      if (moving) raf = requestAnimationFrame(tick);
    }

    hero.addEventListener('mousemove', e => {
      const r  = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left  - r.width /2) / (r.width /2);
      const ny = (e.clientY - r.top   - r.height/2) / (r.height/2);
      tBx = -nx*13; tBy = -ny*13;
      tCx =  nx*5;  tCy =  ny*5;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    hero.addEventListener('mouseleave', () => {
      tBx=tBy=tCx=tCy=0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }

  /* ─── SCROLL PARALLAX (seções) ───────────────────────────── */
  function initScrollParallax() {
    if (prefersReduced) return;

    // Features: left column sobe mais devagar que right
    const featLeft  = document.querySelector('.features-left');
    const featRight = document.querySelector('.features-right');

    // How steps: slight horizontal drift
    const howTitle  = document.querySelector('.how-title');

    // CTA inner
    const ctaInner  = document.querySelector('.cta-inner');

    const layers = [
      { el: featLeft,  speed: 0.04, axis: 'y' },
      { el: featRight, speed: -0.03, axis: 'y' },
      { el: howTitle,  speed: 0.05, axis: 'y' },
      { el: ctaInner,  speed: 0.04, axis: 'y' },
    ].filter(l => l.el);

    let ticking = false;

    function updateParallax() {
      ticking = false;
      const sy = window.scrollY;

      layers.forEach(({ el, speed, axis }) => {
        const rect   = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const val    = center * speed;
        el.style.transform = axis === 'y'
          ? `translateY(${val}px)`
          : `translateX(${val}px)`;
      });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── SECTION IN-VIEW CLASS ──────────────────────────────── */
  function initSectionClasses() {
    const sections = document.querySelectorAll('.features, .testimonials, .pricing');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.1 });
    sections.forEach(s => io.observe(s));
  }

  /* ─── FEATURES REVEAL ────────────────────────────────────── */
  function initFeaturesReveal() {
    if (prefersReduced) return;

    const left  = document.querySelector('.features-left');
    const cards = document.querySelectorAll('.feature-card');
    if (!left && !cards.length) return;

    // Left col: slide from left
    if (left) {
      left.style.opacity   = '0';
      left.style.transform = 'translateX(-32px)';
      left.style.willChange = 'transform, opacity';
    }

    // Cards: hide
    cards.forEach(c => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(28px) scale(0.97)';
      c.style.willChange = 'transform, opacity';
    });

    let triggered = false;
    const io = new IntersectionObserver(entries => {
      if (triggered) return;
      if (!entries.some(e => e.isIntersecting)) return;
      triggered = true;
      io.disconnect();

      // Left col
      if (left) {
        tween(left, {
          from: { opacity:0, x:-32 }, to: { opacity:1, x:0 },
          duration: 700, delay: 0, easeFn: ease.outExpo,
          onDone: () => { left.style.willChange='auto'; }
        });
      }

      // Cards staggered
      cards.forEach((c, i) => {
        tween(c, {
          from: { opacity:0, y:28, scale:0.97 },
          to:   { opacity:1, y:0,  scale:1 },
          duration: 600, delay: i * 75 + 120, easeFn: ease.outExpo,
          onDone: () => { c.style.willChange='auto'; }
        });
      });

      // 3D tilt
      cards.forEach(card => {
        card.addEventListener('mousemove', e => {
          const r  = card.getBoundingClientRect();
          const nx = (e.clientX - r.left  - r.width /2) / (r.width /2);
          const ny = (e.clientY - r.top   - r.height/2) / (r.height/2);
          card.style.transform =
            `perspective(900px) rotateX(${-ny*5}deg) rotateY(${nx*5}deg) translateY(-2px)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });

    }, { threshold: 0.1 });

    const section = document.querySelector('.features');
    if (section) io.observe(section);
  }

  /* ─── HOW-IT-WORKS REVEAL ────────────────────────────────── */
  function initHowReveal() {
    if (prefersReduced) return;

    const stepsGrid = document.querySelector('.steps-grid');
    const steps     = document.querySelectorAll('.step');
    const title     = document.querySelector('.how-title');
    if (!steps.length) return;

    // Hide
    if (title) {
      title.style.opacity   = '0';
      title.style.transform = 'translateY(22px)';
    }
    steps.forEach(s => {
      s.style.opacity   = '0';
      s.style.transform = 'translateY(30px)';
      s.style.willChange = 'transform, opacity';
      const num = s.querySelector('.step-num');
      if (num) num.style.opacity = '0';
    });

    let triggered = false;
    const io = new IntersectionObserver(entries => {
      if (triggered) return;
      if (!entries.some(e => e.isIntersecting)) return;
      triggered = true;
      io.disconnect();

      // Title
      if (title) {
        tween(title, {
          from: { opacity:0, y:22 }, to: { opacity:1, y:0 },
          duration: 650, delay: 0, easeFn: ease.outExpo
        });
      }

      // Steps: stagger
      steps.forEach((s, i) => {
        tween(s, {
          from: { opacity:0, y:30 }, to: { opacity:1, y:0 },
          duration: 600, delay: i * 110 + 150, easeFn: ease.outExpo,
          onDone: () => {
            s.style.willChange = 'auto';
            // Number pop after step reveals
            const num = s.querySelector('.step-num');
            if (num) {
              num.style.opacity = '1';
              num.classList.add('pop');
            }
          }
        });
      });

      // Connector line
      if (stepsGrid) {
        setTimeout(() => { stepsGrid.classList.add('line-revealed'); }, 350);
      }

    }, { threshold: 0.15 });

    const section = document.querySelector('.how');
    if (section) io.observe(section);
  }

  /* ─── TESTIMONIALS REVEAL ────────────────────────────────── */
  function initTestimonialsReveal() {
    if (prefersReduced) return;

    const tcards = document.querySelectorAll('.tcard');
    if (!tcards.length) return;

    // Diagonal stagger: each card has different Y offset
    const offsets = [36, 24, 48];
    tcards.forEach((c, i) => {
      c.style.opacity    = '0';
      c.style.transform  = `translateY(${offsets[i] || 30}px)`;
      c.style.willChange = 'transform, opacity';
    });

    const heading = document.querySelector('.testimonials h2');
    if (heading) {
      heading.style.opacity   = '0';
      heading.style.transform = 'translateY(20px)';
    }

    let triggered = false;
    const io = new IntersectionObserver(entries => {
      if (triggered) return;
      if (!entries.some(e => e.isIntersecting)) return;
      triggered = true;
      io.disconnect();

      if (heading) {
        tween(heading, {
          from: { opacity:0, y:20 }, to: { opacity:1, y:0 },
          duration: 650, delay: 0, easeFn: ease.outExpo
        });
      }

      tcards.forEach((c, i) => {
        tween(c, {
          from: { opacity:0, y: offsets[i]||30 }, to: { opacity:1, y:0 },
          duration: 680, delay: i * 95 + 120, easeFn: ease.outExpo,
          onDone: () => { c.style.willChange='auto'; }
        });
      });

    }, { threshold: 0.08 });

    const section = document.querySelector('.testimonials');
    if (section) io.observe(section);
  }

  /* ─── PRICING REVEAL ─────────────────────────────────────── */
  function initPricingReveal() {
    if (prefersReduced) return;

    const header = document.querySelector('.pricing-header');
    const plans  = document.querySelectorAll('.plan-card');
    if (!plans.length) return;

    if (header) {
      header.style.opacity   = '0';
      header.style.transform = 'translateY(20px)';
    }
    plans.forEach((p, i) => {
      p.style.opacity   = '0';
      p.style.transform = 'translateY(36px) scale(0.97)';
      p.style.willChange = 'transform, opacity';
    });

    let triggered = false;
    const io = new IntersectionObserver(entries => {
      if (triggered) return;
      if (!entries.some(e => e.isIntersecting)) return;
      triggered = true;
      io.disconnect();

      if (header) {
        tween(header, {
          from: { opacity:0, y:20 }, to: { opacity:1, y:0 },
          duration: 600, delay: 0, easeFn: ease.outExpo
        });
      }
      plans.forEach((p, i) => {
        tween(p, {
          from: { opacity:0, y:36, scale:0.97 }, to: { opacity:1, y:0, scale:1 },
          duration: 650, delay: i * 110 + 150, easeFn: ease.outExpo,
          onDone: () => { p.style.willChange='auto'; }
        });
      });

    }, { threshold: 0.1 });

    const section = document.querySelector('.pricing');
    if (section) io.observe(section);
  }

  /* ─── CTA WORD-BY-WORD REVEAL ────────────────────────────── */
  function initCtaReveal() {
    if (prefersReduced) return;

    const h2 = document.querySelector('.cta-inner h2');
    const p  = document.querySelector('.cta-inner p');
    const btns = document.querySelector('.cta-buttons');
    const note = document.querySelector('.cta-note');
    if (!h2) return;

    // Split h2 into word spans
    const rawHtml = h2.innerHTML;
    const words   = [];
    // Preserve <span> tags, split only text nodes
    h2.innerHTML = rawHtml.replace(/(<[^>]+>|[^<\s]+)/g, match => {
      if (match.startsWith('<')) return match;
      words.push(match);
      return `<span class="cta-word">${match}</span>`;
    });

    // Hide rest
    [p, btns, note].forEach(el => {
      if (!el) return;
      el.style.opacity   = '0';
      el.style.transform = 'translateY(16px)';
    });

    let triggered = false;
    const io = new IntersectionObserver(entries => {
      if (triggered) return;
      if (!entries.some(e => e.isIntersecting)) return;
      triggered = true;
      io.disconnect();

      const wordEls = h2.querySelectorAll('.cta-word');
      wordEls.forEach((w, i) => {
        tween(w, {
          from: { opacity:0, y:18 }, to: { opacity:1, y:0 },
          duration: 520, delay: i * 38, easeFn: ease.outExpo
        });
      });

      const baseDelay = wordEls.length * 38 + 80;
      [p, btns, note].forEach((el, i) => {
        if (!el) return;
        tween(el, {
          from: { opacity:0, y:16 }, to: { opacity:1, y:0 },
          duration: 580, delay: baseDelay + i * 90, easeFn: ease.outExpo
        });
      });

    }, { threshold: 0.15 });

    const section = document.querySelector('.cta-section');
    if (section) io.observe(section);
  }

  /* ─── FOOTER REVEAL ──────────────────────────────────────── */
  function initFooterReveal() {
    if (prefersReduced) return;

    const cols = document.querySelectorAll('.footer-brand, .footer-col');
    cols.forEach((c, i) => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(20px)';
      c.style.willChange = 'transform, opacity';
    });

    let triggered = false;
    const io = new IntersectionObserver(entries => {
      if (triggered) return;
      if (!entries.some(e => e.isIntersecting)) return;
      triggered = true;
      io.disconnect();

      cols.forEach((c, i) => {
        tween(c, {
          from: { opacity:0, y:20 }, to: { opacity:1, y:0 },
          duration: 560, delay: i * 70, easeFn: ease.outExpo,
          onDone: () => { c.style.willChange='auto'; }
        });
      });
    }, { threshold: 0.1 });

    const footer = document.querySelector('.footer');
    if (footer) io.observe(footer);
  }

  /* ─── CURSOR ─────────────────────────────────────────────── */
  function initCursor() {
    if (prefersReduced) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('agr-cursor');
    const dot  = document.createElement('div'); dot.id  = 'agr-dot';
    const ring = document.createElement('div'); ring.id = 'agr-ring';
    document.body.append(dot, ring);

    let mx=-200,my=-200, rx=-200,ry=-200, rafC=null;

    function moveDot(x,y)  { dot.style.transform  = `translate(calc(${x}px - 50%),calc(${y}px - 50%))`; }
    function moveRing(x,y) { ring.style.transform = `translate(calc(${x}px - 50%),calc(${y}px - 50%))`; }

    function tickC() {
      rafC = null;
      rx = lerp(rx,mx,0.12); ry = lerp(ry,my,0.12);
      moveRing(rx,ry);
      if (Math.abs(mx-rx)>.15||Math.abs(my-ry)>.15) rafC=requestAnimationFrame(tickC);
    }

    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      moveDot(mx,my);
      if (!rafC) rafC = requestAnimationFrame(tickC);
    });
    document.addEventListener('mouseleave', () => { dot.style.opacity=ring.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity=ring.style.opacity='1'; });

    document.querySelectorAll('a,button,.btn,.plan-card,.feature-card,.tcard,.toggle').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
    });
    document.querySelectorAll('.pricing,.cta-section,.footer').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cur-dark'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-dark'));
    });
  }

  /* ─── ORIGINAL LOGIC ─────────────────────────────────────── */
  function initOriginal() {
    // Mobile menu
    const hamburger  = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose  = document.getElementById('menuClose');

    if (hamburger && mobileMenu && menuClose) {
      function closeMenu() {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded','true');
        document.body.style.overflow = 'hidden';
      });
      menuClose.addEventListener('click', closeMenu);
      mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
    }

    // Billing toggle
    const toggle      = document.getElementById('billingToggle');
    const labelMensal = document.getElementById('labelMensal');
    const labelAnual  = document.getElementById('labelAnual');
    const badgeSave   = document.getElementById('badgeSave');
    const price1      = document.getElementById('price1');
    const price2      = document.getElementById('price2');

    if (toggle) {
      toggle.addEventListener('change', () => {
        const on = toggle.checked;
        labelMensal?.classList.toggle('active',!on);
        labelAnual?.classList.toggle('active', on);
        if (badgeSave) badgeSave.style.display = on ? 'inline-block' : 'none';
        if (price1) price1.textContent = on ? '23,92' : '29,90';
        if (price2) price2.textContent = on ? '39,92' : '49,90';
      });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -80, duration: 1.2 });
        } else {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
      });
    });
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  function init() {
    injectStyles();
    initLenis();
    initProgressBar();
    initNavbar();
    initCursor();
    initOriginal();
    heroEntrance();

    requestAnimationFrame(() => requestAnimationFrame(() => {
      initHeroParallax();
      initScrollParallax();
      initSectionClasses();
      initFeaturesReveal();
      initHowReveal();
      initTestimonialsReveal();
      initPricingReveal();
      initCtaReveal();
      initFooterReveal();
    }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();