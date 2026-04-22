const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register (optional for now)
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  res.json(user);
};

// Login
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "SECRET_KEY"
  );

  res.json({ token, role: user.role });
};

exports.getUsers = async (req, res) => {
  const users = await User.find({ role: "employee" });
  res.json(users);
};