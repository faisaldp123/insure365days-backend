const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadLeads,
  getLeads,
  assignLeads,
  updateLead,
} = require("../controllers/leadController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const upload = multer({ dest: "uploads/" });

router.post("/upload", protect, adminOnly, upload.single("file"), uploadLeads);
router.get("/", protect, getLeads);
router.post("/assign", protect, adminOnly, assignLeads);
router.put("/:id", protect, updateLead);

module.exports = router;