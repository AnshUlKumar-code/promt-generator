import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("=== MongoDB Connection Debug ===");
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
    console.log("MONGO_URI length:", process.env.MONGO_URI?.length || 0);
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in environment variables");
    }
    
    // Show first 50 chars of URI (hide password)
    const uriPreview = process.env.MONGO_URI.substring(0, 50);
    console.log("URI starts with:", uriPreview + "...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB connected successfully`);
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
    
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Full error:", err);
  }
};

export default connectDB;