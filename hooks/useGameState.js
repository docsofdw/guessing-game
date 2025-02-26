'use client';

import { useState, useEffect } from 'react';

export default function useGameState(date, playerId) {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  // Add feedback for each guess
  const [feedback, setFeedback] = useState([]);
  
  const MAX_ATTEMPTS = 3;
  
  // Load saved state from localStorage
  useEffect(() => {
    if (!date || !playerId) return;
    
    try {
      const savedState = localStorage.getItem(`game-${date}-${playerId}`);
      
      if (savedState) {
        const parsedState = JSON.parse(savedState);
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
  const saveState = (state) => {
    if (!date || !playerId) return;
    
    try {
      localStorage.setItem(`game-${date}-${playerId}`, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };
  
  // Handle a new guess
  const makeGuess = async (college, correctCollege) => {
    // Check if game is already complete
    if (gameComplete) return;
    
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
        
        const newState = {
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
          
          const newState = {
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
          const newState = {
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
    
    const newState = {
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
    
    localStorage.removeItem(`game-${date}-${playerId}`);
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
    attemptsRemaining: MAX_ATTEMPTS - attempts
  };
} 