import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express, { static as expressStatic } from 'express';
import bodyParser from 'body-parser';

import { get404 } from './controllers/error.js';
import sequalize from './util/database.js';
import Product from './models/product.js';
import User from './models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressStatic(join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product); // optional

sequalize
  .sync({ force: true }) // force:true wouldn't be used in the production
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
