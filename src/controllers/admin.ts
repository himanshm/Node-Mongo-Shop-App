import Product from '../models/product';
import { Request, Response, NextFunction } from 'express';
import { ProductType } from '../models/product';
import { ObjectId } from 'mongodb';

export function getAddProduct(req: Request, res: Response, next: NextFunction) {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
}

export async function postAddProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, imageUrl, price, description }: ProductType = req.body;

    const product = new Product(title, imageUrl, price, description);
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
    console.log('getProductId', prodId);
    const product = await Product.findById(prodId);

    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
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
    const prodId: ObjectId = req.body.productId;
    console.log('postEditProductId:', prodId);
    const updatedTitle: string = req.body.title;
    const updatedPrice: number = req.body.price;
    const updatedImageUrl: string = req.body.imageUrl;
    const updatedDesc: string = req.body.description;

    const product = new Product(
      updatedTitle,
      updatedImageUrl,
      updatedPrice,
      updatedDesc,
      prodId
    );

    await product.save();

    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await Product.fetchAll();

    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function postDeleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const prodId = req.body.productId;

    await Product.deleteById(prodId);

    console.log('DESTROYED PRODUCT!');
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    next(err);
  }
}
