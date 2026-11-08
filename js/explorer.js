/**
 * OCEAN LIFE - EXPLORER & SAVE THE OCEAN LOGIC (js/explorer.js)
 * Implements:
 * 1. Interactive Ocean Environments switcher (Coral Reefs, Deep Sea, Open Ocean, Polar Ocean, Caves)
 * 2. Before-and-After Pollution Comparison Slider (mouse & touch draggable)
 * 3. Save The Ocean Environmental Pledge Checklist with LocalStorage persistence
 */

(function () {
  'use strict';

  const environmentsData = {
    coral: {
      title: 'Coral Reefs (Rainforests of the Sea)',
      image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=80',
      depth: '0 – 50 meters',
      temp: '23°C – 29°C',
      salinity: '34 – 37 PSU',
      desc: 'Teeming with over 25% of all oceanic life despite covering less than 0.1% of the seafloor. Corals build calcium carbonate structures through mutualistic symbiosis with photosynthetic zooxanthellae algae.',
      creatures: 'Clownfish, Parrotfish, Hawksbill Sea Turtles, Moray Eels, Reef Sharks, Sea Anemones'
    },
    deepsea: {
      title: 'The Deep Sea (The Abyssal Realm)',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      depth: '1,000 – 6,000 meters',
      temp: '1°C – 4°C',
      salinity: '35 PSU',
      desc: 'The largest habitat on Earth, enveloped in perpetual darkness and crushing hydrostatic pressure. Organisms here survive without sunlight, relying on hydrothermal vent minerals or marine snow falling from above.',
      creatures: 'Anglerfish, Giant Squids, Dumbo Octopuses, Hydrothermal Vent Tube Worms, Viperfish'
    },
    openocean: {
      title: 'The Open Ocean (Pelagic Blue Waters)',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      depth: '0 – 4,000 meters',
      temp: 'Variable by latitude (10°C – 26°C)',
      salinity: '35.5 PSU',
      desc: 'The vast marine desert where massive migratory animals travel thousands of nautical miles across planetary currents. Phytoplankton here generate over half of the oxygen in Earth’s atmosphere.',
      creatures: 'Blue Whales, Great White Sharks, Manta Rays, Ocean Sunfish (Mola mola), Bluefin Tuna, Dolphins'
    },
    polar: {
      title: 'The Polar Oceans (Arctic & Southern Ice)',
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      depth: '0 – 4,000 meters',
      temp: '-1.8°C – 4°C',
      salinity: '30 – 34 PSU',
      desc: 'Frigid, oxygen-rich waters capped by sea ice. Seasonal sea-ice melting fuels explosive spring phytoplankton blooms that support trillions of Antarctic krill, anchoring entire polar food webs.',
      creatures: 'Emperor Penguins, Narwhals, Belugas, Leopard Seals, Walruses, Antarctic Krill'
    },
    caves: {
      title: 'Underwater Caves & Blue Holes',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      depth: '10 – 150 meters',
      temp: '22°C – 26°C',
      salinity: 'Stratified freshwater & saltwater (halocline)',
      desc: 'Submerged limestone sinkholes and subterranean cavern systems such as the Great Blue Hole of Belize. These isolated environments host ancient relict species that have remained unchanged for millennia.',
      creatures: 'Blind Cave Fish, Cave Isopods, Caribbean Reef Sharks, Stalactite Microbes'
    }
  };

  function initExplorerPage() {
    setupEnvironmentSwitcher();
    setupComparisonSlider();
    setupPledgeChallenge();
  }

  // 1. Environment Switcher
  function setupEnvironmentSwitcher() {
    const tabBtns = document.querySelectorAll('.env-tab-btn');
    if (!tabBtns.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const envKey = btn.getAttribute('data-env');
        const env = environmentsData[envKey];
        if (!env) return;

        const img = document.getElementById('env-display-img');
        const title = document.getElementById('env-title');
        const depth = document.getElementById('env-depth-badge');
        const temp = document.getElementById('env-temp-badge');
        const salinity = document.getElementById('env-salinity-badge');
        const desc = document.getElementById('env-desc');
        const creatures = document.getElementById('env-creatures');

        if (img) img.src = env.image;
        if (title) title.textContent = env.title;
        if (depth) depth.textContent = `Depth: ${env.depth}`;
        if (temp) temp.textContent = `Temp: ${env.temp}`;
        if (salinity) salinity.textContent = `Salinity: ${env.salinity}`;
        if (desc) desc.textContent = env.desc;
        if (creatures) creatures.textContent = env.creatures;
      });
    });
  }

  // 2. Before-and-After Comparison Slider
  function setupComparisonSlider() {
    const container = document.getElementById('comparison-slider-container');
    const handle = document.getElementById('comparison-slider-handle');
    const afterLayer = document.getElementById('comparison-after-layer');

    if (!container || !handle || !afterLayer) return;

    let isSliding = false;

    function setSliderPosition(clientX) {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      handle.style.left = `${percentage}%`;
      afterLayer.style.width = `${percentage}%`;
    }

    // Mouse events
    handle.addEventListener('mousedown', () => (isSliding = true));
    window.addEventListener('mouseup', () => (isSliding = false));
    window.addEventListener('mousemove', (e) => {
      if (!isSliding) return;
      setSliderPosition(e.clientX);
    });

    // Touch events for mobile/tablet
    handle.addEventListener('touchstart', () => (isSliding = true), { passive: true });
    window.addEventListener('touchend', () => (isSliding = false));
    window.addEventListener('touchmove', (e) => {
      if (!isSliding || !e.touches[0]) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    // Click anywhere on container to move handle
    container.addEventListener('click', (e) => {
      setSliderPosition(e.clientX);
    });
  }

  // 3. Save The Ocean Pledge Checklist & LocalStorage
  const PLEDGE_STORAGE_KEY = 'ocean_life_pledges';

  function setupPledgeChallenge() {
    const checklistCards = document.querySelectorAll('.pledge-checkbox-card');
    if (!checklistCards.length) return;

    // Load saved state from LocalStorage
    let savedPledges = [];
    try {
      const raw = localStorage.getItem(PLEDGE_STORAGE_KEY);
      if (raw) savedPledges = JSON.parse(raw);
    } catch (e) {}

    checklistCards.forEach((card) => {
      const pledgeId = card.getAttribute('data-pledge-id');
      if (savedPledges.includes(pledgeId)) {
        card.classList.add('checked');
      }

      card.addEventListener('click', () => {
        card.classList.toggle('checked');
        savePledgesState();
        updatePledgeMeter();
      });
    });

    updatePledgeMeter();
  }

  function savePledgesState() {
    const checkedCards = document.querySelectorAll('.pledge-checkbox-card.checked');
    const ids = Array.from(checkedCards).map((c) => c.getAttribute('data-pledge-id'));
    try {
      localStorage.setItem(PLEDGE_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {}

    // Synchronize pledges with SQLite database backend
    try {
      const session = window.getOceanSession ? window.getOceanSession() : null;
      fetch('/api/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pledgeKey: ids.join(','),
          userId: session ? session.userId : 'anonymous',
          userEmail: session ? session.email : 'anonymous'
        })
      }).catch(() => {});
    } catch (e) {}
  }

  function updatePledgeMeter() {
    const total = document.querySelectorAll('.pledge-checkbox-card').length;
    const completed = document.querySelectorAll('.pledge-checkbox-card.checked').length;
    const percent = Math.round((completed / total) * 100);

    const fillBar = document.getElementById('pledge-meter-fill');
    const percentLabel = document.getElementById('pledge-percent-label');
    const rankBadge = document.getElementById('pledge-rank-badge');

    if (fillBar) fillBar.style.width = `${percent}%`;
    if (percentLabel) percentLabel.textContent = `${completed}/${total} Pledges (${percent}%)`;

    // Dynamic Guardian Rank
    if (rankBadge) {
      if (percent === 100) {
        rankBadge.textContent = '🌟 Supreme Ocean Champion';
        rankBadge.style.color = 'var(--status-safe)';
      } else if (percent >= 66) {
        rankBadge.textContent = '🛡️ Deep Sea Guardian';
        rankBadge.style.color = 'var(--accent-cyan)';
      } else if (percent >= 33) {
        rankBadge.textContent = '🪸 Coral Reef Sentinel';
        rankBadge.style.color = 'var(--accent-turquoise)';
      } else {
        rankBadge.textContent = '🌊 Coastal Observer';
        rankBadge.style.color = 'var(--text-muted)';
      }
    }
  }

  window.initExplorerPage = initExplorerPage;

  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.toLowerCase().includes('explorer')) {
      initExplorerPage();
    }
  });
})();

