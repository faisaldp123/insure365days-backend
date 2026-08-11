const express = require("express");
const router = express.Router();

const {
  saveContact,
  getContacts,
  deleteContact,
  deleteAllContacts,
} = require("../controllers/contactController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", saveContact);
router.get("/", getContacts);
router.delete("/delete-all", protect, adminOnly, deleteAllContacts);
router.delete("/:id", protect, adminOnly, deleteContact);

module.exports = router;
