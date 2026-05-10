import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    daysLeft: {
      type: Number,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    // GENERATED PLAN
    plan: [
      {
        day: Number,

        topics: [
          {
            topicId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Topic",
            },

            name: String,

            estimatedHours: Number,

            status: {
              type: String,
              enum: ["pending", "completed", "skipped"],
              default: "pending",
            },
          },
        ],
      },
    ],

    // overall tracking
    progress: {
      completedTopics: { type: Number, default: 0 },
      totalTopics: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", roadmapSchema);