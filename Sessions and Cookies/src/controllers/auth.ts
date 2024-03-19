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
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}
