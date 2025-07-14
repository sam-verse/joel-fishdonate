# Fish Donation Logistics Platform

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

```bash
npm install
```

2. **Set up environment variables**:
Create a `.env` file in the root directory:

```yaml
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_database_url_here
```

3. **Run the development server**:

```bash
npm run dev
```

4. **Build for production**:

```bash
npm run build
npm start
```

## API Endpoints

### User Management

- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Donations

- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation/request
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation

### Chat System

- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/send` - Send message to AI

### Alerts

- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/active` - Get active alerts
- `POST /api/alerts` - Create alert
- `POST /api/alerts/demo` - Generate demo alert

### Export

- `GET /api/export/json` - Export data as JSON
- `GET /api/export/project` - Download project as ZIP

## Project Structure

```ini
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
```

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
