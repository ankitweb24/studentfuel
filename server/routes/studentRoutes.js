import express from "express";
import Student from "../model/Student.js"; // Capitalized model name
import Project from "../model/Project.js";
import Attendance from "../model/Attendance.js";

const router = express.Router();

// ➕ Add New Student
router.post("/", async (req, res) => {
  try {
    const newStudent = new Student(req.body); // Use a distinct variable name
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: `Failed to create student: ${err.message}` });
  }
});

// 📋 Get All Students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    const enriched = await Promise.all(
      students.map(async (student) => {
        const attendance = await Attendance.find({ studentId: student._id });
        const projects = await Project.find({ studentId: student._id });
        return { ...student._doc, attendance, projects };
      })
    );
    res.json(enriched); // Return enriched data with attendance and projects
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch students: ${err.message}` });
  }
});

// 🔍 Get One Student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const attendance = await Attendance.find({ studentId: student._id });
    const projects = await Project.find({ studentId: student._id });
    res.json({ ...student._doc, attendance, projects });
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch student: ${err.message}` });
  }
});

export default router;