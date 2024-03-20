// Import the required modules

import express, {
  Express,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import 'dotenv/config';
import path from 'path';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import bodyParser from 'body-parser';
// import { csrfSync } from 'csrf-sync';

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
    user?: IUser;
  }
}

// Don't need it
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

// const { csrfSynchronisedProtection } = csrfSync();

app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.use(csrfSynchronisedProtection);

// Middleware and Routes

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (user) {
      req.user = user;
      next();
    } else {
      // Handle case where user is not found
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // if (req.csrfToken) {
  //   res.locals.csrfToken = req.csrfToken();
  // }
  next();
});

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Error Handling Middleware

app.use(get404);

// Server Initialization

async function initialize() {
  try {
    await mongooseConnect();

    app.listen(3000);
    console.log('Server is listening on port 3000.');
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

initialize();
