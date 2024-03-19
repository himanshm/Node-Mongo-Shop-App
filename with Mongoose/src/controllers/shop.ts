import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import Order from '../models/order';

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await Product.find();
    console.log(products);
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
    if (!product) {
      throw new Error('No Product found!');
    }

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
    const products = await Product.find();
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
    const user = await req.user?.populate('cart.items.productId');
    const products = user?.cart.items;
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
    if (product) await req.user?.addToCart(product);
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
    await req.user?.removeFromCart(prodId);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function postOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new Error('No user found!');
    }

    const user = await req.user.populate('cart.items.productId');
    console.log(user.cart.items);

    const products = await Promise.all(
      user.cart.items.map(async ({ quantity, productId }) => {
        const product = await Product.findById(productId);
        if (!product) throw new Error('No Product Found!');
        return {
          quantity,
          product: { ...product.toObject() },
        };
      })
    );

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
    });
    await order.save();
    req.user.clearCart();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
}

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new Error('No user found!');
    }

    const orders = await Order.find({ 'user.userId': req.user._id });

    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}
