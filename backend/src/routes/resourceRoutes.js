import express from "express";

import {
  createResource,
  getResourcesBySubject,
} from "../controllers/resourceController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add Resource
router.post(
  "/resources",
  protect,
  createResource
);

// 📚 Get Resources By Subject
router.get(
  "/resources/:subject",
  protect,
  getResourcesBySubject
);

export default router;