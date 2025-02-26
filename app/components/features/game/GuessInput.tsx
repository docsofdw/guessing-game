// src/components/features/game/GuessInput.tsx
"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/app/components/common/ui/button"

interface GuessInputProps {
  onSubmit: (guess: string) => void
  disabled?: boolean
}

export function GuessInput({ onSubmit, disabled = false }: GuessInputProps) {
  const [guess, setGuess] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (guess.trim()) {
      onSubmit(guess.trim())
      setGuess("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter college name..."
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !guess.trim()}>
        Submit
      </Button>
    </form>
  )
}