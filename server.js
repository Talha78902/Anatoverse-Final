import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3000);
const dataDir = path.join(__dirname, 'backend-data');
const usersFile = path.join(dataDir, 'users.json');
const activitiesFile = path.join(dataDir, 'activities.json');

app.use(express.json({ limit: '1mb' }));

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
  if (!fs.existsSync(activitiesFile)) fs.writeFileSync(activitiesFile, JSON.stringify({ activities: [] }, null, 2));
}

function readJson(file) {
  ensureDataFiles();
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  ensureDataFiles();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function makeId(prefix = 'id') {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    progress: user.progress || { organs: [], systems: [] },
  };
}

function getUserByToken(token) {
  if (!token) return null;
  const db = readJson(usersFile);
  return db.users.find((user) => Array.isArray(user.sessions) && user.sessions.some((session) => session.token === token)) || null;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  req.token = token;
  next();
}

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const db = readJson(usersFile);
  if (db.users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }
  const token = makeId('sess');
  const newUser = {
    id: makeId('usr'),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(String(password)),
    createdAt: new Date().toISOString(),
    progress: { organs: [], systems: [] },
    sessions: [{ token, createdAt: new Date().toISOString() }],
  };
  db.users.push(newUser);
  writeJson(usersFile, db);
  return res.status(201).json({ token, user: sanitizeUser(newUser) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const db = readJson(usersFile);
  const user = db.users.find((item) => item.email === normalizedEmail);
  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const token = makeId('sess');
  user.sessions = Array.isArray(user.sessions) ? user.sessions : [];
  user.sessions.push({ token, createdAt: new Date().toISOString() });
  writeJson(usersFile, db);
  return res.json({ token, user: sanitizeUser(user) });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const db = readJson(usersFile);
  const user = db.users.find((item) => item.id === req.user.id);
  if (user) {
    user.sessions = (user.sessions || []).filter((session) => session.token !== req.token);
    writeJson(usersFile, db);
  }
  return res.json({ success: true });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

app.get('/api/activities', authMiddleware, (req, res) => {
  const db = readJson(activitiesFile);
  const activities = db.activities
    .filter((activity) => activity.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 50);
  return res.json({ activities });
});

app.get('/api/progress', authMiddleware, (req, res) => {
  return res.json({ progress: req.user.progress || { organs: [], systems: [] } });
});

app.post('/api/activities', authMiddleware, (req, res) => {
  const { type, targetId, targetName, meta } = req.body || {};
  if (!type) {
    return res.status(400).json({ error: 'Activity type is required.' });
  }

  const activitiesDb = readJson(activitiesFile);
  const usersDb = readJson(usersFile);
  const user = usersDb.users.find((item) => item.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const activity = {
    id: makeId('act'),
    userId: user.id,
    type,
    targetId: targetId || null,
    targetName: targetName || null,
    meta: meta || {},
    createdAt: new Date().toISOString(),
  };
  activitiesDb.activities.push(activity);

  user.progress = user.progress || { organs: [], systems: [] };
  if (type === 'view_organ' || type === 'open_study_page' || type === 'open_advanced_viewer') {
    if (targetId && meta?.entityType === 'organ' && !user.progress.organs.includes(targetId)) {
      user.progress.organs.push(targetId);
    }
  }
  if ((type === 'view_system' || type === 'open_advanced_viewer' || type === 'open_system_study') && targetId && meta?.entityType === 'system') {
    if (!user.progress.systems.includes(targetId)) {
      user.progress.systems.push(targetId);
    }
  }

  writeJson(activitiesFile, activitiesDb);
  writeJson(usersFile, usersDb);

  return res.status(201).json({
    activity,
    progress: user.progress,
  });
});

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnatoVerse running on http://localhost:${PORT}`);
  });
}

start();
