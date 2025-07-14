import { storage } from '../server/storage';

export default async function handler(req, res) {
  const id = req.query.id ? Number(req.query.id) : undefined;
  if (!id) {
    res.status(400).json({ message: 'User ID required' });
    return;
  }
  try {
    if (req.method === 'GET') {
      const user = await storage.getUser(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'User API error', error: error.message });
  }
} 