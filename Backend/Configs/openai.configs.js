import OpenAI from "openai";
import 'dotenv/config'

const openAICfg = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default openAICfg;