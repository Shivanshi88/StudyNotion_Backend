import mongoose from "mongoose";

const tagsSchema= new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   description:{
    typr:String,
    required:true,
   trim:true,
   },
   course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",

   }

});

export default mongoose.model("tagsSchema",tagsSchema)