import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.service,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Get your recovery token to reset password.</p>
        <p>Recovery Token: ${token}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    res.status(500).json({ error: "Failed to send password reset email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { verifyToken, newPassword } = req.body;

    // Validate the password complexity
    const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,100}$/;
    if (!passwordComplexityRegex.test(newPassword)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    const decodedToken = jwt.verify(verifyToken, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decodedToken.id,
      passwordResetToken: verifyToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired password reset token" });
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Confirmation",
      html: `
        <p>Your password has been successfully reset. If you did not initiate this request, please contact us immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Failed to reset password:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
