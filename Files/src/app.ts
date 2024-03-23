// Import the required modules
import express, { Express, ErrorRequestHandler } from 'express';
import 'dotenv/config';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import multer from 'multer';
// Import routes
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
// Import error controller
import { get404, get500 } from './controllers/error';
// Import session store configuration
import { sessionStoreConfig } from './config/session-store';
// Import database connection
import { mongooseConnect } from './config/database';
// Import middlewares
import { userAttachMiddleware } from './middleware/user-attach-middleware';
import { csrfProtection } from './config/csrf-protection';

import { IUser } from './models/user';
import { error } from 'console';

// Declare Modules and Interfaces
declare module 'express-session' {
  interface SessionData {
    isLoggedIn?: boolean;
    user?: IUser;
    csrf?: string;
  }
}

// Initialize the Express App
const app: Express = express();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Database connection string is not provided');

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing body and serving static files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: 'images' }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));

// Set up session with MongoDB session store
const store = sessionStoreConfig(MONGODB_URI);
app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Applying CSRF protection middleware globally
app.use(csrfProtection);

app.use(flash());

// Apply custom middlewares
app.use(userAttachMiddleware);

// Setup local variables to be available in all views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

// Use routes
app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Error Handling Middleware
app.get('/500', get500);
app.use(get404);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err); // Log the error for server-side debugging

  const statusCode = err.statusCode || 500; // Default to 500 if statusCode not specified
  res.status(statusCode).render('error-page', {
    pageTitle: 'Error',
    path: '/error',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: err.message,
  });

  // res.redirect('/500');
};

app.use(errorHandler);

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
