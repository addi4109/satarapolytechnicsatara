/*
  scrollReveal.js — yes.edu.in-style scroll entrance animations
  =============================================================
  One shared IntersectionObserver drives every reveal on the site.
  Opt in by putting a data-reveal attribute on any element:

    <section data-reveal>          → fade-up (default)
    <div data-reveal="fade">       → pure fade
    <div data-reveal="left">       → slide in from the left
    <div data-reveal="right">      → slide in from the right
    <div data-reveal="zoom">       → scale up
    <div data-reveal="down">       → slide down from above

  Children can stagger with data-reveal-child on direct descendants:

    <div className="grid" data-reveal>
      <div data-reveal-child>...</div>   ← card 1 animates first
      <div data-reveal-child>...</div>   ← card 2 follows ~90ms later
    </div>

  Delay any element with data-reveal-delay="200" (ms).

  Call initScrollReveal() once when the app mounts. Newly mounted
  elements (lazy pages, fetched cards) are picked up automatically.
  Reduced-motion users see everything instantly, without animation.
*/

const BASE_SELECTOR = '[data-reveal], [data-reveal-child]';

let observer = null;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/* Mark everything visible immediately and stop observing. */
function revealAll() {
  document.querySelectorAll(BASE_SELECTOR).forEach((el) => {
    el.classList.add('is-visible');
  });
}

/* Shared observer: reveals once, then stops watching the element. */
function getObserver() {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    {
      // Start as the element's top edge crosses ~12% up from the viewport
      // bottom, so the motion is clearly visible but never missed.
      rootMargin: '0px 0px -12% 0px',
      threshold: 0,
    },
  );

  return observer;
}

/* Explicit data-reveal-delay="200" wins; otherwise stagger children of a
   reveal container by index so card grids animate one after another. */
function applyDelays(root) {
  const scope = root || document;

  scope.querySelectorAll('[data-reveal-delay]').forEach((el) => {
    el.style.setProperty('--reveal-delay', `${Number(el.getAttribute('data-reveal-delay')) || 0}ms`);
  });

  scope.querySelectorAll('[data-reveal]').forEach((container) => {
    container.querySelectorAll('[data-reveal-child]').forEach((child, i) => {
      if (!child.style.getPropertyValue('--reveal-delay')) {
        child.style.setProperty('--reveal-delay', `${Math.min(i, 12) * 90}ms`);
      }
    });
  });
}

/* Observe elements that are not yet visible and not already watched. */
function observePending(root) {
  const scope = root || document;

  applyDelays(scope);
  scope.querySelectorAll(BASE_SELECTOR).forEach((el) => {
    if (el.classList.contains('is-visible')) return;
    getObserver().observe(el);
  });
}

/* Check elements already on screen at mount — reveal them without waiting
   for the first scroll event. */
function revealVisibleOnMount() {
  const vh = window.innerHeight || document.documentElement.clientHeight;

  document.querySelectorAll(BASE_SELECTOR).forEach((el) => {
    if (el.classList.contains('is-visible')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      el.classList.add('is-visible');
    }
  });
}

export function initScrollReveal() {
  if (typeof window === 'undefined' || observer) return;

  // Reduced motion (or missing IntersectionObserver): no animation at all.
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  revealVisibleOnMount();
  observePending(document);
}

/* Re-scan after dynamic content mounts (lazy pages, fetched card lists). */
export function refreshScrollReveal(root) {
  if (typeof window === 'undefined') return;
  if (!observer) {
    initScrollReveal();
    return;
  }
  observePending(root);
}

/* Watch the DOM for late-mounted [data-reveal] nodes so component code
   never needs to call refreshScrollReveal manually. */
let mo = null;
export function startScrollRevealWatcher() {
  if (typeof window === 'undefined' || mo || !('MutationObserver' in window)) return;

  mo = new MutationObserver((mutations) => {
    let hasNew = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.(BASE_SELECTOR) || node.querySelector?.(BASE_SELECTOR)) {
          hasNew = true;
          break;
        }
      }
      if (hasNew) break;
    }
    if (hasNew) observePending(document);
  });

  mo.observe(document.body, { childList: true, subtree: true });
}
