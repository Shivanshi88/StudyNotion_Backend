import User from "../models/User"
import OTP from "../models/OTP"
import otpGenerator from "otp-generator";

//sendOtp
export const sendOTP = async (req, res) => {
  try {
    // fetch email fro body
     const {email} = req.body
// check if user  already exists
const checkUserPresent = await User.findOne({email});
// if user already eexist
if(checkUserPresent){
    return res.status(401).json({
        success:false,
        message:"User already register"
    })
}
// generate otp
var otp = otpGenerator.generate(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false
});
console.log("OTP generated:", otp)

//check unique otp or not
const result = await OTP.findOne({otp:otp});
while(result){
    otp =otpGenerator(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false
});

result = await OTP.findOne({otp:otp});
  } 

const otpPayload = {email,otp};
// create an entry in db for otp
const otpBody = await OTP.create (otpPayload);
console.log(otpBody)

// return the response 
res.status(200).json({
    success:true,
    message:"otp send successfully",
    otp,
});

}
  catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error while sending OTP",
    });
  }
};



//sign up
export const signup = async (req,res)=>{
    try{
        // data fetch from req ki body
const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    contactNumber,
    otp,
} = req.body;


//validation  
if (!firstName||!lastName||!email||!password||!confirmPassword ||!otp||!contactNumber){
    return es.status(403).json({
        success:false,
        message:"All fields are required",
    });
}

//2 password match
if(password!== confirmPassword){
    return res.status (400).json({
        success:false,
        message:"password does not matched"
    });
}

//check user already exist or not
const existingUser = await User.findOne({email});
if (existingUser){
    return res.status(400).json({
        success:false,
        message:"Already Existing User"
    });
}
// find most recent otp

const recentOtp = await OTP.find ({emao})
//validate the otp
//hash password 
//create entry database
 


    } catch(error){

    }
}




//login 



//change password