import RatingAndReview from "../models/RatingAndReview.js"
import Course from "../models/Course.js"
//create Rating
export const createRating = async (req,res)=>{
    try{
        //get userid
         const userId = req.user.id;
        //fetch data from req ki body
        const{rating,review,courseId} = req.body;
//validation if user enrolled or not
const courseDetails = await Course.findOne(
                                  {_id: courseId,
                                     studentsEnrolled:{$elemMatch:{$eq:userId}},

                                  },

);

if(! courseDetails){
    return res.staus(500).json({
        success:false,
        message:" student is enrolled in this course"
    })
}
//check user alredy reviewed
const alreadyReviewed = await RatingAndReview.findOne({
                                           user:userId,
                                           course:courseId,
});
if  (alreadyReviewed){
    return res.status(403).json({
        success:false,
        message:"course is already reviewed by the user"
    });
}

//create rating and review
const ratingReview = await RatingAndReview.create({
                                            rating,review,  
                                            course:courseId,
                                            user:userId,
                                                });

//update cousrse with this new rating
 const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                  {
                                 $push :{
                                    ratingAndReviews:ratingReview._id,
                                 }
                                   },
                                {new:true});
    console.log(updatedCourseDetails)   
                             
//return response
return res.status(200).json({
    success:true,
    message:"Rating and review created successfully",
    ratingReview
});
    }catch(error){
        return res.status(500).json({
  success: false,
  message: "Something went wrong while rating the course details",
  error: error.message
});
    }
}


//get avg rating givven by the user
export const getAverageRating = async (req,res)=>{
    try{
//get course id

const courseId = req.body.courseId;
        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                  course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group :{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])
        //return rating

if (result.length > 0){
return res.status(200).json({
    success:true,
    averageRating : result[0].averageRating,
});
}

// if no rating and review exits

return res.status(200).json({

    success:false,
    message:"Avarage rating is 0 ",
    averageRating:0,
})

    }catch(error){
        return res.status(500).json({
  success: false,
  message: "Something went wrong while fetching avg rating the course details",
  error: error.message
});

    }
}

//get all rating and review

export const getAllRating = async (req,res)=>{
try{
  const allReviews  = await RatingAndReview.find({})
                         .sort({rating:"desc"})
                         .populate({
                            path:"user",
                            select:"firstName lastName email image",
                         })
                         .populate({
                            path:"course",
                            select:"courseName",
                         })
                        .exec();
                        return res.status(200).json({
                            success:true,
                            message:"All reviews fetched successfully",
                            data:allReviews
                        });

}catch(error){

     return res.status(500).json({
  success: false,
  error: error.message
});
    
}

}

//get course specific rating and review

