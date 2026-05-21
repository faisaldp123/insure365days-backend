const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: String,

    email: String,

    mobile: String,

    insuranceType: String,

    message: String,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["new", "interested", "not_interested", "follow_up"],
      default: "new",
    },

    callStatus: {
      type: String,
      enum: ["pending", "picked", "not_picked"],
      default: "pending",
    },

    callDuration: String,

    feedback: String,

    followUpDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);