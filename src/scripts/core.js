import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- smooth scroll ---------- */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
window.__lenis = lenis;
if (import.meta.env.DEV) window.__anp = { lenis, ScrollTrigger };

/* ---------- header hide on scroll down ---------- */
const hdr = document.querySelector('[data-header]');
let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  if (hdr) hdr.classList.toggle('is-hidden', y > 400 && y > lastY + 4 && !document.querySelector('.menu:not([hidden])'));
  if (y < lastY - 4) hdr?.classList.remove('is-hidden');
  lastY = y;
}, { passive: true });

/* ---------- mobile menu ---------- */
const menu = document.querySelector('[data-menu]');
const openBtn = document.querySelector('[data-menu-open]');
const setMenu = (open) => {
  if (!menu) return;
  menu.hidden = !open;
  openBtn?.setAttribute('aria-expanded', String(open));
  if (open) { lenis?.stop(); menu.querySelector('[data-menu-close]')?.focus(); } else { lenis?.start(); openBtn?.focus(); }
};
openBtn?.addEventListener('click', () => setMenu(true));
menu?.querySelector('[data-menu-close]')?.addEventListener('click', () => setMenu(false));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false); });

/* ---------- back to top ---------- */
document.querySelector('[data-top]')?.addEventListener('click', (e) => {
  e.preventDefault();
  lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- reveals ---------- */
const revealEls = [...document.querySelectorAll('[data-reveal]')];
if (reduce || !('IntersectionObserver' in window)) revealEls.forEach((el) => el.classList.add('in'));
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => io.observe(el));
  // sweep: anything above the fold line after a fast scroll is shown
  const sweep = () => {
    const lim = innerHeight * 0.92;
    for (const el of revealEls) if (!el.classList.contains('in') && el.getBoundingClientRect().top < lim) el.classList.add('in');
  };
  addEventListener('scroll', () => requestAnimationFrame(sweep), { passive: true });
  sweep();
}

/* ---------- refresh ScrollTrigger only if fonts changed height ---------- */
const h0 = document.documentElement.scrollHeight;
document.fonts?.ready.then(() => { if (document.documentElement.scrollHeight !== h0) ScrollTrigger.refresh(); });

/* ---------- page transitions ---------- */
const panel = document.querySelector('.pt');
if (sessionStorage.getItem('pt') === '1' && panel && !reduce) {
  sessionStorage.removeItem('pt');
  document.documentElement.classList.add('pt-in');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    panel.classList.add('in');
    document.documentElement.classList.remove('pt-in');
    panel.addEventListener('transitionend', () => panel.classList.remove('in'), { once: true });
  }));
}
addEventListener('pageshow', (e) => { if (e.persisted) panel?.classList.remove('out', 'in'); });
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href]');
  if (!a || !panel || reduce) return;
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname === location.pathname) return;
  if (/\.(xml|png|jpe?g|webp|pdf)$/.test(url.pathname)) return;
  e.preventDefault();
  panel.classList.add('out');
  try { sessionStorage.setItem('pt', '1'); } catch {}
  setTimeout(() => { location.href = url.href; }, 330);
});

/* ---------- cursor ---------- */
const cur = document.querySelector('.cur');
if (cur && fine && !reduce) {
  let x = -100, y = -100, rx = -100, ry = -100;
  const ring = cur.querySelector('.cur__ring'), dot = cur.querySelector('.cur__dot');
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; cur.classList.remove('off'); }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.add('off'));
  document.addEventListener('pointerover', (e) => cur.classList.toggle('big', !!e.target.closest?.('a, button, [data-cursor]')));
  gsap.ticker.add(() => {
    rx += (x - rx) * 0.22; ry += (y - ry) * 0.22;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  });
}

/* ---------- magnetic buttons ---------- */
if (fine && !reduce) document.querySelectorAll('.btn').forEach((b) => {
  b.addEventListener('pointermove', (e) => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
  });
  b.addEventListener('pointerleave', () => { b.style.transform = ''; });
});

/* ---------- background videos: load near viewport, pause off screen ---------- */
const bgvs = [...document.querySelectorAll('[data-bgv]')];
if (bgvs.length && !reduce && 'IntersectionObserver' in window) {
  const small = innerWidth < 768;
  const vio = new IntersectionObserver((es) => es.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) {
      if (!v.src) { v.src = small ? v.dataset.srcM : v.dataset.src; v.load(); }
      v.play().catch(() => {});
    } else if (v.src) v.pause();
  }), { rootMargin: '200px 0px' });
  // hero footage waits until after first paint so it never competes with the intro
  const start = () => setTimeout(() => bgvs.forEach((v) => vio.observe(v)), 300);
  document.readyState === 'complete' ? start() : addEventListener('load', start, { once: true });
}
