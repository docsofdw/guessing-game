import * as React from "react";
import { cn } from "@/app/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

// Player type definition
export interface Player {
  id: string;
  name: string;
  score: number;
  trend: "up" | "down" | "neutral";
  rank: number;
  avatar?: string;
  gamesPlayed: number;
  winRate: number;
}

// Trend indicators
const trendIndicators = {
  up: "↗️",
  down: "↘️",
  neutral: "➡️",
};

export interface GameLeaderboardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  players: Player[];
  maxDisplay?: number;
}

export function GameLeaderboard({
  title = "You Don't Know Ball Leaderboard",
  players,
  maxDisplay = 10,
  className,
  ...props
}: GameLeaderboardProps) {
  const displayPlayers = players.slice(0, maxDisplay);

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="bg-gradient-to-r from-blue-800 to-indigo-600 text-white">
        <CardTitle className="flex items-center justify-center text-2xl font-bold">
          <span className="mr-2">🏀</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {/* Header row */}
          <div className="grid grid-cols-12 px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Games</div>
            <div className="col-span-2 text-center">Win Rate</div>
            <div className="col-span-1 text-center">Trend</div>
          </div>
          
          {/* Player rows */}
          {displayPlayers.map((player) => (
            <div 
              key={player.id}
              className="grid grid-cols-12 px-4 py-3 items-center hover:bg-gray-50 transition-colors"
            >
              {/* Rank with medal for top 3 */}
              <div className="col-span-1 text-center font-semibold">
                {player.rank <= 3 ? (
                  <span className="inline-block">
                    {player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉"}
                  </span>
                ) : (
                  player.rank
                )}
              </div>
              
              {/* Player name with optional avatar */}
              <div className="col-span-4 flex items-center">
                {player.avatar ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200 flex-shrink-0">
                    <img src={player.avatar} alt={player.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500">
                    {player.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium truncate">{player.name}</span>
              </div>
              
              {/* Score */}
              <div className="col-span-2 text-center font-mono font-semibold">
                {player.score.toLocaleString()}
              </div>
              
              {/* Games Played */}
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  🏀 {player.gamesPlayed}
                </span>
              </div>
              
              {/* Win Rate */}
              <div className="col-span-2 text-center">
                <span className={cn(
                  "font-medium",
                  player.winRate >= 70 ? "text-green-600" : 
                  player.winRate >= 50 ? "text-blue-600" : 
                  "text-orange-600"
                )}>
                  {player.winRate}%
                </span>
              </div>
              
              {/* Trend indicator */}
              <div className="col-span-1 text-center">
                <span className={cn(
                  "text-sm",
                  player.trend === "up" ? "text-green-500" : 
                  player.trend === "down" ? "text-red-500" : 
                  "text-gray-400"
                )}>
                  {trendIndicators[player.trend]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 