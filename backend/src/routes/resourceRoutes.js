const express = require("express");
const router = express.Router();

const { createResource, getResourcesBySubject } = require("../controllers/resourceController");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST: Add resource (teacher/admin only)
router.post("/resources", authMiddleware, createResource);

// GET: Fetch resources by subject
router.get("/resources/:subject", authMiddleware, getResourcesBySubject);

module.exports = router;