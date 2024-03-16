import { ObjectId } from 'mongodb';
import { mongoConnect, getDb } from '../util/database';

interface Product {
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
    public id?: ObjectId
  ) {}

  async save(): Promise<void> {
    try {
      const db = getDb();
      const result = await db.collection<Product>('products').insertOne(this);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }
}

export default Product;
