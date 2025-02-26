// src/coonents/features/game/PlayerCard.tsx
"use client"

import { Card, CardContent } from "@/components/common/ui/card"
import { AspectRatio } from "@/components/common/ui/aspect-ratio"

interface PlayerCardProps {
  imageUrl?: string
  playerName?: string
}

export function PlayerCard({ 
  imageUrl = "/api/placeholder/400/300",
  playerName = "Mystery Player"
}: PlayerCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <AspectRatio ratio={4/3}>
          <img
            src={imageUrl}
            alt={playerName}
            className="rounded-md object-cover w-full h-full"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  )
}