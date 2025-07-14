import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processChatMessage, generateWeatherAlert } from "./services/openai";
import { insertDonationSchema, insertChatMessageSchema, insertAlertSchema } from "@shared/schema";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import archiver from "archiver";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const { name, email, avatar } = req.body;
      const user = await storage.createUser({ name, email, avatar, role: "user" });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Donation routes
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get donations" });
    }
  });

  app.get("/api/donations/user/:userId", async (req, res) => {
    try {
      const donations = await storage.getDonationsByUserId(parseInt(req.params.userId));
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user donations" });
    }
  });

  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);
      res.json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create donation" });
    }
  });

  app.put("/api/donations/:id", async (req, res) => {
    try {
      const updates = req.body;
      const donation = await storage.updateDonation(parseInt(req.params.id), updates);
      res.json(donation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update donation" });
    }
  });

  app.delete("/api/donations/:id", async (req, res) => {
    try {
      await storage.deleteDonation(parseInt(req.params.id));
      res.json({ message: "Donation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete donation" });
    }
  });

  // Chat routes
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat messages" });
    }
  });

  app.post("/api/chat/send", async (req, res) => {
    try {
      const { message, userId, language = "en" } = req.body;
      
      // Store user message
      await storage.createChatMessage({
        userId: userId || null,
        message,
        isUser: true,
        language,
      });

      // Process with OpenAI
      const aiResponse = await processChatMessage(message, language);
      
      // Store AI response
      await storage.createChatMessage({
        userId: userId || null,
        message: aiResponse.message,
        isUser: false,
        language: aiResponse.language,
      });

      res.json(aiResponse);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get alerts" });
    }
  });

  app.get("/api/alerts/active", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get active alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  app.put("/api/alerts/:id", async (req, res) => {
    try {
      const updates = req.body;
      const alert = await storage.updateAlert(parseInt(req.params.id), updates);
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      await storage.deleteAlert(parseInt(req.params.id));
      res.json({ message: "Alert deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  // Weather alert generation endpoint
  app.post("/api/alerts/generate-weather", async (req, res) => {
    try {
      const { location, condition, severity = "medium" } = req.body;
      const message = await generateWeatherAlert(location, condition);
      
      const alert = await storage.createAlert({
        type: "weather",
        message,
        severity,
        location,
        active: true,
      });
      
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate weather alert" });
    }
  });

  // Demo alert generation endpoint
  app.post("/api/alerts/demo", async (req, res) => {
    try {
      const demoAlerts = [
        {
          type: "weather",
          message: "Heavy rainfall expected in coastal areas. Fishing boats advised to return to port immediately.",
          severity: "high",
          location: "Bay of Bengal"
        },
        {
          type: "info",
          message: "Fish market prices have increased by 15% due to high demand. Good time for donations!",
          severity: "low",
          location: "Mumbai Fish Market"
        },
        {
          type: "disaster",
          message: "Cyclone warning issued for next 48 hours. All fishing activities suspended.",
          severity: "high",
          location: "Arabian Sea"
        }
      ];

      const randomAlert = demoAlerts[Math.floor(Math.random() * demoAlerts.length)];
      const alert = await storage.createAlert({
        type: randomAlert.type,
        message: randomAlert.message,
        severity: randomAlert.severity,
        location: randomAlert.location,
        active: true,
      });

      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to create demo alert" });
    }
  });

  // Donation matching endpoint
  app.post("/api/donations/match", async (req, res) => {
    try {
      const { donationId } = req.body;
      const donation = await storage.getDonation(donationId);
      
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }

      // Simple matching logic - find opposite type in same location
      const allDonations = await storage.getDonations();
      const oppositeType = donation.type === "donation" ? "request" : "donation";
      
      const matches = allDonations.filter(d => 
        d.type === oppositeType && 
        d.location === donation.location && 
        d.status === "pending" &&
        d.id !== donation.id
      );

      res.json({ matches });
    } catch (error) {
      res.status(500).json({ message: "Failed to match donations" });
    }
  });

  // Export all data as JSON
  app.get("/api/export/json", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const donations = await storage.getDonations();
      const alerts = await storage.getAlerts();
      const messages = await storage.getChatMessages();

      const exportData = {
        exportDate: new Date().toISOString(),
        platform: "Fish Donation Logistics",
        version: "1.0.0",
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
          activeDonations: donations.filter(d => d.status === "pending").length,
          activeAlerts: alerts.filter(a => a.active).length,
        }
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="fish-donation-data.json"');
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Export entire project as ZIP
  app.get("/api/export/project", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="fish-donation-logistics-app.zip"');

      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      archive.on('error', (err) => {
        throw err;
      });

      archive.pipe(res);

      // Add all project files
      const projectRoot = process.cwd();
      
      // Add source files
      archive.directory(path.join(projectRoot, 'client'), 'client');
      archive.directory(path.join(projectRoot, 'server'), 'server');
      archive.directory(path.join(projectRoot, 'shared'), 'shared');
      
      // Add configuration files
      archive.file(path.join(projectRoot, 'package.json'), { name: 'package.json' });
      archive.file(path.join(projectRoot, 'tsconfig.json'), { name: 'tsconfig.json' });
      archive.file(path.join(projectRoot, 'vite.config.ts'), { name: 'vite.config.ts' });
      archive.file(path.join(projectRoot, 'tailwind.config.ts'), { name: 'tailwind.config.ts' });
      archive.file(path.join(projectRoot, 'postcss.config.js'), { name: 'postcss.config.js' });
      archive.file(path.join(projectRoot, 'components.json'), { name: 'components.json' });
      archive.file(path.join(projectRoot, 'drizzle.config.ts'), { name: 'drizzle.config.ts' });
      archive.file(path.join(projectRoot, 'replit.md'), { name: 'replit.md' });
      
      // Add README for the project
      const readmeContent = `# Fish Donation Logistics Platform

## Overview
This is a full-stack React application that connects fishing communities worldwide through a fish donation platform. The system helps reduce food waste by matching surplus fish donations with communities in need.

## Features
- ✅ Real AI-powered multilingual chatbot using OpenAI API
- ✅ Weather alerts and disaster notification system
- ✅ Complete donation matching system
- ✅ User management and authentication
- ✅ Real-time browser notifications
- ✅ JSON data export functionality
- ✅ Interactive demo components

## Tech Stack
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM (In-memory for development)
- **AI**: OpenAI GPT-4o for multilingual chat
- **UI**: Radix UI components with shadcn/ui

## Setup Instructions

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**:
   Create a \`.env\` file in the root directory:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=your_database_url_here
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**:
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## API Endpoints

### User Management
- \`GET /api/users/:id\` - Get user by ID
- \`POST /api/users\` - Create new user

### Donations
- \`GET /api/donations\` - Get all donations
- \`POST /api/donations\` - Create donation/request
- \`PUT /api/donations/:id\` - Update donation
- \`DELETE /api/donations/:id\` - Delete donation

### Chat System
- \`GET /api/chat/messages\` - Get chat messages
- \`POST /api/chat/send\` - Send message to AI

### Alerts
- \`GET /api/alerts\` - Get all alerts
- \`GET /api/alerts/active\` - Get active alerts
- \`POST /api/alerts\` - Create alert
- \`POST /api/alerts/demo\` - Generate demo alert

### Export
- \`GET /api/export/json\` - Export data as JSON
- \`GET /api/export/project\` - Download project as ZIP

## Project Structure

\`\`\`
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
├── server/                 # Express backend
│   ├── services/          # Business logic
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage
├── shared/                 # Shared types and schema
└── Configuration files
\`\`\`

## Key Features

### AI Chatbot
- Multilingual support (English, Spanish, French, Chinese, etc.)
- Specialized for fishing communities
- Provides weather information, regulations, and safety guidelines

### Alert System
- Real-time weather and disaster alerts
- Browser notifications for high-priority alerts
- Location-based filtering

### Donation System
- Match surplus fish donations with communities in need
- Track donation status and history
- Contact management for coordination

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

---

Built with ❤️ for fishing communities worldwide.
`;

      archive.append(readmeContent, { name: 'README.md' });

      await archive.finalize();

    } catch (error) {
      console.error('Error creating zip file:', error);
      res.status(500).json({ message: "Failed to create project zip file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
