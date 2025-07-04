# Grant Proposal Generator

## Overview

A full-stack web application for generating professional grant proposals using AI. The system features a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration. Users can fill out comprehensive forms with organization details, project information, and requirements, then generate AI-powered grant proposals with executive summaries, budget justifications, and detailed project plans.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API (GPT-4o) for proposal generation
- **Session Management**: In-memory storage with planned database persistence
- **API**: RESTful endpoints for proposal CRUD operations

## Key Components

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Grant Proposals Table**: Comprehensive proposal data including:
  - Organization details (name, mission)
  - Project information (title, description, target population)
  - Financial details (amount, timeline)
  - Generated proposal content and status tracking

### Form System
- Multi-step form with real-time validation using Zod schemas
- Progress tracking with visual indicators
- Form persistence and auto-save capabilities
- Comprehensive input validation with user-friendly error messages

### AI Proposal Generation
- Integration with OpenAI GPT-4o model
- Structured prompt engineering for consistent proposal format
- Generates complete proposals including:
  - Executive Summary
  - Statement of Need
  - Project Description with methodology
  - Goals & Objectives with timelines
  - Budget Justification
  - Evaluation Plan
  - Organizational Capacity demonstration
  - Sustainability Plan

### UI Components
- Modern, responsive design using shadcn/ui
- Progress bars and loading states
- Toast notifications for user feedback
- Proposal preview and download functionality
- Copy-to-clipboard capabilities

## Data Flow

1. **User Input**: Form data collected through React Hook Form
2. **Validation**: Client-side validation using Zod schemas
3. **API Submission**: Form data sent to Express backend
4. **Database Storage**: Proposal data persisted in PostgreSQL
5. **AI Generation**: OpenAI API called with structured prompts
6. **Response Processing**: Generated proposal stored and returned to client
7. **User Interface**: Proposal displayed with download/copy options

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **AI Service**: OpenAI API for proposal generation
- **UI Library**: Radix UI primitives via shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Drizzle**: Type-safe database queries and migrations
- **Vite**: Fast development server and build tool
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Setup
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation via tsx
- Database migrations through Drizzle Kit
- Environment variable management for API keys

### Production Build
- Frontend: Vite build to static assets
- Backend: ESBuild compilation to Node.js bundle
- Database: Drizzle push for schema deployment
- Environment: Production-ready configuration

### Architecture Decisions

**Database Choice**: PostgreSQL with Drizzle ORM
- **Problem**: Need for reliable data persistence and type safety
- **Solution**: PostgreSQL for robust relational data, Drizzle for type-safe queries
- **Benefits**: Strong consistency, excellent TypeScript integration, migration support

**AI Integration**: OpenAI GPT-4o
- **Problem**: Generate high-quality, professional grant proposals
- **Solution**: Latest OpenAI model with structured prompting
- **Benefits**: State-of-the-art language generation, consistent formatting

**Frontend Framework**: React with shadcn/ui
- **Problem**: Need modern, accessible UI components
- **Solution**: React with professionally designed component library
- **Benefits**: Excellent developer experience, accessibility built-in, consistent design

**Form Handling**: React Hook Form + Zod
- **Problem**: Complex form validation and state management
- **Solution**: Performant form library with schema validation
- **Benefits**: Minimal re-renders, type-safe validation, excellent UX

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Applied Apple-inspired design overhaul for professional, trustworthy appearance
- July 04, 2025. Redesigned with modern minimalist monochromatic color scheme and clean lines
- July 04, 2025. Removed proposal scoring system due to performance issues and user request
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Design preference: Modern, minimalist look with monochromatic color scheme and clean lines that conveys trust and professionalism for high-value clients.
```