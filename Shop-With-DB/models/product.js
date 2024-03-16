import { Sequelize, DataTypes } from 'sequelize';
import sequalize from '../util/database.js';

const Product = sequalize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Product;
