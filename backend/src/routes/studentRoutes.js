import express from "express";

import {

  createStudent,

  getStudents,

  deleteStudent,

  getStudentSettings,

  updateStudentSettings,

} from "../controllers/studentController.js";

const router = express.Router();

// 👨‍🎓 CREATE STUDENT
router.post(
  "/",
  createStudent
);

// 📋 GET ALL STUDENTS
router.get(
  "/",
  getStudents
);

// ❌ DELETE STUDENT
router.delete(
  "/:id",
  deleteStudent
);

// ================= GET SETTINGS =================

router.get(
  "/settings/:id",
  getStudentSettings
);

// ================= UPDATE SETTINGS =================

router.put(
  "/settings/:id",
  updateStudentSettings
);

export default router;