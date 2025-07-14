import { storage } from '../server/storage';
import { generateWeatherAlert } from '../server/services/openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const { location, condition, severity = 'medium' } = req.body;
    const message = await generateWeatherAlert(location, condition);
    const alert = await storage.createAlert({
      type: 'weather',
      message,
      severity,
      location,
      active: true,
    });
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate weather alert' });
  }
} 