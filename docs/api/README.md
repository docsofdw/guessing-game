# docs/architecture/README.md
# Architecture Overview

## System Design
- Next.js 14 App Router
- React Server Components
- State Management with Zustand
- UI Components with shadcn/ui
- Styling with Tailwind CSS

## Data Flow
1. User selects difficulty level
2. Game state managed through Zustand store
3. Daily challenges synchronized with server
4. Results stored and displayed on leaderboard

## Component Architecture
```
src/
├── components/
│   ├── common/      # Reusable UI components
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
└── utils/          # Helper functions
```

# docs/development/README.md
# Development Guide

## Getting Started
1. Clone the repository
2. Install dependencies with `npm install`
3. Run development server with `npm run dev`
4. Access the app at `http://localhost:3000`

## Project Structure
```
YDKB/
├── app/            # Next.js 14 app directory
├── src/            # Source code
├── public/         # Static assets
└── docs/          # Documentation
```

## Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

# docs/components/README.md
# Component Documentation

## Common Components
- Button: Primary action component
- Card: Container component
- Input: Form input component
- Alert: Notification component

## Game Components
- DifficultySelector: Game difficulty chooser
- PlayerCard: NFL player display
- GuessInput: College guess input
- AttemptsDisplay: Remaining attempts view

## Usage Examples
```tsx
// Example of using game components
<GameContainer>
  <PlayerCard player={currentPlayer} />
  <GuessInput onGuess={handleGuess} />
  <AttemptsDisplay attempts={attempts} />
</GameContainer>
```

# docs/api/README.md
# API Documentation

## Endpoints
- `/api/players` - Get daily player
- `/api/guess` - Submit a guess
- `/api/leaderboard` - Get rankings

## Data Models
```typescript
interface Player {
  id: string
  name: string
  college: string
  imageUrl: string
  difficulty: 'easy' | 'hard' | 'hof'
}

interface Guess {
  playerId: string
  guess: string
  correct: boolean
}
```

## Authentication
TBD - Future implementation