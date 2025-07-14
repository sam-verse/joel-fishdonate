import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const { donationId } = req.body;
    const donation = await storage.getDonation(donationId);
    if (!donation) {
      res.status(404).json({ message: 'Donation not found' });
      return;
    }
    const allDonations = await storage.getDonations();
    const oppositeType = donation.type === 'donation' ? 'request' : 'donation';
    const matches = allDonations.filter(d =>
      d.type === oppositeType &&
      d.location === donation.location &&
      d.status === 'pending' &&
      d.id !== donation.id
    );
    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: 'Failed to match donations' });
  }
} 