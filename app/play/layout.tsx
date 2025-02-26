import { GameProvider } from "@/app/hooks/useGame"

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <GameProvider>{children}</GameProvider>
} 