import Resource from "../models/Resource.js";

// ================= CREATE RESOURCE =================
export const createResource = async (req, res) => {

  try {

    const {
      subject,
      topicId,
      title,
      link,
      type,
    } = req.body;

    // 🔐 Role Check
    if (
      req.user.role !== "teacher" &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message:
          "Only teachers/admins can add resources",
      });

    }

    // ✅ Validation
    if (!subject || !title) {

      return res.status(400).json({
        message:
          "Subject and title are required",
      });

    }

    // ✅ Create Resource
    const resource = await Resource.create({

      teacherId: req.user.id,

      subject: subject.toLowerCase(),

      topicId,

      title,

      link,

      type,

    });

    res.status(201).json({

      message:
        "Resource added successfully",

      resource,

    });

  } catch (err) {

    console.error(
      "Create Resource Error:",
      err
    );

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= GET RESOURCES =================
export const getResourcesBySubject = async (req, res) => {

  try {

    const { subject } = req.params;

    const resources = await Resource.find({

      subject: new RegExp(
        `^${subject}$`,
        "i"
      ),

      isApproved: true,

    });

    if (!resources.length) {

      return res.status(404).json({
        message:
          "No resources found for this subject",
      });

    }

    res.status(200).json({
      resources,
    });

  } catch (err) {

    console.error(
      "Get Resources Error:",
      err
    );

    res.status(500).json({
      message: err.message,
    });

  }

};