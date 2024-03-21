## Session - Cookies

Saving data across requests

```
import { default as connectMongoDBSession} from 'connect-mongodb-session';

const MongoDBStore = connectMongoDBSession(session);

var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/tmp',
  collection: 'sessions'
});
```

Both packages (connect-mongodb-session and connect-mongo) are exporting an anonymous function that takes the express-session module as an argument. This function returns a constructor and is exported with modules.export, therefore it's considered a default export and you can import it with import { default as NameForAnonymousFunction } from 'connect-mongo'.

we can use sessions and cookies to store data and what potential issues are if we store mongoose model data in there because we don't store the full mongoose model but only the data but not the magic methods, so we have to recreate that mongoose model, we have to re-fetch the data.

```
const user = await User.findById('65f970493d4975e60c1015ca');
    if (user) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    } else {
      // Handle case where user is not found
      res.status(404).send('User not found');
    }
```

The problem we can face here is writing that data to a database like mongodb can take a couple of milliseconds or depending on your speed even a bit more milliseconds.

The redirect is fired independent from that though, so you might redirect too early.

Now to be sure that your session has been set, you can use request session and call the save method, you normally don't need to do that but you need to do it in scenarios where you need to be sure that your session was created before you continue because here, you can pass in a function that will be called once you're done saving the session. You'll get an error here if an error exists, most of the time that should not be the case and then in here, you can safely redirect and you can be sure that your session has been created here.

Normally you don't need to call that but you need to call it if you need that guarantee which typically is the case when you do redirect for example because in such scenarios, the redirect will be fired independent from the session being saved and therefore the redirect might be finished and the new page might be rendered before your session was updated on the server and in the database.

# Step 1: CSRF Token Generation and Validation Middleware

First, let's define the middleware for generating and validating CSRF tokens in a TypeScript file (e.g., csrfProtection.ts).##

```
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    csrf?: string;
  }
}

// Generate a secure CSRF token
const generateToken = (): string => crypto.randomBytes(32).toString('hex');

// Middleware to attach CSRF token to the req object and local variables for views
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  let token: string;

  if (typeof req.session.csrf === 'undefined') {
    token = generateToken();
    req.session.csrf = token;
  } else {
    token = req.session.csrf;
  }

  res.locals.csrfToken = token;
  next();
};

// Middleware for validating the CSRF token
export const csrfValidate = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const userToken = req.body.csrfToken || req.query.csrfToken;
    if (!userToken || userToken !== req.session.csrf) {
      res.status(403).send('CSRF token validation failed');
      return;
    }
  }
  next();
};
```

# Step 2: Apply Middleware in Your Express Application

Next, apply the csrfProtection and csrfValidate middleware in your main Express application file or where you configure your routes.

```
import express, { Express } from 'express';
import { csrfProtection, csrfValidate } from './csrfProtection';
import bodyParser from 'body-parser';
import session from 'express-session';

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
}));

// Applying CSRF protection middleware globally
app.use(csrfProtection);

// Apply CSRF validation on routes that accept form submissions
app.post('/login', csrfValidate, postLogin);
app.post('/signup', csrfValidate, postSignup);
// Continue for other POST, PUT, DELETE routes

```

# Step 3: Include CSRF Token in Forms and AJAX Requests

Ensure that every form submission includes the CSRF token as a hidden input. For AJAX requests, include the token in the request headers or as part of the data payload

```
<form action="/login" method="POST">
  <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
  <!-- Other form fields -->
</form>
```

For AJAX Requests (example using Fetch API):

```
fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'CSRF-Token': csrfToken // Ensure you have passed the csrfToken to your JavaScript
  },
  body: JSON.stringify({ /* your data */ })
});

```

# Option 1: Apply Globally (Selective Routes)

If most of your routes require CSRF protection, you could apply csrfValidate globally and selectively disable it for routes that don't need protection (like API routes that use a different authentication method, e.g., Bearer tokens).

```
// Apply globally
app.use(csrfValidate);

// Then, for routes that don't need CSRF protection, you'd bypass it somehow,
// perhaps by marking those routes explicitly in some way or by checking the route path in the middleware.

```

# Option 2: Apply to Individual Routes

If only specific routes need CSRF protection, applying csrfValidate directly to those routes or route modules is more appropriate. This method gives you fine-grained control over which routes are protected.

```
// In your route modules, apply directly
router.post('/login', csrfValidate, loginController);
router.post('/signup', csrfValidate, signupController);
// Continue for other routes as needed
```

# Option 3: Apply to Router Modules

Another approach is to wrap entire router modules with CSRF protection. This is useful if all routes within a module require CSRF protection.

```
// Create a middleware to apply csrfValidate to all routes in a router
function applyCsrf(router) {
  router.use(csrfValidate);
  return router;
}

// Use this function to wrap your routers when they're used
app.use('/admin', applyCsrf(adminRoutes));
app.use('/shop', applyCsrf(shopRoutes));
app.use('/auth', applyCsrf(authRoutes));

```

# Best Practices and Considerations

Selective Application: Not all routes may need CSRF protection, particularly those that are idempotent (like GET requests) or those authenticated via non-session methods (like JWTs for APIs). Apply CSRF protection accordingly.

Consistency: Ensure that all routes that should be protected by CSRF are indeed protected. It's easy to overlook a route, especially in large applications.

Testing: Regardless of the method chosen, thorough testing is critical. Ensure that CSRF protection works as intended and doesn't interfere with legitimate requests.
