import { Router } from 'express';
import { getLogin } from '../controllers/auth';
const router = Router();

router.get('/login', getLogin);

export default router;
