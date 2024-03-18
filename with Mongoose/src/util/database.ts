import mongoose from 'mongoose';
import 'dotenv/config';

const mongooseConnect = async () => {
  const connectionString = process.env.DB_CONN_STRING;

  if (!connectionString) {
    throw new Error('Database connection string is not provided');
  }

  try {
    await mongoose.connect(connectionString);
    console.log(`Successfully connected to database`);
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

export default mongooseConnect;
