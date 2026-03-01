import mongoose from "mongoose";
const ProfileSchema = new mongoose.Schema({
gender:{
    type:String,
     enum: ["Male", "Female", "Other"],
},
dateOfBirth:{
    type:Date,
},
about:{
  type:String,
  trim:true,

},
contactNumber:{
    type:Number,
  
}
});
export default mongoose.model("Profile", ProfileSchema);