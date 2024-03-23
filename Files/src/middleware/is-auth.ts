import { Request, Response, NextFunction } from 'express';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  // otherwise I want to allow the request to continue to whichever route the request wanted to go
  next();
};

export default isAuth;
