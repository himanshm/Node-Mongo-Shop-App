import { Response, NextFunction } from 'express';
import { Request } from '../app';
import Product from '../models/product';

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getIndex(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await Product.fetchAll();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await req.user?.getCart();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// Add new products to the cart
export async function postCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const prodId = req.body.productId;
    const product = await Product.findById(prodId);
    await req.user?.addToCart(product);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function postCartDeleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const prodId = req.body.productId;
    await req.user?.deleteItemsFromCart(prodId);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// export async function postOrder(req, res, next) {
//   try {
//     let fetchedCart;
//     const cart = await req.user.getCart();
//     fetchedCart = cart;

//     const products = await cart.getProducts();

//     const order = await req.user.createOrder();

//     await order.addProduct(
//       products.map((product) => {
//         product.orderItem = { quantity: product.cartItem.quantity };
//         return product;
//       })
//     );

//     // Clearing the cart
//     await fetchedCart.setProducts(null);

//     res.redirect('/orders');
//   } catch (err) {
//     console.log(err);
//   }
// }

// export async function getOrders(req, res, next) {
//   try {
//     const orders = await req.user.getOrders({ include: ['products'] });

//     res.render('shop/orders', {
//       path: '/orders',
//       pageTitle: 'Your Orders',
//       orders: orders,
//     });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// }
