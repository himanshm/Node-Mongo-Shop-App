import { Router } from 'express';

import {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
} from '../controllers/admin';

const router = Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// // /admin/add-product => POST
router.post('/add-product', postAddProduct);

router.get('/edit-product/:productId', getEditProduct);

// router.post('/edit-product', postEditProduct);

// router.post('/delete-product', postDeleteProduct);

export default router;
