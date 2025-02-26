// src/components/features/game/GameContainer.tsx
"use client"

import { useState, useEffect } from "react"
import { DifficultySelector } from "./DifficultySelector"
import { AttemptsDisplay } from "./AttemptsDisplay"
import { useGame } from "@/app/hooks/useGame"
import QuestionCard from "@/app/components/QuestionCard"
import { GAME_CONFIG } from "@/app/config/constants"
import CollegeSearch from "./CollegeSearch"

export function GameContainer() {
  const { selectedDifficulty, attempts, makeGuess, currentPlayer, gameStatus, hintsRevealed, revealHint, startGame } = useGame()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guesses, setGuesses] = useState<string[]>([])
  const [gameComplete, setGameComplete] = useState(false)

  useEffect(() => {
    if (selectedDifficulty && !currentPlayer) {
      fetchPlayerData(selectedDifficulty)
    }
  }, [selectedDifficulty, currentPlayer])

  const fetchPlayerData = async (difficulty: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate fetching player data
      // In a real app, this would come from an API or database
      const mockPlayer = {
        id: "1",
        name: "Patrick Mahomes",
        position: "QB",
        college: "Texas Tech",
        draftYear: 2017,
        team: "Kansas City Chiefs",
        imageUrl: "/images/player-placeholder.svg" // Using a local SVG image
      }
      
      // Start the game with the fetched player
      startGame(mockPlayer)
      
    } catch (err: any) {
      console.error('Error fetching player data:', err)
      setError(err.message || 'Failed to load player data')
    } finally {
      setLoading(false)
    }
  }

  const handleGuess = (guess: string) => {
    // Add the guess to the guesses array
    setGuesses(prev => [...prev, guess])
    
    // Check if the guess is correct
    if (currentPlayer && guess.toLowerCase() === currentPlayer.college.toLowerCase()) {
      setGameComplete(true)
    }
    
    // Call the makeGuess function from useGame
    makeGuess(guess)
  }

  if (!selectedDifficulty) {
    return <DifficultySelector />
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg border shadow-sm">
        <p className="text-foreground text-lg">Error: {error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={() => fetchPlayerData(selectedDifficulty)}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg border shadow-sm">
        <p className="text-foreground text-lg">Loading player data...</p>
      </div>
    )
  }

  const maxAttempts = selectedDifficulty ? GAME_CONFIG.difficulties[selectedDifficulty].maxAttempts : 3

  return (
    <div className="space-y-8">
      {currentPlayer ? (
        <QuestionCard 
          playerData={currentPlayer}
          hintsRevealed={hintsRevealed}
          onRevealHint={revealHint}
          maxHints={selectedDifficulty ? GAME_CONFIG.difficulties[selectedDifficulty].hintCount : 3}
        />
      ) : (
        <div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg border shadow-sm">
          <p className="text-foreground text-lg">No player data available</p>
        </div>
      )}
      
      {gameStatus === 'playing' && (
        <div className="w-full max-w-md mx-auto">
          <CollegeSearch
            onGuess={handleGuess}
            attempts={guesses.length}
            maxAttempts={maxAttempts}
            guesses={guesses}
            gameComplete={gameComplete}
            onGiveUp={() => setGameComplete(true)}
            disabled={gameStatus !== 'playing'}
          />
        </div>
      )}
      
      <AttemptsDisplay 
        attempts={attempts} 
        maxAttempts={maxAttempts}
      />
    </div>
  )
}