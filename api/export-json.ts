import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const users = await storage.getUsers();
    const donations = await storage.getDonations();
    const alerts = await storage.getAlerts();
    const messages = await storage.getChatMessages();
    const exportData = {
      exportDate: new Date().toISOString(),
      platform: 'Fish Donation Logistics',
      version: '1.0.0',
      data: {
        users,
        donations,
        alerts,
        chatMessages: messages,
      },
      statistics: {
        totalUsers: users.length,
        totalDonations: donations.length,
        totalAlerts: alerts.length,
        totalMessages: messages.length,
        totalFishDonated: donations.reduce((sum, d) => sum + d.quantity, 0),
        activeDonations: donations.filter(d => d.status === 'pending').length,
        activeAlerts: alerts.filter(a => a.active).length,
      },
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="fish-donation-data.json"');
    res.status(200).json(exportData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to export data' });
  }
} 