import { ObjectId } from 'mongodb';
import { getDb } from '../util/database';

class User {
  constructor(
    public username: string,
    public email: string,
    public _id?: ObjectId
  ) {}

  async save() {
    const db = getDb();
    const result = await db.collection<User>('users').insertOne(this);
    console.log(result);
  }

  static async findById(userId: string | undefined) {
    const db = getDb();
    const user = await db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(userId) });

    return user;
  }
}

export default User;
