// app/leaderboard/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/ui/card"

export default function LeaderboardPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                <span className="font-medium">Player {i + 1}</span>
                <span className="text-muted-foreground">Score: {1000 - i * 50}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
