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
