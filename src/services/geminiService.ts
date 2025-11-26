
import { GoogleGenAI } from "@google/genai";

// Initialize the client safely to prevent runtime crashes if process is undefined
const getClient = () => {
  try {
    // Check if process is defined (common cause of white screen in some envs)
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || '';
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize Gemini client:", e);
    return new GoogleGenAI({ apiKey: '' });
  }
};

export const createChatSession = (language: 'tr' | 'en' = 'tr') => {
  const systemInstruction = `
    ROLE: You are MiniBot, a friendly, enthusiastic, and safe science guide for children (ages 4-10).
    LANGUAGE: ${language === 'tr' ? 'Turkish (Türkçe)' : 'English'}.
    TONE: Cheerful, encouraging, simple, and using emojis 🌟.
    RULES:
    1. Keep answers short (max 3 sentences).
    2. Explain complex concepts using simple analogies (e.g., atoms are like Lego blocks).
    3. Always prioritize safety.
    4. End with a fun, curiosity-sparking question.
  `;

  return getClient().chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      topK: 40,
      maxOutputTokens: 200, 
    },
  });
};

export const generateExperimentIdeas = async (category: string, ageGroup: string, language: 'tr' | 'en'): Promise<string> => {
  const prompt = `
    List 3 simple, safe, and fun at-home science experiments for children aged ${ageGroup} related to ${category}.
    Language: ${language === 'tr' ? 'Turkish' : 'English'}.
    Format:
    For each experiment (1, 2, 3):
    Title (with Emoji)
    Materials: (Simple list)
    Instructions: (3-4 short steps)
    Safety Note: (Crucial safety info)
    
    Make it look attractive with spacing. Ensure experiments are safe for home use.
  `;

  try {
    const response = await getClient().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful science teacher for kids. Prioritize safety and simplicity.",
        temperature: 0.8,
      }
    });
    return response.text || (language === 'tr' ? "Deney fikirleri oluşturulamadı." : "Could not generate experiment ideas.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'tr' 
      ? "Deneyleri şu an oluşturamıyorum. Lütfen daha sonra tekrar dene! 🧪" 
      : "I can't generate experiments right now. Please try again later! 🧪";
  }
};
