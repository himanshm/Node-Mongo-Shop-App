// Import the required modules

import express, { Express, Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import path from 'path';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import bodyParser from 'body-parser';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import User, { IUser } from './models/user';
import { get404 } from './controllers/error';
import mongooseConnect from './util/database';

// Declare Modules and Interfaces

declare module 'express-session' {
  interface SessionData {
    isLoggedIn?: boolean;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Initialize the Express App

const app: Express = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set Up MongoDB Session Store
const MongoDBStore = connectMongoDBSession(session);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Database connection string is not provided');
}

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Middleware and Routes

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById('65f970493d4975e60c1015ca');
    if (user) {
      req.user = user;
      // req.session.isLoggedIn = false;
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Error Handling Middleware

app.use(get404);

// Server Initialization

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
