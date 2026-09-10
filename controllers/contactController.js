const Contact = require("../models/Contact");

// SAVE CONTACT
exports.saveContact = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      alternativeMobile,
      dob,
      insuranceType,
      brandType,
      termAndPpt,
      applicationNumber,
      nomineeName,
      nomineeDob,
      shortAddress,
      message,
      remarks,
    } = req.body;

    // Reject up front if this applicationNumber has already been submitted.
    if (applicationNumber) {
      const existing = await Contact.findOne({
        applicationNumber: String(applicationNumber).trim(),
      }).select("_id");

      if (existing) {
        return res.status(409).json({
          msg: "This application number has already been submitted.",
          field: "applicationNumber",
        });
      }
    }

    const contact = await Contact.create({
      name,
      email,
      mobile,
      alternativeMobile,
      dob,
      insuranceType,
      brandType,
      termAndPpt,
      applicationNumber,
      nomineeName,
      nomineeDob,
      shortAddress,
      message,
      remarks,

      assignedTo: null,

      status: "new",
      callStatus: "pending",
    });

    res.json(contact);
  } catch (err) {
    // If two submissions race past the findOne check above at the exact
    // same instant, the schema's unique index on applicationNumber still
    // rejects the second insert with Mongo error code 11000. Translate
    // that into the same 409 response.
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.applicationNumber) {
      return res.status(409).json({
        msg: "This application number has already been submitted.",
        field: "applicationNumber",
      });
    }

    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// CHECK IF AN APPLICATION NUMBER ALREADY EXISTS
exports.checkApplicationNumber = async (req, res) => {
  try {
    const { applicationNumber } = req.params;

    if (!applicationNumber || !applicationNumber.trim()) {
      return res.status(400).json({ msg: "applicationNumber is required" });
    }

    const existing = await Contact.findOne({
      applicationNumber: applicationNumber.trim(),
    }).select("_id");

    res.json({ exists: Boolean(existing) });
  } catch (err) {
    console.error("CHECK APPLICATION NUMBER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET CONTACTS
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("assignedTo", "name")
      .sort({
        createdAt: -1,
      });

    res.json(contacts);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// DELETE ONE CONTACT FORM SUBMISSION
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    res.json({ msg: "Contact deleted successfully" });
  } catch (err) {
    console.error("DELETE CONTACT ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
};

// DELETE ALL CONTACT FORM SUBMISSIONS
exports.deleteAllContacts = async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.json({ msg: "All contact submissions deleted successfully" });
  } catch (err) {
    console.error("DELETE ALL CONTACTS ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
};