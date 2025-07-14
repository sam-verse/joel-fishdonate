import { storage } from '../server/storage';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { name, email, avatar } = req.body;
      const user = await storage.createUser({ name, email, avatar, role: 'user' });
      res.status(200).json(user);
    } else if (req.method === 'GET') {
      if (!req.query.id) {
        res.status(400).json({ message: 'User ID required' });
        return;
      }
      const user = await storage.getUser(Number(req.query.id));
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