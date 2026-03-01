// Import required modules
import express from "express";
const router = express.Router();

// ================= Controllers =================
import {
  login,
  signup,
  sendotp,
  changePassword,
} from "../controllers/Auth.js";

import {
  resetPasswordToken,
  resetPassword,
} from "../controllers/ResetPassword.js";

// ================= Middleware =================
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// User login
router.post("/login", login);

// User signup
router.post("/signup", signup);

// Send OTP
router.post("/sendotp", sendotp);

// Change password (protected)
router.post("/changepassword", auth, changePassword);

// ********************************************************************************************************
//                                      Reset Password routes
// ********************************************************************************************************

// Generate reset password token
router.post("/reset-password-token", resetPasswordToken);

// Reset password
router.post("/reset-password", resetPassword);

// ================= Export =================
export default router;
