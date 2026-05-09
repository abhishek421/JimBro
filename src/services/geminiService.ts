import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const imageCache = new Map<string, string>();

export async function generateEquipmentDoodle(equipmentName: string): Promise<string> {
  if (imageCache.has(equipmentName)) {
    return imageCache.get(equipmentName)!;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: `A simple, minimalist black and white line stroke doodle icon of a ${equipmentName} gym equipment, solid white background, clean lines, no shading, neobrutalism style`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        imageCache.set(equipmentName, imageUrl);
        return imageUrl;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating doodle:", error);
    throw error;
  }
}

export interface WorkoutPlan {
  days: {
    dayOfWeek: string;
    focus: string;
    exercises: {
      id: string;
      name: string;
      sets: number;
      reps: string;
      duration?: number; // in seconds, for timed exercises
      notes?: string;
    }[];
  }[];
}

export async function generateWorkoutPlan(context: any): Promise<WorkoutPlan> {
  const prompt = `
    You are an expert personal trainer. Create a weekly workout plan based on the following user details:
    - Location: ${context.location}
    - Equipment available: ${context.equipment.join(", ")}
    - Weight: ${context.weight} kg
    - Height: ${context.height} cm
    - Gender: ${context.gender}
    - Goal: General fitness and muscle building
    
    Provide a balanced weekly plan with rest days. For each exercise, provide sets and reps (or duration in seconds if it's a timed exercise like plank).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayOfWeek: {
                    type: Type.STRING,
                    description: "e.g., Monday, Tuesday",
                  },
                  focus: {
                    type: Type.STRING,
                    description: "e.g., Upper Body, Legs, Rest",
                  },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: {
                          type: Type.STRING,
                          description: "A unique string ID for the exercise",
                        },
                        name: { type: Type.STRING },
                        sets: { type: Type.INTEGER },
                        reps: {
                          type: Type.STRING,
                          description: "e.g., 10-12, or 'To failure'",
                        },
                        duration: {
                          type: Type.INTEGER,
                          description: "Duration in seconds, if applicable",
                        },
                        notes: { type: Type.STRING },
                      },
                      required: ["id", "name", "sets", "reps"],
                    },
                  },
                },
                required: ["dayOfWeek", "focus", "exercises"],
              },
            },
          },
          required: ["days"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as WorkoutPlan;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw error;
  }
}
