/**
 * OCEAN LIFE - ABOUT THE OCEAN LOGIC (js/about.js)
 * Implements:
 * 1. 5 Oceans Interactive Cards with modal popups (Pacific, Atlantic, Indian, Southern, Arctic)
 * 2. Interactive Ocean Depth Explorer (Sunlight, Twilight, Midnight, Abyssal, Hadal zones)
 *    with real-time gauge indicators and creature reveals
 */

(function () {
  'use strict';

  const oceansData = {
    pacific: {
      name: 'Pacific Ocean',
      subtitle: 'The Largest and Deepest Ocean on Earth',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      area: '165,250,000 km²',
      maxDepth: '10,994 m (Challenger Deep)',
      avgDepth: '4,280 m',
      location: 'Bordered by Asia and Australia to the west and the Americas to the east.',
      facts: [
        'Covers more than 30% of the entire Earth’s surface, larger than all of Earth’s land area combined.',
        'Home to the "Ring of Fire", a 40,000 km horseshoe containing 75% of Earth’s active volcanoes.',
        'Contains approximately 25,000 distinct islands, more than all other oceans combined.',
        'Houses the Great Barrier Reef, the largest living structure on the planet visible from space.'
      ],
      creatures: 'Blue Whales, Great White Sharks, Manta Rays, Giant Pacific Octopuses, Sea Turtles, Dugongs',
      characteristics: 'Experiences intense tropical typhoons and monsoons. Drives global climatic phenomena including El Niño and La Niña oscillations.'
    },
    atlantic: {
      name: 'Atlantic Ocean',
      subtitle: 'The Busy Highway of Global Civilization',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      area: '106,460,000 km²',
      maxDepth: '8,376 m (Milwaukee Deep)',
      avgDepth: '3,646 m',
      location: 'Separates Europe and Africa to the east from the Americas to the west.',
      facts: [
        'The second-largest ocean, covering approximately 20% of Earth’s surface.',
        'Bisected longitudinally by the Mid-Atlantic Ridge, the longest underwater mountain range on Earth (over 16,000 km long).',
        'Contains the mysterious Sargasso Sea, the only sea in the world bounded entirely by ocean currents rather than land.',
        'Drives the critical Atlantic Meridional Overturning Circulation (AMOC) which stabilizes European climate.'
      ],
      creatures: 'North Atlantic Right Whales, Orcas, Leatherback Sea Turtles, Atlantic Bluefin Tuna, Humpback Whales',
      characteristics: 'Salinity is relatively high compared to other oceans due to high rates of evaporation and limited freshwater river input relative to its massive volume.'
    },
    indian: {
      name: 'Indian Ocean',
      subtitle: 'The Warmest Ocean on Planet Earth',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      area: '70,560,000 km²',
      maxDepth: '7,290 m (Java Trench)',
      avgDepth: '3,741 m',
      location: 'Bounded by Asia to the north, Africa to the west, and Australia to the east.',
      facts: [
        'The third-largest ocean, accounting for roughly 19.8% of the global water surface.',
        'It is the warmest ocean in the world, which inhibits the growth of phytoplankton in its tropical core.',
        'Its weather patterns are uniquely dominated by dramatic seasonal monsoon wind reversals.',
        'Over 40% of the world’s offshore petroleum production comes from the Indian Ocean basin.'
      ],
      creatures: 'Whale Sharks, Indo-Pacific Bottlenose Dolphins, Dugongs, Sea Snakes, Coelacanths (living fossil fish)',
      characteristics: 'Contains vital trade chokepoints including the Strait of Malacca and the Suez Canal. High sea surface temperatures make its coral reefs especially susceptible to thermal bleaching.'
    },
    southern: {
      name: 'Southern Ocean',
      subtitle: 'The Wild Frigid Realm Encircling Antarctica',
      image: 'https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=1200&q=80',
      area: '20,327,000 km²',
      maxDepth: '7,236 m (South Sandwich Trench)',
      avgDepth: '3,270 m',
      location: 'Completely encircles Antarctica up to 60 degrees South latitude.',
      facts: [
        'Officially recognized as the fifth ocean by the International Hydrographic Organization.',
        'Home to the Antarctic Circumpolar Current, the strongest and largest ocean current on Earth, transporting 130 million m³ of water per second.',
        'Absorbs more than 40% of all human-induced carbon dioxide captured by the world’s oceans.',
        'Despite extreme cold, it is one of the most productive marine ecosystems thanks to upwelling Antarctic Krill swarms.'
      ],
      creatures: 'Emperor Penguins, Leopard Seals, Colossal Squids, Blue Whales, Antarctic Toothfish',
      characteristics: 'Continuous howling winds generate some of the largest rogue waves on the planet. Surface waters freeze into vast expanses of seasonal sea ice pack.'
    },
    arctic: {
      name: 'Arctic Ocean',
      subtitle: 'The Ice-Crowned Roof of the World',
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      area: '14,060,000 km²',
      maxDepth: '5,550 m (Molloy Hole)',
      avgDepth: '1,204 m',
      location: 'Centered around the North Pole, surrounded by Eurasia and North America.',
      facts: [
        'The smallest and shallowest of the five global oceans.',
        'Much of its surface is covered by perennial sea ice, though it is warming at three to four times the global average rate.',
        'Receives massive freshwater inflow from huge Siberian and Canadian rivers, giving it the lowest salinity of all oceans.',
        'Experiences months of continuous polar night during winter and continuous sunlight during summer.'
      ],
      creatures: 'Narwhals, Beluga Whales, Bowhead Whales, Walruses, Ringed Seals, Polar Bears',
      characteristics: 'Crucial global climate regulator. As its white reflective sea ice melts into dark open water, the albedo effect diminishes, accelerating global warming.'
    }
  };

  const depthZonesData = {
    sunlight: {
      name: 'Sunlight Zone',
      scientific: 'Epipelagic Zone',
      range: '0 – 200 meters (0 – 656 ft)',
      light: '100% Full Sunlight',
      temp: '20°C to 28°C (68°F to 82°F)',
      pressure: '1 to 20 atm',
      description: 'The sunlit top layer where photosynthesis occurs. Although it represents less than 5% of the ocean’s total depth, over 90% of all marine life thrives here, including extensive coral reefs, dolphins, sea turtles, and massive schools of fish.',
      creatures: ['Bottlenose Dolphins', 'Sea Turtles', 'Clownfish', 'Staghorn Corals', 'Tuna', 'Whale Sharks']
    },
    twilight: {
      name: 'Twilight Zone',
      scientific: 'Mesopelagic Zone',
      range: '200 – 1,000 meters (656 – 3,280 ft)',
      light: 'Faint Blue Shimmer (<1%)',
      temp: '4°C to 10°C (39°F to 50°F)',
      pressure: '20 to 100 atm',
      description: 'Sunlight rapidly fades into deep cobalt blue. Plants cannot grow here. Animals have evolved gigantic sensitive eyes, upward-facing pupils, and bioluminescence to camouflage themselves against the dim light above (counterillumination).',
      creatures: ['Lanternfish', 'Giant Squid', 'Hatchetfish', 'Bristlemouth', 'Viperfish', 'Sperm Whales (hunting)']
    },
    midnight: {
      name: 'Midnight Zone',
      scientific: 'Bathypelagic Zone',
      range: '1,000 – 4,000 meters (3,280 – 13,120 ft)',
      light: 'Pitch Black (0% Sunlight)',
      temp: 'Constant 4°C (39°F)',
      pressure: '100 to 400 atm',
      description: 'Total darkness except for living light produced by bioluminescent creatures. Crushing hydrostatic pressure prevents humans from visiting without specialized titanium submersibles. Creatures often lack color or are jet black or deep crimson.',
      creatures: ['Anglerfish', 'Gulper Eel', 'Vampire Squid', 'Dumbo Octopus', 'Giant Isopod', 'Bioluminescent Jellyfish']
    },
    abyssal: {
      name: 'Abyssal Zone',
      scientific: 'Abyssopelagic Zone',
      range: '4,000 – 6,000 meters (13,120 – 19,680 ft)',
      light: 'Absolute Darkness',
      temp: 'Near Freezing (1°C to 2°C)',
      pressure: '400 to 600 atm',
      description: 'Derived from the Greek word for "bottomless abyss". Covers more than 60% of the entire ocean floor. The terrain consists of vast abyssal plains covered in thick marine sediment ("marine snow"). Animals have extremely slow metabolisms.',
      creatures: ['Deep-sea Tripod Fish', 'Faceless Cusk', 'Ghost Sharks', 'Sea Pigs (Holothurians)', 'Giant Tube Worms']
    },
    hadal: {
      name: 'Hadal Zone',
      scientific: 'Hadopelagic Zone (Trenches)',
      range: '6,000 – 11,000 meters (19,680 – 36,000 ft)',
      light: 'Zero (Only Flashlights & Bioluminescence)',
      temp: '1°C to 4°C (34°F to 39°F)',
      pressure: 'Up to 1,100 atm (8 tons/sq inch)',
      description: 'Named after Hades, the underworld. Found exclusively in deep tectonic subduction trenches such as the Mariana Trench. Pressure here is equivalent to an elephant standing on your thumb. Yet, bizarre barophilic organisms and snailfish flourish.',
      creatures: ['Mariana Snailfish', 'Supergiant Amphipods', 'Barophilic Xenophyophores', 'Decapoda Prawns']
    }
  };

  function initAboutPage() {
    setupOceanCards();
    setupDepthExplorer();
  }

  // Setup clickable ocean cards and modal dialog
  function setupOceanCards() {
    const cards = document.querySelectorAll('.ocean-card');
    const modalBackdrop = document.getElementById('ocean-modal-backdrop');
    if (!cards.length || !modalBackdrop) return;

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const oceanKey = card.getAttribute('data-ocean');
        const ocean = oceansData[oceanKey];
        if (!ocean) return;

        openOceanModal(ocean);
      });
    });

    // Close button
    const closeBtn = document.getElementById('ocean-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeOceanModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeOceanModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeOceanModal();
    });
  }

  function openOceanModal(ocean) {
    const modal = document.getElementById('ocean-modal-backdrop');
    if (!modal) return;

    document.getElementById('modal-ocean-img').src = ocean.image;
    document.getElementById('modal-ocean-title').textContent = ocean.name;
    document.getElementById('modal-ocean-sub').textContent = ocean.subtitle;
    document.getElementById('modal-ocean-area').textContent = ocean.area;
    document.getElementById('modal-ocean-maxdepth').textContent = ocean.maxDepth;
    document.getElementById('modal-ocean-avgdepth').textContent = ocean.avgDepth;
    document.getElementById('modal-ocean-location').textContent = ocean.location;
    document.getElementById('modal-ocean-creatures').textContent = ocean.creatures;
    document.getElementById('modal-ocean-characteristics').textContent = ocean.characteristics;

    const factsList = document.getElementById('modal-ocean-facts');
    if (factsList) {
      factsList.innerHTML = ocean.facts.map((f) => `<li>${f}</li>`).join('');
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeOceanModal() {
    const modal = document.getElementById('ocean-modal-backdrop');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Setup Ocean Depth Explorer
  function setupDepthExplorer() {
    const navItems = document.querySelectorAll('.depth-nav-item');
    const displayCard = document.getElementById('depth-display-card');
    if (!navItems.length || !displayCard) return;

    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        navItems.forEach((n) => n.classList.remove('active'));
        item.classList.add('active');

        const zoneKey = item.getAttribute('data-zone');
        const zone = depthZonesData[zoneKey];
        if (!zone) return;

        renderDepthZone(zoneKey, zone);
      });
    });
  }

  function renderDepthZone(zoneKey, zone) {
    const displayCard = document.getElementById('depth-display-card');
    if (!displayCard) return;

    // Trigger visual depth styling
    displayCard.setAttribute('data-zone', zoneKey);

    document.getElementById('depth-zone-title').textContent = zone.name;
    document.getElementById('depth-scientific-name').textContent = zone.scientific;
    document.getElementById('depth-range-gauge').textContent = zone.range;
    document.getElementById('depth-light-gauge').textContent = zone.light;
    document.getElementById('depth-pressure-gauge').textContent = zone.pressure;
    document.getElementById('depth-temp-gauge').textContent = zone.temp;
    document.getElementById('depth-card-desc').textContent = zone.description;

    const tagsContainer = document.getElementById('depth-creatures-tags');
    if (tagsContainer) {
      tagsContainer.innerHTML = zone.creatures
        .map((c) => `<span class="creature-tag">${c}</span>`)
        .join('');
    }
  }

  window.initAboutPage = initAboutPage;

  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.toLowerCase().includes('about')) {
      initAboutPage();
    }
  });
})();

