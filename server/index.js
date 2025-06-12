import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



import dbConnect from "./db/db.js";

const port = process.env.PORT;

dbConnect();
const app = express();
app.use(express.json());
app.use(cors());



import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Serve React static files
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Student Tracker API is Running");
});

app.listen(port, () => {
  console.log("Server running on port:" + port);
});
