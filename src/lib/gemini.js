// File: src/lib/gemini.js
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
  } from "@google/generative-ai";
  
  // use the client‐side public var you set in .env.local
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDpMRdgW84A-Ii7Yt7IJvhZFFOYLJwcyEs"
  );
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];
  
  export const generateContent = async (prompt) => {
    try {
      const result = await model.generateContent(prompt, { safetySettings });
      return result.response.text();
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  };
  
  export default generateContent;
  