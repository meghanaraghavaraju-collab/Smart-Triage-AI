
import mongoose from 'mongoose';
import { setServers } from 'node:dns';

// Use alternative DNS servers for MongoDB SRV lookup
setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/smart-triage-ai';

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000
    });

    console.log(
      `[MongoDB] Connected successfully to host: ${conn.connection.host}`
    );

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    return null;
  }
};

