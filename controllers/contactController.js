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
    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
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
