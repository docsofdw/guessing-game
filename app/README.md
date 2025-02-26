# App Directory Structure

This directory contains the main application code organized according to Next.js App Router pattern.

## Directory Structure

- `/app` - Main application directory (App Router)
  - `/components` - Reusable UI components
    - `/ui` - Basic UI components (buttons, cards, etc.)
    - `/features` - Feature-specific components
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions and libraries
  - `/types` - TypeScript type definitions
  - `/utils` - Helper functions
  - `/api` - API routes
  - Various page directories (`/play`, `/admin`, etc.)

## Component Organization

Components are organized into two main categories:

1. **UI Components**: Basic, reusable UI elements like buttons, cards, inputs, etc.
2. **Feature Components**: Components specific to features of the application, organized by feature name.

## File Naming Conventions

- React components: PascalCase (e.g., `QuestionCard.tsx`)
- Utility functions: camelCase (e.g., `supabase-client.js`)
- Hooks: camelCase prefixed with "use" (e.g., `useGameState.js`)

## TypeScript

TypeScript is used throughout the application for type safety. Type definitions are stored in the `/types` directory. 