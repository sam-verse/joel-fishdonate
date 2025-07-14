import { storage } from '../server/storage';

export default async function handler(req, res) {
  const id = req.query.id ? Number(req.query.id) : undefined;
  if (!id) {
    res.status(400).json({ message: 'Alert ID required' });
    return;
  }
  try {
    if (req.method === 'PUT') {
      const updates = req.body;
      const alert = await storage.updateAlert(id, updates);
      res.status(200).json(alert);
    } else if (req.method === 'DELETE') {
      await storage.deleteAlert(id);
      res.status(200).json({ message: 'Alert deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Alert API error', error: error.message });
  }
} 