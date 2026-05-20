import Assignment from "../models/Assignment.js";

// ================= CREATE =================

export const createAssignment =
  async (req, res) => {

    try {

      const {

        title,

        description,

        deadline,

        teacherName,

      } = req.body;

      // ================= FILE =================

      let assignmentFile = "";

      if (req.file) {

        assignmentFile =
          `/uploads/${req.file.filename}`;

      }

      // ================= CREATE =================

      const assignment =
        await Assignment.create({

          title,

          description,

          deadline,

          teacherName,

          assignmentFile,

        });

      res.status(201).json(
        assignment
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to create assignment",

      });

    }

  };

// ================= GET =================

export const getAssignments =
  async (req, res) => {

    try {

      const assignments =
        await Assignment.find().sort({

          createdAt: -1,

        });

      res.json(assignments);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch assignments",

      });

    }

  };

// ================= SUBMIT =================

export const submitAssignment =
  async (req, res) => {

    try {

      const {

        studentName,

        submissionLink,

      } = req.body;

      const assignment =
        await Assignment.findById(
          req.params.id
        );

      if (!assignment) {

        return res.status(404).json({

          message:
            "Assignment not found",

        });

      }

      // ================= FILE =================

      let submissionFile = "";

      if (req.file) {

        submissionFile =
          `/uploads/${req.file.filename}`;

      }

      // ================= PUSH =================

      assignment.submissions.push({

        studentName,

        submissionLink,

        submissionFile,

      });

      await assignment.save();

      res.json({

        message:
          "Assignment submitted",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Submission failed",

      });

    }

  };

// ================= GRADE SUBMISSION =================

export const gradeSubmission =
  async (req, res) => {

    try {

      const {

        assignmentId,

        submissionId,

      } = req.params;

      const {

        marks,

        feedback,

      } = req.body;

      // ================= FIND ASSIGNMENT =================

      const assignment =
        await Assignment.findById(
          assignmentId
        );

      if (!assignment) {

        return res.status(404).json({

          message:
            "Assignment not found",

        });

      }

      // ================= FIND SUBMISSION =================

      const submission =
        assignment.submissions.id(
          submissionId
        );

      if (!submission) {

        return res.status(404).json({

          message:
            "Submission not found",

        });

      }

      // ================= UPDATE =================

      submission.marks = marks;

      submission.feedback =
        feedback;

      await assignment.save();

      res.json({

        message:
          "Submission graded successfully",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Grading failed",

      });

    }

  };