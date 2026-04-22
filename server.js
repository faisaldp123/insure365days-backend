const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));