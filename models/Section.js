import mongoose from "mongoose";
const Section = new mongoose.Schema({
sectionName:{
    type:String,
},
subSection:[{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"SubSection",
}]
});
export default mongoose.model("Section", Section);