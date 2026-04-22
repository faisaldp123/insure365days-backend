const Contact = require("../models/Contact");

exports.saveContact = async (req, res) => {
  const contact = await Contact.create(req.body);
  res.json(contact);
};

exports.getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
};