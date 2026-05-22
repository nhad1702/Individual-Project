// models/Test.js
import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions" }],
  timeLimit: Number,
  visibility: { type: String, enum: ["private", "public"], default: "private" },
  createdAt: { type: Date, default: Date.now }
});

 const testModel = mongoose.model("Test", testSchema);
export default testModel;