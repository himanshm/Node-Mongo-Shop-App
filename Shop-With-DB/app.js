import { join } from 'path';

import express, { static } from 'express';
import { urlencoded } from 'body-parser';

import { get404 } from './controllers/error';
import db from './util/database';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';

app.use(urlencoded({ extended: false }));
app.use(static(join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

app.listen(3000);
