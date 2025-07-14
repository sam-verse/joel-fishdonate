import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChatResponse {
  message: string;
  language: string;
  intent: string;
}

export async function processChatMessage(message: string, language: string = "en"): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are a multilingual AI assistant specialized in helping fishing communities worldwide. You provide information about:
    1. Fishing regulations and laws
    2. Weather and sea conditions
    3. Sustainable fishing practices
    4. Safety guidelines
    5. Fish donation and food waste reduction

    Respond in ${language} language. Be helpful, accurate, and culturally sensitive. If you don't know something, say so clearly.
    
    Format your response as JSON with these fields:
    - message: Your response to the user
    - language: The language you're responding in
    - intent: The main topic/intent of the user's question (weather, law, practice, donation, safety, general)`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      message: result.message || "I'm sorry, I couldn't process your request. Please try again.",
      language: result.language || language,
      intent: result.intent || "general"
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm experiencing technical difficulties. Please try again later.",
      language: language,
      intent: "error"
    };
  }
}

export async function generateWeatherAlert(location: string, condition: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a concise weather alert for fishing communities. Be specific about safety implications."
        },
        {
          role: "user",
          content: `Generate a weather alert for ${location} with condition: ${condition}`
        }
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    return response.choices[0].message.content || `Weather alert for ${location}: ${condition}`;
  } catch (error) {
    console.error("Weather alert generation error:", error);
    return `Weather alert for ${location}: ${condition}`;
  }
}
