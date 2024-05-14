import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import Token from "../models/Token.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); //Find 1 in the Database
    if (!user) return res.status(400).json({ msg: "User does not exist. " }); //Edit message

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // Delete password before sending the response
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* REquest RESET */
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User does not exist");

  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  sendEmail(
    user.email,
    "Password Reset Request",
    { name: user.name, link: link },
    "./template/requestResetPassword.handlebars"
  );
  return link;
};

/* RESET PW */
const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await User.findById({ _id: userId });
  sendEmail(
    user.email,
    "Password Reset Successfully",
    { name: user.name },
    "./template/resetPassword.handlebars"
  );

  await passwordResetToken.deleteOne();
  return true;
};
