import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';

const MongoDBStore = connectMongoDBSession(session);

export const sessionStoreConfig = (MONGODB_URI: string) => {
  const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
  });

  store.on('error', (error) => {
    console.error('Session store error:', error);
  });

  return store;
};
