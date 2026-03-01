// Import required modules
import express from "express";
const router = express.Router();

// ================= Controllers =================

// Course Controllers
import {
  createCourse,
  getAllCourses,
  getCourseDetails,
} from "../controllers/Course.js";

// Category Controllers
import {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} from "../controllers/Category.js";

// Section Controllers
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/Section.js";

// Sub-Section Controllers
import { 
  CreateSubSection,
  updateSubSection,
  deleteSubSection
} from "../controllers/SubSection.js";


// Rating & Review Controllers
import {
  createRating,
  getAverageRating,
  getAllRating,
} from "../controllers/RatingAndReview.js";

// ================= Middlewares =================
import {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Create Course (Instructor only)
router.post("/createCourse", auth, isInstructor, createCourse);

// Section routes
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);

// Sub-section routes
router.post("/addSubSection", auth, isInstructor, CreateSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Course fetching
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);

// ********************************************************************************************************
//                                      Category routes (Admin only)
// ********************************************************************************************************

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review routes
// ********************************************************************************************************

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

// ================= Export =================
export default router;
