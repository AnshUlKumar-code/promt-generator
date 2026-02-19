import mongoose from "mongoose";

const connectDB = async () => {
  try {
    
    const dbName = "promt-generator";
    await mongoose.connect(`${process.env.MONGO_URI}/${dbName}`);

    console.log(" MongoDB connected successfully to database ");
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
  
  }


};

export default connectDB;
