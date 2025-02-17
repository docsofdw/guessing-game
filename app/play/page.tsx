// app/play/page.tsx
import { GameContainer } from "@/components/features/game/GameContainer"

export default function PlayPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Today's Challenge</h1>
        <GameContainer />
      </div>
    </main>
  )
}