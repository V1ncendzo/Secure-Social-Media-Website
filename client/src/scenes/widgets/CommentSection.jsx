import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);

  const handleAddComment = async () => {
    const response = await fetch(`http://localhost:3001/posts/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, comment: newComment }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment("");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmation = window.confirm("Are you sure you want to delete this comment?");

    if (confirmation) {
      setIsLoading(true); // Set loading state (optional)
      try {
        const response = await fetch(
          `http://localhost:3001/posts/${postId}/comments/${commentId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // Include your auth token in headers
            },
          }
        );
    
        if (response.ok) {
          const updatedPost = await response.json();
          dispatch(setPost({ post: updatedPost }));
          navigate(`/profile/${_id}`);
          setTimeout(() => {
            navigate("/home"); 
          }, 500); 
        } else {  
          console.error("Failed to delete comment");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    } else {
      console.log("Comment deletion cancelled");
    }
  };

  return (
    <Box mt="0.5rem">
      {comments.map((comment, i) => (
        <Box key={`${comment.userId}-${i}`} mb="0.5rem">
          <Divider />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Avatar
                src={`http://localhost:3001/assets/${comment.userPicturePath}`}
              />
              <Typography sx={{ color: "textPrimary", ml: "0.5rem" }}>
                <span style={{ fontWeight: "bold" }}>{comment.userName}</span> :{" "}
                {comment.content}
              </Typography>
            </Box>
            {comment.userId === loggedInUserId && (
              <IconButton disabled={isLoading} sx={{ color: "error.main"}} onClick={() => handleDeleteComment(comment._id)}>
                <DeleteOutlined />
              </IconButton>
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#00d5fa", fontStyle: "italic" }}
          >
            {new Date(comment.createdAt).toLocaleString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Divider />
        </Box>
      ))}
      <Box mt="0.5rem" display="flex" alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          label="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          sx={{ ml: "0.5rem" }}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default CommentSection;
