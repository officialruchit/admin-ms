import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/admin';

interface JwtPayload {
  userId: string;
  roles: string[];
  isAdmin: boolean;
}

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    roles?: string[];
    isAdmin?: boolean;
  }
}

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!decoded.isAdmin || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};
