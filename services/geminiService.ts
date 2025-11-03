import { GoogleGenAI, Type } from '@google/genai';

// The API key is set in the environment. 
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    dates: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: 'A date in YYYY-MM-DD format',
      },
    },
  },
  required: ['dates'],
};

export const fetchAvailableDates = async (
  consulate: string,
  visaType: string,
  month: number, // 1-indexed month
  year: number
): Promise<string[]> => {
  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
  const prompt = `
    You are a visa appointment scheduling system simulator.
    For the US consulate in ${consulate} for a ${visaType} visa, during ${monthName} ${year}, generate a plausible list of 5 to 10 available appointment dates.
    Do not make every day available. Assume appointments are only on weekdays (Monday-Friday). Some weeks might have no availability.
    Return the dates in a JSON object with a single key "dates" which is an array of strings in 'YYYY-MM-DD' format.
    If there is absolutely no availability for the entire month, return an empty "dates" array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonString = response.text;
    if (!jsonString) {
      console.error("Gemini API returned an empty response.");
      return [];
    }

    const parsedResponse = JSON.parse(jsonString);
    if (parsedResponse && Array.isArray(parsedResponse.dates)) {
      return parsedResponse.dates.sort();
    }
    return [];
  } catch (error) {
    console.error('Error fetching visa dates from Gemini:', error);
    return [];
  }
};
