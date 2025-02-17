// src/components/features/game/GuessInput.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/common/ui/input"
import { Button } from "@/components/common/ui/button"

interface GuessInputProps {
  onGuess: (guess: string) => void
  disabled?: boolean
}

export function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onGuess(input.trim())
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter college name..."
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={disabled || !input.trim()}>
        Guess
      </Button>
    </form>
  )
}