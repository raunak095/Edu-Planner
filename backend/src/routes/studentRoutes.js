import express from "express";

import {
  createStudent,
  getStudents,
  deleteStudent,
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

export default router;