const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

module.exports = mongoose.model("Lead", leadSchema);