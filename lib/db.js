
import mongoose from 'mongoose';

let isConnected; 

const connectDB = async () => {
  if (isConnected) {
    console.log("Database already connected");
    return;
  }

  try {
    // console.log("MongoDB URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000, 
      socketTimeoutMS: 45000, 
    });

    isConnected = true; 
    console.log("DB connected successfully");
  } catch (error) {
    isConnected = false; 
    console.error("Error connecting to database:", error.message);
    throw new Error("Could not connect to the database");
  }
};

export default connectDB;
