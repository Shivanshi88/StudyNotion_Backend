// ===============================
// IMPORTS
// ===============================

import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";


// ============================================================
// UPDATE USER PROFILE
// ============================================================

export const updateProfile = async (req, res) => {
  try {
    // Get data from request body
    const { dateOfBirth, about, contactNumber, gender } = req.body;

    // Get logged-in user ID from token
    const id = req.user.id;

    // Find user by ID
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find profile using additionalDetails reference
    const profile = await Profile.findById(userDetails.additionalDetails);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update profile fields
    if (dateOfBirth !== undefined)
  profile.dateOfBirth = dateOfBirth;

if (about !== undefined)
  profile.about = about;

if (contactNumber !== undefined)
  profile.contactNumber = contactNumber;

if (gender !== undefined) {
  profile.gender = gender;
}

    // Save updated profile
    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
      error: error.message,
    });
  }
};


// ============================================================
// DELETE USER ACCOUNT
// ============================================================

export const deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    // Check if user exists
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete associated profile
    await Profile.findByIdAndDelete(user.additionalDetails);

    // Delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};


// ============================================================
// GET COMPLETE USER DETAILS
// ============================================================

export const getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    // Find user and populate profile details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .populate("courses")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================================
// UPDATE DISPLAY PICTURE
// ============================================================

export const updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "Display picture is required",
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    // Update user image field in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: uploadedImage.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating display picture",
      error: error.message,
    });
  }
};


// ============================================================
// GET ENROLLED COURSES
// ============================================================

export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Populate enrolled courses
    const userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "instructor",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching enrolled courses",
    });
  }
};