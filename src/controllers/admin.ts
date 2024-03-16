// export function getAddProduct(req, res, next) {
//   res.render('admin/edit-product', {
//     pageTitle: 'Add Product',
//     path: '/admin/add-product',
//     editing: false,
//   });
// }

// export async function postAddProduct(req, res, next) {
//   try {
//     const { title, imageUrl, price, description } = req.body;

//     // Using magic association methods
//     const result = await req.user.createProduct({
//       title,
//       price,
//       imageUrl,
//       description,
//     });

//     console.log('Created product');
//     res.redirect('/admin/products');
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// }

// export async function getEditProduct(req, res, next) {
//   try {
//     const editMode = req.query.edit;
//     if (!editMode) {
//       return res.redirect('/');
//     }

//     const prodId = req.params.productId;
//     const products = await req.user.getProducts({ where: { id: prodId } });
//     const product = products[0];

//     if (!product) {
//       return res.redirect('/');
//     }

//     res.render('admin/edit-product', {
//       pageTitle: 'Edit Product',
//       path: '/admin/edit-product',
//       editing: editMode,
//       product: product,
//     });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// }

// export async function postEditProduct(req, res, next) {
//   try {
//     const prodId = req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedPrice = req.body.price;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedDesc = req.body.description;

//     const product = await Product.findByPk(prodId);

//     if (!product) {
//       throw new Error('Product not found');
//     }

//     product.title = updatedTitle;
//     product.price = updatedPrice;
//     product.imageUrl = updatedImageUrl;
//     product.description = updatedDesc;

//     await product.save();

//     onsole.log('UPDATED PRODUCT!');
//     res.redirect('/admin/products');
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// }

// export async function getProducts(req, res, next) {
//   try {
//     const products = await req.user.getProducts();

//     res.render('admin/products', {
//       prods: products,
//       pageTitle: 'Admin Products',
//       path: '/admin/products',
//     });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// }

// export async function postDeleteProduct(req, res, next) {
//   try {
//     const prodId = req.body.productId;

//     const product = await Product.findByPk(prodId);

//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Destroy the product
//     await product.destroy();

//     console.log('DESTROYED PRODUCT!');
//     res.redirect('/admin/products'); // Only redirect once the deletion is succeeded
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// }
