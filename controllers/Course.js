import Course from "../models/Course.js";
import Tag from "../models/category.js";
import User from "../models/User.js";
import { uploadImageToCloudinary } from "../utils/imageuploader.js";

// handler for create course
export const createCourse = async (req, res) => {
  try {
    // data fetch from req ki body
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details", instructorDetails);
//TODO VERIFY THAT USERID AND INSTRUCTOR ID
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    // check given tag valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag details not found",
      });
    }

    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id, // instructor type ek objectid hai
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // update the tag schema
    await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Course created Successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:  " failed to create new course",
      error:error.message,
    });
  }
};

// get all course handler functions

export const showAllCourse = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
