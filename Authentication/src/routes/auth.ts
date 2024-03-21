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
const router = Router();

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.get('/reset', getReset);

router.get('/reset/:token', getNewPassword);

router.post('/login', postLogin);

router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.post('/reset', postReset);

router.post('/new-password', postNewPassword);

export default router;
