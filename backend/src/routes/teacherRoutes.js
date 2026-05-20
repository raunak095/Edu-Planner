import express from "express";

import {

  getTeacherDashboardStats,

  createAssignment,

  getAssignments,

  submitAssignment,

} from "../controllers/teacherController.js";

const router = express.Router();

// ================= DASHBOARD =================

router.get(
  "/dashboard",
  getTeacherDashboardStats
);

// ================= CREATE ASSIGNMENT =================

router.post(
  "/assignments",
  createAssignment
);

// ================= GET ALL ASSIGNMENTS =================

router.get(
  "/assignments",
  getAssignments
);

// ================= SUBMIT ASSIGNMENT =================

router.post(
  "/assignments/:id/submit",
  submitAssignment
);

export default router;
