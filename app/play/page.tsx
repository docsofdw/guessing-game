'use client';

import { GameContainer } from "../components/features/game/GameContainer";

export default function PlayPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Today's Challenge</h1>
      <GameContainer />
    </div>
  );
} 