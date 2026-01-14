import Tag from "../models/category.js" 
//create Tag ka Handler funcation
export const createCategory = async(req, res)=>{
    try{
       const {name,description} = req.body;

       //validation

        if(!name || !description){
return res.status(400).json({
    success:false,
    message:"all fields are requires",
})
        }
// create entry in db
const categoryDetails = await Tag.create({
    name:name,
    description:description,
});
console.log(categoryDetails);

//return respons
return res.status(200).json({
    success:true,
    message:"category create succesfully",
})

    }
     catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

// get all category handler funtion

export const showAllCategory = async (req,res)=>{
    try{
const allTags = await Tag.find({ },{name:true,description:true});
res.status(200).json({
    success:true,
    message:"Alll category return successfullly"
}); 
    } 
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};