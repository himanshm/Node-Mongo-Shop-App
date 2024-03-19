import mongoose, { Schema, Types } from 'mongoose';
import { ProductType } from './product';

interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

interface IOrder extends Document {
  products: Array<{ product: ProductType; quantity: number }>;
  user: IUser;
  _id?: Types.ObjectId;
}

const orderSchema = new Schema<IOrder>({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
