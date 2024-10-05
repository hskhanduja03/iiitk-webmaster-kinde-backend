// lib/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 20000, // Increase to 20 seconds
        socketTimeoutMS: 45000 // Increase to 45 seconds
    });
    console.log("DB connected");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

export default connectDB;
