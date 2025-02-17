// src/components/features/game/GameContainer.tsx
"use client"

import { useState } from "react"
import { DifficultySelector } from "./DifficultySelector"
import { PlayerCard } from "./PlayerCard"
import { GuessInput } from "./GuessInput"
import { AttemptsDisplay } from "./AttemptsDisplay"
import { useGame } from "@/hooks/useGame"

export function GameContainer() {
  const { selectedDifficulty } = useGame()
  const [attempts, setAttempts] = useState<string[]>([])

  const handleGuess = (guess: string) => {
    setAttempts(prev => [...prev, guess])
  }

  if (!selectedDifficulty) {
    return <DifficultySelector />
  }

  return (
    <div className="space-y-8">
      <PlayerCard />
      <GuessInput
        onGuess={handleGuess}
        disabled={attempts.length >= 3}
      />
      <AttemptsDisplay attempts={attempts} />
    </div>
  )
}