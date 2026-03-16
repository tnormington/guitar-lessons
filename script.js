// ============================================
// GUITAR LESSONS SITE - SCRIPT
// ============================================

// --- Year in footer ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Nav scroll behavior ---
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 60) {
    nav.style.background = 'rgba(13, 13, 15, 0.97)';
  } else {
    nav.style.background = 'rgba(13, 13, 15, 0.85)';
  }

  lastScroll = currentScroll;
}, { passive: true });

// --- Mobile nav toggle ---
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');

  navLinks.classList.toggle('open', !isOpen);
  navToggle.classList.toggle('open', !isOpen);
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  });
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    navToggle.focus();
  }
});

// --- Fade-in on scroll (Intersection Observer) ---
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly for card grids
      const delay = getSiblingDelay(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

fadeEls.forEach(el => fadeObserver.observe(el));

function getSiblingDelay(el) {
  const parent = el.parentElement;
  if (!parent) return 0;

  // Only stagger elements within grid containers
  const isGrid = parent.classList.contains('learn-grid') ||
                 parent.classList.contains('pricing-grid') ||
                 parent.classList.contains('about-badges');

  if (!isGrid) return 0;

  const siblings = Array.from(parent.querySelectorAll('.fade-in'));
  const index = siblings.indexOf(el);
  return index * 80;
}

// --- FAQ accordion ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    faqItems.forEach(other => {
      const otherBtn = other.querySelector('.faq-question');
      const otherAnswer = other.querySelector('.faq-answer');
      if (otherBtn && otherAnswer && other !== item) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.hidden = true;
        otherAnswer.style.maxHeight = null;
      }
    });

    // Toggle current
    btn.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen;
  });
});

// --- Smooth active state for nav links (scroll spy) ---
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links .nav-link:not(.nav-link-cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, {
  threshold: 0.3,
  rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))}px 0px 0px 0px`,
});

sections.forEach(s => sectionObserver.observe(s));

// Add active nav link style
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-link.active { color: var(--text-primary); background: rgba(255,255,255,0.05); }`;
document.head.appendChild(activeStyle);
