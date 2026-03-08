import { GoogleGenAI, ThinkingLevel, Modality, Type } from "@google/genai";

// Note: API key is handled by the platform via process.env.GEMINI_API_KEY
// For gemini-3.1-flash-image-preview, the user must select their own key via openSelectKey()

export interface ChatOptions {
  useThinking?: boolean;
  useSearch?: boolean;
  useFastMode?: boolean;
}

export const chatWithGemini = async (message: string, options: ChatOptions = {}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Select model based on options
  let model = "gemini-3.1-pro-preview"; // Default
  if (options.useFastMode) {
    model = "gemini-3.1-flash-lite-preview";
  } else if (options.useSearch) {
    model = "gemini-3-flash-preview";
  }

  const config: any = {
    systemInstruction: "Você é um Concierge de Luxo especializado em casamentos e eventos de alto padrão. Seu tom é sofisticado, prestativo e refinado. Você ajuda noivas e organizadores a planejar detalhes, escolher paletas de cores e resolver dilemas de etiqueta.",
  };

  if (options.useThinking && !options.useFastMode) {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    // Do not set maxOutputTokens for ThinkingLevel.HIGH as per guidelines
  }

  if (options.useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: message }] }],
    config,
  });

  return response.text;
};

export const generateImageConcept = async (prompt: string, aspectRatio: string = "1:1", base64Image?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Using gemini-3-pro-image-preview for aspect ratio control as requested
  // but gemini-3.1-flash-image-preview is also great. 
  // The user request mentions gemini-3-pro-image-preview for aspect ratios.
  const model = "gemini-3-pro-image-preview";

  const parts: any[] = [{ text: `Crie um conceito visual de luxo para papelaria de casamento baseado nesta descrição: ${prompt}. O estilo deve ser sofisticado, minimalista e elegante.` }];
  
  if (base64Image) {
    parts.push({
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: "image/png"
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  return null;
};
