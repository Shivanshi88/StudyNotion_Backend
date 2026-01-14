import SubSection from "../models/SubSection.js";
import Section from "../models/Section.js";
import { uploadImagetoCloudinary } from "../utils/imageUploader.js";

// create subsection logic
export const CreateSubSection = async (req, res) => {
  try {
    // fetch data from req body
    const { sectionId, title, timeduration, description } = req.body;

    // extract video file
    const video = req.files?.videoFile;

    // validation
    if (!sectionId || !title || !timeduration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const uploadDetails = await uploadImagetoCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create subsection
    const subSectionDetails = await SubSection.create({
      title,
      timeduration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // update section with this subsection
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    )
      .populate("subSection")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// update subsection logic
export const updateSubSection = async (req, res) => {
  try {
    // fetch data
    const { subSectionId, title, timeduration, description } = req.body;

    // extract video file (optional)
    const video = req.files?.videoFile;

    // validation
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId is required",
      });
    }

    // find subsection
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // update fields if provided
    if (title) subSection.title = title;
    if (timeduration) subSection.timeduration = timeduration;
    if (description) subSection.description = description;

    // if new video uploaded, update video
    if (video) {
      const uploadDetails = await uploadImagetoCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
    }

    // save updated subsection
    await subSection.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: subSection,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// delete subsection logic
export const deleteSubSection = async (req, res) => {
  try {
    // fetch ids
    const { subSectionId, sectionId } = req.body;

    // validation
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId and sectionId are required",
      });
    }

    // delete subsection
    await SubSection.findByIdAndDelete(subSectionId);

    // remove subsection reference from section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
