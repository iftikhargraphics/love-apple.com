/**
 * The Love Apple Cafe-Bar
 * Main JavaScript — navigation, hero slideshow, scroll reveals, menu tabs
 */

(function () {
  'use strict';

  /* =========================================================
     1. ANNOUNCEMENT BAR OFFSET — push header below announcement
     ========================================================= */
  function positionHeader() {
    const bar = document.querySelector('.announcement-bar');
    const header = document.getElementById('site-header');
    if (!bar || !header) return;
    // Announcement bar height used as CSS variable for offset calculations
    const barH = bar.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--ann-bar-height', barH + 'px');
    header.style.top = barH + 'px';
  }

  /* =========================================================
     2. STICKY NAVIGATION — add scrolled class
     ========================================================= */
  function initNav() {
    const header = document.getElementById('site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =========================================================
     3. HAMBURGER / MOBILE MENU
     ========================================================= */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    function toggleMenu(open) {
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      toggleMenu(!isOpen);
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        toggleMenu(false);
        hamburger.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        hamburger.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  /* =========================================================
     4. HERO SLIDESHOW
     ========================================================= */
  function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;

    let current = 0;
    const INTERVAL = 6000; // 6s per slide

    // Preload images
    slides.forEach(slide => {
      const url = slide.style.backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)/, '');
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });

    function goTo(index) {
      slides[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    let timer = setInterval(next, INTERVAL);

    // Pause on visibility change (saves battery / reduces motion)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        timer = setInterval(next, INTERVAL);
      }
    });
  }

  /* =========================================================
     5. SCROLL REVEAL (IntersectionObserver)
     ========================================================= */
  function initReveal() {
    // If user prefers reduced motion, just show everything
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* =========================================================
     6. MENU TABS
     ========================================================= */
  function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');
    if (!tabs.length) return;

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        const targetId = 'tab-' + tab.dataset.tab;

        // Update tabs
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Update panels
        panels.forEach(p => {
          p.classList.remove('active');
          p.hidden = true;
        });
        const target = document.getElementById(targetId);
        if (target) {
          target.classList.add('active');
          target.hidden = false;
        }
      });

      // Keyboard navigation (arrow keys)
      tab.addEventListener('keydown', (e) => {
        let newIndex = i;
        if (e.key === 'ArrowRight') newIndex = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') newIndex = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') newIndex = 0;
        if (e.key === 'End') newIndex = tabs.length - 1;
        if (newIndex !== i) {
          e.preventDefault();
          tabs[newIndex].focus();
          tabs[newIndex].click();
        }
      });
    });
  }

  /* =========================================================
     7. SMOOTH SCROLL for anchor links
     ========================================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          // Account for sticky header
          const header = document.getElementById('site-header');
          const bar = document.querySelector('.announcement-bar');
          const offset = (header ? header.getBoundingClientRect().height : 0) +
                         (bar ? bar.getBoundingClientRect().height : 0) + 8;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* =========================================================
     8. FOOTER YEAR
     ========================================================= */
  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* =========================================================
     9. ACTIVE NAV LINK HIGHLIGHTING
     ========================================================= */
  function initActiveLinks() {
    const sections = document.querySelectorAll('section[id], main [id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(sec => observer.observe(sec));
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    positionHeader();
    initNav();
    initMobileMenu();
    initHeroSlideshow();
    initReveal();
    initMenuTabs();
    initSmoothScroll();
    setYear();
    initActiveLinks();

    window.addEventListener('resize', positionHeader, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
