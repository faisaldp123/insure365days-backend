const Lead = require("../models/Lead");
const Contact = require("../models/Contact");
const XLSX = require("xlsx");

// Upload Leads via Excel
exports.uploadLeads = async (req, res) => {
  try {
    const file = req.file.path;

    const workbook = XLSX.readFile(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const leads = data.map((item) => ({
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      assignedTo: null,
    }));

    await Lead.insertMany(leads);

    res.json({
      msg: "Leads uploaded",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Upload failed",
    });
  }
};

// Get Leads
exports.getLeads = async (req, res) => {
  try {
    let excelLeads = [];
    let contactLeads = [];

    if (req.user.role === "admin") {
      excelLeads = await Lead.find()
        .populate("assignedTo", "name")
        .lean();

      contactLeads = await Contact.find()
        .populate("assignedTo", "name")
        .lean();
    } else {
      excelLeads = await Lead.find({
        assignedTo: req.user.id,
      }).lean();

      contactLeads = await Contact.find({
        assignedTo: req.user.id,
      }).lean();
    }

    const allLeads = [
      ...excelLeads.map((lead) => ({
        ...lead,
        source: "excel",
      })),

      ...contactLeads.map((lead) => ({
        ...lead,
        source: "contact",
      })),
    ];

    allLeads.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    res.json(allLeads);
  } catch (err) {
    console.error("GET LEADS ERROR:", err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// Assign Leads + Contacts
exports.assignLeads = async (req, res) => {
  try {
    const { leadIds, employeeId } = req.body;

    if (!leadIds || !leadIds.length) {
      return res.status(400).json({
        msg: "No leads selected",
      });
    }

    if (!employeeId) {
      return res.status(400).json({
        msg: "Employee is required",
      });
    }

    // Update Excel Leads
    await Lead.updateMany(
      {
        _id: { $in: leadIds },
      },
      {
        assignedTo: employeeId,
      }
    );

    // Update Contact Form Leads
    await Contact.updateMany(
      {
        _id: { $in: leadIds },
      },
      {
        assignedTo: employeeId,
      }
    );

    res.json({
      msg: "Leads assigned successfully",
    });
  } catch (err) {
    console.error("ASSIGN ERROR:", err);

    res.status(500).json({
      msg: "Assignment failed",
    });
  }
};

// Update Lead (Employee)
exports.updateLead = async (req, res) => {
  try {
    const { status, callStatus, feedback, callDuration } = req.body;

    let lead = await Lead.findById(req.params.id);

    // If not found in Lead collection, check Contact collection
    if (!lead) {
      lead = await Contact.findById(req.params.id);
    }

    if (!lead) {
      return res.status(404).json({
        msg: "Not found",
      });
    }

    lead.status = status || lead.status;
    lead.callStatus = callStatus || lead.callStatus;
    lead.feedback = feedback || lead.feedback;
    lead.callDuration = callDuration || lead.callDuration;

    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      msg: "Update failed",
    });
  }
};