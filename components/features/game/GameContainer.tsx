'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for better TypeScript support
interface Player {
  id: number;
  name: string;
  position: string;
  college: string;
  difficulty: string;
  image_url?: string;
}

interface GameState {
  currentPlayer: Player | null;
  attempts: number;
  isCorrect: boolean;
  gaveUp: boolean;
  guesses: string[];
  feedback: string;
}

export function GameContainer() {
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guess, setGuess] = useState('');
  const [collegeList, setCollegeList] = useState<string[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: null,
    attempts: 0,
    isCorrect: false,
    gaveUp: false,
    guesses: [],
    feedback: ''
  });

  // Maximum number of attempts allowed
  const MAX_ATTEMPTS = 3;

  // Fetch player data from Supabase
  useEffect(() => {
    async function fetchPlayerData() {
      try {
        setLoading(true);
        
        // First, check for a daily challenge
        const today = new Date().toISOString().split('T')[0];
        const { data: challenge, error: challengeError } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('challenge_date', today)
          .maybeSingle();
        
        if (challenge) {
          // Get the easy player for the challenge
          const { data: player, error: playerError } = await supabase
            .from('players')
            .select('*')
            .eq('id', challenge.easy_player_id)
            .single();
            
          if (playerError) throw playerError;
          
          setGameState(prev => ({ ...prev, currentPlayer: player }));
          
          // Also fetch a sample of players for the database count
          const { data: allPlayers, error } = await supabase
            .from('players')
            .select('*', { count: 'exact', head: true });
            
          if (error) throw error;
          
          setPlayerData(allPlayers || []);
        } else {
          // No challenge found, fetch random players
          const { data, error } = await supabase
            .from('players')
            .select('*')
            .eq('difficulty', 'Easy')
            .limit(10);
          
          if (error) throw error;
          
          setPlayerData(data || []);
          
          // If we have players, select one randomly for the game
          if (data && data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            setGameState(prev => ({ ...prev, currentPlayer: data[randomIndex] }));
          }
        }

        // Fetch all unique colleges for autocomplete
        const { data: colleges, error: collegesError } = await supabase
          .from('players')
          .select('college')
          .order('college');
        
        if (collegesError) throw collegesError;
        
        // Extract unique colleges
        const uniqueColleges = Array.from(new Set(colleges?.map(p => p.college) || []))
          .filter(Boolean)
          .sort();
          
        setCollegeList(uniqueColleges);
        
      } catch (err: any) {
        console.error('Error fetching player data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerData();
  }, []);

  // Filter colleges based on user input
  useEffect(() => {
    if (guess.length >= 3) {
      const filtered = collegeList.filter(college => 
        college.toLowerCase().includes(guess.toLowerCase())
      );
      setFilteredColleges(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [guess, collegeList]);

  // Handle user guess submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameState.currentPlayer || gameState.isCorrect || gameState.gaveUp) return;
    
    const trimmedGuess = guess.trim();
    if (!trimmedGuess) return;
    
    // Add to guesses array if not already included
    if (!gameState.guesses.includes(trimmedGuess)) {
      const updatedGuesses = [...gameState.guesses, trimmedGuess];
      
      // Check if guess is correct (case insensitive)
      const isCorrect = trimmedGuess.toLowerCase() === gameState.currentPlayer.college.toLowerCase();
      const newAttempts = gameState.attempts + 1;
      
      setGameState(prev => ({
        ...prev,
        attempts: newAttempts,
        isCorrect,
        guesses: updatedGuesses,
        feedback: isCorrect 
          ? 'Correct! Well done!' 
          : newAttempts >= MAX_ATTEMPTS
            ? `Game over! The correct answer was ${gameState.currentPlayer?.college}`
            : `Incorrect. Try again! (Attempt ${newAttempts}/${MAX_ATTEMPTS})`
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        feedback: 'You already guessed that college.'
      }));
    }
    
    // Clear the input and hide suggestions
    setGuess('');
    setShowSuggestions(false);
  };

  // Handle selecting a college from suggestions
  const handleSelectCollege = (college: string) => {
    setGuess(college);
    setShowSuggestions(false);
  };

  // Handle giving up
  const handleGiveUp = () => {
    if (gameState.currentPlayer && !gameState.isCorrect && !gameState.gaveUp) {
      setGameState(prev => ({
        ...prev,
        gaveUp: true,
        feedback: `You gave up. The correct answer was ${gameState.currentPlayer?.college}.`
      }));
    }
  };

  // Reset the game with a new player
  const resetGame = () => {
    if (playerData.length > 0) {
      const randomIndex = Math.floor(Math.random() * playerData.length);
      setGameState({
        currentPlayer: playerData[randomIndex],
        attempts: 0,
        isCorrect: false,
        gaveUp: false,
        guesses: [],
        feedback: ''
      });
      setGuess('');
      setShowSuggestions(false);
    }
  };

  // Determine if the game is over
  const isGameOver = gameState.isCorrect || gameState.gaveUp || gameState.attempts >= MAX_ATTEMPTS;

  if (loading) return <div className="bg-gray-800 text-white p-8 rounded-lg">Loading player data...</div>;
  
  if (error) return <div className="bg-red-800 text-white p-8 rounded-lg">Error: {error}</div>;
  
  if (!gameState.currentPlayer) return <div className="bg-red-800 text-white p-8 rounded-lg">No players available</div>;

  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg">
      <h2 className="text-xl font-bold mb-6">Who is this NFL player?</h2>
      
      {/* Display player image or clue */}
      <div className="mb-6 h-64 bg-gray-700 flex items-center justify-center rounded-lg">
        {gameState.currentPlayer.image_url ? (
          <img 
            src={gameState.currentPlayer.image_url} 
            alt="Mystery player" 
            className="max-h-full max-w-full object-contain rounded"
          />
        ) : (
          <div className="text-gray-400">Player image not available</div>
        )}
      </div>
      
      {/* Player info */}
      <div className="mb-4">
        <p className="font-semibold">{gameState.currentPlayer.name}</p>
        <p className="text-gray-400">Position: {gameState.currentPlayer.position}</p>
        <p className="text-gray-400">Difficulty: {gameState.currentPlayer.difficulty}</p>
      </div>
      
      {/* Previous guesses */}
      {gameState.guesses.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Previous guesses:</p>
          <div className="flex flex-wrap gap-2">
            {gameState.guesses.map((g, index) => (
              <span key={index} className="bg-gray-700 px-2 py-1 rounded text-sm">
                {g}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Game feedback */}
      {gameState.feedback && (
        <div className={`mb-4 p-3 rounded ${
          gameState.isCorrect 
            ? 'bg-green-700' 
            : gameState.gaveUp || gameState.attempts >= MAX_ATTEMPTS
              ? 'bg-yellow-700'
              : 'bg-red-700'
        }`}>
          {gameState.feedback}
        </div>
      )}
      
      {/* Attempt indicators */}
      <div className="flex mb-4 gap-2">
        {[...Array(MAX_ATTEMPTS)].map((_, i) => (
          <div 
            key={i} 
            className={`w-8 h-8 flex items-center justify-center rounded-full border ${
              i < gameState.attempts 
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
            
            {/* College suggestions dropdown */}
            {showSuggestions && filteredColleges.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white text-black rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredColleges.map((college, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectCollege(college)}
                  >
                    {college}
                  </div>
                ))}
              </div>
            )}
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
        <button 
          onClick={resetGame}
          className="w-full bg-green-600 hover:bg-green-700 px-6 py-2 rounded mb-4"
        >
          Play Again
        </button>
      )}
      
      {/* Player college info (shown after game is over) */}
      {isGameOver && (
        <div className="mt-4 bg-gray-700 p-4 rounded">
          <h3 className="font-bold text-lg mb-2">College: {gameState.currentPlayer.college}</h3>
          <p className="text-sm text-gray-300">
            {gameState.currentPlayer.name} played college football at {gameState.currentPlayer.college}.
          </p>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-400">
        Players in database: {playerData.length}
      </div>
    </div>
  );
} 