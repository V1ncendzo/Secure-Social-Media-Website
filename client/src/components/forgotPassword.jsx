import React, { useState } from 'react';
import { 
    Box, Button, TextField,
    Typography, 
    Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const initialValuesReset = {
    newPassword: "",
    confirmPassword: "",
    recoveryToken:"",
};

const initialEmail = {
    email: "",
};

const resetPasswordSchema = yup.object().shape({
    newPassword: yup
      .string()
      .required("New password is required")
      .matches(passwordComplexityRegex, "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
    recoveryToken: yup.string().required("Recovery Token is required"),
});
  

const forgotPasswordSchema = yup.object().shape({
    email: yup.string().required("Email is required"),
});

const ForgotPassword = ({ open, handleClose }) => {
    const [mailMessage, setMailMessage] = useState("");
    const [resetMessage, setResetMessage] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(""); //red line alert
    const [isMailSubmit, setMailSubmit] = useState(false);

    const handleForgotPassword = async (values, onSubmitProps) => {
        try {
            const body = new URLSearchParams({
                email: values.email,
            }).toString(); // Create string manually 

            const response = await fetch('http://localhost:3001/auth/forgot-password', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body,
            });

            const data = await response.json();

            if (response.ok) {
                setMailMessage('An email has been sent with password reset instructions.');
                setErrorMessage("");
                setMailSubmit(true);
                onSubmitProps.resetForm();
            } else {
                setErrorMessage(`Error: ${data.message}`);
            }
            
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }    
    };

    const handleResetPassword = async (values, onSubmitProps) => {
        try {
            const body = new URLSearchParams({
                verifyToken: values.recoveryToken,
                newPassword: values.confirmPassword,
            }).toString();

            const response = await fetch('http://localhost:3001/auth/reset-password', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body,
            });

            const data = await response.json();

            if (response.ok) {
                setMailMessage("");
                setErrorMessage("");
                setResetMessage('Your password has been reset.');
                setMailSubmit(false);
                onSubmitProps.resetForm();
                setTimeout(() => handleClose(), 1500);
            } else {
                setErrorMessage(`Error: ${data.message}`);
            }
            
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }    
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isMailSubmit ? "Reset Password" : "Recover Email"}</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={isMailSubmit ? initialValuesReset : initialEmail}
                    validationSchema={isMailSubmit ? resetPasswordSchema : forgotPasswordSchema}
                    onSubmit={isMailSubmit ? handleResetPassword : handleForgotPassword}
                >
                    {({ 
                        values, 
                        errors, 
                        touched, 
                        isSubmitting, 
                        handleChange, 
                        handleBlur, 
                        handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            {!isMailSubmit && (
                                <Box marginBottom={2}>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                </Box>
                            )}
                            {isMailSubmit && (
                                <>
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
                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                        />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <TextField
                                            fullWidth
                                            id="recoveryToken"
                                            name="recoveryToken"
                                            label="Recovery Token"
                                            type="text"
                                            value={values.recoveryToken}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.recoveryToken && Boolean(errors.recoveryToken)}
                                            helperText={touched.recoveryToken && errors.recoveryToken}
                                        />
                                    </Box>
                                </>
                            )}
                            {errorMessage && (
                                <Typography sx={{ color: "red", marginBottom: "2rem" }}>
                                    {errorMessage}
                                </Typography>
                            )}
                            {mailMessage && (
                                <Typography sx={{ color: "green", marginBottom: "2rem" }}>
                                    {mailMessage}
                                </Typography>
                            )}
                            {resetMessage && (
                                <Typography sx={{ color: "green", marginBottom: "2rem" }}>
                                    {resetMessage}
                                </Typography>
                            )}
                            <DialogActions>
                                <Button onClick={handleClose} color="secondary">Close</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting || (isMailSubmit && values.confirmPassword !== values.newPassword)}
                                >
                                    {isMailSubmit ? "Reset Password" : "Send Reset Link"}
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPassword;