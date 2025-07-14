import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const messages = await storage.getChatMessages(userId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get chat messages' });
  }
} 