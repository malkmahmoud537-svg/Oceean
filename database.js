/**
 * OCEAN LIFE - DATABASE SERVICE (database.js)
 * Persistent SQLite Database Engine powered by Node.js native `node:sqlite`
 * 
 * Tables:
 * - users: Authentication, password hashes, timestamps
 * - species: Marine life catalog with English & Arabic translations
 * - pledges: Conservation commitments & community statistics
 * - game_scores: Ocean cleanup mission scores & leaderboard
 * - contact_messages: Inquiries and environmental feedback
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'ocean.sqlite');

class OceanDatabase {
  constructor() {
    this.db = new DatabaseSync(DB_PATH);
    this.initTables();
    this.seedInitialData();
  }

  initTables() {
    // 1. Users Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        role TEXT DEFAULT 'explorer',
        createdAt TEXT NOT NULL
      );
    `);

    // 2. Species Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS species (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        nameAr TEXT NOT NULL,
        scientificName TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        statusClass TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        descriptionAr TEXT NOT NULL,
        detailUrl TEXT NOT NULL,
        habitat TEXT,
        diet TEXT,
        lifespan TEXT
      );
    `);

    // 3. Conservation Pledges Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pledges (
        id TEXT PRIMARY KEY,
        userId TEXT,
        userEmail TEXT,
        pledgeKey TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // 4. Game Scores / Leaderboard Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS game_scores (
        id TEXT PRIMARY KEY,
        playerName TEXT NOT NULL,
        score INTEGER NOT NULL,
        streak INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // 5. Contact / Feedback Messages Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
  }

  seedInitialData() {
    // Check if species table is empty
    const countSpecies = this.db.prepare('SELECT COUNT(*) as cnt FROM species').get();
    if (countSpecies.cnt === 0) {
      console.log('🌊 Seeding Marine Species database...');
      const insert = this.db.prepare(`
        INSERT INTO species (id, name, nameAr, scientificName, category, status, statusClass, image, description, descriptionAr, detailUrl, habitat, diet, lifespan)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const initialSpecies = [
        [
          'clownfish',
          'Clownfish',
          'سمكة المهرج',
          'Amphiprion ocellaris',
          'fish',
          'Least Concern',
          'badge-safe',
          'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80',
          'Famous for their symbiotic partnership with sea anemones, clownfish are immune to the anemone’s stinging tentacles due to a special mucus coating.',
          'تشتهر بتعايشها التكافلي مع شقائق النعمان البحرية، وتتمتع بحصانة ضد لسعاتها بفضل طبقة مخاطية واقية.',
          'animals/clownfish.html',
          'Tropical Coral Reefs & Lagoons',
          'Zooplankton, Algae & Tentacle Parasites',
          '6 – 10 years'
        ],
        [
          'blue-whale',
          'Blue Whale',
          'الحوت الأزرق',
          'Balaenoptera musculus',
          'mammals',
          'Endangered',
          'badge-danger',
          'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80',
          'The largest animal ever known to have lived on Earth, reaching lengths of up to 30 meters and weights exceeding 190 metric tons.',
          'أضخم كائن حي عُرف على وجه الأرض على الإطلاق، يصل طوله إلى 30 متراً ووزنه يتجاوز 190 طناً.',
          'animals/blue-whale.html',
          'Open Oceans worldwide (Pelagic & Polar)',
          'Krill (up to 4 tons per day)',
          '80 – 90 years'
        ],
        [
          'shark',
          'Great White Shark',
          'القرش الأبيض الكبير',
          'Carcharodon carcharias',
          'fish',
          'Vulnerable',
          'badge-warning',
          'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80',
          'An apex predator possessing acute sensory organs including the ampullae of Lorenzini, capable of detecting minute electromagnetic fields.',
          'مفترس بحري قمة يتميز بحواس فائقة تشمل حويصلات لورنزيني القادرة على رصد أدق المجالات الكهرومغناطيسية.',
          'animals/shark.html',
          'Coastal & Offshore Temperate Waters',
          'Seals, Sea Lions, Tuna & Marine Mammals',
          '70+ years'
        ],
        [
          'turtle',
          'Green Sea Turtle',
          'السلحفاة البحرية الخضراء',
          'Chelonia mydas',
          'reptiles',
          'Endangered',
          'badge-danger',
          'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80',
          'Ancient marine reptiles that have navigated oceanic currents for over 100 million years, returning thousands of miles to nest on their natal beaches.',
          'زواحف بحرية قديمة تجوب التيارات المحيطية منذ أكثر من 100 مليون عام، وتسافر آلاف الأميال للتعشيش في مسقط رأسها.',
          'animals/turtle.html',
          'Tropical & Subtropical Coastal Waters',
          'Seagrasses & Marine Algae (Herbivorous adults)',
          '60 – 70 years'
        ],
        [
          'dolphin',
          'Bottlenose Dolphin',
          'الدلفين الشائع قاروري الأنف',
          'Tursiops truncatus',
          'mammals',
          'Least Concern',
          'badge-safe',
          'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=800&q=80',
          'Renowned for extraordinary intelligence, complex social pods, and sophisticated echolocation sonar used for communication and hunting.',
          'يشتهر بذكائه الاستثنائي، وروابطه الاجتماعية المعقدة، وجهاز السونار البيولوجي المتطور لتحديد المواقع والتواصل.',
          'animals/dolphin.html',
          'Warm-temperate & Tropical Oceans',
          'Squid, Crustaceans & Coastal Fish',
          '40 – 50 years'
        ],
        [
          'octopus',
          'Giant Pacific Octopus',
          'أخطبوط المحيط الهادئ العملاق',
          'Enteroctopus dofleini',
          'invertebrates',
          'Least Concern',
          'badge-safe',
          'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=800&q=80',
          'The largest octopus species in the world with three hearts, blue hemocyanin blood, and remarkable camouflage abilities through chromatic skin cells.',
          'أكبر أنواع الأخطبوط في العالم، يمتلك ثلاثة قلوب ودماً أزرق وقدرة مذهلة على التخفي وتغيير لون جلده.',
          'animals/octopus.html',
          'Cold Subtidal Rocky Reefs & Caves',
          'Crabs, Clams, Lobsters & Small Fish',
          '3 – 5 years'
        ],
        [
          'jellyfish',
          'Moon Jellyfish',
          'قنديل قمر البحر',
          'Aurelia aurita',
          'invertebrates',
          'Least Concern',
          'badge-safe',
          'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80',
          'Translucent pelagic cnidarian with 95% water composition and pulsing umbrella bells that create gentle vortices to capture microscopic plankton.',
          'كائن بحري رخوي شفاف يمثل الماء 95% من وزنه، ينبض بانتظام لتوليد دوامات مائية تسحب العوالق المجهرية.',
          'animals/jellyfish.html',
          'Coastal waters, Harbors & Inshore Bays',
          'Microscopic Zooplankton & Fish Larvae',
          '1 – 2 years'
        ],
        [
          'seahorse',
          'Hippocampus Seahorse',
          'فرس البحر المتوج',
          'Hippocampus kuda',
          'fish',
          'Vulnerable',
          'badge-warning',
          'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
          'Unique marine teleost with an equine profile, prehensile tail, and a rare biological adaptation where males carry and hatch fertilised eggs.',
          'سمكة بحرية فريدة برأس يشبه الخيل وذيل ماسك، وتتميز بنظام تكاثر استثنائي يحمل فيه الذكر البيض حتى يفقس.',
          'animals/seahorse.html',
          'Sheltered Seagrass Meadows & Mangroves',
          'Tiny Mysid Shrimps & Amphipods',
          '1 – 5 years'
        ],
        [
          'manta-ray',
          'Giant Oceanic Manta Ray',
          'مانتا راي المحيطية العملاقة',
          'Mobula birostris',
          'fish',
          'Endangered',
          'badge-danger',
          'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
          'Gentle giants with wingspans reaching up to 7 meters and the highest brain-to-body mass ratio of all cold-blooded fish.',
          'عملاق محيطي وديع بمسافة جناحية تصل إلى 7 أمتار، ويملك أعلى نسبة لكتلة الدماغ مقارنة بالجسم بين الأسماك ذوات الدم البارد.',
          'animals/manta-ray.html',
          'Tropical, Subtropical & Temperate Waters',
          'Filter-fed Zooplankton & Small Fish',
          '40+ years'
        ],
        [
          'lionfish',
          'Red Lionfish',
          'سمكة الديك الرومي المخططة',
          'Pterois volitans',
          'fish',
          'Least Concern',
          'badge-safe',
          'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
          'Striking predatory fish characterized by fan-like pectoral fins and venomous dorsal spines, native to the Indo-Pacific.',
          'سمكة مفترسة ساحرة تتميز بزعانف مروحية وأشواك ظهرية سامة، تستوطن مياه المحيطين الهندي والهادئ.',
          'animals/lionfish.html',
          'Coral & Rocky Reefs (1 – 50 m depth)',
          'Small Reef Fish & Invertebrates',
          '10 – 15 years'
        ],
        [
          'starfish',
          'Ochre Sea Star',
          'نجم البحر المغري',
          'Pisaster ochraceus',
          'invertebrates',
          'Least Concern',
          'badge-safe',
          'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80',
          'Keystone predator of intertidal zones capable of regenerating severed arms and everting its stomach outside its body to digest prey.',
          'مفترس رئيسي في المناطق المدية قادر على تجديد أذرعه المبتورة وإخراج معدته خارج جسمه لهضم الفريسة خارجياً.',
          'animals/starfish.html',
          'Rocky Intertidal & Shallow Subtidal Shores',
          'Mussels, Barnacles, Snails & Limpets',
          'Up to 20 years'
        ],
        [
          'coral',
          'Staghorn Coral',
          'مرجان قرن الوعل',
          'Acropora cervicornis',
          'invertebrates',
          'Critically Endangered',
          'badge-danger',
          'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
          'Foundational branching stony corals that build intricate 3D reef frameworks, supporting roughly 25% of all marine biodiversity.',
          'مرجان صخري متفرع يبني هياكل ثلاثية الأبعاد تدعم نحو 25% من كامل التنوع البيولوجي في المحيطات.',
          'animals/coral.html',
          'Clear, Shallow Tropical Waters (1 – 30 m)',
          'Photosynthetic Zooxanthellae & Plankton',
          'Centuries (Colony structures)'
        ]
      ];

      for (const sp of initialSpecies) {
        insert.run(...sp);
      }
      console.log('✅ 12 Marine Species seeded successfully.');
    }

    // Seed default demo explorer user if empty
    const countUsers = this.db.prepare('SELECT COUNT(*) as cnt FROM users').get();
    if (countUsers.cnt === 0) {
      console.log('👤 Seeding default Explorer user...');
      // SHA-256 for 'OceanExplorer2026!'
      const demoHash = '3f9f7a8b34f89d31154c15392095689531aa967000bf7123aa24eb7909c25fba';
      this.db.prepare(`
        INSERT INTO users (id, fullName, email, passwordHash, role, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('usr_demo_1', 'Captain Jacques Cousteau', 'explorer@oceanlife.org', demoHash, 'admin', new Date().toISOString());
    }

    // Seed sample high scores
    const countScores = this.db.prepare('SELECT COUNT(*) as cnt FROM game_scores').get();
    if (countScores.cnt === 0) {
      const insertScore = this.db.prepare(`
        INSERT INTO game_scores (id, playerName, score, streak, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertScore.run('score_1', 'Marine Guardian', 240, 8, new Date().toISOString());
      insertScore.run('score_2', 'Eco Diver', 190, 6, new Date().toISOString());
      insertScore.run('score_3', 'Aqua Scout', 160, 5, new Date().toISOString());
    }
  }

  // === USER AUTH METHODS ===
  getUserByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  }

  getUserById(id) {
    return this.db.prepare('SELECT id, fullName, email, role, createdAt FROM users WHERE id = ?').get(id);
  }

  createUser(id, fullName, email, passwordHash) {
    const stmt = this.db.prepare(`
      INSERT INTO users (id, fullName, email, passwordHash, role, createdAt)
      VALUES (?, ?, ?, ?, 'explorer', ?)
    `);
    stmt.run(id, fullName, email, passwordHash, new Date().toISOString());
    return this.getUserById(id);
  }

  // === SPECIES METHODS ===
  getAllSpecies(category = null, search = null) {
    let sql = 'SELECT * FROM species';
    const params = [];
    const conditions = [];

    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search && search.trim() !== '') {
      conditions.push('(LOWER(name) LIKE ? OR LOWER(nameAr) LIKE ? OR LOWER(scientificName) LIKE ? OR LOWER(description) LIKE ?)');
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term, term);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    return this.db.prepare(sql).all(...params);
  }

  getSpeciesById(id) {
    return this.db.prepare('SELECT * FROM species WHERE id = ?').get(id);
  }

  // === CONSERVATION PLEDGES METHODS ===
  savePledge(userId, userEmail, pledgeKey) {
    const id = 'pledge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    this.db.prepare(`
      INSERT INTO pledges (id, userId, userEmail, pledgeKey, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId || 'anonymous', userEmail || 'anonymous', pledgeKey, new Date().toISOString());
    return { success: true, id };
  }

  getPledgeStats() {
    const totalPledges = this.db.prepare('SELECT COUNT(*) as total FROM pledges').get();
    const byKey = this.db.prepare(`
      SELECT pledgeKey, COUNT(*) as count 
      FROM pledges 
      GROUP BY pledgeKey
    `).all();
    return {
      total: totalPledges.total + 1420, // baseline community counter + live
      breakdown: byKey
    };
  }

  // === GAME SCORES / LEADERBOARD METHODS ===
  saveGameScore(playerName, score, streak) {
    const id = 'score_' + Date.now();
    this.db.prepare(`
      INSERT INTO game_scores (id, playerName, score, streak, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, playerName || 'Anonymous Diver', Number(score) || 0, Number(streak) || 0, new Date().toISOString());
    return { success: true, id };
  }

  getLeaderboard(limit = 10) {
    return this.db.prepare(`
      SELECT playerName, score, streak, createdAt 
      FROM game_scores 
      ORDER BY score DESC 
      LIMIT ?
    `).all(limit);
  }

  // === CONTACT / FEEDBACK METHODS ===
  saveContactMessage(name, email, message) {
    const id = 'msg_' + Date.now();
    this.db.prepare(`
      INSERT INTO contact_messages (id, name, email, message, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name, email, message, new Date().toISOString());
    return { success: true, id };
  }
}

module.exports = new OceanDatabase();

