import { storage } from '../server/storage';

export default async function handler(req, res) {
  const id = req.query.id ? Number(req.query.id) : undefined;
  if (!id) {
    res.status(400).json({ message: 'Donation ID required' });
    return;
  }
  try {
    if (req.method === 'PUT') {
      const updates = req.body;
      const donation = await storage.updateDonation(id, updates);
      res.status(200).json(donation);
    } else if (req.method === 'DELETE') {
      await storage.deleteDonation(id);
      res.status(200).json({ message: 'Donation deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Donation API error', error: error.message });
  }
} 