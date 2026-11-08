/**
 * OCEAN LIFE - INTERACTIVE POLLUTION SORTING GAME (js/pollution-game.js)
 * Implements:
 * 1. HTML5 Drag & Drop API + Touch Drag polyfill for mobile phones & tablets
 * 2. 8 Oceanic Debris Objects sorted into 4 Category Bins (Plastics, Hazardous/Fishing, Glass/Metal, Organic)
 * 3. Real-time score system, streak multiplier & audio feedback
 * 4. Progress bar tracking
 * 5. Win / Game Over modal with final score & Restart functionality
 */

(function () {
  'use strict';

  const initialGameItems = [
    { id: 'item-1', name: 'Plastic Water Bottle', emoji: '🧴', category: 'plastics' },
    { id: 'item-2', name: 'Ghost Fishing Net', emoji: '🕸️', category: 'hazardous' },
    { id: 'item-3', name: 'Discarded Plastic Bag', emoji: '🛍️', category: 'plastics' },
    { id: 'item-4', name: 'Broken Glass Jar', emoji: '🫙', category: 'glass-metal' },
    { id: 'item-5', name: 'Aluminum Soda Can', emoji: '🥫', category: 'glass-metal' },
    { id: 'item-6', name: 'Organic Food Waste', emoji: '🍎', category: 'organic' },
    { id: 'item-7', name: 'Corroded Car Battery', emoji: '🔋', category: 'hazardous' },
    { id: 'item-8', name: 'Paper & Cardboard Box', emoji: '📦', category: 'organic' }
  ];

  let currentItems = [];
  let score = 0;
  let streak = 0;
  let sortedCount = 0;
  const totalItemsCount = initialGameItems.length;

  function initPollutionGame() {
    const gamePool = document.getElementById('game-waste-pool');
    if (!gamePool) return;

    resetGame();
    setupDropZones();
    setupRestartButton();
  }

  function resetGame() {
    score = 0;
    streak = 0;
    sortedCount = 0;
    currentItems = JSON.parse(JSON.stringify(initialGameItems));

    // Shuffle items array
    currentItems.sort(() => Math.random() - 0.5);

    updateStatsDisplay();
    renderDraggableItems();

    const resultModal = document.getElementById('game-result-modal');
    if (resultModal) resultModal.classList.remove('active');
  }

  function renderDraggableItems() {
    const pool = document.getElementById('game-waste-pool');
    if (!pool) return;

    pool.innerHTML = '';
    currentItems.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'draggable-waste-item';
      el.setAttribute('draggable', 'true');
      el.setAttribute('data-id', item.id);
      el.setAttribute('data-category', item.category);
      el.innerHTML = `<span class="waste-emoji">${item.emoji}</span> <span>${item.name}</span>`;

      // Desktop HTML5 drag events
      el.addEventListener('dragstart', handleDragStart);
      el.addEventListener('dragend', handleDragEnd);

      // Mobile Touch events
      setupTouchDrag(el);

      pool.appendChild(el);
    });
  }

  let draggedItem = null;

  function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
  }

  // Setup 4 Target Category Bins
  function setupDropZones() {
    const bins = document.querySelectorAll('.game-drop-bin');
    bins.forEach((bin) => {
      bin.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        bin.classList.add('drag-over');
      });

      bin.addEventListener('dragleave', () => {
        bin.classList.remove('drag-over');
      });

      bin.addEventListener('drop', function (e) {
        e.preventDefault();
        bin.classList.remove('drag-over');

        const itemId = e.dataTransfer.getData('text/plain');
        processDrop(itemId, bin);
      });
    });
  }

  // Touch Drag Polyfill for Smartphones and Tablets
  function setupTouchDrag(el) {
    let touchStartX = 0;
    let touchStartY = 0;
    let clone = null;

    el.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

      draggedItem = el;
      el.classList.add('dragging');

      // Create floating touch clone
      clone = el.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.pointerEvents = 'none';
      clone.style.zIndex = '9999';
      clone.style.opacity = '0.9';
      clone.style.transform = 'scale(1.08)';
      clone.style.left = `${touch.clientX - 40}px`;
      clone.style.top = `${touch.clientY - 20}px`;
      document.body.appendChild(clone);
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (!clone) return;
      const touch = e.touches[0];
      clone.style.left = `${touch.clientX - 40}px`;
      clone.style.top = `${touch.clientY - 20}px`;
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      if (clone) {
        clone.remove();
        clone = null;
      }
      el.classList.remove('dragging');

      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const bin = dropTarget ? dropTarget.closest('.game-drop-bin') : null;

      if (bin) {
        processDrop(el.getAttribute('data-id'), bin);
      }
      draggedItem = null;
    });
  }

  function processDrop(itemId, bin) {
    const item = currentItems.find((i) => i.id === itemId);
    if (!item) return;

    const binCategory = bin.getAttribute('data-category');

    if (item.category === binCategory) {
      // Correct drop!
      streak++;
      const gained = 100 + streak * 25;
      score += gained;
      sortedCount++;

      if (window.oceanAudio) window.oceanAudio.playSuccessSound();
      if (window.showToast) window.showToast(`Correct! +${gained} pts (${item.name})`, 'success');

      // Bin pulse animation
      bin.style.transform = 'scale(1.06)';
      bin.style.borderColor = 'var(--status-safe)';
      setTimeout(() => {
        bin.style.transform = '';
        bin.style.borderColor = '';
      }, 350);

      // Remove item from pool
      currentItems = currentItems.filter((i) => i.id !== itemId);
      renderDraggableItems();
      updateStatsDisplay();

      // Check win condition
      if (sortedCount >= totalItemsCount) {
        setTimeout(handleGameWin, 500);
      }
    } else {
      // Wrong drop!
      streak = 0;
      score = Math.max(0, score - 40);

      if (window.oceanAudio) window.oceanAudio.playErrorSound();
      if (window.showToast) window.showToast(`Incorrect category for ${item.name}! -40 pts`, 'error');

      // Bin error shake
      bin.style.transform = 'translateX(6px)';
      bin.style.borderColor = 'var(--status-danger)';
      setTimeout(() => {
        bin.style.transform = 'translateX(-6px)';
        setTimeout(() => {
          bin.style.transform = '';
          bin.style.borderColor = '';
        }, 150);
      }, 150);

      updateStatsDisplay();
    }
  }

  function updateStatsDisplay() {
    const scoreVal = document.getElementById('game-score-val');
    const streakVal = document.getElementById('game-streak-val');
    const fillBar = document.getElementById('game-progress-fill');

    if (scoreVal) scoreVal.textContent = score;
    if (streakVal) streakVal.textContent = `${streak}x`;

    if (fillBar) {
      const pct = (sortedCount / totalItemsCount) * 100;
      fillBar.style.width = `${pct}%`;
    }
  }

  function handleGameWin() {
    const modal = document.getElementById('game-result-modal');
    const finalScore = document.getElementById('final-score-val');
    if (!modal) return;

    if (finalScore) finalScore.textContent = score;
    modal.classList.add('active');

    // Submit score to SQLite backend API
    try {
      const session = window.getOceanSession ? window.getOceanSession() : null;
      const playerName = session && session.fullName ? session.fullName : 'Ocean Explorer';
      fetch('/api/game/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, score, streak: maxStreak })
      }).catch(() => {});
    } catch (e) {}

    if (window.showToast) {
      window.showToast('Ocean Cleanup Mission Complete! Outstanding work!', 'success');
    }
  }

  function setupRestartButton() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('#game-restart-btn')) {
        resetGame();
      }
    });
  }

  window.initPollutionGame = initPollutionGame;

  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.toLowerCase().includes('explorer')) {
      initPollutionGame();
    }
  });
})();

