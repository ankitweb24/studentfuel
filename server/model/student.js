import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  joinDate: Date,
});

export default mongoose.model("Student", studentSchema);
