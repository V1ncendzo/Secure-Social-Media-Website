import express from "express";
import {
  addCommentToPost,
  deleteCommentFromPost,
  deletePost,
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* DELETE */
router.delete("/:id/delete", verifyToken, deletePost);

/* ADD COMMENT */
router.post("/comment", verifyToken, addCommentToPost); // Add the new route for adding comments

/* DELETE COMMENT */
router.delete(
  "/:postId/comments/:commentId",
  verifyToken,
  deleteCommentFromPost
);
export default router;
