import express from "express";
import Project from "../model/Project.js";

const router = express.Router();

// ➕ Add Project
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get Projects by Student ID
router.get("/:studentId", async (req, res) => {
  const projects = await Project.find({ studentId: req.params.studentId });
  res.json(projects);
});

export default router;
