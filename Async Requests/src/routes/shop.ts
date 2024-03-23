import { Router } from 'express';
import {
  getProducts,
  getIndex,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getOrders,
  getInvoice,
} from '../controllers/shop';
import isAuth from '../middleware/is-auth';
import { csrfValidate } from '../../config/csrf-protection';

const router = Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', isAuth, getCart);

router.get('/orders/:orderId', isAuth, getInvoice);

router.get('/orders', isAuth, getOrders);

router.post('/cart', csrfValidate, isAuth, postCart);

router.post('/cart-delete-item', csrfValidate, isAuth, postCartDeleteProduct);

router.post('/create-order', csrfValidate, isAuth, postOrder);

export default router;
