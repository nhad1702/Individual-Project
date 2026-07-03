import 'dotenv/config';

const allowedTypes = ['multiple_choice', 'true_false', 'short_answer'];
const allowedDifficulties = ['easy', 'medium', 'hard'];

const cleanJsonText = (content) => {
  return String(content || '')
    .trim()
    .replace(/```json|```/g, '')
    .replace(/,\s*([}\]])/g, '$1')
    .trim();
};

const normalizeDifficulty = (value) => {
  const difficulty = String(value || '').toLowerCase().trim();
  return allowedDifficulties.includes(difficulty) ? difficulty : 'medium';
};

const normalizeType = (type, options = []) => {
  const normalized = String(type || '').toLowerCase().trim();
  if (allowedTypes.includes(normalized)) return normalized;
  return Array.isArray(options) && options.length > 0 ? 'multiple_choice' : 'short_answer';
};

const normalizeLabel = (label, index) => {
  const raw = String(label || '').trim();
  const normalized = raw
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFF10 + 0x30))
    .replace(/[Ａ-Ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFF21 + 0x41))
    .replace(/[ａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFF41 + 0x61))
    .replace(/^\s*([0-9A-Za-z])[\).．\.]*$/u, "$1")
    .trim();

  if (normalized) return normalized;
  return String.fromCharCode(65 + index);
};

const normalizeAnswer = (value) => {
  return String(value || '')
    .trim()
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFF10 + 0x30))
    .replace(/[Ａ-Ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFF21 + 0x41))
    .replace(/[ａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFF41 + 0x61))
    .replace(/[\).．\.]+$/u, "")
    .trim()
    .toLowerCase();
};

const normalizeOptions = (options, type, answer) => {
  if (type !== 'multiple_choice') return [];

  const normalizedAnswer = normalizeAnswer(answer);

  const normalized = (Array.isArray(options) ? options : [])
    .map((option, index) => {
      const label = normalizeLabel(option?.label, index);
      const text = String(option?.text || '').trim();
      const isCorrect = Boolean(option?.isCorrect)
        || normalizedAnswer === label.toLowerCase()
        || normalizedAnswer === text.toLowerCase();

      return { label, text, isCorrect };
    })
    .filter((option) => option.text);

  if (!normalized.some((option) => option.isCorrect) && normalized.length > 0) {
    normalized[0].isCorrect = true;
  }

  return normalized;
};

const normalizeQuestion = (question) => {
  const answer = String(question?.answer || '').trim();
  const type = normalizeType(question?.type, question?.options);

  return {
    questionText: String(question?.questionText || '').trim(),
    type,
    options: normalizeOptions(question?.options, type, answer),
    answer: answer,
    difficulty: normalizeDifficulty(question?.difficulty)
  };
};

export const ollamaGenerateQuestionsFromText = async (ocrText) => {
  const prompt = `
You are an AI that converts OCR text into structured exam questions.

IMPORTANT RULES:
- Return ONLY valid JSON (no explanation, no markdown)
- Follow EXACT schema below
- Do NOT include extra fields

SCHEMA:
[
  {
    "questionText": "string",
    "type": "multiple_choice | true_false | short_answer",
    "options": [
      { "label": "A", "text": "string", "isCorrect": true }
    ],
    "answer": "string",
    "difficulty": "easy | medium | hard"
  }
]

REQUIREMENTS:
- Use "multiple_choice" when the question has explicit choices.
- Use "true_false" only for true/false questions.
- Use "short_answer" for open-ended or fill-in questions.
- For multiple_choice, generate 4 options with exactly one correct answer. Label choices with either A, B, C, D or 1, 2, 3, 4.
- For true_false and short_answer, set options to [] and provide a valid answer.
- For true_false, answer must be "true" or "false".
- For short_answer, answer should be the expected answer if available, otherwise an empty string.
- Infer difficulty from the question complexity.
- If OCR text is unclear, do your best to interpret it.

TEXT:
${ocrText}
`;

  const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
  const modelName = process.env.OLLAMA_MODEL || 'llama3:8b';

  try {
    const response = await fetch(`${ollamaHost}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let content = cleanJsonText(data.response);

    const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    const parsed = JSON.parse(content);

    return Array.isArray(parsed)
      ? parsed.map(normalizeQuestion).filter((q) => q.questionText)
      : [];

  } catch (error) {
    console.error('AI RAW OUTPUT:', error.message);
    throw new Error('Failed to process Ollama response: ' + error.message);
  }
};