import { RequestHandler } from 'express';
import User from '../models/user';
import { IUser } from '../models/user';

// Don't need it
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const userAttachMiddleware: RequestHandler = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send('User not found');
      next();
    }
  } catch (err) {
    if (typeof err === 'string') {
      next(new Error(err));
    } else {
      next(err); // Rethrow the original error
    }
  }
};
