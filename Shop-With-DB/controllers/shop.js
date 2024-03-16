import Product from '../models/product.js';
import Cart from '../models/cart.js';

export function getProducts(req, res, next) {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
}

export function getProduct(req, res, next) {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
}

export function getIndex(req, res, next) {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
}

export async function getCart(req, res, next) {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
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
export async function postCart(req, res, next) {
  try {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    // Getting the user's cart
    const cart = await req.user.getCart();
    fetchedCart = cart;

    // Getting products from the cart
    const products = await cart.getProducts({ where: { id: prodId } });
    let product;

    if (products.length > 0) {
      product = products[0];
    }

    if (product) {
      // if product is anything but undefined, get old quantity and increase it
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      // If product doesn't exist in the cart, find it by ID
      product = await Product.findByPk(prodId);
    }

    // Adding product to cart with the updated quantity
    await fetchedCart.addProduct(product, {
      through: { quantity: newQuantity },
    });

    res.redirect('/cart');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function postCartDeleteProduct(req, res, next) {
  try {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    const product = products[0];
    await product.cartItem.destroy();
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export function getOrders(req, res, next) {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
}

export function getCheckout(req, res, next) {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
}
