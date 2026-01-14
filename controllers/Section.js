import Section from "../models/Section.js";
import Course from "../models/Course.js";

export const createSection = async (req, res) => {
  try {
    // data fetch from request body
    const { sectionName, courseId } = req.body;

    // validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create new section
    const newSection = await Section.create({ sectonName });

    // update course with section & populate section + subsections
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",          // sections
        populate: {
          path: "subSection",            // subsections inside section
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourseDetails,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
//update section

export const updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId } = req.body
    //data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //update the data
    const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true })

    //return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedCourseDetails,
    });


  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "failed to update the section",
    });
  }

};

// delete the section
export const deleteSection = async (req, res) => {
  try {
    // get id from params
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionId is required",
      });
    }

    // delete section
    const deletedSection = await Section.findByIdAndDelete(sectionId);

    if (!deletedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: deletedSection,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete the section",
    });
  }
};

