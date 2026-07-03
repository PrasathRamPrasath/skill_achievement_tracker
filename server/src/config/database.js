import mongoose from 'mongoose';
import envConfig from './envConfig.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envConfig.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
