import mongoose from "mongoose";
import { resetPassword } from "../controllers/ResetPassword";
const userSchema = new mongoose.Schema({
firstName:{
    type:String,
    required:true,
    trim:true,
},
lastName:{
    type:String,
    required:true,
    trim:true,
},
email:{
      type:String,
    required:true,
    trim:true,
     unique:true,
},
password:{
      type:String,
    required:true,

},
accountType:{
type:String,
enum:["Admin","Student","Instructor"],
required:true,
 trim:true,
},
contactNumber: {
  type: String,
  required: true,
},

additionalDetails:{
type:mongoose.Schema.Types.ObjectId,
  ref:"Profile",
    required:true,
  
},
courses:[{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Course",
}],
token:{
    type:String,
},
resetPasswordExpires:{
type:Date,
},
image:{
    type:String,
    required:true,
},
courseProgress:[{
 
    type:mongoose.Schema.Types.ObjectId,
    ref:"CourseProgress",

}]
});
export default mongoose.model("User", userSchema);