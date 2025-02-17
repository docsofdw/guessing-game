export type Difficulty = 'easy' | 'hard' | 'hof'

export interface Player {
  id: string
  name: string
  college: string
  imageUrl: string
  difficulty: Difficulty
}

export interface GameState {
  selectedDifficulty: Difficulty | null
  currentPlayer?: Player
  attempts: string[]
  isComplete: boolean
  isSuccess: boolean
}