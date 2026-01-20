// import mongoose
import mongoose from "mongoose";

// define the Courses schema
const coursesSchema = new mongoose.Schema({
  courseName: { type: String },
  courseDescription: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // reference to User model
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section", // reference to Section model
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview", // reference to Rating and Review model
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // reference to Category model
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // reference to User model
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"], // status can only be Draft or Published
  },
});

// export the Courses model
export default mongoose.model("Course", coursesSchema);
