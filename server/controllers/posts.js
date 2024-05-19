import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, isProfilePage } = req.body;
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

    if (isProfilePage) {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.status(201).json(posts);
    } else {
      const userPosts = await Post.find({ userId }).sort({ createdAt: -1 });
      res.status(201).json(userPosts);
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({ createdAt: -1 });
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
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    // If there's an error during the deletion process, return a 500 status with an error message
    res.status(500).json({ message: err.message });
  }
};

/* ADD COMMENT */
export const addCommentToPost = async (req, res) => {
  try {
    const { postId, comment } = req.body;

    // Find the post by its ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the user by ID to get the user's name
    const user = await User.findById(req.user.id);

    // Add the comment to the post with the user's name
    post.comments.push({
      userId: req.user.id,
      userName: user.firstName + " " + user.lastName, // Assuming you have firstName and lastName fields
      userPicturePath: user.picturePath,
      content: comment,
    });
    await post.save();

    // Manually populate userName in the comments array
    for (const comment of post.comments) {
      const commenter = await User.findById(comment.userId);
      comment.userName = commenter.firstName + " " + commenter.lastName;
    }

    // Return the updated post with userName populated in the comments
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE COMMENT */
export const deleteCommentFromPost = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userIdFromRequest = req.user.id; // Assuming you have the user ID available in the request object

    // Find the post by its ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment by its ID
    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is authorized to delete the comment (by matching user ID)
    if (comment.userId.toString() !== userIdFromRequest) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    // If authorized, delete the comment by filtering it out of the comments array
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
    await post.save();

    // Return a success message
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    // If there's an error during the deletion process, return a 500 status with an error message
    res.status(500).json({ message: err.message });
  }
};
