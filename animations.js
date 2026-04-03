/**
 * TOF.io — Shared Animations
 * Requires: GSAP, ScrollTrigger, Lenis (via node_modules), SplitType (UMD global)
 */

import gsap from './node_modules/gsap/index.js';
import { ScrollTrigger } from './node_modules/gsap/ScrollTrigger.js';
import Lenis from './node_modules/@studio-freight/lenis/dist/lenis.mjs';

gsap.registerPlugin(ScrollTrigger);

// ── LENIS SMOOTH SCROLL ──────────────────────────────
const lenis = new Lenis({
  duration: 1.15,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);

// ── NAV BLUR ON SCROLL ───────────────────────────────
const nav = document.querySelector('nav.site-nav');
if (nav) {
  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
}

// ── SPLIT TYPE HEADLINE REVEALS ──────────────────────
// Each [data-split] element gets words revealed staggered on scroll
// SplitType is loaded as UMD global before this module
document.querySelectorAll('[data-split]').forEach(el => {
  if (typeof SplitType === 'undefined') return;

  // Wrap each word in an overflow:hidden container for clean clip reveal
  const split = new SplitType(el, { types: 'words', wordClass: 'split-word' });

  // Initial state
  gsap.set(split.words, { opacity: 0, yPercent: 110 });

  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter() {
      gsap.to(split.words, {
        opacity: 1,
        yPercent: 0,
        duration: 0.75,
        stagger: 0.055,
        ease: 'power3.out',
      });
    },
  });
});

// ── STAT COUNTER ANIMATIONS ──────────────────────────
document.querySelectorAll('[data-count]').forEach(el => {
  const raw    = el.dataset.count;      // e.g. "246" or "2"
  const suffix = el.dataset.suffix || ''; // e.g. "M" or "T"
  const target = parseFloat(raw);

  gsap.set(el, { opacity: 0 });

  ScrollTrigger.create({
    trigger: el,
    start: 'top 82%',
    once: true,
    onEnter() {
      gsap.to(el, { opacity: 1, duration: 0.4 });
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate() {
          const v = this.targets()[0].val;
          // If the target is an integer show no decimals, else 1 decimal
          el.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suffix;
        },
        onComplete() {
          el.textContent = target + suffix;
        },
      });
    },
  });
});

// ── STAGGERED CARD / BLOCK REVEALS ───────────────────
document.querySelectorAll('[data-stagger]').forEach(container => {
  const items = Array.from(container.children);
  if (!items.length) return;

  gsap.set(items, { opacity: 0, y: 32 });

  ScrollTrigger.create({
    trigger: container,
    start: 'top 82%',
    once: true,
    onEnter() {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: 'power2.out',
      });
    },
  });
});

// ── GENERAL SCROLL REVEALS (.will-reveal) ────────────
document.querySelectorAll('.will-reveal').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 86%',
    once: true,
    onEnter() {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      });
    },
  });
});

// ── SECTION LINE REVEAL ──────────────────────────────
document.querySelectorAll('.line-reveal').forEach(el => {
  gsap.fromTo(el,
    { scaleX: 0, transformOrigin: 'left' },
    {
      scaleX: 1,
      duration: 1.1,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
    }
  );
});

export { lenis, gsap, ScrollTrigger };
