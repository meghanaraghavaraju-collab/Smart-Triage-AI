import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

let openaiClient = null;

export const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return null; // Signals to service to use clinical heuristic fallback engine
  }
  
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
};
