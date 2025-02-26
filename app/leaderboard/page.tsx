// app/leaderboard/page.tsx
'use client';

import { GameLeaderboard, Player } from "@/app/components/common/ui/game-leaderboard";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Sample player data for "You Don't Know Ball" game
const samplePlayers: Player[] = [
  {
    id: "1",
    name: "CollegeHoopsExpert",
    score: 2450,
    trend: "up",
    rank: 1,
    avatar: "https://i.pravatar.cc/150?img=1",
    gamesPlayed: 42,
    winRate: 85,
  },
  {
    id: "2",
    name: "MarchMadnessFan",
    score: 2180,
    trend: "up",
    rank: 2,
    avatar: "https://i.pravatar.cc/150?img=2",
    gamesPlayed: 38,
    winRate: 79,
  },
  {
    id: "3",
    name: "HoopsDreams",
    score: 1920,
    trend: "neutral",
    rank: 3,
    avatar: "https://i.pravatar.cc/150?img=3",
    gamesPlayed: 35,
    winRate: 74,
  },
  {
    id: "4",
    name: "BracketBuster",
    score: 1750,
    trend: "down",
    rank: 4,
    avatar: "https://i.pravatar.cc/150?img=4",
    gamesPlayed: 40,
    winRate: 68,
  },
  {
    id: "5",
    name: "CollegeHoopsGuru",
    score: 1680,
    trend: "up",
    rank: 5,
    avatar: "https://i.pravatar.cc/150?img=5",
    gamesPlayed: 32,
    winRate: 72,
  },
  {
    id: "6",
    name: "NCAAWizard",
    score: 1550,
    trend: "up",
    rank: 6,
    avatar: "https://i.pravatar.cc/150?img=6",
    gamesPlayed: 30,
    winRate: 65,
  },
  {
    id: "7",
    name: "CollegeBaller",
    score: 1420,
    trend: "down",
    rank: 7,
    avatar: "https://i.pravatar.cc/150?img=7",
    gamesPlayed: 28,
    winRate: 60,
  },
  {
    id: "8",
    name: "HoopsKnowledge",
    score: 1290,
    trend: "neutral",
    rank: 8,
    avatar: "https://i.pravatar.cc/150?img=8",
    gamesPlayed: 25,
    winRate: 58,
  },
  {
    id: "9",
    name: "BballScholar",
    score: 1160,
    trend: "up",
    rank: 9,
    avatar: "https://i.pravatar.cc/150?img=9",
    gamesPlayed: 22,
    winRate: 55,
  },
  {
    id: "10",
    name: "CollegeHoopsFan",
    score: 1030,
    trend: "down",
    rank: 10,
    avatar: "https://i.pravatar.cc/150?img=10",
    gamesPlayed: 20,
    winRate: 52,
  },
];

export default function LeaderboardPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/login');
    }
  }, [isLoaded, userId, router]);

  // Don't render anything until auth is loaded
  if (!isLoaded || !userId) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Leaderboard</h1>
      <div className="max-w-4xl mx-auto">
        <GameLeaderboard players={samplePlayers} />
      </div>
    </div>
  );
}
