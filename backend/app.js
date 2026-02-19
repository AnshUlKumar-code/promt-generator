import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongoDB.js";
import router from "./routes/imageAddRoute.js";
import connectCloudinary from "./config/cloudinary.js";

dotenv.config();

// Connect to services
try {
  connectDB();
  connectCloudinary();
} catch (err) {
  console.error("Connection error:", err);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", router);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
    error: err.stack // Add this temporarily to see full error
  });
});
app.get('/db-status', async (req, res) => {
  res.json({
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
    readyState: mongoose.connection.readyState,
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// ✅ MUST EXPORT FOR VERCEL:
export default app;