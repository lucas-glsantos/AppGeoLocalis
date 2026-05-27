import { getAuth } from '@clerk/express';
import { User } from '../models/User.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Não autorizado' });
    }

    req.userId = userId;
    req.isAdmin = false;

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (adminEmail) {
      const user = await User.findUserByClerkId(userId);
      req.isAdmin = user?.is_admin || false;
    }

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (userId) {
      req.userId = userId;
      req.isAdmin = false;

      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      if (adminEmail) {
        const user = await User.findUserByClerkId(userId);
        req.isAdmin = user?.is_admin || false;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

export const isAdmin = async (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ success: false, message: 'Acesso restrito a administradores' });
  }
  next();
};