import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    if (!userId) {
      res.status(400).json({ message: 'userId query parameter required' });
      return;
    }
    const donations = await storage.getDonationsByUserId(userId);
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user donations' });
  }
} 