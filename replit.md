# Agent Manager Dashboard

## Overview

This is a React-based agent management dashboard application that provides real-time monitoring and control of AI agents. The system simulates multiple agents (Researcher, Writer, Editor) working on various tasks with a comprehensive interface for tracking their status, viewing logs, managing artifacts, and configuring system settings.

The application follows a full-stack architecture with a React frontend, Express.js backend, and PostgreSQL database integration. It features a modern, responsive UI built with shadcn/ui components and Tailwind CSS, designed for monitoring distributed agent workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Framework**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom simulation logic for agent states
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development**: Hot module replacement with Vite integration
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage)
- **Database Ready**: Prepared for PostgreSQL with Drizzle ORM configuration
- **API Design**: RESTful API structure with /api prefix routing

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: User table with id, username, password fields
- **Validation**: Zod schema validation integration
- **Migrations**: Drizzle-kit for database migrations

### Component Architecture
- **Layout Components**: Header, Sidebar with responsive mobile support
- **Feature Components**: Agent cards, chat interface, file tree, artifact viewers
- **UI Components**: Complete shadcn/ui component set for consistent design
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

### Agent Simulation System
- **Real-time Updates**: Custom hook-based simulation with state updates
- **Agent Types**: Researcher, Writer, Editor roles with different behaviors
- **Task Management**: Queue system (todo, in-progress, done, failed)
- **Communication**: Chat interface with different message types (system, agent, error, success, handoff, user)
- **Logging**: Structured JSON logging with timestamp and severity levels

### Theming and Styling
- **Dark Mode**: CSS custom properties with class-based theme switching
- **Design System**: Neutral color palette with consistent spacing and typography
- **Typography**: Inter font with multiple weights
- **Icons**: Lucide React icon library

### Build and Development
- **Build Tool**: Vite with React plugin and TypeScript support
- **Development**: Hot reload with error overlay
- **Production**: Optimized builds with static asset handling
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon Database serverless driver for PostgreSQL connectivity
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **drizzle-kit**: Database migration and schema management tools

### UI and Styling
- **@radix-ui/***: Complete set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Utility for conditional class name composition

### React Ecosystem
- **@tanstack/react-query**: Server state management and data fetching
- **@hookform/resolvers**: Form validation resolvers for react-hook-form
- **wouter**: Lightweight routing library

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling
- **tsx**: TypeScript execution for development server

### Utilities
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel component for UI