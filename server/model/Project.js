import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  date: Date,
  title: String,
  description: String,
});

export default mongoose.model("Project", projectSchema);
