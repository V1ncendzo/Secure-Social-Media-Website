import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DeleteOutlined} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DeletePost = ({ postId }) => {
  const [isLoading, setIsLoading] = useState(false); // Optional state for loading indicator
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);

  const handleDelete = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this post?");

    if (confirmation) {
      setIsLoading(true); // Set loading state (optional)
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}/delete`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`, // Include your auth token in headers
          },
        });

        if (response.ok) {
          console.log("Post deleted successfully!");
          navigate(`/profile/${_id}`);
          setTimeout(() => {
            navigate("/home"); // Navigate to the home page after a delay
          }, 500); // 2000 milliseconds (2 seconds) delay 
        } else {
          throw new Error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    } else {
      console.log("Post deletion cancelled");
    }
  };

  return (
    <IconButton disabled={isLoading} onClick={handleDelete} sx={{ color: "error.main"}}>
      {isLoading ? "Deleting..." : <DeleteOutlined />}
    </IconButton>
  );
};

export default DeletePost;
