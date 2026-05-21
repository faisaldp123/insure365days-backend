const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: String,

    email: String,

    mobile: String,

    insuranceType: String, // ✅ NEW FIELD

    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);