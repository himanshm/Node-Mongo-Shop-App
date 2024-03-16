import { MongoClient } from 'mongodb';
import 'dotenv/config';

export async function mongoConnect() {
  const connectionString = process.env.DB_CONN_STRING;

  if (!connectionString) {
    throw new Error('Database connection string is not provided');
  }
  const client: MongoClient = new MongoClient(connectionString);

  try {
    await client.connect();
    console.log(`Successfully connected to database`);
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}
