import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('node_shop', 'root', 'vrprime1314', {
  dialect: 'mysql',
  host: 'localhost',
});

export default sequelize;
