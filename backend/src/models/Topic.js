import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },

    name: { type: String, required: true },

    // STATIC priority (teacher/system assigned)
    basePriority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    // DYNAMIC score (calculated by algorithm)
    priorityScore: {
      type: Number,
      default: 0,
    },

    // Past exam relevance
    examFrequency: {
      type: Number,
      default: 0,
    },

    // Difficulty level (1–5)
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    // Time needed
    estimatedHours: {
      type: Number,
      default: 1,
    },

    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Topic", topicSchema);