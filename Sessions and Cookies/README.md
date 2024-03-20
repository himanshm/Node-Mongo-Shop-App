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
