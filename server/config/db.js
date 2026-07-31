import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // Don't crash the process immediately; surface the error clearly.
    setTimeout(() => process.exit(1), 100);
  }
};

export default connectDB;
