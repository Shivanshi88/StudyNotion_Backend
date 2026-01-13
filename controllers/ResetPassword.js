import User from "../models/User.js";          // FIX: user → User
import mailSender from "../utils/mailsender.js";
import crypto from "crypto";                   
import bcrypt from "bcryptjs";             

// reset password token
export const resetPasswordToken = async (req, res) => {
  try {
    // get mail for req ki body 
    const email = req.body.email;

    // email registered or not, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }

    // token generation for email 
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing the Url
    await mailSender(
      email,
      "password reset link",
      `password reset link: ${url}`
    );

    // return response
    return res.json({
      success: true,
      message: "email sent successfully, please check email and change password",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password email",
    });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;

    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password doesn't match with confirm password",
      });
    }

    // get user details from db using token
    const userDetails = await User.findOne({ token: token });

    // if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid token",
      });
    }

    // token time check (token kitne time k liye valid hai)
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, generate new token",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update the password
    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
        token: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};
