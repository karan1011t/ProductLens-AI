import { GoogleGenAI } from "@google/genai";

const PROMPT_TEMPLATE = `
You are a multimodal product intelligence assistant.
Given the uploaded image, extract all identifiable product details,
infer specifications, detect brand or model if possible, and generate
a structured analysis including:

### PRODUCT SUMMARY
A clear and concise overview of what the product appears to be.

### TECHNICAL FEATURES
List of inferred specifications and features.

### PROS
Bulleted list of strengths.

### CONS
Bulleted list of weaknesses.

### IDEAL USER PROFILES
Who would benefit most from this product.

### PRICE ESTIMATE
Approximate price range (based on visual attributes only, in USD).

### ALTERNATIVES
Two comparable alternative products with 1–2 line comparison each.

### FINAL RECOMMENDATION
Short, clear buying recommendation.

Format everything cleanly using markdown headers (###) and bullet points.
Be decisive. If details cannot be inferred, make best-effort guesses based on visual cues.
`;

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your environment configuration.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-2.5-flash for speed and efficient multimodal capabilities
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: PROMPT_TEMPLATE
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          }
        ]
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No analysis generated.");
    }

    return text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};