// models/Question.js
import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  label: String,
  text: String,
  isCorrect: Boolean
});

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  sourceFile: { type: mongoose.Schema.Types.ObjectId, ref: "FileUploads" },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Tests" },

  questionText: { type: String, required: true },
  type: { type: String, enum: ["multiple_choice", "true_false", "short_answer"] },
  options: [optionSchema],
  answer: { type: String, required: true },

  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  verified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

const questionModel = mongoose.model("Questions", questionSchema);
export default questionModel;