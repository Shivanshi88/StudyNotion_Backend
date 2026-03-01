// Import required modules
import express from "express";
const router = express.Router();

// Controllers
import {
  capturePayment,
  verifySignature,
} from "../controllers/Payments.js";

// Middlewares
import {
  auth,
  isStudent,
} from "../middlewares/auth.js";

// Routes
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);

// Export router
export default router;
