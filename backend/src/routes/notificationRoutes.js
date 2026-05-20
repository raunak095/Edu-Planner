import express from "express";

import Notification from "../models/Notification.js";

const router = express.Router();

// ================= GET USER NOTIFICATIONS =================

router.get("/:userId", async (req, res) => {

  try {

    const notifications =
      await Notification.find({

        userId: req.params.userId,

      }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Failed to fetch notifications",

    });

  }

});

// ================= CREATE NOTIFICATION =================

router.post("/", async (req, res) => {

  try {

    const notification =
      await Notification.create(req.body);

    res.json(notification);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Failed to create notification",

    });

  }

});

// ================= MARK AS READ =================

router.put("/:id/read", async (req, res) => {

  try {

    const updated =
      await Notification.findByIdAndUpdate(

        req.params.id,

        { read: true },

        { new: true }

      );

    res.json(updated);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Failed to update notification",

    });

  }

});

export default router;