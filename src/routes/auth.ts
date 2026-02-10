import { Router } from 'express';
import { findUser, createUser, verifyPassword, getSampleUsers } from '../utils/users.js';
import { signToken, optionalAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/signup', (req, res) => {
  const { username, password, displayName } = req.body;

  if (!username || !password || !displayName) {
    res.status(400).json({ error: 'username, password, and displayName are required' });
    return;
  }
  if (username.length < 2 || username.length > 30) {
    res.status(400).json({ error: 'Username must be 2-30 characters' });
    return;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    res.status(400).json({ error: 'Username can only contain letters, numbers, hyphens, and underscores' });
    return;
  }
  if (password.length < 4) {
    res.status(400).json({ error: 'Password must be at least 4 characters' });
    return;
  }

  try {
    const user = createUser(username, password, displayName);
    const token = signToken({ username: user.username, displayName: user.displayName });
    res.json({ token, user: { username: user.username, displayName: user.displayName } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(409).json({ error: message });
  }
});

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'username and password are required' });
    return;
  }

  const user = findUser(username);
  if (!user || !verifyPassword(user, password)) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken({ username: user.username, displayName: user.displayName });
  res.json({ token, user: { username: user.username, displayName: user.displayName } });
});

authRouter.post('/sample-login', (req, res) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({ error: 'username is required' });
    return;
  }

  const user = findUser(username);
  if (!user || !user.isSample) {
    res.status(404).json({ error: 'Sample account not found' });
    return;
  }

  const token = signToken({ username: user.username, displayName: user.displayName });
  res.json({ token, user: { username: user.username, displayName: user.displayName } });
});

authRouter.get('/me', optionalAuth, (req, res) => {
  if (!req.user) {
    res.json({ user: null });
    return;
  }
  res.json({ user: req.user });
});

authRouter.get('/sample-accounts', (_req, res) => {
  res.json({ accounts: getSampleUsers() });
});
