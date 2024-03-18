import { ObjectId } from 'mongodb';
import { getDb } from '../util/database';

export interface UserType {
  username: string;
  email: string;
}

class User {
  constructor(public username: string, public email: string) {}

  async save() {
    const db = getDb();
    const result = await db.collection<User>('users').insertOne(this);
    console.log(result);
  }

  static async findById(userId: string) {
    const db = getDb();
    const result = await db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(userId) });
    console.log(result);

    return result;
  }
}

export default User;
