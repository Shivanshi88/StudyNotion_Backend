// ================= IMPORTS =================


import Course from "../models/Course.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
// Cloudinary image upload utility
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

/*
 CREATE COURSE CONTROLLER
*/
export const createCourse = async (req, res) => {
  try {
    // -------- Get instructor (user) ID from token --------
    const userId = req.user.id;

    // -------- Extract data from request body --------
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status,
      instructions,
    } = req.body;

    // -------- Get thumbnail image from request files --------
    const thumbnail = req.files?.thumbnailImage;

    // -------- Validation: mandatory fields --------
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    // -------- Default status --------
    if (!status) {
      status = "Draft";
    }

    // -------- Check instructor existence --------
    const instructorDetails = await User.findById(userId);

    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // -------- Validate category --------
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    // -------- Upload thumbnail to Cloudinary --------
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // -------- Create new course --------
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
    });

    // -------- Add course to instructor's courses --------
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // -------- Add course to category --------
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // -------- Send success response --------
    return res.status(201).json({
      success: true,
      data: newCourse,
      message: "Course created successfully",
    });

  } catch (error) {
    // -------- Error handling --------
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

/*
=================================================
 GET ALL COURSES CONTROLLER
=================================================
*/
export const getAllCourses = async (req, res) => {
  try {
    // -------- Fetch all courses with selected fields --------
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    // -------- Send response --------
    return res.status(200).json({
      success: true,
      data: allCourses,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Can't fetch course data",
      error: error.message,
    });
  }
};
// get all course details
export const getCourseDetails = async (req, res) => {
  try {
    //get course ki id from req ki body
    const { courseId } = req.body
    //find course details
    const courseDetails = await Course.find(
      { _id: courseId }
    ).populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate ("category")
    .populate("ratingAndreviews")
    .populate({
      path:"courseContent",
      populate:{
        path:"subSection",
      },
    })
    .exec();

//validation

if (!courseDetails){
  return res.status(400).json({
    success:false,
    message:`could not find the course with ${courseId}`,
  });
}

//return response
return res.status(200).json({
  success:true,
  message:"course details fetched successfully",
  data:courseDetails,

})

  }
  catch (error) {
console.log(error);
return res.status(500).json({
  success: false,
  message: "Something went wrong while fetching the course details",
  error: error.message
});

  };


};