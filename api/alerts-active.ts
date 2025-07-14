import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const alerts = await storage.getActiveAlerts();
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get active alerts' });
  }
} 