import { RequestHandler } from 'express';
import crypto from 'crypto';

// Generate a secure CSRF token
const generateToken = (): string => crypto.randomBytes(32).toString('hex');

// Middleware to attach CSRF token to the req object and local variables for views
export const csrfProtection: RequestHandler = (req, res, next): void => {
  let token: string;

  if (typeof req.session.csrf === 'undefined') {
    token = generateToken();
    req.session.csrf = token;
  } else {
    token = req.session.csrf;
  }

  res.locals.csrfToken = token;
  next();
};

// Middleware for validating the CSRF token
export const csrfValidate: RequestHandler = (req, res, next): void => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const userToken = req.body.csrfToken || req.query.csrfToken;
    if (!userToken || userToken !== req.session.csrf) {
      res.status(403).send('CSRF token validation failed');
      return;
    }
  }
  next();
};
