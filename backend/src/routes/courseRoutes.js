import express from "express";

import {
  createCourse,
  getCourses,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// 📚 CREATE COURSE
router.post(
  "/",
  createCourse
);

// 📋 GET ALL COURSES
router.get(
  "/",
  getCourses
);

// ❌ DELETE COURSE
router.delete(
  "/:id",
  deleteCourse
);

export default router;