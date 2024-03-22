import { Request, Response, NextFunction } from 'express';

export function get404(req: Request, res: Response, next: NextFunction) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
  });
}

export function get500(req: Request, res: Response, next: NextFunction) {
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
  });
}
