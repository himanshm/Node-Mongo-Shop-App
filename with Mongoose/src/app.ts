import express, { Express, Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import path from 'path';
import bodyParser from 'body-parser';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import User, { IUser } from './models/user';

import { get404 } from './controllers/error';
import mongooseConnect from './util/database';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const app: Express = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById('65f970493d4975e60c1015ca');
    if (user) {
      req.user = user;
    }
    console.log(user);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

async function initialize() {
  try {
    await mongooseConnect();
    const existingUser = await User.findOne();
    if (!existingUser) {
      const user = new User({
        name: 'Himansh',
        email: 'himansh@example.com',
        cart: { items: [] },
      });

      await user.save();
    }

    app.listen(3000);
    console.log('Server is listening on port 3000.');
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

initialize();
