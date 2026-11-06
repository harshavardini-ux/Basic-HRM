import mongoose from 'mongoose';

let isConnected = false;
let useInMemory = false;

// In-memory collections to ensure zero-crash preview when MongoDB Atlas is offline or not configured
export const memoryStore = {
  users: [],
  employees: [],
  departments: [],
  attendances: [],
  leaves: [],
  performances: [],
  announcements: []
};

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('example.mongodb.net')) {
    console.log('[DB] No active MongoDB Atlas URI detected in .env. Using simulated in-memory MongoDB store.');
    useInMemory = true;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    useInMemory = false;
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] MongoDB Connection Error: ${error.message}`);
    console.log('[DB] Falling back to in-memory store for safe demonstration.');
    useInMemory = true;
  }
};

export const isInMemoryMode = () => useInMemory;
