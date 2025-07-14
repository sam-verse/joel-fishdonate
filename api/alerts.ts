import { storage } from '../server/storage';
import { insertAlertSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // /api/alerts or /api/alerts?active=true
      if (req.query.active === 'true') {
        const alerts = await storage.getActiveAlerts();
        res.status(200).json(alerts);
      } else {
        const alerts = await storage.getAlerts();
        res.status(200).json(alerts);
      }
    } else if (req.method === 'POST') {
      try {
        const alertData = insertAlertSchema.parse(req.body);
        const alert = await storage.createAlert(alertData);
        res.status(200).json(alert);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({ message: 'Invalid alert data', errors: error.errors });
        } else {
          res.status(500).json({ message: 'Failed to create alert' });
        }
      }
    } else if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const alert = await storage.updateAlert(Number(id), updates);
      res.status(200).json(alert);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await storage.deleteAlert(Number(id));
      res.status(200).json({ message: 'Alert deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Alert API error', error: error.message });
  }
} 