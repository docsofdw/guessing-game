// app/page.tsx

"use client"

import Link from "next/link"
import { Button } from "@/components/common/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/common/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">YDKB</CardTitle>
          <CardDescription className="text-center">
            Test your knowledge of NFL players' college careers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Link href="/play">
            <Button size="lg" className="w-48">Start Today's Game</Button>
          </Link>
          <Link href="/archive">
            <Button variant="outline" size="lg" className="w-48">View Archive</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost" size="lg" className="w-48">Leaderboard</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}