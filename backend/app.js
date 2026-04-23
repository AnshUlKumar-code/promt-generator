// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/mongoDB.js";
// import router from "./routes/imageAddRoute.js";
// import connectCloudinary from "./config/cloudinary.js";

// dotenv.config();

// // Connect to services
// try {
//   connectDB();
//   connectCloudinary();
// } catch (err) {
//   console.error("Connection error:", err);
// }

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api/posts", router);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });
// app.get('/db-status', async (req, res) => {
//   res.json({
//     mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
//     readyState: mongoose.connection.readyState,
//     // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
//   });
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: err.message || "Something went wrong",
//     error: err.stack // Add this temporarily to see full error
//   });
// });


// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// // ✅ MUST EXPORT FOR VERCEL:
// export default app;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose"; // ✅ Added missing import
import connectDB from "./config/mongoDB.js";
import router from "./routes/imageAddRoute.js";
import connectCloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();

// Connect to services
const startServices = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log("✅ All services connected");
  } catch (err) {
    console.error("Connection error:", err);
  }
};

startServices();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/posts", router);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get('/db-status', async (req, res) => {
  res.json({
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
    readyState: mongoose.connection?.readyState || 0,
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { error: err.stack })
  });
});

// ✅ UNCOMMENTED - THIS STARTS THE SERVER!
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`=================================`);
  console.log(`📍 Local:    http://localhost:${PORT}`);
  console.log(`📡 API:      http://localhost:${PORT}/api/posts`);
  console.log(`🔍 DB Status: http://localhost:${PORT}/db-status`);
  console.log(`=================================\n`);
});

// ✅ MUST EXPORT FOR VERCEL:
export default app;