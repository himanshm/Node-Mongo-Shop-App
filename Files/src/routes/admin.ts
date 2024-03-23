import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  getProducts,
  postEditProduct,
  postDeleteProduct,
} from '../controllers/admin';

import isAuth from '../middleware/is-auth';
import { csrfValidate } from '../../config/csrf-protection';

// you can add as many arguments as you want, as many handlers as you want therefore they will be parsed from left to right, the request will travel through them from left to right.  So the request which reaches get product goes into that isAuth middleware first and in the isAuth middleware, we might be redirecting and we don't call next, hence the request would never continue to that controller action but if we make it past the if check in the middleware, we do call next, so the next middleware in line will be called and the next middleware in line would be our get add product controller action here.

const router = Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, getProducts);

// /admin/add-product => POST
router.post(
  '/add-product',
  csrfValidate,
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 800 }).trim(),
  ],
  isAuth,
  postAddProduct
);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post(
  '/edit-product',
  csrfValidate,
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  postEditProduct
);

router.post('/delete-product', csrfValidate, isAuth, postDeleteProduct);

export default router;
