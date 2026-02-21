/**
 * ASANTIAL – Interactions
 * IntersectionObserver für Scroll-Reveal, Hero-Entrance, Hover wird über CSS abgedeckt.
 * Nur native Browser-APIs, keine externen Libraries.
 */

(function () {
  'use strict';

  const STAGGER_DELAY_MS = 80;
  const REVEAL_THRESHOLD = 0.15;
  const REVEAL_HEADLINE_THRESHOLD = 0.2;
  const REVEAL_STAGGER_CONTAINER_THRESHOLD = 0.1;

  /**
   * prefers-reduced-motion respektieren (Animationen nicht starten oder vereinfachen).
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Zwei Observer: einer für Standard (0.15), einer für Headlines (0.2).
   * So erfüllen wir die Spec-Thresholds genau.
   */
  function initRevealObservers() {
    const standardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          standardObserver.unobserve(entry.target);
        });
      },
      { threshold: REVEAL_THRESHOLD }
    );

    const headlineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          headlineObserver.unobserve(entry.target);
        });
      },
      { threshold: REVEAL_HEADLINE_THRESHOLD }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      if (el.closest('.reveal-stagger-container')) return;
      if (el.classList.contains('reveal--headline')) {
        headlineObserver.observe(el);
      } else {
        standardObserver.observe(el);
      }
    });
  }

  /**
   * Gestaffelte Karten: Container beobachten, dann .revealed mit Delay auf Kinder.
   */
  function initStaggerReveal() {
    const containers = document.querySelectorAll('.reveal-stagger-container');
    if (!containers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const customDelay = parseInt(entry.target.dataset.staggerDelay, 10);
          const delayMs = customDelay > 0 ? customDelay : STAGGER_DELAY_MS;
          const children = entry.target.querySelectorAll('.reveal--stagger');
          children.forEach((child, index) => {
            const delay = index * delayMs;
            if (delay === 0) {
              child.classList.add('revealed');
            } else {
              setTimeout(() => child.classList.add('revealed'), delay);
            }
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: REVEAL_STAGGER_CONTAINER_THRESHOLD }
    );

    containers.forEach((container) => observer.observe(container));
  }

  /**
   * Hero-Entrance: Sequenz läuft per CSS (@keyframes + animation-delay).
   * Body-Klasse für optionales Styling nach Start.
   */
  function initHeroEntrance() {
    if (prefersReducedMotion()) return;
    if (document.body) document.body.classList.add('hero-entrance-started');
  }

  /**
   * Hover-Interactions sind in animations.css umgesetzt (.card-hover, .btn-primary-hover).
   * Kein zusätzliches JS nötig.
   */

  /**
   * Pfeil Modul „Entscheidungen“: Beim Runterscrollen wächst der Pfeil von links nach rechts
   * im Tempo des Scrollens (Scroll-Progress der Sektion).
   */
  function initArrowScrollProgress() {
    var wrap = document.querySelector('.entscheidungen__arrow-wrap');
    if (!wrap) return;
    var section = wrap.closest('section');
    if (!section) return;

    var snakePath = document.getElementById('arrow-snake-path');
    var arrowHead = document.getElementById('arrow-head-poly');
    var totalLength = snakePath ? snakePath.getTotalLength() : 1200;

    if (snakePath) {
      wrap.style.setProperty('--arrow-total-length', totalLength);
    }

    var ticking = false;
    function updateProgress() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight;
      var sectionHeight = rect.height;
      var progress = (vh - rect.top) / (vh + sectionHeight);
      var clamped = Math.max(0, Math.min(1, progress));
      wrap.style.setProperty('--arrow-progress', clamped);
      var container = wrap.closest('.container');
      if (container) container.style.setProperty('--arrow-progress', clamped);

      if (arrowHead && snakePath && clamped > 0.02) {
        var dist = clamped * totalLength;
        var pt = snakePath.getPointAtLength(dist);
        var pt2 = snakePath.getPointAtLength(Math.min(dist + 1, totalLength));
        var angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);
        arrowHead.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ') rotate(' + angle + ')');
        arrowHead.style.opacity = '1';
      } else if (arrowHead) {
        arrowHead.style.opacity = '0';
      }

      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateProgress);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateProgress();
  }

  /**
   * Modul 8 Systemlogik: Diagramm baut sich beim Scroll auf
   * (Rahmen → Knoten 1–3 → Verbindungslinien).
   */
  function initSystemlogikDiagram() {
    const diagram = document.getElementById('systemlogik-diagram');
    if (!diagram) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('systemlogik__diagram-wrap--built');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(diagram);
  }

  /**
   * Modul 2 Kernaussage: Zeile für Zeile sanft einblenden.
   */
  function initStatementReveal() {
    var section = document.getElementById('statement');
    if (!section) return;

    var lines = section.querySelectorAll('.statement__line');
    if (!lines.length) return;

    var started = false;
    var LINE_DELAY = 600;

    if (prefersReducedMotion()) {
      lines.forEach(function (el) { el.classList.add('statement__line--visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || started) return;
          started = true;
          lines.forEach(function (el, i) {
            setTimeout(function () {
              el.classList.add('statement__line--visible');
            }, i * LINE_DELAY);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
  }

  /**
   * Burger Menu: Toggle, Smooth-Scroll, Nav-Scroll-Styling
   */
  function initBurgerMenu() {
    var burger = document.getElementById('burger');
    var overlay = document.getElementById('nav-overlay');
    var nav = document.getElementById('nav');
    if (!burger || !overlay) return;

    var links = overlay.querySelectorAll('a[href^="#"]');

    function openMenu() {
      burger.classList.add('burger--open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Menü schließen');
      overlay.classList.add('nav-overlay--open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
    }

    function closeMenu() {
      burger.classList.remove('burger--open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Menü öffnen');
      overlay.classList.remove('nav-overlay--open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
    }

    burger.addEventListener('click', function () {
      var isOpen = burger.classList.contains('burger--open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          closeMenu();
          setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.classList.contains('burger--open')) {
        closeMenu();
        burger.focus();
      }
    });

    if (nav) {
      var scrollTicking = false;
      function checkScroll() {
        if (window.scrollY > 60) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
        scrollTicking = false;
      }
      window.addEventListener('scroll', function () {
        if (!scrollTicking) {
          scrollTicking = true;
          requestAnimationFrame(checkScroll);
        }
      }, { passive: true });
      checkScroll();
    }
  }

  /**
   * Init: nach DOM ready Observer und Hero starten.
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  function initFaqAccordion() {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('faq__item--open');

        items.forEach(function (other) {
          if (other !== item && other.classList.contains('faq__item--open')) {
            other.classList.remove('faq__item--open');
            other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            other.querySelector('.faq__answer').style.maxHeight = '0';
            other.querySelector('.faq__answer').setAttribute('aria-hidden', 'true');
          }
        });

        if (isOpen) {
          item.classList.remove('faq__item--open');
          btn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0';
          answer.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('faq__item--open');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  function initProCardRotation() {
    var cards = document.querySelectorAll('.professional__floating-card');
    if (!cards.length) return;
    if (prefersReducedMotion()) return;

    var current = 0;
    setInterval(function () {
      cards[current].classList.remove('pro-card--active');
      current = (current + 1) % cards.length;
      cards[current].classList.add('pro-card--active');
    }, 2200);
  }

  function run() {
    initRevealObservers();
    initStaggerReveal();
    initHeroEntrance();
    initStatementReveal();
    initArrowScrollProgress();
    initSystemlogikDiagram();
    initBurgerMenu();
    initFaqAccordion();
    initProCardRotation();
  }

  init();
})();
