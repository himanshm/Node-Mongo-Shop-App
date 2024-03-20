import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { ProductType } from './product';

interface ICartItem {
  productId?: Types.ObjectId;
  quantity: number;
}

interface Cart extends Document {
  // items: Types.DocumentArray<ICartItem>;
  items: ICartItem[];
}

export interface IUser extends Document, IUserMethods {
  email: string;
  password: string;
  cart: Cart;
}

interface IUserMethods {
  addToCart: (product: ProductType) => Promise<void>;
  removeFromCart: (productId: Types.ObjectId) => Promise<void>;
  clearCart: () => Promise<void>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.method('clearCart', async function () {
  this.cart.items = [];
  await this.save();
});

userSchema.method('removeFromCart', async function (productId: Types.ObjectId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    if (item.productId) {
      return item.productId.toString() !== productId.toString();
    }
  });

  this.cart.items = updatedCartItems;
  await this.save();
});

userSchema.method('addToCart', async function (product: ProductType) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId?.toString() === product._id?.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  this.cart.items = updatedCartItems;
  await this.save();
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
