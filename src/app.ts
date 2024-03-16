import express, { Express } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { mongoConnect } from './util/database';

// import { get404 } from './controllers/error';

const app: Express = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

import adminRoutes from './routes/admin';
// import shopRoutes from './routes/shop';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// app.use(get404);

async function initialize() {
  try {
    await mongoConnect();
    app.listen(3000);
    console.log('Server is listening on port 3000.');
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

initialize();
