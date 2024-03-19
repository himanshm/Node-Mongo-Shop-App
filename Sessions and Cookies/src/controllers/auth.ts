import { Request, Response, NextFunction } from 'express';

export async function getLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isLoggedIn = req.get('Cookie')?.trim().split('=')[1];
  try {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: isLoggedIn,
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
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
  } catch (err) {
    console.log(err);
    next(err);
  }
}
