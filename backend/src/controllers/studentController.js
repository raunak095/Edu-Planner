import Student from "../models/Student.js";

// 👨‍🎓 CREATE STUDENT
export const createStudent = async (req, res) => {

  try {

    const {
      name,
      email,
    } = req.body;

    // ✅ Validation
    if (!name || !email) {

      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // ✅ Check Existing
    const existingStudent =
      await Student.findOne({ email });

    if (existingStudent) {

      return res.status(400).json({
        message: "Student already exists",
      });
    }

    // ✅ Create Student
    const newStudent = new Student({
      name,
      email,

      // ================= DEFAULT SETTINGS =================

      settings: {

        focusDuration: 25,

        dailyGoal: 4,

        musicAutoplay: true,

        notifications: true,

        aiMode: "Balanced",

      },

    });

    await newStudent.save();

    res.status(201).json(newStudent);

  } catch (error) {

    console.error(
      "Create Student Error:",
      error
    );

    res.status(500).json({
      message: "Failed to create student",
    });
  }
};

// 📋 GET ALL STUDENTS
export const getStudents = async (req, res) => {

  try {

    const students =
      await Student.find().sort({
        createdAt: -1,
      });

    res.status(200).json(students);

  } catch (error) {

    console.error(
      "Fetch Students Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};

// ❌ DELETE STUDENT
export const deleteStudent = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const deletedStudent =
      await Student.findByIdAndDelete(id);

    if (!deletedStudent) {

      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message:
        "Student deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete Student Error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete student",
    });
  }
};

// ================= GET STUDENT SETTINGS =================

export const getStudentSettings = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const student =
      await Student.findById(id);

    if (!student) {

      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(
      student.settings
    );

  } catch (error) {

    console.error(
      "Get Settings Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch settings",
    });
  }
};

// ================= UPDATE STUDENT SETTINGS =================

export const updateStudentSettings =
  async (req, res) => {

    try {

      const { id } = req.params;

      const {

        focusDuration,

        dailyGoal,

        musicAutoplay,

        notifications,

        aiMode,

      } = req.body;

      const updatedStudent =
        await Student.findByIdAndUpdate(

          id,

          {

            settings: {

              focusDuration,

              dailyGoal,

              musicAutoplay,

              notifications,

              aiMode,

            },

          },

          { new: true }

        );

      if (!updatedStudent) {

        return res.status(404).json({
          message: "Student not found",
        });
      }

      res.status(200).json({

        message:
          "Settings updated successfully",

        settings:
          updatedStudent.settings,

      });

    } catch (error) {

      console.error(
        "Update Settings Error:",
        error
      );

      res.status(500).json({
        message: "Failed to update settings",
      });
    }
  };