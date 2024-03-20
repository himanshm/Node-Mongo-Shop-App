import { Request, Response, NextFunction } from 'express';

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
      isAuthenticated: req.session.isLoggedIn,
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
    req.session.isLoggedIn = true;
    res.redirect('/');
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
