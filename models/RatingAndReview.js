import mongoose from "mongoose";

const RatingAndReview = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
      index: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate reviews
RatingAndReview.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model("RatingAndReview", RatingAndReview);
