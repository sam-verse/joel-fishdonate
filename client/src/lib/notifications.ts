export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = "default";

  private constructor() {
    this.requestPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    this.permission = await Notification.requestPermission();
    return this.permission === "granted";
  }

  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (this.permission !== "granted") {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    const notification = new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }

  async showAlert(message: string, severity: "low" | "medium" | "high" = "medium"): Promise<void> {
    if (severity === "high") {
      const title = "🚨 URGENT ALERT";
      await this.showNotification(title, {
        body: message,
        requireInteraction: true,
        tag: "urgent-alert",
      });
    } else if (severity === "medium") {
      const title = "⚠️ Weather Alert";
      await this.showNotification(title, {
        body: message,
        tag: "weather-alert",
      });
    } else {
      const title = "ℹ️ Information";
      await this.showNotification(title, {
        body: message,
        tag: "info-alert",
      });
    }
  }

  async showDonationUpdate(message: string): Promise<void> {
    await this.showNotification("🐟 Donation Update", {
      body: message,
      tag: "donation-update",
    });
  }
}

export const notificationService = NotificationService.getInstance();
