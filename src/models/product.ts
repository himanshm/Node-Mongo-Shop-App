import { ObjectId } from 'mongodb';
import { getDb } from '../util/database';

export interface ProductType {
  title: string;
  imageUrl: string;
  price: number;
  description: string;
}

class Product {
  constructor(
    public title: string,
    public imageUrl: string,
    public price: number,
    public description: string,
    public _id?: ObjectId
  ) {}

  async save(): Promise<void> {
    try {
      const db = getDb();
      if (this._id) {
        const result = await db.collection<Product>('products').updateOne(
          {
            _id: new ObjectId(this._id),
          },
          { $set: this } // {$set: {title: this.title, imageUrl: this.imageUrl, price: this.price } and so on}
        );
        console.log(result);
      } else {
        const result = await db.collection<Product>('products').insertOne(this);
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const products = await db
        .collection<Product>('products')
        .find({})
        .toArray();

      // console.log(products);
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(prodId: string) {
    try {
      const db = getDb();
      const product = await db
        .collection<Product>('products')
        .find({ _id: new ObjectId(prodId) })
        .next();

      if (!product) {
        throw new Error('Product not found');
      }

      // console.log(product);
      return product;
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error to be handled by the calling function
    }
  }
}

export default Product;
