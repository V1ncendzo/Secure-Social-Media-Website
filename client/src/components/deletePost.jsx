import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DeleteOutlined} from "@mui/icons-material";
import {  IconButton, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DeletePost = ({ postId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
          setErrorMessage("");
          navigate(`/profile/${_id}`);
          setTimeout(() => {
            navigate("/home"); 
          }, 500); 
        } else {
          setErrorMessage("Failed to delete post.");
        }
      } catch (error) {
        setErrorMessage("Failed to delete post.");
      } finally {
        setIsLoading(false); // Reset loading state
      }
    } else {
      console.log("Post deletion cancelled");
    }
  };

  return (
    <div>
      <IconButton disabled={isLoading} onClick={handleDelete} sx={{ color: "error.main"}}>
        {isLoading ? <CircularProgress size={24} /> : <DeleteOutlined />}
      </IconButton>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </div>

  );
};

export default DeletePost;
