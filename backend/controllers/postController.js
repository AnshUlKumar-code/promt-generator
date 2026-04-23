import PostModel from "../model/model.js";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createPost = async (req, res) => {
  try {
    // ✅ DEBUG: Log everything
    console.log("=== DEBUG INFO ===");
    console.log("Content-Type:", req.headers['content-type']);
    console.log("req.body:", JSON.stringify(req.body, null, 2));
    console.log("req.file:", req.file ? "File present" : "No file");
    console.log("Description from body:", req.body.description);
    console.log("==================");
    
    const { 
      title, 
      description, 
      tags, 
      category_id 
    } = req.body;

    // ✅ Validate required fields
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
        debug: { 
          receivedBody: req.body,
          contentType: req.headers['content-type']
        }
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

    // ✅ Parse tags
    let parsedTags = tags;
    if (tags && typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(",").map(tag => tag.trim());
      }
    }

    // ✅ Create new post
    const newPost = new PostModel({
      title: title || null,
      description: description.trim(),
      image_url: result.secure_url,
      tags: parsedTags || [],
      category_id: category_id || null
    });

    await newPost.save();

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