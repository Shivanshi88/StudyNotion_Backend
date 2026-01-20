import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// generate reset password token and send email
export const resetPasswordToken = async (req, res) => {
  try {
    // fetch email from request body
    const email = req.body.email;

    // check if user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email`,
      });
    }

    // generate random token
    const token = crypto.randomBytes(20).toString("hex");

    // save token and expiry time in database
    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );

    console.log("DETAILS", updatedDetails);

    // create reset password url
    const url = `http://localhost:3000/update-password/${token}`;

    // send reset password email
    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    // return success response
    return res.json({
      success: true,
      message: "Email Sent Successfully, Please Check Your Email to Continue Further",
    });

  } catch (error) {
    return res.json({
      success: false,
      message: "Some Error in Sending the Reset Message",
      error: error.message,
    });
  }
};

// reset password using token
export const resetPassword = async (req, res) => {
  try {
    // fetch password details from request body
    const { password, confirmPassword, token } = req.body;

    // check password match
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }

    // find user using token
    const userDetails = await User.findOne({ token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }

    // check token expiry
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token is Expired, Please Regenerate Your Token",
      });
    }

    // encrypt new password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // update password and remove token
    await User.findOneAndUpdate(
      { token },
      {
        password: encryptedPassword,
        token: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true }
    );

    // return success response
    return res.json({
      success: true,
      message: "Password Reset Successful",
    });

  } catch (error) {
    return res.json({
      success: false,
      message: "Some Error in Updating the Password",
      error: error.message,
    });
  }
};
