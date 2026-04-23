import PostModel from "../model/model.js";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createPost = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      tags, 
      category_id 
    } = req.body;

    // ✅ Validate required fields (description is now required)
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // ✅ Validate image is present
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // ✅ Upload image to Cloudinary
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

    // ✅ Parse tags if it's a JSON string (from form-data)
    let parsedTags = tags;
    if (tags && typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        // If not JSON, split by comma
        parsedTags = tags.split(",").map(tag => tag.trim());
      }
    }

    // ✅ Create new post with updated schema
    const newPost = new PostModel({
      title: title || null,           // Optional
      description,                     // Required
      image_url: result.secure_url,   // Required (field name changed from 'image' to 'image_url')
      tags: parsedTags || [],          // Optional, defaults to []
      category_id: category_id || null // Optional, can be ObjectId string
    });

    await newPost.save();

    // ✅ Return response with formatted data
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        id: newPost._id,
        title: newPost.title,
        description: newPost.description,
        image_url: newPost.image_url,
        tags: newPost.tags,
        category_id: newPost.category_id,
        created_at: newPost.createdAt,
        updated_at: newPost.updatedAt
      }
    });

  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};