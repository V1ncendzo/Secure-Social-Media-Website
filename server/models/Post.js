import mongoose from "mongoose";
import { Schema } from "mongoose";
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
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    createdAt: { type: Date, default: Date.now },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        userName: String,
        userPicturePath: String, // Added field for user's profile picture
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
