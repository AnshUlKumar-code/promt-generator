import express from "express";
import upload from "../middleware/multer.js";
import { createPost } from "../controllers/postController.js";

const router = express.Router();


router.post("/", upload.single("image"), createPost);

export default router;