import React, { useState } from "react";
<<<<<<< HEAD
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
=======
import { Box, Button, TextField, 
  Dialog, DialogTitle,Typography, 
  DialogContent, DialogActions } from "@mui/material";
>>>>>>> origin/main
import { Formik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,100}$/;
const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .matches(passwordComplexityRegex, "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character '!@#$%^&*'"),
    confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePassword = ({ open, handleClose }) => {
  const token = useSelector((state) => state.token);
  const [Message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const handleChangePassword = async (values, onSubmitProps) => {
    try {
      const body = new URLSearchParams({
        oldPassword: values.oldPassword,
        newPassword: values.confirmPassword,
      }).toString();

      const response = await fetch("http://localhost:3001/users/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (response.ok) {
        onSubmitProps.resetForm();
<<<<<<< HEAD
        onSubmitProps.resetForm();
=======
>>>>>>> origin/main
        setErrorMessage("");
        setMessage("Your password has been changed.");
        setTimeout(() => {
          navigate("/")}, 3000);
      } else {
        // const data = await response.json();
        // throw new Error(data.message || "Failed to change password");
        setMessage("");
        setErrorMessage("Some error occured.");
      }
    } catch (err) {
      // window.alert(err.message);
      setMessage("");
      setErrorMessage("Change password has been canceled: ", err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={handleChangePassword}
        >
          {({ 
            values, 
            errors, 
            touched, 
            isSubmitting, 
            handleChange, 
            handleBlur, 
            handleSubmit,
            }) => (
            <form onSubmit={handleSubmit}>
              <Box marginBottom={2}>
                <TextField
                  fullWidth
                  id="oldPassword"
                  name="oldPassword"
                  label="Old Password"
                  type="password"
                  value={values.oldPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.oldPassword && Boolean(errors.oldPassword)}
                  helperText={touched.oldPassword && errors.oldPassword}
                />
              </Box>
              <Box marginBottom={2}>
                <TextField
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.newPassword && Boolean(errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                />
              </Box>
              <Box marginBottom={2}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.confirmPassword &&
                    (Boolean(errors.confirmPassword) ||
                      (values.confirmPassword !== values.newPassword &&
                        "Passwords don't match"))
                  }
                  helperText={
                    touched.confirmPassword
                      ? errors.confirmPassword || "Passwords matched"
                      : null
                  }
                />
              </Box>
              {Message && (<Typography sx={{ color: "green", marginBottom: "1rem" }}> {Message} </Typography>)}
              {errorMessage && (<Typography sx={{ color: "red", marginBottom: "1rem" }}> {errorMessage} </Typography>)}
              <DialogActions>
                <Button onClick={handleClose} color="secondary">Close</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || values.confirmPassword !== values.newPassword}
                >
                  Change Password
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;