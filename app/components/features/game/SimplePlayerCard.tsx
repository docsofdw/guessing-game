// src/components/features/game/SimplePlayerCard.tsx
"use client"

import { Card, CardContent } from "@/app/components/ui/card"
import { AspectRatio } from "@/app/components/ui/aspect-ratio"

interface SimplePlayerCardProps {
  imageUrl?: string
  playerName?: string
}

export function SimplePlayerCard({ 
  imageUrl = "/api/placeholder/400/300",
  playerName = "Mystery Player"
}: SimplePlayerCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <AspectRatio ratio={4/3}>
          <img
            src={imageUrl}
            alt={playerName}
            className="object-cover w-full h-full rounded-md"
          />
        </AspectRatio>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium">{playerName}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

export default SimplePlayerCard;