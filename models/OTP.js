// import required modules
import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";
import emailTemplate from "../mail/templates/emailVerificationTemplate.js";

// define OTP schema
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // document will auto-delete after 5 minutes
  },
});

// function to send verification email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

// pre-save hook to send email after saving new OTP
OTPSchema.pre("save", async function (next) {
  console.log("New OTP document saved to database");

  // only send email if the document is new
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }

});

// export OTP model
const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;
