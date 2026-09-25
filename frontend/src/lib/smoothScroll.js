/*
  smoothScroll.js — Lenis inertial scrolling (yes.edu.in-style feel)
  ==================================================================
  Adds natural momentum + easing to mouse-wheel scrolling. Touch
  scrolling stays native (mobile browsers already have good physics).

  Self-contained: nothing about the page's content, layout, or
  behaviour changes. When the app locks body scroll (lightbox
  overlays, mobile menu drawer set `document.body.style.overflow`),
  this module detects it instantly and stops Lenis so those modals
  behave exactly as before. Reduced-motion users keep native scroll.
*/

import Lenis from 'lenis';

let lenis = null;
let rafId = null;
let rafRunning = false;
let bodyObserver = null;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function raf(time) {
  if (!lenis) return;
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}

function startRaf() {
  if (rafRunning || !lenis) return;
  rafRunning = true;
  rafId = requestAnimationFrame(raf);
}

function stopRaf() {
  if (!rafRunning) return;
  cancelAnimationFrame(rafId);
  rafRunning = false;
}

/* Body scroll lock state (used by lightboxes and the mobile drawer). */
function isBodyLocked() {
  return document.body.style.overflow === 'hidden';
}

function syncWithBodyLock() {
  if (!lenis) return;
  if (isBodyLocked()) lenis.stop();
  else lenis.start();
}

export function initSmoothScroll() {
  if (typeof window === 'undefined') return;
  if (lenis) return; // already initialised (StrictMode double-mount safe)
  if (prefersReducedMotion()) return; // keep native scroll, no momentum

  lenis = new Lenis({
    // ~0.95s glide — snappier while keeping the momentum feel.
    duration: 0.95,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true, // animate mouse-wheel scrolling
    wheelMultiplier: 1.1, // slightly more distance per wheel notch
    syncTouch: false, // leave touch/trackpad-native scrolling alone
    touchMultiplier: 1.5,
    // Never hijack wheel events aimed at overlay panels (enquiry form,
    // lightboxes) so their inner scrolling keeps working untouched.
    prevent: (node) =>
      !!node.closest?.('.enquiry-overlay, .enquiry-panel, .lightbox-content, .news-lightbox-content'),
  });

  startRaf();

  // React instantly when something locks/unlocks body scroll.
  bodyObserver = new MutationObserver(syncWithBodyLock);
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
  syncWithBodyLock();
}

export function destroySmoothScroll() {
  if (bodyObserver) {
    bodyObserver.disconnect();
    bodyObserver = null;
  }
  stopRaf();
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

/* Route changes reset the scroll position — route it through Lenis when
   active so the reset is applied without fighting the animation loop. */
export function scrollToTopImmediate() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}
