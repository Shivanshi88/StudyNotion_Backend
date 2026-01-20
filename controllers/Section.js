import Section from "../models/Section.js";
import Course from "../models/Course.js";

// create a new section
export const createSection = async (req, res) => {
  try {
    // extract section name and course id from request body
    const { sectionName, courseId } = req.body;

    // validate input fields
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    // create new section in database
    const newSection = await Section.create({ sectionName });

    // add section id into course content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // send success response with updated course
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    // handle server error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update section name
export const updateSection = async (req, res) => {
  try {
    // extract section name and section id
    const { sectionName, sectionId } = req.body;

    // update section in database
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return updated section
    return res.status(200).json({
      success: true,
      message: section,
    });
  } catch (error) {
    // handle error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// delete a section
export const deleteSection = async (req, res) => {
  try {
    // get section id from request params
    const { sectionId } = req.params;

    // delete section from database
    await Section.findByIdAndDelete(sectionId);

    // send success response
    return res.status(200).json({
      success: true,
      message: "Section deleted",
    });
  } catch (error) {
    // handle error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
