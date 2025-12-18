import { GoogleGenAI, Type } from "@google/genai";
import { Category, Transaction, FinancialInsights } from "../types";

// ✅ Vite-compatible environment variable
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined;

// ⚠️ Only initialize Gemini if API key exists
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const MODEL_NAME = "gemini-3-flash-preview";

/**
 * Categorize a transaction using Gemini
 */
export const categorizeTransaction = async (
  description: string,
  amount: number
): Promise<Category> => {
  if (!ai) return Category.OTHER;

  try {
    const prompt = `
Categorize this transaction: "${description}" (Amount: ₹${amount}).
Choose exactly one: [Food, Rent, Travel, Utilities, Subscriptions, Shopping, Entertainment, Other].
Return ONLY the word.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        maxOutputTokens: 20,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text?.trim() ?? "Other";

    const categoryValues = Object.values(Category) as string[];
    const matchedCategory = categoryValues.find(
      c => c.toLowerCase() === text.toLowerCase()
    );

    return (matchedCategory as Category) || Category.OTHER;
  } catch (error) {
    console.error("Gemini Categorization Error:", error);
    return Category.OTHER;
  }
};

/**
 * Generate financial insights using Gemini
 */
export const generateInsights = async (
  transactions: Transaction[]
): Promise<FinancialInsights> => {
  if (!ai || transactions.length === 0) {
    return {
      summary: "Add more data for AI analysis.",
      tips: ["Track daily to improve accuracy."],
      lastUpdated: Date.now()
    };
  }

  try {
    const summaryData = transactions.reduce<Record<string, number>>(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {}
    );

    const prompt = `
Analyze spending (INR): ${JSON.stringify(summaryData)}.
Return JSON with:
- "summary": 2 short sentences
- "tips": array of 3 concise tips
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A concise summary of the user's spending habits."
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable financial tips for the user."
            }
          },
          required: ["summary", "tips"],
          propertyOrdering: ["summary", "tips"]
        }
      }
    });

    const parsed = JSON.parse(response.text ?? "{}");

    return {
      summary: parsed.summary || "No summary available.",
      tips: parsed.tips || ["Keep tracking!"],
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return {
      summary: "Insights temporarily unavailable.",
      tips: ["Please check back later."],
      lastUpdated: Date.now()
    };
  }
};
