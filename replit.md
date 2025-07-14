# Fish Donation Logistics Platform

## Overview

This is a full-stack web application designed to connect fishing communities worldwide through a fish donation platform. The system helps reduce food waste by matching surplus fish donations with communities in need, while providing multilingual AI assistance and real-time alerts for fishing communities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with TanStack Query for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Structure**: RESTful endpoints with JSON responses
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Database Schema

The application uses four main tables:

### AI Integration

- **OpenAI GPT-4o**: Multilingual chatbot for fishing communities
- **Capabilities**: Weather information, fishing regulations, sustainable practices, safety guidelines
- **Language Support**: Dynamic language detection and response
- **Intent Recognition**: Categorizes user queries for better assistance

### Real-time Features

- **Alert System**: Weather, disaster, and fishing regulation notifications
- **Severity Levels**: Low, medium, high priority alerts
- **Browser Notifications**: Push notifications for urgent alerts
- **Auto-refresh**: Periodic polling for new alerts and updates

## Data Flow

1. **User Authentication**: Simple localStorage-based user management
2. **Donation Workflow**: Create → Pending → Matched → Completed
3. **Chat System**: User message → OpenAI processing → AI response → Database storage
4. **Alert Distribution**: Alert creation → Database → Client polling → Browser notification

## External Dependencies

### Core Dependencies

- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **openai**: AI chat functionality
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components

### Development Tools

- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling
- **drizzle-kit**: Database migrations and schema management

## Deployment Strategy

### Development

- **Command**: `npm run dev`
- **Server**: Express with Vite middleware for HMR
- **Database**: Drizzle push for schema synchronization

### Production

- **Build Process**:
   1. Vite builds client assets to `dist/public`
   2. esbuild bundles server code to `dist/index.js`

- **Start Command**: `npm start`
- __Environment__: Expects `DATABASE_URL` and `OPENAI_API_KEY`

### Database Management

- **Schema**: Defined in `shared/schema.ts`
- **Migrations**: Generated in `./migrations` directory
- **Push Command**: `npm run db:push` for development

### Key Architectural Decisions

1. **Shared Schema**: Common TypeScript definitions between client and server in `shared/` directory
2. **Memory Storage Fallback**: In-memory storage implementation for development/testing with sample data
3. **Monorepo Structure**: Client and server in same repository with shared types
4. **Tailwind Theming**: CSS variables for consistent design system
5. **Error Handling**: Comprehensive error boundaries and API error handling
6. **Performance**: Optimistic updates and query caching for better UX
7. **Real-time Features**: Polling-based alert system with browser notifications
8. **Modular Components**: Separated UI components into logical sections and dedicated files

### Recent Changes (January 2025)

1. **Enhanced Data Model**: Added comprehensive sample data for users, donations, alerts, and chat messages
2. **Real Alert System**: Implemented active alert polling with browser notifications for high-priority alerts
3. **Demo Alert Generator**: Added interactive button to generate realistic demo alerts for testing
4. **Improved Type Safety**: Fixed TypeScript errors in storage layer with proper type definitions
5. **Component Structure**: Organized components into logical sections (HeroSection, ChallengesSection, etc.)
6. **Sample Data**: Added realistic sample users, donations, and alerts to demonstrate full functionality
7. **Interactive Features**: Working chat history, donation tracking, and alert management