import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'listwise-dev-secret';

export interface AuthPayload {
  username: string;
  displayName: string;
}

export interface EditTokenPayload {
  owner: string;
  slug: string;
  type: 'edit-token';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function signEditToken(owner: string, slug: string): string {
  const payload: EditTokenPayload = { owner, slug, type: 'edit-token' };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyEditToken(token: string): EditTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as EditTokenPayload;
    if (decoded.type !== 'edit-token') return null;
    return decoded;
  } catch {
    return null;
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }
  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    if (decoded.username) {
      req.user = decoded;
    }
  } catch {
    // invalid token, continue without auth
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  optionalAuth(req, res, () => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    next();
  });
}
