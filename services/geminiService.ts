
import { GoogleGenAI, Type } from "@google/genai";
import { LeaveEntry, LeaveType, LeaveQuota, PublicHoliday } from "../types";
import { ANNUAL_QUOTA } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (aiClient) {
    return aiClient;
  }

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    aiClient = new GoogleGenAI({ apiKey });
    return aiClient;
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    return null;
  }
};

export const getSmartLeavePlanning = async (
  currentLeaves: LeaveEntry[],
  remainingQuota: LeaveQuota,
  holidays: PublicHoliday[] = []
) => {
  const ai = getAiClient();
  if (!ai) {
    return null;
  }

  const year = new Date().getFullYear();
  const prompt = `
    I have a leave tracking app. Current year is ${year}.
    My total annual quota is: Vacation: ${ANNUAL_QUOTA[LeaveType.VACATION]}, Sick: ${ANNUAL_QUOTA[LeaveType.SICK]}.
    My remaining balance is: Vacation: ${remainingQuota[LeaveType.VACATION]}, Sick: ${remainingQuota[LeaveType.SICK]}.
    
    The following public holidays are configured in my system:
    ${holidays.map(h => `- ${h.name}: ${h.date}`).join('\n')}

    Current booked leaves:
    ${currentLeaves.map(l => `- ${l.type}: ${l.startDate} to ${l.endDate} (${l.description})`).join('\n')}

    Act as a professional HR and life coach. Suggest 3 creative ways to use my remaining VACATION days effectively. 
    Crucially, look at the configured public holidays and suggest "bridge days" to maximize my time off (e.g., if a holiday is on a Thursday, suggest taking the Friday off for a 4-day weekend).
    Provide specific dates based on the configured holidays.
    Also provide a brief motivational summary of my current balance.
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
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  dates: { type: Type.STRING },
                  benefit: { type: Type.STRING }
                },
                required: ["title", "description", "dates", "benefit"]
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["suggestions", "summary"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return null;
  }
};
