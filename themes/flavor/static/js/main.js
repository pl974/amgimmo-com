/**
 * AMG Immobilier — Main JavaScript
 * ================================
 * Interactions, animations et fonctionnalités du site
 * 
 * @author AMG Immobilier
 * @version 2.0.0
 * @license MIT
 */

(function() {
  'use strict';

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================
  
  const CONFIG = {
    headerScrollThreshold: 50,
    animationDelay: 100,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // ==========================================================================
  // UTILITIES
  // ==========================================================================
  
  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function}
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function using requestAnimationFrame
   * @param {Function} func - Function to throttle
   * @returns {Function}
   */
  function rafThrottle(func) {
    let ticking = false;
    return function executedFunction(...args) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          func(...args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }

  // ==========================================================================
  // HEADER SCROLL EFFECT
  // ==========================================================================
  
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const updateHeader = rafThrottle(() => {
      const isScrolled = window.scrollY > CONFIG.headerScrollThreshold;
      header.classList.toggle('is-scrolled', isScrolled);
    });

    window.addEventListener('scroll', updateHeader, { passive: true });
    
    // Initial state
    updateHeader();
  }

  // ==========================================================================
  // MOBILE MENU
  // ==========================================================================
  
  function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!navToggle || !mobileMenu) return;

    // Get focusable elements in mobile menu
    const focusableElements = mobileMenu.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function openMenu() {
      navToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus first element after animation
      if (!CONFIG.reducedMotion) {
        setTimeout(() => firstFocusable?.focus(), 300);
      } else {
        firstFocusable?.focus();
      }
    }

    function closeMenu() {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      navToggle.focus();
    }

    function toggleMenu() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      isExpanded ? closeMenu() : openMenu();
    }

    // Event listeners
    navToggle.addEventListener('click', toggleMenu);

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });

    // Trap focus in mobile menu
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    });

    // Close on backdrop click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ==========================================================================
  // SMOOTH SCROLL
  // ==========================================================================
  
  function initSmoothScroll() {
    // Skip if user prefers reduced motion
    if (CONFIG.reducedMotion) return;

    const header = document.getElementById('header');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#main') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  // ==========================================================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ==========================================================================
  
  function initAnimations() {
    // Skip animations if user prefers reduced motion
    if (CONFIG.reducedMotion) {
      document.querySelectorAll('.grid__item, .categories__item').forEach(el => {
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.grid__item, .categories__item').forEach(el => {
      observer.observe(el);
    });
  }

  // ==========================================================================
  // NEWSLETTER FORM
  // ==========================================================================
  
  function initNewsletter() {
    const form = document.querySelector('.newsletter__form');
    if (!form) return;

    const input = form.querySelector('.newsletter__input');
    const btn = form.querySelector('.newsletter__btn');
    
    if (!input || !btn) return;

    const originalText = btn.textContent;

    // Create status message element for screen readers
    const statusEl = document.createElement('div');
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.className = 'sr-only';
    form.appendChild(statusEl);

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = input.value.trim();
      
      // Validation
      if (!email || !email.includes('@') || !email.includes('.')) {
        statusEl.textContent = 'Veuillez entrer une adresse email valide.';
        input.focus();
        input.setAttribute('aria-invalid', 'true');
        return;
      }

      input.setAttribute('aria-invalid', 'false');
      btn.disabled = true;
      btn.textContent = 'Envoi...';
      statusEl.textContent = 'Envoi en cours...';

      // Simulate submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      btn.textContent = 'Merci !';
      statusEl.textContent = 'Inscription réussie ! Merci de votre abonnement.';
      input.value = '';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2500);
    });

    // Clear error state on input
    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
    });
  }

  // ==========================================================================
  // LAZY LOADING IMAGES
  // ==========================================================================
  
  function initLazyLoading() {
    // Modern browsers support native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
      return;
    }

    // Fallback for older browsers
    const images = document.querySelectorAll('img[loading="lazy"]');
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ==========================================================================
  // PRINT STYLES
  // ==========================================================================
  
  function initPrintHandler() {
    window.addEventListener('beforeprint', () => {
      // Expand any collapsed content before printing
      document.querySelectorAll('[aria-expanded="false"]').forEach(el => {
        el.setAttribute('data-was-collapsed', 'true');
        el.setAttribute('aria-expanded', 'true');
      });
    });

    window.addEventListener('afterprint', () => {
      // Restore collapsed state
      document.querySelectorAll('[data-was-collapsed="true"]').forEach(el => {
        el.removeAttribute('data-was-collapsed');
        el.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================================================
  // EXTERNAL LINKS
  // ==========================================================================
  
  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      // Skip internal links
      if (link.hostname === window.location.hostname) return;
      
      // Add security attributes
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('target', '_blank');
      
      // Add visual indicator for screen readers
      if (!link.querySelector('.sr-only')) {
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = ' (s\'ouvre dans un nouvel onglet)';
        link.appendChild(srText);
      }
    });
  }

  // ==========================================================================
  // INITIALIZE
  // ==========================================================================
  
  function init() {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initNewsletter();
    initLazyLoading();
    initPrintHandler();
    initExternalLinks();

    // Log init in development
    if (window.location.hostname === 'localhost') {
      console.log('AMG Immobilier initialized', {
        reducedMotion: CONFIG.reducedMotion
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
