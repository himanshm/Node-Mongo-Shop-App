import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

export async function getLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.session);
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function postLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findById('65f970493d4975e60c1015ca');
    if (user) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.log(err);
        } else res.redirect('/');
      });
    } else {
      // Handle case where user is not found
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export function postLogout(req: Request, res: Response, next: NextFunction) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      next(err);
    } else {
      res.redirect('/');
    }
  });
}
