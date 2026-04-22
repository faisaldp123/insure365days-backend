const Lead = require("../models/Lead");
const XLSX = require("xlsx");

// Upload Leads via Excel
exports.uploadLeads = async (req, res) => {
  const file = req.file.path;

  const workbook = XLSX.readFile(file);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const leads = data.map((item) => ({
    name: item.name,
    email: item.email,
    mobile: item.mobile,
  }));

  await Lead.insertMany(leads);

  res.json({ msg: "Leads uploaded" });
};

// Get Leads
exports.getLeads = async (req, res) => {
  const leads =
    req.user.role === "admin"
      ? await Lead.find().populate("assignedTo", "name")
      : await Lead.find({ assignedTo: req.user.id });

  res.json(leads);
};

// Assign Leads
exports.assignLeads = async (req, res) => {
  const { leadIds, employeeId } = req.body;

  await Lead.updateMany(
    { _id: { $in: leadIds } },
    { assignedTo: employeeId }
  );

  res.json({ msg: "Leads assigned" });
};

// Update Lead (Employee)
exports.updateLead = async (req, res) => {
  const { status, callStatus, feedback, callDuration } = req.body;

  const lead = await Lead.findById(req.params.id);

  if (!lead) return res.status(404).json({ msg: "Not found" });

  lead.status = status || lead.status;
  lead.callStatus = callStatus || lead.callStatus;
  lead.feedback = feedback || lead.feedback;
  lead.callDuration = callDuration || lead.callDuration;

  await lead.save();

  res.json(lead);
};