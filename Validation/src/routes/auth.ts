import { Router } from 'express';
import { check, body } from 'express-validator';
import {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} from '../controllers/auth';
import { csrfValidate } from '../config/csrf-protection';
const router = Router();

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.get('/reset', getReset);

router.get('/reset/:token', getNewPassword);

router.post('/login', csrfValidate, postLogin);

router.post(
  '/signup',
  csrfValidate,
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email!')
      .custom((value, { req }) => {
        if (value === 'test@test.com') {
          throw new Error('This email address is forbidden!');
        }
        return true;
      }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  postSignup
);

router.post('/logout', csrfValidate, postLogout);

router.post('/reset', csrfValidate, postReset);

router.post('/new-password', csrfValidate, postNewPassword);

export default router;
