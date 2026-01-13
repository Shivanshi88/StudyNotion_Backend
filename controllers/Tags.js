import Tag from "../models/tags.js" 
//create Tag ka Handler funcation
export const createTag = async(req, res)=>{
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
const tagDetails = await Tag.create({
    name:name,
    description:description,
});
console.log(tagDetails);

//return respons
return res.status(200).json({
    success:true,
    message:"Tag create succesfully",
})

    }
     catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

// get all tags handler funtion

export const showAlltags = async (req,res)=>{
    try{
const allTags = await Tag.find({ },{name:true,description:true});
res.status(200).json({
    success:true,
    message:"Alll tags return successfullly"
}); 
    } 
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};