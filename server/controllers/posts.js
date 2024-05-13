import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */ //own posts
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userIdFromRequest = req.user.id; // Assuming you have the user ID available in the request object
    // Find the post by its ID
    const post = await Post.findById(id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authorized to delete the post (by matching user ID)
    if (post.userId !== userIdFromRequest) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // If authorized, delete the post
    const deletedPost = await Post.findByIdAndDelete(id);

    // Return a success message
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    // If there's an error during the deletion process, return a 500 status with an error message
    res.status(500).json({ message: err.message });
  }
};

// DELETE all posts
// export const deletePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Find the post by its ID and delete it
//     const deletedPost = await Post.findByIdAndDelete(id);
//     // If the post doesn't exist, return a 404 status
//     if (!deletedPost) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     // If the post is successfully deleted, return a success message
//     res.status(200).json({ message: "Post deleted successfully" });
//   } catch (err) {
//     // If there's an error during the deletion process, return a 500 status with an error message
//     res.status(500).json({ message: err.message });
//   }
// };