import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import express, { static as expressStatic } from 'express';
import bodyParser from 'body-parser';

import { get404 } from './controllers/error.js';
import db from './util/database.js';

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

app.listen(3000);
