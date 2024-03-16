import { ObjectId } from 'mongodb';

import { mongoConnect, getDb } from '../util/database';

export default class Product {
  constructor(
    public title: string,
    public imageUrl: string,
    public price: number,
    public description: string,
    public id?: ObjectId
  ) {}

  save() {}
}
