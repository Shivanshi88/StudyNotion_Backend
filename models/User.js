// import mongoose library
import mongoose from "mongoose";

// define the user schema
const userSchema = new mongoose.Schema(
  {
    // user's first name
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    // user's last name
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    // user's email
    email: {
      type: String,
      required: true,
      trim: true,
    },
    // user's password
    password: {
      type: String,
      required: true,
    },
    // user's account type: Admin, Student, or Instructor
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    // whether the user is active
    active: {
      type: Boolean,
      default: true,
    },
    // whether the user is approved
    approved: {
      type: Boolean,
      default: true,
    },
    // reference to additional profile details
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    // courses associated with the user
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    // token for authentication or password reset
    token: {
      type: String,
    },
    // expiry time for password reset token
    resetPasswordExpires: {
      type: Date,
    },
    // profile image
    image: {
      type: String,
      required: true,
    },
    // progress of the user in different courses
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress",
      },
    ],
  },
  // automatically add createdAt and updatedAt fields
  { timestamps: true }
);

// export the User model
export default mongoose.model("User", userSchema);
