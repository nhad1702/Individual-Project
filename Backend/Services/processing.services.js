import FileUpload from "../models/FileUpload.js";
import Question from "../models/Question.js";
import { extractTextFromImage } from "../utils/ocr.util.js";
import { generateQuestionsFromText } from "../utils/ai.util.js";

export async function processFile(fileUploadId) {
  const file = await FileUpload.findById(fileUploadId);
  if (!file) throw new Error("File not found");

  try {
    file.status = "processing";
    await file.save();

    // OCR
    const text = await extractTextFromImage(file.fileUrl);
    file.ocrText = text;
    file.status = "ocr_done";
    await file.save();

    // AI
    const questions = await generateQuestionsFromText(text);

    const createdQuestions = await Question.insertMany(
      questions.map(q => ({
        ...q,
        userId: file.userId,
        sourceFile: file._id
      }))
    );

    file.extractedQuestions = createdQuestions.map(q => q._id);
    file.status = "ai_done";
    await file.save();

    return createdQuestions;
  } catch (error) {
    file.status = "failed";
    await file.save();
    throw error;
  }
}