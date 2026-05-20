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

      // ================= FILE =================

      let submissionFile = "";

      if (req.file) {

        submissionFile =
          `/uploads/${req.file.filename}`;

      }

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