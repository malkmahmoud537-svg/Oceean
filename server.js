/**
 * OCEAN LIFE - FULL-STACK BACKEND SERVER (server.js)
 * Dual-Mode Engine: Runs seamlessly with Express OR Native Node.js (Zero Dependencies!)
 * 
 * Capabilities:
 * - Real user authentication with SQLite database & cryptographic validation
 * - Dynamic marine species API with bilingual search (English/Arabic)
 * - Ocean Guardian pledge persistence & live statistics
 * - Clean Ocean Mission game leaderboard API
 * - Serves frontend SPA and multi-page static site
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const db = require('./database');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Check if Express is available; if not, use built-in Node HTTP
let useExpress = false;
try {
  require.resolve('express');
  useExpress = true;
} catch (e) {
  useExpress = false;
}

if (useExpress) {
  startExpressServer();
} else {
  startNativeHttpServer();
}

// ==============================================================================
// 1. EXPRESS IMPLEMENTATION (When npm install was run)
// ==============================================================================
function startExpressServer() {
  const express = require('express');
  const cors = require('cors');
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(PUBLIC_DIR));

  // Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      appName: 'OCEAN LIFE API',
      engine: 'Express.js',
      database: 'SQLite (ocean.sqlite)',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { fullName, email, passwordHash } = req.body;
      if (!fullName || !email || !passwordHash) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      const existing = db.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const user = db.createUser(userId, fullName.trim(), email.trim(), passwordHash);
      res.status(201).json({ message: 'Account created successfully!', user });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, passwordHash } = req.body;
      if (!email || !passwordHash) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const user = db.getUserByEmail(email);
      if (!user || user.passwordHash !== passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      res.json({ message: 'Login successful!', user: { id: user.id, fullName: user.fullName, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  // Species
  app.get('/api/species', (req, res) => {
    const { category, search } = req.query;
    const species = db.getAllSpecies(category, search);
    res.json({ count: species.length, species });
  });

  app.get('/api/species/:id', (req, res) => {
    const sp = db.getSpeciesById(req.params.id);
    if (!sp) return res.status(404).json({ error: 'Species not found.' });
    res.json(sp);
  });

  // Pledges
  app.get('/api/pledges/stats', (req, res) => {
    res.json(db.getPledgeStats());
  });

  app.post('/api/pledges', (req, res) => {
    const { userId, userEmail, pledgeKey } = req.body;
    res.status(201).json(db.savePledge(userId, userEmail, pledgeKey));
  });

  // Game Leaderboard
  app.get('/api/game/leaderboard', (req, res) => {
    res.json({ leaderboard: db.getLeaderboard(Number(req.query.limit) || 10) });
  });

  app.post('/api/game/score', (req, res) => {
    const { playerName, score, streak } = req.body;
    res.status(201).json(db.saveGameScore(playerName, score, streak));
  });

  // Contact
  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    res.status(201).json(db.saveContactMessage(name, email, message));
  });

  // Telemetry
  app.get('/api/telemetry', (req, res) => {
    res.json({
      station: 'Global Pelagic Sentinel-6',
      surfaceTemperature: '18.4°C',
      averageWaveHeight: '2.1 m',
      meanSalinity: '35.1 PSU',
      timestamp: new Date().toISOString()
    });
  });

  app.listen(PORT, () => printBanner('Express.js (Full Engine)'));
}

// ==============================================================================
// 2. NATIVE ZERO-DEPENDENCY HTTP IMPLEMENTATION (Runs without npm install!)
// ==============================================================================
function startNativeHttpServer() {
  const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // --- API ENDPOINTS ---
    if (pathname.startsWith('/api/')) {
      return handleApiRequest(req, res, parsedUrl);
    }

    // --- STATIC FILES ---
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

    // Normalize and prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // Fallback for directory to index.html
        if (stats && stats.isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
          return res.end('404 Not Found');
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500);
          return res.end('Internal Server Error');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      });
    });
  });

  server.listen(PORT, () => printBanner('Native Node HTTP (Zero Dependencies Required!)'));
}

function handleApiRequest(req, res, parsedUrl) {
  const pathname = parsedUrl.pathname;

  const jsonResponse = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(JSON.stringify(data));
  };

  const getBody = (callback) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        callback(null, parsed);
      } catch (err) {
        callback(err, null);
      }
    });
  };

  if (pathname === '/api/health' && req.method === 'GET') {
    return jsonResponse(200, {
      status: 'online',
      appName: 'OCEAN LIFE API',
      engine: 'Node Native Zero-Dependencies',
      database: 'SQLite (ocean.sqlite)',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  }

  if (pathname === '/api/species' && req.method === 'GET') {
    const category = parsedUrl.searchParams.get('category');
    const search = parsedUrl.searchParams.get('search');
    const species = db.getAllSpecies(category, search);
    return jsonResponse(200, { count: species.length, species });
  }

  if (pathname.startsWith('/api/species/') && req.method === 'GET') {
    const id = pathname.replace('/api/species/', '');
    const sp = db.getSpeciesById(id);
    if (!sp) return jsonResponse(404, { error: 'Species not found.' });
    return jsonResponse(200, sp);
  }

  if (pathname === '/api/auth/register' && req.method === 'POST') {
    return getBody((err, body) => {
      if (err || !body.fullName || !body.email || !body.passwordHash) {
        return jsonResponse(400, { error: 'All fields are required.' });
      }
      if (db.getUserByEmail(body.email)) {
        return jsonResponse(409, { error: 'Email already exists.' });
      }
      const userId = 'usr_' + Date.now();
      const user = db.createUser(userId, body.fullName.trim(), body.email.trim(), body.passwordHash);
      return jsonResponse(201, { message: 'Registered!', user });
    });
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    return getBody((err, body) => {
      if (err || !body.email || !body.passwordHash) {
        return jsonResponse(400, { error: 'Email and password required.' });
      }
      const user = db.getUserByEmail(body.email);
      if (!user || user.passwordHash !== body.passwordHash) {
        return jsonResponse(401, { error: 'Invalid credentials.' });
      }
      return jsonResponse(200, { message: 'Logged in!', user });
    });
  }

  if (pathname === '/api/pledges/stats' && req.method === 'GET') {
    return jsonResponse(200, db.getPledgeStats());
  }

  if (pathname === '/api/pledges' && req.method === 'POST') {
    return getBody((err, body) => {
      return jsonResponse(201, db.savePledge(body.userId, body.userEmail, body.pledgeKey));
    });
  }

  if (pathname === '/api/game/leaderboard' && req.method === 'GET') {
    return jsonResponse(200, { leaderboard: db.getLeaderboard(10) });
  }

  if (pathname === '/api/game/score' && req.method === 'POST') {
    return getBody((err, body) => {
      return jsonResponse(201, db.saveGameScore(body.playerName, body.score, body.streak));
    });
  }

  if (pathname === '/api/telemetry' && req.method === 'GET') {
    return jsonResponse(200, {
      station: 'Global Pelagic Sentinel-6',
      surfaceTemperature: '18.4°C',
      averageWaveHeight: '2.1 m',
      meanSalinity: '35.1 PSU',
      timestamp: new Date().toISOString()
    });
  }

  return jsonResponse(404, { error: 'API route not found' });
}

function printBanner(engine) {
  console.log(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║   🌊 OCEAN LIFE - FULL-STACK BACKEND & DATABASE RUNNING 🌊    ║
  ║                                                               ║
  ║   Local Server : http://localhost:${PORT}                       ║
  ║   Engine       : ${engine.padEnd(43)}║
  ║   Database     : SQLite (ocean.sqlite)                        ║
  ║   REST APIs    : http://localhost:${PORT}/api/health            ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝
  `);
}

module.exports = { PORT };
