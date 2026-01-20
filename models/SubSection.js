import mongoose from "mongoose";
const SubSection = new mongoose.Schema({
 title:{
    type:String,
 },
 timeDuration:{
    type:String,

 },

 description:{
    type:String,
 },
videoUrl:{
    type:String,
    required:true,
}
});
export default mongoose.model("SubSection", SubSection);