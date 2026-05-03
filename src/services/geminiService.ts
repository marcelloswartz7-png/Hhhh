import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const optimizeSummary = async (summary: string, jobTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Optimize this professional summary for a ${jobTitle}: "${summary}". Make it impactful, concise, and professional. Return only the optimized text.`,
    });
    return response.text?.trim() || summary;
  } catch (error) {
    console.error("AI Error:", error);
    return summary;
  }
};

export const suggestSkills = async (jobTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 6 core professional skills for a ${jobTitle}. Return them as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const text = response.text?.trim();
    if (text) {
      return JSON.parse(text) as string[];
    }
    return [];
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
};
