// import { createWorker } from "tesseract.js";

// export const extractTextFromImage = async (imagePath, lang = 'eng') => {
//   const worker = await createWorker();

//   try {
//     await worker.loadLanguage(lang);
//     await worker.initialize(lang);

//     const { data } = await worker.recognize(imagePath);

//     return data.text;
//   } finally {
//     await worker.terminate();
//   }
// }

// import { createWorker } from "tesseract.js";

// export const extractTextFromImage = async (imagePath) => {
//   const worker = await createWorker("jpn");

//   try {
//     const { data } = await worker.recognize(imagePath);

//     console.log("📝 OCR TEXT:\n", data.text); // debug

//     return data.text;

//   } catch (error) {
//     console.error("OCR Error:", error);
//     throw error;

//   } finally {
//     await worker.terminate();
//   }
// };

import { createWorker } from "tesseract.js";

// 🧠 Clean Japanese OCR text
const cleanJapaneseText = (text) => {
  return text
    // normalize spaces
    .replace(/\s+/g, " ")

    // remove spaces between Japanese characters
    .replace(/([ぁ-んァ-ン一-龯])\s+([ぁ-んァ-ン一-龯])/g, "$1$2")

    // remove spaces before punctuation
    .replace(/\s+([。、！？])/g, "$1")

    // fix common OCR splits like "ちょ っ と" → "ちょっと"
    .replace(/っ\s+/g, "っ")

    // trim
    .trim();
};

export const extractTextFromImage = async (imagePath) => {
  const worker = await createWorker("jpn+eng"); // ✅ better for mixed text

  try {
    const { data } = await worker.recognize(imagePath, {
      tessedit_pageseg_mode: 6 // assume uniform text block
    });

    console.log("📝 RAW OCR TEXT:\n", data.text);

    // 🔥 CLEAN TEXT
    const cleanedText = cleanJapaneseText(data.text);

    console.log("\n✨ CLEANED TEXT:\n", cleanedText);

    return cleanedText;

  } catch (error) {
    console.error("OCR Error:", error);
    throw error;

  } finally {
    await worker.terminate();
  }
};