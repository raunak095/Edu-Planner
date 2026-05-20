import express from "express";

import {

  createAssignment,

  getAssignments,

  submitAssignment,

} from "../controllers/assignmentController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ================= CREATE ASSIGNMENT =================

router.post(

  "/",

  upload.single("assignmentFile"),

  createAssignment

);

// ================= GET ASSIGNMENTS =================

router.get(
  "/",
  getAssignments
);

// ================= SUBMIT ASSIGNMENT =================

router.post(

  "/:id/submit",

  upload.single("submissionFile"),

  submitAssignment

);

export default router;