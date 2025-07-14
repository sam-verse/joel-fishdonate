import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertDonationSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const id = req.query.id ? Number(req.query.id) : undefined;
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      if (id) {
        const donation = await storage.getDonation(id);
        if (!donation) {
          res.status(404).json({ message: 'Donation not found' });
          return;
        }
        res.status(200).json(donation);
      } else if (userId) {
        const donations = await storage.getDonationsByUserId(userId);
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
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          res.status(400).json({ message: 'Invalid donation data', errors: error.errors });
        } else {
          res.status(500).json({ message: 'Failed to create donation' });
        }
      }
    } else if (req.method === 'PUT') {
      const id = req.query.id ? Number(req.query.id) : undefined;
      if (!id) {
        res.status(400).json({ message: 'Donation ID required' });
        return;
      }
      const updates = req.body;
      const donation = await storage.updateDonation(id, updates);
      res.status(200).json(donation);
    } else if (req.method === 'DELETE') {
      const id = req.query.id ? Number(req.query.id) : undefined;
      if (!id) {
        res.status(400).json({ message: 'Donation ID required' });
        return;
      }
      await storage.deleteDonation(id);
      res.status(200).json({ message: 'Donation deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Donation API error', error: error.message });
  }
} 