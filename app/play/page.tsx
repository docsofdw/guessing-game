// app/play/page.tsx
'use client';
import { GameContainer } from "../../components/features/game/GameContainer"
// Remove this import if you don't need it
// import { PlayersList } from "@/components/features/players/PlayersList"

export default function PlayPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Today's Challenge</h1>
        <GameContainer />
        
        {/* Remove this component if you don't need it */}
        {/* <PlayersList /> */}
      </div>
    </main>
  )
}