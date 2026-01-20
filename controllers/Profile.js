const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Update user profile
exports.updateProfile = async (req, res) => {
	try {
		// Extract data from request body
		const { dateOfBirth = "", about = "", contactNumber } = req.body;

		// Get user id from auth middleware
		const id = req.user.id;

		// Find user details
		const userDetails = await User.findById(id);

		// Find profile using reference stored in user
		const profile = await Profile.findById(userDetails.additionalDetails);

		// Update profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;

		// Save updated profile
		await profile.save();

		// Send success response
		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

// Delete user account
exports.deleteAccount = async (req, res) => {
	try {
		// Get user id from token
		const id = req.user.id;

		// Find user by id
		const user = await User.findById({ _id: id });

		// If user does not exist
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Delete associated profile
		await Profile.findByIdAndDelete({ _id: user.userDetails });

		// Delete user account
		await User.findByIdAndDelete({ _id: id });

		// Send success response
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "User cannot be deleted successfully",
		});
	}
};

// Get complete user details
exports.getAllUserDetails = async (req, res) => {
	try {
		// Get user id from token
		const id = req.user.id;

		// Fetch user data and populate profile details
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();

		// Send success response with data
		res.status(200).json({
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

// updateDisplayPicture (pending)
