import express from "express";
import upload from "../middleware/multer.js";
import { createPost } from "../controllers/postController.js";

const router = express.Router();

// This is correct - it accepts image file and other form fields
router.post("/", upload.single("image"), createPost);

export default router;