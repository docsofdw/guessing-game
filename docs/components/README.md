docs/components/README.md
Component Documentation
Game Components
DifficultySelector
typescriptCopy<DifficultySelector />
Allows users to choose game difficulty level.

Props: None
State: Uses global game state

PlayerCard
typescriptCopy<PlayerCard
  imageUrl?: string
  playerName?: string
/>
Displays the NFL player image and information.
GuessInput
typescriptCopy<GuessInput
  onGuess: (guess: string) => void
  disabled?: boolean
/>
Handles user input for college guesses.
AttemptsDisplay
typescriptCopy<AttemptsDisplay
  attempts: string[]
  maxAttempts?: number
/>
Shows remaining attempts and previous guesses.
Common UI Components
Button
Standard button component with variants:
typescriptCopy<Button
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
/>
Card
Container component with header and content sections:
typescriptCopy<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>