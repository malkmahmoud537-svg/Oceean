/**
 * OCEAN LIFE - THEME SWITCHER ENGINE (js/theme.js)
 * Manages Dark Mode (Abyssal Deep Ocean) & Light Mode (Sunlit Tropical Lagoon)
 * - Persists preference in localStorage ('ocean_theme')
 * - Respects system prefers-color-scheme if no saved preference
 * - Dynamically signals underwater canvas to adapt ambient water gradient
 */

(function () {
  'use strict';

  const THEME_KEY = 'ocean_theme';

  class ThemeEngine {
    constructor() {
      this.currentTheme = 'dark';
      this.init();
    }

    init() {
      // Check saved preference or system preference
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) {
        this.currentTheme = savedTheme;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        this.currentTheme = 'light';
      } else {
        this.currentTheme = 'dark';
      }

      this.applyTheme(this.currentTheme);
      this.setupListener();
    }

    applyTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);

      this.updateUI();

      // Notify underwater background engine if active
      if (window.underwaterEngine && window.underwaterEngine.setTheme) {
        window.underwaterEngine.setTheme(theme);
      }

      window.dispatchEvent(new CustomEvent('ocean:themeChanged', { detail: { theme } }));
    }

    toggle() {
      const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(nextTheme);
      if (window.showToast) {
        const msg = nextTheme === 'light'
          ? (document.documentElement.getAttribute('lang') === 'ar' ? 'تم تفعيل الوضع النهاري (المياه الاستوائية المشمسة)' : 'Light Mode Activated (Sunlit Tropical Waters)')
          : (document.documentElement.getAttribute('lang') === 'ar' ? 'تم تفعيل الوضع الليلي (أعماق المحيط السحيقة)' : 'Dark Mode Activated (Deep Ocean Abyss)');
        window.showToast(msg, 'info');
      }
      return this.currentTheme;
    }

    updateUI() {
      const themeBtns = document.querySelectorAll('.theme-toggle-btn');
      const isAr = document.documentElement.getAttribute('lang') === 'ar';
      themeBtns.forEach((btn) => {
        if (this.currentTheme === 'light') {
          const label = isAr ? 'التبديل إلى الوضع الليلي' : 'Switch to Dark Mode';
          btn.setAttribute('aria-label', label);
          btn.setAttribute('title', label);
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          `;
        } else {
          const label = isAr ? 'التبديل إلى الوضع النهاري' : 'Switch to Light Mode';
          btn.setAttribute('aria-label', label);
          btn.setAttribute('title', label);
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          `;
        }
      });
    }

    setupListener() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-toggle-btn');
        if (btn) {
          this.toggle();
        }
      });
      window.addEventListener('ocean:languageChanged', () => {
        this.updateUI();
      });
    }
  }

  // Early initialization before DOM loads to prevent flash of wrong theme
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }

  window.oceanTheme = new ThemeEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.oceanTheme.updateUI();
  });
})();

