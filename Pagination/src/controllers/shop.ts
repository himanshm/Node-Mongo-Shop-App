import { Request, Response, NextFunction, RequestHandler } from 'express';
import Product from '../models/product';
import Order from '../models/order';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import HttpError from '../../utils/httpError';

const ITEMS_PER_PAGE = 2;

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await Product.find();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  } catch (err) {
    if (typeof err === 'string') {
      const error = new HttpError(err, 500);
      error.httpErrorCode = 500;
      return next(error);
    }
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
  } catch (err) {
    if (typeof err === 'string') {
      const error = new HttpError(err, 500);
      error.httpErrorCode = 500;
      return next(error);
    }
  }
}

export async function getIndex(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string, 10);
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  } catch (err) {
    if (typeof err === 'string') {
      const error = new HttpError(err, 500);
      error.httpErrorCode = 500;
      return next(error);
    }
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
    if (typeof err === 'string') {
      const error = new HttpError(err, 500);
      error.httpErrorCode = 500;
      return next(error);
    }
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
    if (typeof err === 'string') {
      const error = new HttpError(err, 500);
      error.httpErrorCode = 500;
      return next(error);
    }
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
    if (typeof err === 'string') {
      const error = new HttpError(err, 500);
      error.httpErrorCode = 500;
      return next(error);
    }
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
        email: req.user.email,
        userId: req.user,
      },
      products: products,
    });
    await order.save();
    req.user.clearCart();
    res.redirect('/orders');
  } catch (err) {
    if (typeof err === 'string') {
      const error = new HttpError(err, 500);
      error.httpErrorCode = 500;
      return next(error);
    }
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
    if (typeof err === 'string') {
      const error = new HttpError(err, 500);
      error.httpErrorCode = 500;
      return next(error);
    }
  }
}

export const getInvoice: RequestHandler = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new Error('Order not found!'));
    }

    if (order.user.userId.toString() !== req.user?._id.toString()) {
      return next(new Error('Unauthorised!'));
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join(
      __dirname,
      '..', // Up from src to Files
      '..', // Up from Files to the project root
      'data',
      'invoices',
      invoiceName
    );

    // Create a new PDF document
    const pdfDoc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

    const writeStream = fs.createWriteStream(invoicePath);

    pdfDoc.pipe(writeStream);
    pdfDoc.pipe(res);

    pdfDoc.fontSize(25).text('Invoice', 100, 50);
    pdfDoc.text('-----------------------------------', 100, 70);
    pdfDoc.text(`Order ID: ${orderId}`, 100, 100);
    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          `${prod.product.title} - ${prod.quantity} x $${prod.product.price}`
        );
    });
    pdfDoc.text(`---------`);
    pdfDoc.fontSize(26).text(`Total Price: $${totalPrice}`);

    pdfDoc.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
    //   res.send(data);
    // });

    // fs.access(invoicePath, fs.constants.F_OK, (err) => {
    //   if (err) {
    //     console.log('File does not exist:', err);
    //     return next(new Error('Invoice not found.'));
    //   }

    //   const fileStream = fs.createReadStream(invoicePath);
    //   fileStream.on('error', (error) => {
    //     next(error);
    //   });
    //   fileStream.pipe(res);
    // });
  } catch (err) {
    next(err);
  }
};

/* file read stream and call the pipe method to forward the data that is

read in with that stream to response because the response object is a writable stream actually

and you can use readable streams to pipe their output into a writable stream,

not every object is a writable stream but the response happens to be one.

So we can pipe our readable stream, the file stream into the response and that means that the response will

be streamed to the browser and will contain the data and the data will basically be downloaded by the

browser */
