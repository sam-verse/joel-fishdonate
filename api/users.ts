import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      const { name, email, avatar } = req.body;
      const user = await storage.createUser({ name, email, avatar, role: 'user' });
      res.status(200).json(user);
    } else if (req.method === 'GET') {
      // Support /api/users?id=123 or /api/users
      const id = req.query.id ? Number(req.query.id) : undefined;
      if (id) {
        const user = await storage.getUser(id);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }
        res.status(200).json(user);
      } else {
        // Optionally, return all users or error
        res.status(400).json({ message: 'User ID required' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'User API error', error: error.message });
  }
} 