import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import dbConnect from "./db/db.js";

const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dbConnect();
const app = express();

// लॉगिंग मिडलवेयर (डीबगिंग के लिए)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(cors());

// स्टैटिक फाइल्स सर्व करें
app.use(express.static(path.join(__dirname, '../client/build')));

import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// API रूट्स
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

// विशिष्ट रूट्स के लिए React की index.html सर्व करें
const reactRoutes = ['/', '/about', '/dashboard', '/login']; // अपने React रूट्स यहाँ जोड़ें
reactRoutes.forEach(route => {
  app.get(route, (req, res) => {
    console.log(`Serving index.html for route: ${req.url}`);
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
});

// गलत रिक्वेस्ट्स को ब्लॉक करें
app.use((req, res, next) => {
  if (req.url.includes('https://git.new') || req.url.includes('pathToRegexpError')) {
    console.warn(`Blocked invalid URL: ${req.url}`);
    return res.status(400).send('Invalid request URL');
  }
  next();
});

// त्रुटि हैंडलिंग मिडलवेयर
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get("/", (req, res) => {
  res.send("Student Tracker API is Running");
});

app.listen(port, () => {
  console.log("Server running on port: " + port);
});