/**
 * OCEAN LIFE - MARINE LIFE GALLERY & SEARCH SYSTEM (js/marine.js)
 * Implements:
 * 1. Data store for 12 marine species with scientific classifications
 * 2. Instant real-time search by name, scientific name & description
 * 3. Category filtering (All, Fish, Mammals, Reptiles, Invertebrates)
 * 4. Asynchronous live iNaturalist sightings counter badge fetch
 * 5. Dynamic grid rendering with deep links to dedicated details pages (/animals/*.html)
 */

(function () {
  'use strict';

  const marineSpecies = [
    {
      id: 'clownfish',
      name: 'Clownfish',
      scientificName: 'Amphiprion ocellaris',
      category: 'fish',
      status: 'Least Concern',
      statusClass: 'badge-safe',
      image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80',
      description: 'Famous for their symbiotic partnership with sea anemones, clownfish are immune to the anemone’s stinging tentacles due to a special mucus coating.',
      detailUrl: 'animals/clownfish.html'
    },
    {
      id: 'blue-whale',
      name: 'Blue Whale',
      scientificName: 'Balaenoptera musculus',
      category: 'mammals',
      status: 'Endangered',
      statusClass: 'badge-danger',
      image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80',
      description: 'The largest animal ever known to have lived on Earth, reaching lengths of up to 30 meters (98 ft) and weights exceeding 190 metric tons.',
      detailUrl: 'animals/blue-whale.html'
    },
    {
      id: 'shark',
      name: 'Great White Shark',
      scientificName: 'Carcharodon carcharias',
      category: 'fish',
      status: 'Vulnerable',
      statusClass: 'badge-warning',
      image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80',
      description: 'An apex predator possessing acute sensory organs including the ampullae of Lorenzini, capable of detecting minute electromagnetic fields.',
      detailUrl: 'animals/shark.html'
    },
    {
      id: 'turtle',
      name: 'Green Sea Turtle',
      scientificName: 'Chelonia mydas',
      category: 'reptiles',
      status: 'Endangered',
      statusClass: 'badge-danger',
      image: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient marine reptiles that have navigated oceanic currents for over 100 million years, returning thousands of miles to nest on their natal beaches.',
      detailUrl: 'animals/turtle.html'
    },
    {
      id: 'dolphin',
      name: 'Bottlenose Dolphin',
      scientificName: 'Tursiops truncatus',
      category: 'mammals',
      status: 'Least Concern',
      statusClass: 'badge-safe',
      image: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=800&q=80',
      description: 'Highly intelligent and social cetaceans capable of sophisticated echolocation, self-awareness, vocal imitation, and complex hunting strategies.',
      detailUrl: 'animals/dolphin.html'
    },
    {
      id: 'octopus',
      name: 'Giant Pacific Octopus',
      scientificName: 'Enteroctopus dofleini',
      category: 'invertebrates',
      status: 'Vulnerable',
      statusClass: 'badge-warning',
      image: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=800&q=80',
      description: 'Master of camouflage with three hearts, blue hemocyanin blood, and nine brains—one central brain and autonomous mini-brains in each arm.',
      detailUrl: 'animals/octopus.html'
    },
    {
      id: 'jellyfish',
      name: 'Moon Jellyfish',
      scientificName: 'Aurelia aurita',
      category: 'invertebrates',
      status: 'Least Concern',
      statusClass: 'badge-safe',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      description: 'Translucent gelatinous creatures composed of 95% water that drift effortlessly on ocean currents, using rhythmic bell pulses to capture plankton.',
      detailUrl: 'animals/jellyfish.html'
    },
    {
      id: 'seahorse',
      name: 'Pacific Seahorse',
      scientificName: 'Hippocampus ingens',
      category: 'fish',
      status: 'Vulnerable',
      statusClass: 'badge-warning',
      image: 'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?auto=format&fit=crop&w=800&q=80',
      description: 'Remarkable teleost fish where males carry fertilized eggs in a brood pouch and give birth. They anchor themselves to eelgrass with prehensile tails.',
      detailUrl: 'animals/seahorse.html'
    },
    {
      id: 'manta-ray',
      name: 'Giant Manta Ray',
      scientificName: 'Mobula birostris',
      category: 'fish',
      status: 'Endangered',
      statusClass: 'badge-danger',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
      description: 'Gentle giants with wingspans reaching up to 7 meters (23 ft) and the highest brain-to-body mass ratio of all cold-blooded fish.',
      detailUrl: 'animals/manta-ray.html'
    },
    {
      id: 'lionfish',
      name: 'Red Lionfish',
      scientificName: 'Pterois volitans',
      category: 'fish',
      status: 'Least Concern',
      statusClass: 'badge-safe',
      image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
      description: 'Striking predatory fish characterized by fan-like pectoral fins and venomous dorsal spines, native to the Indo-Pacific but invasive in the Atlantic.',
      detailUrl: 'animals/lionfish.html'
    },
    {
      id: 'starfish',
      name: 'Ochre Sea Star',
      scientificName: 'Pisaster ochraceus',
      category: 'invertebrates',
      status: 'Least Concern',
      statusClass: 'badge-safe',
      image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80',
      description: 'Keystone predator of intertidal zones capable of regenerating severed arms and everting its stomach outside its body to digest prey externally.',
      detailUrl: 'animals/starfish.html'
    },
    {
      id: 'coral',
      name: 'Staghorn Coral',
      scientificName: 'Acropora cervicornis',
      category: 'invertebrates',
      status: 'Critically Endangered',
      statusClass: 'badge-danger',
      image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
      description: 'Foundational branching stony corals that build intricate 3D reef frameworks, supporting roughly 25% of all marine biodiversity worldwide.',
      detailUrl: 'animals/coral.html'
    }
  ];

  let currentCategory = 'all';
  let searchQuery = '';

  function initMarinePage() {
    renderSpeciesGrid();
    setupSearch();
    setupFilters();
    updateCategoryCounts();
  }

  function setupSearch() {
    const searchInput = document.getElementById('marine-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderSpeciesGrid();
    });
  }

  function setupFilters() {
    const pills = document.querySelectorAll('.filter-pill');
    if (!pills.length) return;

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-category');
        renderSpeciesGrid();
      });
    });
  }

  function updateCategoryCounts() {
    const counts = { all: marineSpecies.length, fish: 0, mammals: 0, reptiles: 0, invertebrates: 0 };
    marineSpecies.forEach((s) => {
      if (counts[s.category] !== undefined) counts[s.category]++;
    });

    for (let cat in counts) {
      const el = document.getElementById(`count-${cat}`);
      if (el) el.textContent = counts[cat];
    }
  }

  function renderSpeciesGrid() {
    const grid = document.getElementById('marine-animals-grid');
    if (!grid) return;

    const filtered = marineSpecies.filter((item) => {
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery) ||
        item.scientificName.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results-state">
          <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:#fff; margin-bottom:0.5rem;">No marine species found</h3>
          <p style="color:var(--text-muted);">Try adjusting your search query or switching category filters.</p>
        </div>
      `;
      return;
    }

    const isAr = document.documentElement.getAttribute('lang') === 'ar';
    const viewDetailsLabel = isAr ? 'عرض التفاصيل' : 'View Details';
    const liveRecordsLabel = isAr ? 'السجلات الحية: جاري فحص iNaturalist...' : 'Live records: Checking iNaturalist...';

    const speciesName = (sp) => (isAr && sp.nameAr ? sp.nameAr : sp.name);
    const speciesDesc = (sp) => (isAr && sp.descriptionAr ? sp.descriptionAr : sp.description);

    grid.innerHTML = filtered
      .map(
        (sp) => `
        <article class="marine-card" data-species-id="${sp.id}">
          <div class="marine-card-image-wrap">
            <img src="${sp.image}" alt="${sp.name}" loading="lazy" />
            <div class="marine-card-overlay"></div>
            <div class="marine-card-badges">
              <span class="badge badge-cyan">${isAr && sp.categoryAr ? sp.categoryAr : sp.category}</span>
              <span class="badge ${sp.statusClass}">${sp.status}</span>
            </div>
          </div>
          <div class="marine-card-body">
            <div class="marine-card-header">
              <h3 class="marine-animal-name">${speciesName(sp)}</h3>
              <p class="marine-scientific-name">${sp.scientificName}</p>
            </div>
            <p class="marine-animal-desc">${speciesDesc(sp)}</p>
            
            <div class="marine-live-api-badge" id="sighting-badge-${sp.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
              </svg>
              <span>${liveRecordsLabel}</span>
            </div>

            <div class="marine-card-action">
              <a href="${sp.detailUrl}" class="btn btn-primary btn-sm">
                <span>${viewDetailsLabel}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </article>
      `
      )
      .join('');

    // Asynchronously fetch live observation records from iNaturalist
    loadLiveSightingsCounts(filtered);
  }

  // Fetch real count for each visible animal
  async function loadLiveSightingsCounts(speciesList) {
    if (!window.oceanAPI) return;

    for (let sp of speciesList) {
      try {
        const badge = document.getElementById(`sighting-badge-${sp.id}`);
        if (!badge) continue;

        const observations = await window.oceanAPI.fetchRecentSightings(sp.scientificName, 2);
        if (observations && observations.length > 0) {
          badge.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Verified Sighting: ${observations[0].place.split(',')[0]}</span>
          `;
        }
      } catch (e) {}
    }
  }

  window.marineSpecies = marineSpecies;
  window.initMarinePage = initMarinePage;

  window.addEventListener('ocean:languageChanged', () => {
    if (document.getElementById('marine-animals-grid')) {
      renderSpeciesGrid();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.toLowerCase().includes('marine')) {
      initMarinePage();
    }
  });
})();

