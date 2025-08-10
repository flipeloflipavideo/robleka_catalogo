# Overview

This is a full-stack e-commerce catalog application for ROBLEKA Diseños, a creative stationery business. The application displays products like agendas, notebooks, and labels with filtering, search, and social sharing capabilities. It features a modern React frontend with a sophisticated purple-blue color scheme and an Express.js backend with PostgreSQL database integration.

The application is built as a product showcase/catalog rather than a full e-commerce platform - focusing on displaying products beautifully with social sharing features to drive engagement. It includes an admin panel for content management and uses modern web technologies throughout.

# User Preferences

Preferred communication style: Simple, everyday language.
Brand name: ROBLEKA Diseños
Color scheme: Deep blues, purples, and violets (sophisticated blue-purple palette)

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/building
- **Routing**: Wouter for lightweight client-side routing  
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom color scheme and Poppins/Inter fonts
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript throughout with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging, error handling, and request parsing
- **Development**: Hot module replacement via Vite integration in development mode

## Data Storage & Schema
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon serverless PostgreSQL via connection pooling
- **Schema Design**: 
  - Products table with JSON fields for arrays (tags, images, colors)
  - Users table for basic admin authentication
  - Generated UUIDs for primary keys
- **Validation**: Drizzle-Zod integration for runtime schema validation
- **Storage Strategy**: In-memory storage class for development with sample data

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting with `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe SQL query builder with PostgreSQL dialect
- **Database Migrations**: Drizzle Kit for schema management and migrations

### UI & Design System
- **Radix UI**: Complete set of accessible React primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Poppins and Inter font families for typography

### Development & Build Tools
- **Vite**: Fast build tool with HMR, TypeScript support, and React plugin
- **Replit Integration**: Development environment plugins for Replit platform
- **ESBuild**: Fast JavaScript bundler for production builds

### Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### State & HTTP
- **TanStack Query**: Powerful data synchronization for React with caching and background updates
- **Wouter**: Minimalist routing library as alternative to React Router

### Social Features
- **Social Sharing**: Custom implementation for WhatsApp, Facebook, Telegram, and email sharing
- **URL Generation**: Dynamic product and catalog URL generation for sharing

The architecture emphasizes type safety throughout the stack, modern React patterns, and a component-driven UI approach. The application is designed to be easily deployable and maintainable with clear separation of concerns between frontend and backend.