Architecture Overview
System Design
Frontend Architecture

Next.js App Router: Page routing and server components
React Components: Modular UI building blocks
Zustand: State management for game logic
Tailwind CSS: Utility-first styling

Data Flow

User initiates game by selecting difficulty
Game state managed through Zustand store
Daily challenges synchronized with server
Player guesses validated against database
Results stored and displayed

Component Structure
Copysrc/
├── components/
│   ├── common/         # Shared UI components
│   │   └── ui/         # shadcn/ui components
│   └── features/       # Feature-specific
│       └── game/       # Game-related components
└── hooks/              # Custom React hooks
State Management

Game state handled by Zustand
Persistent storage for game progress
Centralized state for game logic

Performance Considerations

Server components for static content
Client components for interactive elements
Optimized image loading
Caching strategies