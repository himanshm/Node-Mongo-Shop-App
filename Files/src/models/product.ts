import { ObjectId } from 'mongodb';
import { model, Schema, Types } from 'mongoose';

export interface ProductType {
  title: string;
  price: number;
  description: string;
  image: File;
  userId: ObjectId;
  _id?: Types.ObjectId;
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
  image: {
    type: File,
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
