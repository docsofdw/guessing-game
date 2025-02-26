"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/common/ui/card"
import { Button } from "@/app/components/common/ui/button"

interface QuestionCardProps {
  playerData: {
    name: string
    position: string
    team: string
    imageUrl?: string
  }
  hintsRevealed: number
  onRevealHint?: () => void
  maxHints?: number
}

export default function QuestionCard({
  playerData,
  hintsRevealed = 0,
  onRevealHint,
  maxHints = 3
}: QuestionCardProps) {
  if (!playerData) return null

  const { name, position, team, imageUrl } = playerData

  const getHintText = (hintLevel: number) => {
    if (hintLevel <= hintsRevealed) {
      switch (hintLevel) {
        case 1:
          return `Position: ${position}`
        case 2:
          return `Team: ${team}`
        case 3:
          return `First letter of name: ${name.charAt(0)}`
        default:
          return ""
      }
    }
    return "? ? ?"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Which college did this player attend?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative w-full aspect-square max-w-[240px] mx-auto rounded-lg overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`NFL Player ${name}`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
              <div className="w-32 h-12 bg-gray-300"></div>
              <span className="text-muted-foreground mt-2">Player Image</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {[1, 2, 3].map((level) => (
              <div key={level} className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Hint {level}: {getHintText(level)}</p>
              </div>
            ))}
          </div>
          
          {onRevealHint && hintsRevealed < maxHints && (
            <Button 
              onClick={onRevealHint} 
              variant="outline" 
              className="w-full mt-4"
            >
              Reveal Hint ({hintsRevealed + 1}/{maxHints})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 