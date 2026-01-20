import mongoose from "mongoose";

const categorySchema= new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   description:{
    typr:String,
    required:true,
   trim:true,
   },
   courses:[
      {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
   }
   ]

});

export default mongoose.model("categorySchema",categorySchema)