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
  setCurrentPlayer: (player: any) => void
}

export const useGame = create<GameStore>()(
  persist(
    (set) => ({
      selectedDifficulty: null,
      attempts: [],
      isComplete: false,
      isSuccess: false,
      currentPlayer: undefined,

      selectDifficulty: (difficulty) => 
        set({ 
          selectedDifficulty: difficulty, 
          attempts: [], 
          isComplete: false, 
          isSuccess: false,
          currentPlayer: undefined
        }),

      makeGuess: (guess) =>
        set((state) => {
          const attempts = [...state.attempts, guess]
          const isComplete = attempts.length >= GAME_CONFIG.MAX_ATTEMPTS
          const isSuccess = state.currentPlayer && 
            guess.toLowerCase() === state.currentPlayer.college.toLowerCase()
          
          return {
            attempts,
            isComplete: isComplete || isSuccess,
            isSuccess
          }
        }),

      setCurrentPlayer: (player) =>
        set({ currentPlayer: player }),

      resetGame: () =>
        set({ 
          selectedDifficulty: null, 
          attempts: [], 
          isComplete: false, 
          isSuccess: false,
          currentPlayer: undefined
        }),
    }),
    {
      name: GAME_CONFIG.STORAGE_KEYS.GAME_STATE,
    }
  )
)