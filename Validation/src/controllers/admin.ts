import Product from '../models/product';
import { Request, Response, NextFunction } from 'express';
import { ProductType } from '../models/product';
import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
// import { ObjectId } from 'mongodb';

export function getAddProduct(req: Request, res: Response, next: NextFunction) {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
}

export async function postAddProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let userId: string | undefined;
    const { title, imageUrl, price, description }: ProductType = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        editing: false,
        hasError: true,
        product: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          description: description,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    if (req.user) {
      userId = req.user._id;
    }

    const product = new Product({
      title,
      imageUrl,
      price,
      description,
      userId,
    });
    await product.save();
    console.log('Created product');
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function getEditProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }

    const prodId = req.params.productId;
    const product = await Product.findById(prodId);

    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function postEditProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const prodId: string = req.body.productId;
    const updatedTitle: string = req.body.title;
    const updatedPrice: number = req.body.price;
    const updatedImageUrl: string = req.body.imageUrl;
    const updatedDesc: string = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        product: {
          title: updatedTitle,
          imageUrl: updatedImageUrl,
          price: updatedPrice,
          description: updatedDesc,
          _id: prodId,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const product = await Product.findById(prodId);
    if (!product) {
      throw new Error('Product not found!');
    }

    if (!req.user) {
      throw new Error('User not found!');
    }

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;

    await product.save();

    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error('No user found!');
    }
    const products = await Product.find({ userId: req.user._id });
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export async function postDeleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const prodId: string = req.body.productId;

    await Product.deleteOne({ _id: prodId, userId: req.user?._id });

    console.log('DESTROYED PRODUCT!');
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    next(err);
  }
}
