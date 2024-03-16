import { mongoConnect, getDb } from '../util/database';

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
    public description: string
  ) // public id?: number
  {}

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
