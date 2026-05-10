import Course from "../models/Course.js";

// 📚 CREATE COURSE
export const createCourse = async (req, res) => {

  try {

    const {
      title,
      description,
    } = req.body;

    // ✅ Validation
    if (!title || !description) {

      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // ✅ Create Course
    const newCourse = new Course({
      title,
      description,
    });

    // ✅ Save to MongoDB
    await newCourse.save();

    res.status(201).json(newCourse);

  } catch (error) {

    console.error("Create Course Error:", error);

    res.status(500).json({
      message: "Failed to create course",
    });
  }
};

// 📋 GET ALL COURSES
export const getCourses = async (req, res) => {

  try {

    const courses = await Course.find().sort({
      createdAt: -1,
    });

    res.status(200).json(courses);

  } catch (error) {

    console.error("Fetch Courses Error:", error);

    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
};

// ❌ DELETE COURSE
export const deleteCourse = async (req, res) => {

  try {

    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {

      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
    });

  } catch (error) {

    console.error("Delete Course Error:", error);

    res.status(500).json({
      message: "Failed to delete course",
    });
  }
};