import multer from "multer";
import path from "path";
import fs from "fs";

// ================= CREATE UPLOADS FOLDER =================

const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ================= STORAGE =================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, uploadPath);

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);

  },

});

// ================= FILE FILTER =================

const fileFilter = (req, file, cb) => {

  const allowedMimes = [

    "application/pdf",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "text/plain",

  ];

  const allowedExtensions = [
    ".pdf",
    ".docx",
    ".txt",
  ];

  const fileExt = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    allowedMimes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExt)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only PDF, DOCX, and TXT files are allowed"
      ),
      false
    );

  }

};

// ================= MULTER =================

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 20 * 1024 * 1024,

  },

});

export default upload;