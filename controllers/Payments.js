// ================= IMPORTS =================

// Razorpay instance
import { instance } from "../config/razorpay.js";

// Models
import Course from "../models/Course.js";
import User from "../models/User.js";

// Utilities
import mailSender from "../utils/mailSender.js";
import courseEnrollmentmail from "../mail/templates/courseEnrollmentmail.js";


// Libraries
import mongoose from "mongoose";
import crypto from "crypto";

/*
=================================================
 CAPTURE PAYMENT & CREATE RAZORPAY ORDER
=================================================
*/
export const capturePayment = async (req, res) => {
  try {
    // -------- Get courseId & userId --------
    const { course_id } = req.body;
    const userId = req.user.id;

    // -------- Validation --------
    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course ID",
      });
    }

    // -------- Fetch course details --------
    const course = await Course.findById(course_id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Could not find the course",
      });
    }

    // -------- Check already enrolled --------
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student already enrolled in this course",
      });
    }

    // -------- Create Razorpay order --------
    const options = {
      amount: course.price * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: course_id,
        userId,
      },
    };

    const paymentResponse = await instance.orders.create(options);

    // -------- Send order details to frontend --------
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate payment",
      error: error.message,
    });
  }
};

/*
=================================================
 VERIFY RAZORPAY WEBHOOK SIGNATURE
=================================================
*/
export const verifySignature = async (req, res) => {
  try {
    // -------- Webhook secret (should be in .env) --------
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // -------- Extract signature --------
    const signature = req.headers["x-razorpay-signature"];

    // -------- Generate expected signature --------
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    // -------- Compare signatures --------
    if (signature !== digest) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    console.log("Payment is authorized");

    // -------- Extract courseId & userId from notes --------
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    // -------- Enroll student in course --------
    const enrolledCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );

    if (!enrolledCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -------- Add course to user's enrolled list --------
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      { $push: { courses: courseId } },
      { new: true }
    );

    // -------- Send confirmation email --------
    await mailSender(
      enrolledStudent.email,
      "Congratulations from CodeHelp 🎉",
      courseEnrollmentmail(
        enrolledCourse.courseName,
        enrolledStudent.firstName
      )
    );

    // -------- Final response --------
    return res.status(200).json({
      success: true,
      message: "Signature verified & course enrolled successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while verifying payment",
      error: error.message,
    });
  }
};
