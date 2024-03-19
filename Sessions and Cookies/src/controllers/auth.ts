import { Request, Response, NextFunction } from 'express';

export async function getLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: req.isLoggedIn,
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
    req.isLoggedIn = true;
    res.redirect('/');
  } catch (err) {
    console.log(err);
    next(err);
  }
}
