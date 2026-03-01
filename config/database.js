import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const database = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ DB connected");
  } catch (error) {
    console.log(" DB connection failed");
    console.log(error.message);
    process.exit(1);
  }
};
