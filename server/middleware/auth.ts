import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Define supported user types
export type UserType = 'user' | 'business' | 'admin';

interface JwtPayload {
  userId: string;
  email: string;
  userType: UserType;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userType: UserType;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Verify JWT and attach user to request
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    const user = await User.findById(decoded.userId).select('userType');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      userId: decoded.userId,
      userType: user.userType as UserType,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Restrict routes to specific user types
export const requireUserType = (allowedTypes: UserType[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If route requires business access, check verification status
    if (allowedTypes.includes('business') && req.user.userType === 'business') {
      const user = await User.findById(req.user.userId).select('isVerified');
      if (!user?.isVerified) {
        return res.status(403).json({ error: 'Business account pending verification' });
      }
    }

    // Admin bypass verification checks
    if (req.user.userType === 'admin') {
      return next();
    }

    next();
  };
};

// Middleware to require verified business status
export const requireVerifiedBusiness = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.user.userType !== 'business') {
    return res.status(403).json({ error: 'Access restricted to business accounts' });
  }

  const user = await User.findById(req.user.userId).select('isVerified');
  if (!user?.isVerified) {
    return res.status(403).json({ error: 'Business account pending verification' });
  }

  next();
};

// Example usage:
// app.post('/business-only', authMiddleware, requireUserType(['business']), handler);
// app.post('/users-only', authMiddleware, requireUserType(['user']), handler);