import { ObjectId } from 'mongodb';
import { model, Schema } from 'mongoose';

export interface ProductType {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  userId: ObjectId;
}

const productSchema = new Schema<ProductType>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Product = model('Product', productSchema);

export default Product;

// import { ObjectId } from 'mongodb';
// import { getDb } from '../util/database';

// export interface ProductType {
//   title: string;
//   imageUrl: string;
//   price: number;
//   description: string;
// }

// class Product {
//   public _id?: ObjectId;
//   constructor(
//     public title: string,
//     public imageUrl: string,
//     public price: number,
//     public description: string,
//     id?: ObjectId | null,
//     public userId?: string
//   ) {
//     this._id = id ? new ObjectId(id) : undefined;
//   }

//   async save(): Promise<void> {
//     try {
//       const db = getDb();
//       if (this._id) {
//         const result = await db.collection<Product>('products').updateOne(
//           {
//             _id: this._id,
//           },
//           { $set: this }
//         );
//         console.log(result);
//       } else {
//         const result = await db.collection<Product>('products').insertOne(this);
//         console.log(result);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//     console.log('productId:', this._id);
//   }

//   static async fetchAll() {
//     try {
//       const db = getDb();
//       const products = await db
//         .collection<Product>('products')
//         .find({})
//         .toArray();

//       // console.log(products);
//       return products;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async findById(prodId: string) {
//     try {
//       const db = getDb();
//       const product = await db
//         .collection<Product>('products')
//         .find({ _id: new ObjectId(prodId) })
//         .next();

//       if (!product) {
//         throw new Error('Product not found');
//       }

//       // console.log(product);
//       return product;
//     } catch (error) {
//       console.log(error);
//       throw error; // Rethrow the error to be handled by the calling function
//     }
//   }

//   static async deleteById(prodId: string) {
//     try {
//       const db = getDb();
//       const result = await db
//         .collection<Product>('products')
//         .deleteOne({ _id: new ObjectId(prodId) });
//       console.log(result);
//       return result;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// export default Product;
