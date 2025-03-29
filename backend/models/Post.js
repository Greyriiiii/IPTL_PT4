import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    shares: { 
      type: Number, 
      default: 0 
    },
    comments: [
      {
        userId: { type: String, required: true }, 
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
