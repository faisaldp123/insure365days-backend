const express = require("express");
const router = express.Router();

const {
  saveContact,
  getContacts,
} = require("../controllers/contactController");

router.post("/", saveContact);
router.get("/", getContacts);

module.exports = router;