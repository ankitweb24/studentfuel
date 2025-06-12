import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String, // hashed
});

export default mongoose.model("User", userSchema);
