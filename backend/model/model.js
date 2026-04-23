import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,  // Made optional
    },
    description: {
      type: String,
      required: true,   // Required as you specified
    },
    image_url: {
      type: String,
      required: true,   // Required as you specified
    },
    tags: {
      type: [String],   // Array of strings
      required: false,  // Made optional
      default: [],
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,  // Made optional
      ref: "Category",  // Optional: if you have a Category model
    },
  },
  { timestamps: true }  // This automatically adds createdAt and updatedAt
);

// If you want to explicitly define createdAt (though timestamps already does it)
// You can also add an index for better query performance
// postSchema.index({ category_id: 1 });
// postSchema.index({ tags: 1 });

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;