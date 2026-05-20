import Assignment from "../models/Assignment.js";

// ================= DASHBOARD =================

export const getTeacherDashboardStats = async (
  req,
  res
) => {

  try {

    const assignments =
      await Assignment.countDocuments();

    res.status(200).json({

      courses: 12,

      quizzes: 34,

      students: 120,

      uploads: 18,

      assignments,

    });

  } catch (error) {

    console.error(
      "Teacher Dashboard Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load dashboard stats",
    });

  }

};

// ================= CREATE ASSIGNMENT =================

export const createAssignment = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      deadline,
      teacherName,
    } = req.body;

    const assignment =
      await Assignment.create({

        title,

        description,

        deadline,

        teacherName,

      });

    res.status(201).json(
      assignment
    );

  } catch (error) {

    console.error(
      "Create Assignment Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to create assignment",

    });

  }

};

// ================= GET ASSIGNMENTS =================

export const getAssignments = async (
  req,
  res
) => {

  try {

    const assignments =
      await Assignment.find().sort({
        createdAt: -1,
      });

    res.status(200).json(
      assignments
    );

  } catch (error) {

    console.error(
      "Get Assignments Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to fetch assignments",

    });

  }

};

// ================= SUBMIT ASSIGNMENT =================

export const submitAssignment = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      studentName,
      fileUrl,
    } = req.body;

    const assignment =
      await Assignment.findById(id);

    if (!assignment) {

      return res.status(404).json({

        message:
          "Assignment not found",

      });

    }

    assignment.submissions.push({

      studentName,

      fileUrl,

    });

    await assignment.save();

    res.status(200).json({

      message:
        "Assignment submitted successfully",

    });

  } catch (error) {

    console.error(
      "Submit Assignment Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to submit assignment",

    });

  }

};