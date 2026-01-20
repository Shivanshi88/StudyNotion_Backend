import mongoose from "mongoose";
const RatingAndReview = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"

    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
        trim:true,
    },
    course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},
});
export default mongoose.model("RatingAndReview", RatingAndReview);