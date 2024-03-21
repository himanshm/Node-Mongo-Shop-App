import { Router } from 'express';
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

router.post('/signup', csrfValidate, postSignup);

router.post('/logout', csrfValidate, postLogout);

router.post('/reset', csrfValidate, postReset);

router.post('/new-password', csrfValidate, postNewPassword);

export default router;
