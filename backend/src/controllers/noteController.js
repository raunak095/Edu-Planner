import Note from "../models/Note.js";

// 📤 Upload Note
export const uploadNote = async (req, res) => {

  try {

    const { title } = req.body;

    // ✅ Validation
    if (!title || !req.file) {

      return res.status(400).json({
        message: "Title and file are required",
      });

    }

    // 📎 File URL
    const fileUrl = `/uploads/${req.file.originalname}`;

    // ✅ Create Note
    const newNote = new Note({
      title,
      fileUrl,
    });

    // 💾 Save to MongoDB
    await newNote.save();

    res.status(201).json(newNote);

  } catch (error) {

    console.error(
      "Upload Note Error:",
      error
    );

    res.status(500).json({
      message: "Failed to upload note",
    });

  }

};

// 📋 Get All Notes
export const getNotes = async (req, res) => {

  try {

    const notes = await Note.find().sort({
      createdAt: -1,
    });

    res.status(200).json(notes);

  } catch (error) {

    console.error(
      "Fetch Notes Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch notes",
    });

  }

};

// ❌ Delete Note
export const deleteNote = async (req, res) => {

  try {

    const { id } = req.params;

    const deletedNote =
      await Note.findByIdAndDelete(id);

    if (!deletedNote) {

      return res.status(404).json({
        message: "Note not found",
      });

    }

    res.status(200).json({
      message:
        "Note deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete Note Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete note",
    });

  }

};