import type { Difficulty } from "@/app/types/game"

export const GAME_CONFIG = {
  difficulties: {
    easy: {
      name: "Easy",
      description: "More recent players, more hints",
      maxAttempts: 5,
      hintCount: 3,
      yearRange: [2010, 2023],
    },
    medium: {
      name: "Medium",
      description: "Mix of players, some hints",
      maxAttempts: 4,
      hintCount: 2,
      yearRange: [2000, 2023],
    },
    hard: {
      name: "Hard",
      description: "All-time players, minimal hints",
      maxAttempts: 3,
      hintCount: 1,
      yearRange: [1970, 2023],
    },
  } as Record<Difficulty, {
    name: string
    description: string
    maxAttempts: number
    hintCount: number
    yearRange: [number, number]
  }>,
  
  MAX_ATTEMPTS: 3,
  
  STORAGE_KEYS: {
    GAME_STATE: "ydkb-game-state",
  }
} 