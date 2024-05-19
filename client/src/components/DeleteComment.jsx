import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DeleteOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DeletePost = ({ postId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmation) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("Post deleted successfully!");
          navigate("/home"); // Redirect to home page after deletion
        } else {
          throw new Error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Post deletion cancelled");
    }
  };

  return (
    <IconButton
      disabled={isLoading}
      onClick={handleDelete}
      sx={{ color: "error.main" }}
    >
      {isLoading ? "Deleting..." : <DeleteOutlined />}
    </IconButton>
  );
};

export default DeletePost;
