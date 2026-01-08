import mongoose from "mongoose";
import mailSender from "../utils/mailsender";
const OTPSchema = new mongoose.Schema({

email:{
 type:String,
 required:true,
  },
otp:{
    type:String,
    required:true,
},
createdAt:{
    type:Date,
    default:Date.now,
     expires: 5 * 60,
}


});

// a function -> to send emails
async function sendVerificationEmail(email,otp){
    try{
const mailResponse = await mailSender(email,"verification mail from studyNotion",otp);
console.log("Email send succesfullly:", mailResponse);


    } catch(error){
        console.log("error occured while sending a mail:",error);
        throw error;

    }

}
//using middleware
OTPSchema.pre("save",async function (next) {
   await sendVerificationEmail(this.email,this.otp) 
   next();
})



export default mongoose.model("OTPSchema",OTPSchema)