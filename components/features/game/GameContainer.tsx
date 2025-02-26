'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getPlayerImage } from '../../../lib/playerImages'; // Import the new function

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Define types for better TypeScript support
interface Player {
  id: number;
  name: string;
  position: string;
  college: string;
  difficulty: string;
  image_url?: string;
}

export function GameContainer() {
  // Game state
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect' | 'gaveup'>('playing');
  const [playerImage, setPlayerImage] = useState<string | null>(null);

  // Maximum attempts allowed
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    setIsLoaded(true);
    fetchPlayer();
  }, []);

  // Add a new useEffect to fetch the player image when a player is selected
  useEffect(() => {
    async function fetchPlayerImage() {
      if (player?.name) {
        // First check if we already have the image URL in the database
        if (player.image_url) {
          setPlayerImage(player.image_url);
        } else {
          // If not, fetch it from the API
          const imageUrl = await getPlayerImage(player.name);
          setPlayerImage(imageUrl);
          
          // Cache the URL in the database if we found an image
          if (imageUrl) {
            try {
              const supabase = createClient(supabaseUrl, supabaseAnonKey);
              await supabase
                .from('players')
                .update({ image_url: imageUrl })
                .eq('id', player.id);
            } catch (err) {
              console.error('Error updating player image URL:', err);
            }
          }
        }
      } else {
        setPlayerImage(null);
      }
    }
    
    fetchPlayerImage();
  }, [player?.name]);

  // Fetch a player from Supabase
  const fetchPlayer = async () => {
    try {
      setLoading(true);
      
      // Create Supabase client
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Get a random player (using Easy difficulty for simplicity)
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('difficulty', 'Easy')
        .limit(10);
        
      if (error) throw error;
      
      // Get total count of players
      const { count, error: countError } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true });
        
      if (countError) throw countError;
      
      setPlayerCount(count || 0);
      
      // If we have players, select one randomly
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setPlayer(data[randomIndex]);
      }
    } catch (err: any) {
      console.error('Error fetching player:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle guess submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!player || gameState !== 'playing') return;
    
    const trimmedGuess = guess.trim();
    if (!trimmedGuess) return;
    
    // Add to guesses array if not already included
    if (!guesses.includes(trimmedGuess)) {
      const updatedGuesses = [...guesses, trimmedGuess];
      setGuesses(updatedGuesses);
      
      // Check if guess is correct (case insensitive)
      const isCorrect = trimmedGuess.toLowerCase() === player.college.toLowerCase();
      const newAttempts = attempts + 1;
      
      if (isCorrect) {
        setFeedback('Correct! Well done!');
        setGameState('correct');
        
        // Load a new question after a delay
        setTimeout(() => {
          resetGame();
        }, 2000);
      } else {
        if (newAttempts >= MAX_ATTEMPTS) {
          setFeedback(`Game over! The correct answer was ${player.college}`);
          setGameState('incorrect');
        } else {
          setFeedback(`Incorrect. Try again! (Attempt ${newAttempts}/${MAX_ATTEMPTS})`);
        }
        setAttempts(newAttempts);
      }
    } else {
      setFeedback('You already guessed that college.');
    }
    
    // Clear the input
    setGuess('');
  };

  // Handle giving up
  const handleGiveUp = () => {
    if (player && gameState === 'playing') {
      setFeedback(`You gave up. The correct answer was ${player.college}.`);
      setGameState('gaveup');
    }
  };

  // Reset the game
  const resetGame = () => {
    setGuess('');
    setAttempts(0);
    setGuesses([]);
    setFeedback('');
    setGameState('playing');
    setPlayerImage(null);
    fetchPlayer();
  };

  if (!isLoaded) {
    return <div className="bg-gray-800 text-white p-8 rounded-lg">Loading game data...</div>;
  }

  if (loading) {
    return <div className="bg-gray-800 text-white p-8 rounded-lg">Loading player data...</div>;
  }
  
  if (error) {
    return <div className="bg-red-800 text-white p-8 rounded-lg">Error: {error}</div>;
  }
  
  if (!player) {
    return <div className="bg-red-800 text-white p-8 rounded-lg">No players available</div>;
  }

  const isGameOver = gameState === 'correct' || gameState === 'incorrect' || gameState === 'gaveup';

  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg">
      <h2 className="text-xl font-bold mb-6">Who is this NFL player?</h2>
      
      {/* Display player image or clue */}
      <div className="mb-6 h-64 bg-gray-700 flex items-center justify-center rounded-lg">
        {playerImage ? (
          <img 
            src={playerImage} 
            alt={`${player.name}`} 
            className="max-h-full max-w-full object-contain rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-gray-600 rounded-full w-32 h-32 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-300">
                {player.name?.charAt(0) || '?'}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Player info */}
      <div className="mb-4">
        <p className="font-semibold">{player.name}</p>
        <p className="text-gray-400">Position: {player.position}</p>
        <p className="text-gray-400">Difficulty: {player.difficulty}</p>
      </div>
      
      {/* Previous guesses */}
      {guesses.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Previous guesses:</p>
          <div className="flex flex-wrap gap-2">
            {guesses.map((g, index) => (
              <span key={index} className="bg-gray-700 px-2 py-1 rounded text-sm">
                {g}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Game feedback */}
      {feedback && (
        <div className={`mb-4 p-3 rounded ${
          gameState === 'correct' 
            ? 'bg-green-700' 
            : gameState === 'incorrect' || gameState === 'gaveup'
              ? 'bg-yellow-700'
              : 'bg-red-700'
        }`}>
          {feedback}
        </div>
      )}
      
      {/* Attempt indicators */}
      <div className="flex mb-4 gap-2">
        {[...Array(MAX_ATTEMPTS)].map((_, i) => (
          <div 
            key={i} 
            className={`w-8 h-8 flex items-center justify-center rounded-full border ${
              i < attempts 
                ? 'border-red-500 bg-red-500 bg-opacity-20' 
                : 'border-gray-600'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      
      {/* Guess form */}
      {!isGameOver ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex relative">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter college name..."
              className="flex-grow px-4 py-2 rounded-l text-black"
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-r"
            >
              Guess
            </button>
          </div>
          
          <button
            type="button"
            onClick={handleGiveUp}
            className="mt-2 text-sm text-gray-400 hover:text-white"
          >
            I Don't Know Ball
          </button>
        </form>
      ) : (
        // Only show Play Again button if the game is over due to wrong answers or giving up
        // Don't show it when the answer is correct (since we auto-advance)
        gameState === 'correct' ? null : (
          <button 
            onClick={resetGame}
            className="w-full bg-green-600 hover:bg-green-700 px-6 py-2 rounded mb-4"
          >
            Play Again
          </button>
        )
      )}
      
      {/* Player college info (shown after game is over) */}
      {isGameOver && (
        <div className="mt-4 bg-gray-700 p-4 rounded">
          <h3 className="font-bold text-lg mb-2">College: {player.college}</h3>
          <p className="text-sm text-gray-300">
            {player.name} played college football at {player.college}.
          </p>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-400">
        Players in database: {playerCount}
      </div>
    </div>
  );
}

export default GameContainer; 