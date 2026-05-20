import mongoose from "mongoose";

const assignmentSchema =
  new mongoose.Schema(

    {

      title: {

        type: String,

        required: true,

      },

      description: {

        type: String,

        required: true,

      },

      deadline: {

        type: Date,

        required: true,

      },

      teacherName: {

        type: String,

        default: "Teacher",

      },

      // ================= TEACHER FILE =================

      assignmentFile: {

        type: String,

        default: "",

      },

      // ================= SUBMISSIONS =================

      submissions: [

        {

          studentName: String,

          submissionLink: String,

          submissionFile: String,

          submittedAt: {

            type: Date,

            default: Date.now,

          },

          marks: {

            type: Number,

            default: 0,

          },

          feedback: {

            type: String,

            default: "",

          },

        },

      ],

    },

    {

      timestamps: true,

    }

  );

export default mongoose.model(

  "Assignment",

  assignmentSchema

);