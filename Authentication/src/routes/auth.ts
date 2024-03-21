import { Router } from 'express';
import {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
} from '../controllers/auth';
const router = Router();

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.get('/reset', getReset);

router.post('/login', postLogin);

router.post('/signup', postSignup);

router.post('/logout', postLogout);

export default router;
