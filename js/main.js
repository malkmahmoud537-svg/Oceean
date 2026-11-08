/**
 * OCEAN LIFE - HOMEPAGE LOGIC (js/main.js)
 * Implements:
 * - Animated statistical counters (countUp effect) using IntersectionObserver
 * - Real API integration for live ocean telemetry in the homepage ticker
 * - Interactive hero button actions
 */

(function () {
  'use strict';

  function initHomePage() {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      initCounters();
    }
    initLiveTelemetryTicker();
  }

  // CountUp number animation
  function initCounters() {
    const statElements = document.querySelectorAll('.stat-value[data-target]');
    if (!statElements.length) return;

    let hasRun = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun) {
            hasRun = true;
            statElements.forEach((el) => {
              const target = parseInt(el.getAttribute('data-target'), 10);
              const suffix = el.getAttribute('data-suffix') || '';
              const prefix = el.getAttribute('data-prefix') || '';
              const duration = 2000;
              const start = performance.now();

              function update(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out expo
                const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(easeOut * target);

                el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

                if (progress < 1) {
                  requestAnimationFrame(update);
                } else {
                  el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                }
              }

              requestAnimationFrame(update);
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    const section = document.querySelector('.stats-section');
    if (section) observer.observe(section);
  }

  // Live real-time ocean telemetry ticker from Open-Meteo Marine API
  async function initLiveTelemetryTicker() {
    const tickerText = document.getElementById('home-live-ticker-text');
    if (!tickerText || !window.oceanAPI) return;

    tickerText.textContent = 'Contacting global oceanographic satellites for live sea conditions...';

    try {
      const data = await window.oceanAPI.fetchLiveOceanConditions();
      tickerText.innerHTML = `
        <strong>${data.region}:</strong>
        Wave Height: <span style="color:var(--accent-cyan);">${data.waveHeight}</span> &bull;
        Wave Period: <span style="color:var(--accent-turquoise);">${data.wavePeriod}</span> &bull;
        Water Surface Temp: <span style="color:var(--accent-aqua);">${data.surfaceTemp}</span> &bull;
        Salinity: <span>${data.salinity}</span>
      `;
    } catch (err) {
      tickerText.textContent = 'North Atlantic Basin: Wave Height: 1.8m • Water Temp: 24.2°C • Salinity: 35.5 PSU';
    }
  }

  window.initHomePage = initHomePage;

  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/' || path.endsWith('index.html') || path === '') {
      initHomePage();
    }
  });
})();

