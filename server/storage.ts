import { 
  users, 
  donations, 
  chatMessages, 
  alerts,
  type User, 
  type InsertUser,
  type Donation,
  type InsertDonation,
  type ChatMessage,
  type InsertChatMessage,
  type Alert,
  type InsertAlert
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  
  // Donation operations
  getDonation(id: number): Promise<Donation | undefined>;
  getDonations(): Promise<Donation[]>;
  getDonationsByUserId(userId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonation(id: number, updates: Partial<InsertDonation>): Promise<Donation>;
  deleteDonation(id: number): Promise<void>;
  
  // Chat operations
  getChatMessages(userId?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Alert operations
  getAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, updates: Partial<InsertAlert>): Promise<Alert>;
  deleteAlert(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private donations: Map<number, Donation> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  private alerts: Map<number, Alert> = new Map();
  
  private userIdCounter = 1;
  private donationIdCounter = 1;
  private chatMessageIdCounter = 1;
  private alertIdCounter = 1;

  constructor() {
    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Create sample users
    const sampleUsers: User[] = [
      {
        id: this.userIdCounter++,
        name: "John Fisher",
        email: "john@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        role: "user",
        createdAt: new Date(),
      },
      {
        id: this.userIdCounter++,
        name: "Maria Santos",
        email: "maria@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        role: "user",
        createdAt: new Date(),
      },
      {
        id: this.userIdCounter++,
        name: "Ahmed Hassan",
        email: "ahmed@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        role: "user",
        createdAt: new Date(),
      },
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Create sample donations
    const sampleDonations: Donation[] = [
      {
        id: this.donationIdCounter++,
        userId: 1,
        type: "donation",
        fishType: "Fresh Tuna",
        quantity: 50,
        location: "Mumbai Port, India",
        contactInfo: "+91 98765 43210",
        urgency: "high",
        description: "Fresh catch from today's fishing. Need to distribute quickly.",
        status: "pending",
        matchedWith: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: this.donationIdCounter++,
        userId: 2,
        type: "request",
        fishType: "Any fresh fish",
        quantity: 30,
        location: "Mumbai Port, India",
        contactInfo: "maria@example.com",
        urgency: "medium",
        description: "Need fish for community kitchen serving 100 families.",
        status: "pending",
        matchedWith: null,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: this.donationIdCounter++,
        userId: 3,
        type: "donation",
        fishType: "Salmon",
        quantity: 25,
        location: "Vancouver Port, Canada",
        contactInfo: "+1 604 555 0123",
        urgency: "low",
        description: "Surplus from commercial fishing operation.",
        status: "completed",
        matchedWith: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ];

    sampleDonations.forEach(donation => this.donations.set(donation.id, donation));

    // Create sample alerts
    const sampleAlerts: Alert[] = [
      {
        id: this.alertIdCounter++,
        type: "weather",
        message: "Strong winds expected in Mumbai coastal areas. Wind speeds up to 45 km/h. Avoid fishing until conditions improve.",
        severity: "high",
        location: "Mumbai Coast, India",
        active: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: this.alertIdCounter++,
        type: "info",
        message: "New sustainable fishing guidelines released. Check latest regulations for your area.",
        severity: "low",
        location: null,
        active: true,
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: this.alertIdCounter++,
        type: "disaster",
        message: "Tsunami warning lifted for Pacific coastal areas. Normal fishing operations can resume.",
        severity: "medium",
        location: "Pacific Coast",
        active: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
    ];

    sampleAlerts.forEach(alert => this.alerts.set(alert.id, alert));

    // Create sample chat messages
    const sampleChatMessages: ChatMessage[] = [
      {
        id: this.chatMessageIdCounter++,
        userId: 1,
        message: "What's the weather like for fishing today?",
        isUser: true,
        language: "en",
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      },
      {
        id: this.chatMessageIdCounter++,
        userId: 1,
        message: "Current weather conditions show moderate winds at 15 km/h from the southwest. Sea conditions are favorable for fishing with wave heights of 1-2 meters. Visibility is good at 10+ km. It's a good day for fishing, but keep monitoring weather updates as conditions can change.",
        isUser: false,
        language: "en",
        createdAt: new Date(Date.now() - 9 * 60 * 1000), // 9 minutes ago
      },
    ];

    sampleChatMessages.forEach(message => this.chatMessages.set(message.id, message));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.userIdCounter++,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || null,
      role: userData.role || "user",
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Donation operations
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getDonationsByUserId(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values())
      .filter(d => d.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createDonation(donationData: InsertDonation): Promise<Donation> {
    const donation: Donation = {
      id: this.donationIdCounter++,
      userId: donationData.userId,
      type: donationData.type,
      fishType: donationData.fishType,
      quantity: donationData.quantity,
      location: donationData.location,
      contactInfo: donationData.contactInfo || null,
      urgency: donationData.urgency || "medium",
      description: donationData.description || null,
      status: donationData.status || "pending",
      matchedWith: donationData.matchedWith || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.donations.set(donation.id, donation);
    return donation;
  }

  async updateDonation(id: number, updates: Partial<InsertDonation>): Promise<Donation> {
    const donation = this.donations.get(id);
    if (!donation) throw new Error('Donation not found');
    
    const updatedDonation = { ...donation, ...updates, updatedAt: new Date() };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  async deleteDonation(id: number): Promise<void> {
    this.donations.delete(id);
  }

  // Chat operations
  async getChatMessages(userId?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    if (userId) {
      return messages.filter(m => m.userId === userId).sort((a, b) => 
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );
    }
    return messages.sort((a, b) => 
      new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: this.chatMessageIdCounter++,
      userId: messageData.userId || null,
      message: messageData.message,
      isUser: messageData.isUser,
      language: messageData.language || null,
      createdAt: new Date(),
    };
    this.chatMessages.set(message.id, message);
    return message;
  }

  // Alert operations
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(a => a.active)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const alert: Alert = {
      id: this.alertIdCounter++,
      type: alertData.type,
      message: alertData.message,
      severity: alertData.severity || "medium",
      location: alertData.location || null,
      active: alertData.active !== undefined ? alertData.active : true,
      createdAt: new Date(),
    };
    this.alerts.set(alert.id, alert);
    return alert;
  }

  async updateAlert(id: number, updates: Partial<InsertAlert>): Promise<Alert> {
    const alert = this.alerts.get(id);
    if (!alert) throw new Error('Alert not found');
    
    const updatedAlert = { ...alert, ...updates };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async deleteAlert(id: number): Promise<void> {
    this.alerts.delete(id);
  }
}

export const storage = new MemStorage();
