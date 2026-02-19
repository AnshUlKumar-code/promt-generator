import PostModel from "../model/model.js";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createPost = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // ✅ Upload from buffer to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const result = await uploadPromise;

    const newPost = new PostModel({
      title,
      image: result.secure_url,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};