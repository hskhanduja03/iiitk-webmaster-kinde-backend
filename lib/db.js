// lib/db.js
import mongoose from 'mongoose';

let isConnected; // Track connection status

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    console.log("Database already connected");
    return;
  }

  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000, // 20 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });

    isConnected = true; // Update connection status
    console.log("DB connected successfully");
  } catch (error) {
    isConnected = false; // Update connection status on error
    console.error("Error connecting to database:", error.message);
    // Optional: Rethrow the error to propagate it
    throw new Error("Could not connect to the database");
  }
};

export default connectDB;
