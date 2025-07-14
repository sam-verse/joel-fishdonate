import { storage } from '../server/storage';
import { insertDonationSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.userId) {
        const donations = await storage.getDonationsByUserId(Number(req.query.userId));
        res.status(200).json(donations);
      } else {
        const donations = await storage.getDonations();
        res.status(200).json(donations);
      }
    } else if (req.method === 'POST') {
      try {
        const donationData = insertDonationSchema.parse(req.body);
        const donation = await storage.createDonation(donationData);
        res.status(200).json(donation);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({ message: 'Invalid donation data', errors: error.errors });
        } else {
          res.status(500).json({ message: 'Failed to create donation' });
        }
      }
    } else if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const donation = await storage.updateDonation(Number(id), updates);
      res.status(200).json(donation);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await storage.deleteDonation(Number(id));
      res.status(200).json({ message: 'Donation deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Donation API error', error: error.message });
  }
} 