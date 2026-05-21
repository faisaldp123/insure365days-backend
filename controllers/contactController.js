const Contact = require("../models/Contact");

// SAVE CONTACT
exports.saveContact = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      insuranceType,
      message,
    } = req.body;

    const contact = await Contact.create({
      name,
      email,
      mobile,
      insuranceType,
      message,

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