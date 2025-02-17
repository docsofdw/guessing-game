// src/hooks/useGame.ts
"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Difficulty, GameState } from '@/types/game'
import { GAME_CONFIG } from '@/config/constants'

interface GameStore extends GameState {
  selectDifficulty: (difficulty: Difficulty) => void
  makeGuess: (guess: string) => void
  resetGame: () => void
}

export const useGame = create<GameStore>()(
  persist(
    (set) => ({
      selectedDifficulty: null,
      attempts: [],
      isComplete: false,
      isSuccess: false,

      selectDifficulty: (difficulty) => 
        set({ selectedDifficulty: difficulty, attempts: [], isComplete: false, isSuccess: false }),

      makeGuess: (guess) =>
        set((state) => {
          const attempts = [...state.attempts, guess]
          const isComplete = attempts.length >= GAME_CONFIG.MAX_ATTEMPTS
          
          return {
            attempts,
            isComplete,
            isSuccess: guess.toLowerCase() === state.currentPlayer?.college.toLowerCase()
          }
        }),

      resetGame: () =>
        set({ selectedDifficulty: null, attempts: [], isComplete: false, isSuccess: false }),
    }),
    {
      name: GAME_CONFIG.STORAGE_KEYS.GAME_STATE,
    }
  )
)