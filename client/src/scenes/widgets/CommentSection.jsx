import React, { useState } from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material"; // Import Avatar component
import { Avatar } from "@mui/material"; // Import Avatar component
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const CommentSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

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

  return (
    <Box mt="0.5rem">
      {comments.map((comment, i) => (
        <Box key={`${comment.userId}-${i}`} mb="0.5rem">
          <Divider />
          <Box display="flex" alignItems="center">
            <Avatar
              src={`http://localhost:3001/assets/${comment.userPicturePath}`}
            />
            <Typography sx={{ color: "textPrimary", ml: "0.5rem" }}>
              <span style={{ fontWeight: "bold" }}>{comment.userName}</span> :{" "}
              {comment.content}
            </Typography>
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
