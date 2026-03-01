import dotenv from "dotenv";
dotenv.config(); // 👈 MUST be first


import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import userRoutes from "./routes/User.js";
import profileRoutes from "./routes/Profile.js";
import paymentRoutes from "./routes/Payments.js";
import courseRoutes from "./routes/Course.js";

import { database } from "./config/database.js";
import { cloudinaryConnect } from "./config/cloudinary.js";

const app = express();
const PORT = process.env.PORT || 4000;

// DB connection
database();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

// default route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "your server is up and running",
  });
});

// server
app.listen(PORT, () => {
  console.log(`app is running at ${PORT}`);
});
