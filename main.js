/* ============================================================
   LANA'S RECIPE HUB — main.js
   Global JavaScript for all pages
   ============================================================ */

(function () {
  'use strict';

  /* ── MOBILE NAV TOGGLE ──────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navList   = document.getElementById('nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });

    // Close nav when a link is clicked (mobile)
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── STICKY HEADER SHADOW ───────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── FAQ ACCORDION ──────────────────────────────────────── */
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── SEARCH OVERLAY (mobile) ────────────────────────────── */
  // Show search bar on mobile when toggled
  const searchToggle = document.querySelector('.search-toggle-btn');
  const searchForm   = document.querySelector('.search-form');
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', () => {
      searchForm.classList.toggle('visible');
      if (searchForm.classList.contains('visible')) {
        searchForm.querySelector('input').focus();
      }
    });
  }

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── INTERSECTION OBSERVER — SCROLL REVEALS ─────────────── */
  if ('IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll(
      '.card, .tip-card, .stat, .team-card, .review-card, .contact-info-card, .mv-card, .featured-img'
    );

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      el.classList.add('reveal-ready');
      revealObserver.observe(el);
    });
  }

  /* ── TOAST NOTIFICATION ─────────────────────────────────── */
  window.showToast = function (message, duration = 3000) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="toast__msg"></span>`;
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast__msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  };

  /* ── COMMENT / FORM SUBMISSION (mock) ───────────────────── */
  const commentBar = document.querySelector('.comment-bar');
  if (commentBar) {
    commentBar.querySelector('button').addEventListener('click', () => {
      const input = commentBar.querySelector('input');
      if (input.value.trim()) {
        window.showToast('Comment posted — thank you!');
        input.value = '';
      }
    });
  }

  /* ── CONTACT FORM (mock) ────────────────────────────────── */
  const contactForm = document.querySelector('.contact-bottom form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      window.showToast('Message sent — we\'ll be in touch soon!');
      contactForm.reset();
    });
  }

  /* ── STAR RATING ─────────────────────────────────────────── */
  const starRating = document.querySelector('.star-rating-interactive');
  if (starRating) {
    starRating.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        window.showToast(`You rated this recipe ${input.value} star${input.value > 1 ? 's' : ''}!`);
      });
    });
  }

  /* ── CUISINE SEARCH FILTER ──────────────────────────────── */
  const cuisineSearch = document.querySelector('.cuisine-search input');
  if (cuisineSearch) {
    cuisineSearch.addEventListener('input', () => {
      const query = cuisineSearch.value.toLowerCase().trim();
      document.querySelectorAll('.cuisine-card').forEach(card => {
        const title = card.querySelector('.card__title')?.textContent.toLowerCase() || '';
        card.style.display = (!query || title.includes(query)) ? '' : 'none';
      });
    });
  }

  /* ── RECIPE FILTER (home & recipes page) ────────────────── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.recipe-card').forEach(card => {
          const tags = card.dataset.tags || '';
          card.style.display = (filter === 'all' || tags.includes(filter)) ? '' : 'none';
        });
      });
    });
  }

  /* ── HERO PARALLAX (subtle) ──────────────────────────────── */
  const heroImg = document.querySelector('.hero__img-wrap img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroImg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
  }

  /* ── NUMBER COUNTER ANIMATION (stats strip) ─────────────── */
  const statNumbers = document.querySelectorAll('.stat__number[data-target]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObs.observe(el));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    const steps    = 60;
    const step     = target / steps;
    let current    = 0;
    let count       = 0;

    const timer = setInterval(() => {
      count++;
      current = Math.min(current + step, target);
      el.textContent = Math.round(current).toLocaleString() + suffix;
      if (count >= steps) clearInterval(timer);
    }, duration / steps);
  }

  /* ── IMAGE LAZY LOAD FALLBACK ────────────────────────────── */
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });

})();
