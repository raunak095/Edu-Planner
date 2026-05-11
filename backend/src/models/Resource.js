import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(

  {

    teacherId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    subject: {

      type: String,

      required: true,

    },

    // 🔗 LINK TO TOPIC
    topicId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Topic",

    },

    title: {

      type: String,

      required: true,

    },

    link: {

      type: String,

    },

    type: {

      type: String,

      enum: [
        "pdf",
        "link",
        "video",
        "note",
      ],

      default: "link",

    },

    // 📈 usefulness
    relevanceScore: {

      type: Number,

      default: 0,

    },

    // ✅ approval system
    isApproved: {

      type: Boolean,

      default: false,

    },

    // 👁️ analytics
    views: {

      type: Number,

      default: 0,

    },

  },

  {

    timestamps: true,

  }

);

export default mongoose.model(
  "Resource",
  resourceSchema
);