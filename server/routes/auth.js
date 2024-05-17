import express from "express";
import { login } from "../controllers/auth.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password", resetPassword);
router.post("/reset-password", resetPassword);

export default router;
