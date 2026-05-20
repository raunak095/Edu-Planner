import Announcement from "../models/Announcement.js";

import Notification from "../models/Notification.js";

import User from "../models/User.js";

// 📢 CREATE ANNOUNCEMENT
export const createAnnouncement = async (req, res) => {

  try {

    const {
      title,
      message,
    } = req.body;

    // ✅ Validation
    if (!title || !message) {

      return res.status(400).json({
        message:
          "Title and message are required",
      });

    }

    // ✅ Create Announcement
    const newAnnouncement =
      new Announcement({

        title,
        message,

      });

    // 💾 Save Announcement
    await newAnnouncement.save();

    // ================= GET ALL STUDENTS =================

    const students =
      await User.find({

        role: "student",

      });

    // ================= CREATE NOTIFICATIONS =================

    const notifications =
      students.map((student) => ({

        userId: student._id,

        title:
          "📢 New Announcement",

        message:
          `${title} - ${message}`,

        type: "announcement",

      }));

    // 💾 Save Notifications
    await Notification.insertMany(
      notifications
    );

    // ================= REALTIME SOCKET =================

    const io = req.app.get("io");

    notifications.forEach((notification) => {

      io.emit(
        "new-notification",
        notification
      );

    });

    res.status(201).json(
      newAnnouncement
    );

  } catch (error) {

    console.error(
      "Create Announcement Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to create announcement",

    });

  }

};

// 📋 GET ALL ANNOUNCEMENTS
export const getAnnouncements = async (
  req,
  res
) => {

  try {

    const announcements =
      await Announcement.find().sort({

        createdAt: -1,

      });

    res.status(200).json(
      announcements
    );

  } catch (error) {

    console.error(
      "Fetch Announcements Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to fetch announcements",

    });

  }

};

// ❌ DELETE ANNOUNCEMENT
export const deleteAnnouncement = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const deletedAnnouncement =
      await Announcement.findByIdAndDelete(
        id
      );

    if (!deletedAnnouncement) {

      return res.status(404).json({

        message:
          "Announcement not found",

      });

    }

    res.status(200).json({

      message:
        "Announcement deleted successfully",

    });

  } catch (error) {

    console.error(
      "Delete Announcement Error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to delete announcement",

    });

  }

};