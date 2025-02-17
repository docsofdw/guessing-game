Development Guide
Getting Started

Prerequisites

Node.js 18+
npm/yarn
Git


Installation
bashCopygit clone https://github.com/docsofdw/YDKB.git
cd YDKB
npm install

Development Server
bashCopynpm run dev


Project Structure
CopyYDKB/
├── app/                # Next.js pages
├── src/               # Source code
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities
│   └── types/         # TypeScript types
├── public/            # Static files
└── docs/             # Documentation
Best Practices

Code Style

Use TypeScript for type safety
Follow component composition patterns
Implement proper error handling


Component Guidelines

Keep components focused and reusable
Use proper prop typing
Implement error boundaries


State Management

Use Zustand for global state
Implement proper state persistence
Handle loading and error states



docs/api/README.md
API Documentation
Endpoints
GET /api/players/daily
Returns the daily player challenge.
typescriptCopyinterface Response {
  player: {
    id: string
    name: string
    imageUrl: string
    difficulty: 'easy' | 'hard' | 'hof'
  }
}
POST /api/guess
Submit a guess for the current player.
typescriptCopyinterface Request {
  playerId: string
  guess: string
}

interface Response {
  correct: boolean
  message: string
}
GET /api/leaderboard
Retrieve the current leaderboard.
typescriptCopyinterface Response {
  players: Array<{
    id: string
    name: string
    score: number
    gamesPlayed: number
  }>
}
Error Handling
All endpoints return standard error responses:
typescriptCopyinterface ErrorResponse {
  error: string
  code: number
  details?: any
}
Rate Limiting

100 requests per hour per IP
Applies to all endpoints
Tracked by IP address