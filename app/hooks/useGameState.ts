'use client';

import { useState, useEffect } from 'react';

interface GameState {
  attempts: number;
  correctGuess: boolean;
  gaveUp: boolean;
  guesses: string[];
  gameComplete: boolean;
  feedback: string[];
}

interface UseGameStateReturn {
  loading: boolean;
  attempts: number;
  correctGuess: boolean;
  gaveUp: boolean;
  guesses: string[];
  gameComplete: boolean;
  feedback: string[];
  makeGuess: (college: string, correctCollege: string) => Promise<boolean>;
  giveUp: () => void;
  resetGame: () => void;
  maxAttempts: number;
  attemptsRemaining: number;
  incrementScore?: () => void;
  addResult?: (playerId: number, isCorrect: boolean, attempts: number) => void;
}

export default function useGameState(date?: string, playerId?: string | number): UseGameStateReturn {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  // Add feedback for each guess
  const [feedback, setFeedback] = useState<string[]>([]);
  
  const MAX_ATTEMPTS = 3;
  
  // Load saved state from localStorage
  useEffect(() => {
    if (!date || !playerId) {
      setLoading(false);
      return;
    }
    
    try {
      const savedState = localStorage.getItem(`game-${date}-${playerId}`);
      
      if (savedState) {
        const parsedState = JSON.parse(savedState) as GameState;
        setAttempts(parsedState.attempts);
        setCorrectGuess(parsedState.correctGuess);
        setGaveUp(parsedState.gaveUp);
        setGuesses(parsedState.guesses || []);
        setGameComplete(parsedState.gameComplete);
        setFeedback(parsedState.feedback || []);
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    } finally {
      setLoading(false);
    }
  }, [date, playerId]);
  
  // Save state to localStorage
  const saveState = (state: GameState) => {
    if (!date || !playerId) return;
    
    try {
      localStorage.setItem(`game-${date}-${playerId}`, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };
  
  // Handle a new guess
  const makeGuess = async (college: string, correctCollege: string): Promise<boolean> => {
    // Check if game is already complete
    if (gameComplete) return false;
    
    // Add to guesses array if not already included
    if (!guesses.includes(college)) {
      const updatedGuesses = [...guesses, college];
      setGuesses(updatedGuesses);
      
      // Check if guess is correct
      const isCorrect = college.toLowerCase() === correctCollege.toLowerCase();
      
      // Get hint or feedback for the guess
      let guessFeedback = '';
      if (!isCorrect) {
        try {
          const response = await fetch('/api/daily-challenge/hint', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              guess: college, 
              answer: correctCollege 
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            guessFeedback = data.hint;
          }
        } catch (error) {
          console.error('Error getting hint:', error);
          guessFeedback = 'Try another college';
        }
      } else {
        guessFeedback = 'Correct!';
      }
      
      const updatedFeedback = [...feedback, guessFeedback];
      setFeedback(updatedFeedback);
      
      if (isCorrect) {
        setCorrectGuess(true);
        setGameComplete(true);
        
        const newState: GameState = {
          attempts: attempts + 1,
          correctGuess: true,
          gaveUp: false,
          guesses: updatedGuesses,
          gameComplete: true,
          feedback: updatedFeedback
        };
        
        setAttempts(attempts + 1);
        saveState(newState);
        return true;
      } else {
        // Wrong guess
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Check if max attempts reached
        if (newAttempts >= MAX_ATTEMPTS) {
          setGameComplete(true);
          
          const newState: GameState = {
            attempts: newAttempts,
            correctGuess: false,
            gaveUp: false,
            guesses: updatedGuesses,
            gameComplete: true,
            feedback: updatedFeedback
          };
          
          saveState(newState);
        } else {
          // Game continues
          const newState: GameState = {
            attempts: newAttempts,
            correctGuess: false,
            gaveUp: false,
            guesses: updatedGuesses,
            gameComplete: false,
            feedback: updatedFeedback
          };
          
          saveState(newState);
        }
        
        return false;
      }
    }
    
    return false;
  };
  
  // Handle giving up
  const giveUp = () => {
    setGaveUp(true);
    setGameComplete(true);
    
    const newState: GameState = {
      attempts,
      correctGuess: false,
      gaveUp: true,
      guesses,
      gameComplete: true,
      feedback
    };
    
    saveState(newState);
  };
  
  // Reset game state
  const resetGame = () => {
    setAttempts(0);
    setCorrectGuess(false);
    setGaveUp(false);
    setGuesses([]);
    setGameComplete(false);
    setFeedback([]);
    
    if (date && playerId) {
      localStorage.removeItem(`game-${date}-${playerId}`);
    }
  };
  
  // These functions are added to match the interface expected by other components
  const incrementScore = () => {
    // This would be implemented in a real app
    console.log('Score incremented');
  };
  
  const addResult = (playerId: number, isCorrect: boolean, attempts: number) => {
    // This would be implemented in a real app
    console.log('Result added', { playerId, isCorrect, attempts });
  };
  
  return {
    loading,
    attempts,
    correctGuess,
    gaveUp,
    guesses,
    gameComplete,
    feedback,
    makeGuess,
    giveUp,
    resetGame,
    maxAttempts: MAX_ATTEMPTS,
    attemptsRemaining: MAX_ATTEMPTS - attempts,
    incrementScore,
    addResult
  };
} 