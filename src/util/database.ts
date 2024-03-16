import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';

let _db: Db;

const mongoConnect = async () => {
  const connectionString = process.env.DB_CONN_STRING;

  if (!connectionString) {
    throw new Error('Database connection string is not provided');
  }
  const client: MongoClient = new MongoClient(connectionString);

  try {
    await client.connect();
    console.log(`Successfully connected to database`);
    _db = client.db();
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No database found!');
};

export { mongoConnect, getDb };
