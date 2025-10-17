
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import type { CharacterProfile, VideoConfig, Scene } from '../types';
import { Language, translations } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Parses errors from the Gemini API and returns a more user-friendly message.
 * @param error The catched error.
 * @param context A string describing the function where the error occurred.
 * @returns A user-friendly error message string.
 */
function getErrorMessage(error: unknown, context: string): string {
    console.error(`Error in ${context}:`, error);
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        // Check for specific error messages from the Gemini SDK
        if (message.includes('api key')) {
            return `API Key Error in ${context}: The API key is not valid or has been disabled. Please ensure it is correctly configured in your environment.`;
        }
        if (message.includes('quota')) {
            return `Quota Error in ${context}: You have exceeded your API usage quota. Please check your Google AI project.`;
        }
        if (message.includes('permission denied')) {
             return `Permission Error in ${context}: The API key lacks the necessary permissions for this operation.`;
        }
         if (message.includes('json')) {
             return `Response Error in ${context}: The model returned an invalid response. It might be helpful to try again.`;
        }
        // Fallback to a cleaner version of the original message
        return `Error in ${context}: ${error.message}`;
    }
    return `An unknown error occurred in ${context}.`;
}

const sceneSchema = {
  type: Type.OBJECT,
  properties: {
    scene_id: { type: Type.INTEGER },
    time: { type: Type.STRING },
    prompt: { type: Type.STRING },
  },
  required: ["scene_id", "time", "prompt"],
};

const fullResponseSchema = {
    type: Type.OBJECT,
    properties: {
        scenes: {
            type: Type.ARRAY,
            items: sceneSchema,
        },
    },
    required: ["scenes"],
};

export const generateStoryIdea = async (style: string, language: Language): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const systemInstruction = translations[language].systemInstruction_generateStoryIdea(style);

  try {
    const response = await ai.models.generateContent({
      model,
      contents: "Please generate a story idea.",
      config: {
        systemInstruction,
        temperature: 0.9,
      },
    });
    return response.text.trim();
  } catch (error) {
    throw new Error(getErrorMessage(error, 'generateStoryIdea'));
  }
};


export const generateScript = async (
  storyIdea: string,
  characters: CharacterProfile[],
  config: VideoConfig,
  language: Language
): Promise<string> => {
  const model = 'gemini-2.5-pro';
  const systemInstruction = translations[language].systemInstruction_generateScript(config);

  const charactersString = characters.map(c => `- ${c.name}: ${c.description}`).join('\n');

  const userPrompt = `
    **Story Idea / Synopsis:**
    ${storyIdea}

    **Main Characters:**
    ${charactersString}
    
    **Video Style:** ${config.style}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.9,
        topP: 0.95,
      },
    });
    
    return response.text.trim();
  } catch (error) {
    throw new Error(getErrorMessage(error, 'generateScript'));
  }
};


export const generateScenePrompts = async (
  characters: CharacterProfile[],
  generatedScript: string,
  config: VideoConfig,
  language: Language,
  existingScenes: Scene[] = []
): Promise<Scene[]> => {
  const model = 'gemini-2.5-flash';
  
  const isContinuation = existingScenes.length > 0;
  const systemInstruction = translations[language].systemInstruction_generateScenes(config, isContinuation);

  const charactersString = characters.map(c => `- ${c.name}: ${c.description}`).join('\n');

  const lastSceneNumber = isContinuation ? Math.max(...existingScenes.map(s => s.scene_id)) : 0;
  
  const continuationPromptPart = isContinuation
    ? `
    You have already generated ${lastSceneNumber} scenes. Please continue generating the storyboard starting from scene number ${lastSceneNumber + 1}.

    **Previously Generated Scenes (for context only, do not repeat them):**
    ${JSON.stringify(existingScenes.slice(-3))} 
    `
    : 'Please generate the video scene prompts based on the following details.';

  const userPrompt = `
    ${continuationPromptPart}

    **Reference Characters:**
    ${charactersString}

    **Full Script to be Visualized:**
    ${generatedScript}

    **Video Configuration:**
    - Total Duration: ${config.duration} seconds
    `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: fullResponseSchema,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const rawText = response.text.trim();
    
    const jsonRegex = /```json\s*([\s\S]*?)\s*```|({[\s\S]*})/;
    const match = rawText.match(jsonRegex);
    
    if (!match) {
        throw new Error("Could not find a valid JSON object in the API response.");
    }
    
    const extractedJson = match[1] || match[2];
    
    let parsedJson;
    try {
        parsedJson = JSON.parse(extractedJson);
    } catch (e) {
        console.error("Failed to parse extracted JSON:", e, "Extracted:", extractedJson);
        throw new Error("Invalid JSON format received from API after cleanup.");
    }

    if (parsedJson.scenes && Array.isArray(parsedJson.scenes)) {
        return parsedJson.scenes as Scene[];
    } else {
        console.warn("Received unexpected JSON structure. 'scenes' array not found.", parsedJson);
        return [];
    }
  } catch (error) {
    throw new Error(getErrorMessage(error, 'generateScenePrompts'));
  }
};

const characterSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
  },
  required: ["name", "description"],
};

const characterListSchema = {
    type: Type.OBJECT,
    properties: {
        characters: {
            type: Type.ARRAY,
            items: characterSchema,
        },
    },
    required: ["characters"],
};

export const generateCharacterDNA = async (script: string, duration: number, language: Language): Promise<CharacterProfile[]> => {
  const model = 'gemini-2.5-flash';
  const systemInstruction = translations[language].systemInstruction_generateCharacters(duration);

  const userPrompt = `
    Analyze the following script/story idea and generate the Character DNA for the key characters, keeping in mind the story is for a ${duration}-second video.

    **Script / Story Idea:**
    ${script}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: characterListSchema,
        temperature: 0.7,
      },
    });

    const rawText = response.text.trim();
    const jsonRegex = /```json\s*([\s\S]*?)\s*```|({[\s\S]*})/;
    const match = rawText.match(jsonRegex);
    
    if (!match) {
        throw new Error("Could not find a valid JSON object in the character response.");
    }
    
    const extractedJson = match[1] || match[2];

    let parsedJson;
    try {
        parsedJson = JSON.parse(extractedJson);
    } catch (e) {
        console.error("Failed to parse extracted JSON for characters:", e, "Extracted:", extractedJson);
        throw new Error("Invalid JSON format for characters received from API.");
    }

    if (parsedJson.characters && Array.isArray(parsedJson.characters)) {
        return (parsedJson.characters as Omit<CharacterProfile, 'id'>[]).map(char => ({
            ...char,
            id: crypto.randomUUID(),
        }));
    } else {
        throw new Error("Invalid JSON structure for characters received from API.");
    }

  } catch (error) {
    throw new Error(getErrorMessage(error, 'generateCharacterDNA'));
  }
};

export const generateCharacterImage = async (description: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const prompt = `Create a full-body, cinematic portrait of the following character. The background should be simple and neutral (e.g., grey or a soft gradient) and not distract from the character. Character details: ${description}`;
  
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: prompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
  
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:image/png;base64,${base64ImageBytes}`;
        }
      }
      throw new Error("No image data found in the response from the model.");
  
    } catch (error) {
      throw new Error(getErrorMessage(error, 'generateCharacterImage'));
    }
  };
  
  export const generateSceneImage = async (scenePrompt: string, referenceImageBase64: string): Promise<string> => {
      const model = 'gemini-2.5-flash-image';
      
      const match = referenceImageBase64.match(/^data:(image\/.+);base64,(.+)$/);
      if (!match) {
          throw new Error("Invalid base64 image format provided for reference.");
      }
      const mimeType = match[1];
      const data = match[2];
  
      const imagePart = {
          inlineData: {
              mimeType,
              data,
          },
      };
      const textPart = {
          text: `Using the provided reference image for character consistency, create a cinematic image for the following scene: ${scenePrompt}`
      };
  
      try {
          const response: GenerateContentResponse = await ai.models.generateContent({
              model,
              contents: { parts: [imagePart, textPart] },
              config: {
                  responseModalities: [Modality.IMAGE],
              },
          });
  
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  const base64ImageBytes: string = part.inlineData.data;
                  return `data:image/png;base64,${base64ImageBytes}`;
              }
          }
          throw new Error("No image data found in the response from the model.");
  
      } catch (error) {
        throw new Error(getErrorMessage(error, 'generateSceneImage'));
      }
  };
