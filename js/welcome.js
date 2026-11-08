/**
 * OCEAN LIFE - WELCOME DASHBOARD LOGIC (js/welcome.js)
 * Implements:
 * 1. Verification of authenticated session
 * 2. Personalized user greeting & ocean rank
 * 3. Quick navigation links to Marine Life, Ocean Explorer & Conservation
 * 4. User profile overview & Logout functionality
 */

(function () {
  'use strict';

  function initWelcomePage() {
    const welcomeContainer = document.querySelector('.welcome-page-container');
    if (!welcomeContainer) return;

    const session = window.getOceanSession ? window.getOceanSession() : null;

    const nameDisplay = document.getElementById('welcome-user-name');
    const emailDisplay = document.getElementById('welcome-user-email');
    const avatarCircle = document.getElementById('welcome-user-avatar');
    const logoutBtn = document.getElementById('welcome-logout-btn');

    if (session && session.fullName) {
      if (nameDisplay) nameDisplay.textContent = session.fullName;
      if (emailDisplay) emailDisplay.textContent = session.email;
      if (avatarCircle) {
        const initials = session.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        avatarCircle.textContent = initials;
      }
    } else {
      // Default guest name if arrived directly
      if (nameDisplay) nameDisplay.textContent = 'Explorer';
      if (emailDisplay) emailDisplay.textContent = 'guest@oceanlife.org';
      if (avatarCircle) avatarCircle.textContent = 'EX';
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.logoutOceanUser) {
          window.logoutOceanUser();
        }
      });
    }
  }

  window.initWelcomePage = initWelcomePage;

  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.toLowerCase().includes('welcome')) {
      initWelcomePage();
    }
  });
})();

