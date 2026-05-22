import { extractTextFromImage } from '../Utils/OCR/OCR.utils.js'
import { generateQuestionsFromText } from '../Utils/OpenAI/openAI.utils.js'

const testOCRAndAI = async () => {
    try {
        const imgPath = './Tests/Example1_image.png'

        console.log("🔍 Running OCR...");
        const text = await extractTextFromImage(imgPath);

        console.log("\n===== OCR RESULT =====\n");
        console.log(text);

        console.log("\n🤖 Sending to OpenAI...\n");
        const questions = await generateQuestionsFromText(text);

        console.log("\n===== AI QUESTIONS =====\n");
        console.log(JSON.stringify(questions, null, 2));
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testOCRAndAI()