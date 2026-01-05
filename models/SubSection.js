import mongoose from "mongoose";
const SubSection = new mongoose.Schema({
 title:{
    type:String,
 },
 timeDuration:{
    type:String,

 },

 Discription:{
    type:String,
 },
VideoUrl:{
    type:String,
    required:true,
}
});
export default mongoose.model("SubSection", SubSection);