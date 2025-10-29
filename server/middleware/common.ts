import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

/**
 * Verifies that the authenticated user has access to the requested resource
 * by checking if the resource belongs to them.
 */
export const requireResourceOwnership = (resourceUserId: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Admins can access any resource
    if (req.user.userType === 'admin') {
      return next();
    }

    // Users can only access their own resources
    if (req.user.userId !== resourceUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

/**
 * Checks if a user account is active. Use this middleware after authMiddleware.
 */
export const requireActiveAccount = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findById(req.user.userId).select('isActive');
  if (!user?.isActive) {
    return res.status(403).json({ error: 'Account is suspended' });
  }

  next();
};

/**
 * Rate limiting middleware to prevent abuse
 */
export const rateLimit = (requests: number, timeWindowMs: number) => {
  const requestCounts = new Map<string, { count: number; lastReset: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const clientIp = req.ip;

    const clientData = requestCounts.get(clientIp) || { count: 0, lastReset: now };

    // Reset count if time window has passed
    if (now - clientData.lastReset > timeWindowMs) {
      clientData.count = 0;
      clientData.lastReset = now;
    }

    if (clientData.count >= requests) {
      return res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: Math.ceil((clientData.lastReset + timeWindowMs - now) / 1000)
      });
    }

    clientData.count++;
    requestCounts.set(clientIp, clientData);

    next();
  };
};

/**
 * Error handling middleware
 */
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.status(500).json({ error: 'Internal server error' });
};