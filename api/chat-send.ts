import { storage } from '../server/storage';
import { processChatMessage } from '../server/services/openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const { message, userId, language = 'en' } = req.body;
    // Store user message
    await storage.createChatMessage({
      userId: userId || null,
      message,
      isUser: true,
      language,
    });
    // Process with OpenAI
    const aiResponse = await processChatMessage(message, language);
    // Store AI response
    await storage.createChatMessage({
      userId: userId || null,
      message: aiResponse.message,
      isUser: false,
      language: aiResponse.language,
    });
    res.status(200).json(aiResponse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to process chat message' });
  }
} 