import assert from 'assert';
import { extractTextFromImage } from '../Utils/OCR/OCR.utils.js';
import { generateQuestionsFromText } from '../Utils/AI/AI.utils.js';

process.env.AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';

const exampleImage = './Tests/IMG_0126.jpg';
const allowedTypes = ['multiple_choice', 'true_false', 'short_answer'];
const allowedDifficulties = ['easy', 'medium', 'hard'];

const validateQuestion = (question, index) => {
  assert(question, `Question ${index} is missing`);
  assert.strictEqual(typeof question.questionText, 'string', `Question ${index} must have a questionText`);
  assert(question.questionText.trim().length > 0, `Question ${index} questionText cannot be empty`);
  assert(allowedTypes.includes(question.type), `Question ${index} has invalid type: ${question.type}`);
  assert(allowedDifficulties.includes(question.difficulty), `Question ${index} has invalid difficulty: ${question.difficulty}`);
  assert.strictEqual(typeof question.answer, 'string', `Question ${index} must include an answer string`);

  if (question.type === 'multiple_choice') {
    assert(Array.isArray(question.options), `Question ${index} multiple_choice options must be an array`);
    assert(question.options.length >= 2, `Question ${index} must include at least 2 options`);
    assert(question.options.some(opt => opt.isCorrect), `Question ${index} must include one correct option`);
  } else {
    assert(Array.isArray(question.options), `Question ${index} options must be an array`);
    assert.strictEqual(question.options.length, 0, `Question ${index} of type ${question.type} must not include options`);
    if (question.type === 'true_false') {
      assert(['true', 'false'].includes(question.answer.toLowerCase().trim()), `Question ${index} true_false answer must be "true" or "false"`);
    }
  }
};

const runOCRAndAITest = async () => {
  try {
    console.log('🔍 Running OCR...');
    const text = await extractTextFromImage(exampleImage);

    console.log('\n===== OCR RESULT =====\n');
    console.log(text);

    console.log('\n🤖 Sending OCR text to AI provider...\n');
    const questions = await generateQuestionsFromText(text);

    assert(Array.isArray(questions), 'AI output must be an array');
    assert(questions.length > 0, 'AI output must contain at least one question');

    let foundMultipleChoice = false;
    let foundTrueFalse = false;
    let foundShortAnswer = false;

    questions.forEach((question, index) => {
      validateQuestion(question, index + 1);
      if (question.type === 'multiple_choice') foundMultipleChoice = true;
      if (question.type === 'true_false') foundTrueFalse = true;
      if (question.type === 'short_answer') foundShortAnswer = true;
    });

    assert(foundMultipleChoice, 'Expected at least one multiple_choice question');
    assert(foundTrueFalse, 'Expected at least one true_false question');
    assert(foundShortAnswer, 'Expected at least one short_answer question');

    console.log('✅ OCR/AI regression test passed!');
    console.log('\n===== AI QUESTIONS =====\n');
    console.log(JSON.stringify(questions, null, 2));
  } catch (error) {
    console.error('❌ OCR/AI regression failed:', error.message || error);
    process.exit(1);
  }
};

runOCRAndAITest();
