import Category from "../models/Category.js";

// ================= CREATE CATEGORY =================
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDetails = await Category.create({
      name,
      description,
    });

    console.log(categoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= SHOW ALL CATEGORIES =================
export const showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    return res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CATEGORY PAGE DETAILS =================
export const categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // selected category courses
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category",
      });
    }

    const selectedCourses = selectedCategory.courses;

    // courses from other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate("courses");

    let differentCourses = [];
    for (const category of categoriesExceptSelected) {
      differentCourses.push(...category.courses);
    }

    // top-selling courses
    const allCategories = await Category.find().populate("courses");
    const allCourses = allCategories.flatMap(
      (category) => category.courses
    );

    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      selectedCourses,
      differentCourses,
      mostSellingCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
