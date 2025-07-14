import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const demoAlerts = [
      {
        type: 'weather',
        message: 'Heavy rainfall expected in coastal areas. Fishing boats advised to return to port immediately.',
        severity: 'high',
        location: 'Bay of Bengal',
      },
      {
        type: 'info',
        message: 'Fish market prices have increased by 15% due to high demand. Good time for donations!',
        severity: 'low',
        location: 'Mumbai Fish Market',
      },
      {
        type: 'disaster',
        message: 'Cyclone warning issued for next 48 hours. All fishing activities suspended.',
        severity: 'high',
        location: 'Arabian Sea',
      },
    ];
    const randomAlert = demoAlerts[Math.floor(Math.random() * demoAlerts.length)];
    const alert = await storage.createAlert({
      type: randomAlert.type,
      message: randomAlert.message,
      severity: randomAlert.severity,
      location: randomAlert.location,
      active: true,
    });
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create demo alert' });
  }
} 