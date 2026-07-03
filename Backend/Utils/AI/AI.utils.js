import { openAIGenerateQuestionsFromText } from "./openAI.utils.js";
import { ollamaGenerateQuestionsFromText } from "./ollamaAI.utils.js";

const chooseProvider = () => {
  const provider = String(process.env.AI_PROVIDER || "").toLowerCase().trim();

  if (provider === "openai" || (provider === "" && process.env.OPENAI_API_KEY)) {
    return "openai";
  }

  if (provider === "ollama" || (provider === "" && process.env.OLLAMA_HOST)) {
    return "ollama";
  }

  throw new Error("No AI provider is configured. Set AI_PROVIDER=openai or AI_PROVIDER=ollama, and provide the corresponding credentials.");
};

export const generateQuestionsFromText = async (ocrText) => {
  const provider = chooseProvider();

  if (provider === "openai") {
    return openAIGenerateQuestionsFromText(ocrText);
  }

  if (provider === "ollama") {
    return ollamaGenerateQuestionsFromText(ocrText);
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
};
