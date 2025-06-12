import express from "express";
import Attendance from "../model/Attendance.js";

const router = express.Router();

// ➕ Mark Attendance
router.post("/", async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get Attendance by Student ID
router.get("/:studentId", async (req, res) => {
  const records = await Attendance.find({ studentId: req.params.studentId });
  res.json(records);
});

export default router;
