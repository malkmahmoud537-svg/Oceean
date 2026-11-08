/**
 * OCEAN LIFE - SEAMLESS PERSISTENT NAVIGATION ROUTER (js/navigation.js)
 * Implements:
 * 1. Persistent SPA-style navigation across all pages without restarting Canvas background
 * 2. Active nav link indicator & Home icon routing
 * 3. Mobile slide-down menu drawer
 * 4. Top progress bar during page load
 * 5. Back-to-top floating button
 * 6. Global Toast notification system
 * 7. Graceful fallback to regular page navigation if running on strict file:// origin
 */

(function () {
  'use strict';

  class OceanRouter {
    constructor() {
      this.progressBar = null;
      this.mainContent = null;
      this.isTransitioning = false;

      this.init();
    }

    init() {
      this.progressBar = document.getElementById('route-progress-bar');
      this.mainContent = document.getElementById('main-content');

      this.setupLinkInterceptor();
      this.setupPopState();
      this.setupMobileMenu();
      this.setupScrollListener();
      this.updateActiveNav();
      this.initCurrentPageScripts();
    }

    // Intercept internal link clicks for seamless persistent transitions
    setupLinkInterceptor() {
      document.addEventListener('click', (e) => {
        // Find closest anchor tag
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Ignore hash-only links, javascript:, tel:, mailto: or external links
        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
          return;
        }

        // Check if external domain
        try {
          const url = new URL(href, window.location.href);
          if (url.origin !== window.location.origin) {
            return; // Allow normal external navigation
          }

          e.preventDefault();
          this.navigateTo(url.pathname + url.search + url.hash);
        } catch (err) {
          // If URL parsing fails, default to normal browser navigation
        }
      });
    }

    // Handle browser Back / Forward buttons
    setupPopState() {
      window.addEventListener('popstate', () => {
        this.loadPageContent(window.location.pathname + window.location.search + window.location.hash, false);
      });
    }

    // Seamless page loader
    async navigateTo(urlPath) {
      if (this.isTransitioning) return;
      this.closeMobileMenu();

      // Normalize current and target
      const current = window.location.pathname;
      if (current === urlPath) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      await this.loadPageContent(urlPath, true);
    }

    async loadPageContent(urlPath, pushToHistory = true) {
      this.isTransitioning = true;
      this.startProgress();

      try {
        const response = await fetch(urlPath);
        if (!response.ok) {
          throw new Error(`Failed to load page: ${response.status}`);
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Extract new title & main content
        const newTitle = doc.querySelector('title') ? doc.querySelector('title').textContent : 'OCEAN LIFE';
        const newMain = doc.querySelector('#main-content');
        const newNavbar = doc.querySelector('.navbar');
        const newFooter = doc.querySelector('.footer');

        if (!newMain) {
          // Fallback if structure differs
          window.location.href = urlPath;
          return;
        }

        // Animate out old content
        if (this.mainContent) {
          this.mainContent.classList.add('page-transitioning');
          await new Promise((resolve) => setTimeout(resolve, 220));

          // Replace main content
          this.mainContent.innerHTML = newMain.innerHTML;
          document.title = newTitle;

          // Also synchronize navbar and footer to keep relative paths accurate
          const currentNavbar = document.querySelector('.navbar');
          if (newNavbar && currentNavbar) {
            currentNavbar.innerHTML = newNavbar.innerHTML;
          }
          const currentFooter = document.querySelector('.footer');
          if (newFooter && currentFooter) {
            currentFooter.innerHTML = newFooter.innerHTML;
          }

          // Re-sync UI state on the updated navbar & content
          if (window.oceanAudio) {
            window.oceanAudio.updateUI();
          }
          if (window.oceanTheme) {
            window.oceanTheme.updateUI();
          }
          if (window.oceanI18n) {
            window.oceanI18n.applyLanguage(window.oceanI18n.currentLang, false);
          }

          // Scroll to top
          window.scrollTo(0, 0);

          // Animate in new content
          this.mainContent.classList.remove('page-transitioning');
        }

        if (pushToHistory) {
          window.history.pushState({}, '', urlPath);
        }

        this.updateActiveNav();
        this.initCurrentPageScripts();
        this.completeProgress();
      } catch (error) {
        console.warn('[OceanRouter] Persistent transition failed (e.g. local file CORS). Falling back to direct load:', error);
        this.completeProgress();
        // Safe standard multi-page navigation fallback
        window.location.href = urlPath;
      } finally {
        this.isTransitioning = false;
      }
    }

    startProgress() {
      if (!this.progressBar) return;
      this.progressBar.style.opacity = '1';
      this.progressBar.style.width = '35%';
      setTimeout(() => {
        if (this.progressBar.style.width === '35%') {
          this.progressBar.style.width = '75%';
        }
      }, 150);
    }

    completeProgress() {
      if (!this.progressBar) return;
      this.progressBar.style.width = '100%';
      setTimeout(() => {
        this.progressBar.style.opacity = '0';
        setTimeout(() => {
          this.progressBar.style.width = '0%';
        }, 300);
      }, 200);
    }

    // Active navigation indicator
    updateActiveNav() {
      const currentPath = window.location.pathname.toLowerCase();
      const navLinks = document.querySelectorAll('.nav-link');

      navLinks.forEach((link) => {
        link.classList.remove('active');
        const href = (link.getAttribute('href') || '').toLowerCase();

        // Exact match or sub-path match
        if (href === currentPath) {
          link.classList.add('active');
        } else if (
          (currentPath === '/' || currentPath.endsWith('index.html')) &&
          (href === '/' || href.endsWith('index.html'))
        ) {
          link.classList.add('active');
        } else if (currentPath.includes('about') && href.includes('about')) {
          link.classList.add('active');
        } else if ((currentPath.includes('marine') || currentPath.includes('/animals/')) && href.includes('marine')) {
          link.classList.add('active');
        } else if (currentPath.includes('explorer') && href.includes('explorer')) {
          link.classList.add('active');
        } else if ((currentPath.includes('login') || currentPath.includes('welcome')) && (href.includes('login') || href.includes('welcome'))) {
          link.classList.add('active');
        }
      });
    }

    // Mobile Hamburger Menu
    setupMobileMenu() {
      document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.mobile-nav-toggle');
        if (toggle) {
          const menu = document.getElementById('nav-menu');
          if (menu) {
            menu.classList.toggle('open');
          }
        }
      });
    }

    closeMobileMenu() {
      const menu = document.getElementById('nav-menu');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
      }
    }

    // Scroll listener for scrolled navbar & back to top
    setupScrollListener() {
      const navbar = document.querySelector('.navbar');
      const backToTop = document.getElementById('back-to-top');

      window.addEventListener('scroll', () => {
        const top = window.scrollY;

        if (navbar) {
          if (top > 40) navbar.classList.add('scrolled');
          else navbar.classList.remove('scrolled');
        }

        if (backToTop) {
          if (top > 450) backToTop.classList.add('visible');
          else backToTop.classList.remove('visible');
        }
      });

      if (backToTop) {
        backToTop.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }

    // Initialize page-specific JavaScript modules based on current route
    initCurrentPageScripts() {
      const path = window.location.pathname.toLowerCase();

      // Home Page
      if (path === '/' || path.endsWith('index.html') || path === '') {
        if (window.initHomePage) window.initHomePage();
      }

      // About Page
      if (path.includes('about')) {
        if (window.initAboutPage) window.initAboutPage();
      }

      // Marine Life Gallery
      if (path.includes('marine-life')) {
        if (window.initMarinePage) window.initMarinePage();
      }

      // Animal Details Pages
      if (path.includes('/animals/')) {
        if (window.initAnimalDetailPage) window.initAnimalDetailPage();
      }

      // Ocean Explorer & Pollution Game
      if (path.includes('explorer')) {
        if (window.initExplorerPage) window.initExplorerPage();
        if (window.initPollutionGame) window.initPollutionGame();
      }

      // Auth & Welcome Pages
      if (path.includes('login')) {
        if (window.initAuthPage) window.initAuthPage();
      }
      if (path.includes('welcome')) {
        if (window.initWelcomePage) window.initWelcomePage();
      }
    }
  }

  // Global Toast Functionality
  window.showToast = function (message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  };

  // Launch Router
  document.addEventListener('DOMContentLoaded', () => {
    window.oceanRouter = new OceanRouter();
  });
})();

