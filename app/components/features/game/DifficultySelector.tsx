// src/components/features/game/DifficultySelector.tsx
"use client"

import { Button } from "@/app/components/common/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/common/ui/card"
import { GAME_CONFIG } from "@/app/config/constants"
import { useGame } from "@/app/hooks/useGame"
import type { Difficulty } from "@/app/types/game"

export function DifficultySelector() {
  const { selectDifficulty, selectedDifficulty } = useGame()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Select Difficulty</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Choose your challenge level
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {Object.entries(GAME_CONFIG.difficulties).map(([key, config]) => (
            <Button 
              key={key}
              variant={selectedDifficulty === key ? "default" : "outline"}
              onClick={() => selectDifficulty(key as Difficulty)}
              className="w-full sm:w-auto"
            >
              {config.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}