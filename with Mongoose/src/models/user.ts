// import { ObjectId } from 'mongodb';
// import { getDb } from '../util/database';
// import Product from './product';

// interface CartItem {
//   productId: ObjectId;
//   quantity: number;
// }
// interface Cart {
//   items: CartItem[];
// }
// interface OrderItem {
//   product: Product;
//   quantity: number;
// }

// interface Order {
//   products: Product[];
//   // items: OrderItem[];
//   user: {
//     _id: ObjectId;
//     username: string;
//     email: string;
//   };
//   _id?: ObjectId;
// }

// class User {
//   constructor(
//     public username: string,
//     public email: string,
//     public cart: Cart = { items: [] },
//     public _id?: ObjectId
//   ) {}

//   async save() {
//     const db = getDb();
//     const result = await db.collection<User>('users').insertOne(this);
//     console.log(result);
//   }

//   async addToCart(product: Product) {
//     const db = getDb();
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId?.toString() === product._id?.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     await db
//       .collection<User>('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   async getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });
//     const products = db
//       .collection<Product>('products')
//       .find({ _id: { $in: productIds } })
//       .toArray();

//     return (await products).map((prod) => {
//       return {
//         ...prod,
//         quantity: this.cart.items.find((item) => {
//           return item.productId.toString() === prod._id.toString();
//         })?.quantity,
//       };
//     });
//   }

//   async deleteItemsFromCart(productId: ObjectId) {
//     try {
//       const db = getDb();
//       const updatedCartItems = this.cart.items.filter(
//         (item) => item.productId.toString() !== productId.toString()
//       );

//       await db
//         .collection<User>('users')
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: { items: updatedCartItems } } }
//         );
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async addOrder() {
//     try {
//       const db = getDb();
//       const products = await this.getCart();
//       // const orderItems: OrderItem[] = [];

//       // for (const cartItem of this.cart.items) {
//       //   const product = await db
//       //     .collection<Product>('products')
//       //     .findOne({ _id: cartItem.productId });

//       //   if (product) {
//       //     orderItems.push({
//       //       product: product,
//       //       quantity: cartItem.quantity,
//       //     });
//       //   }
//       // }

//       const order: Order = {
//         products: products,
//         // items: orderItems,
//         // Duplicate data both in orders and users collection
//         user: {
//           _id: new ObjectId(this._id),
//           username: this.username,
//           email: this.email,
//         },
//       };

//       await db.collection<Order>('orders').insertOne(order);
//       this.cart = { items: [] };
//       await db
//         .collection<User>('users')
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         );
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getOrders() {
//     try {
//       const db = getDb();
//       return await db
//         .collection('orders')
//         .find({ 'user._id': new ObjectId(this._id) })
//         .toArray();
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async findById(userId: string | undefined) {
//     const db = getDb();
//     const user = await db
//       .collection<User>('users')
//       .findOne({ _id: new ObjectId(userId) });

//     return user;
//   }
// }

// export default User;
