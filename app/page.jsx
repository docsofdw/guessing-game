'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [player, setPlayer] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing, correct, incorrect, gaveup
  const [colleges, setColleges] = useState([]);
  
  // Maximum attempts allowed
  const MAX_ATTEMPTS = 3;
  
  // Initialize Supabase client
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    fetchTodaysPlayer();
    fetchColleges();
  }, []);
  
  // Fetch today's player for the game
  const fetchTodaysPlayer = async () => {
    try {
      setLoading(true);
      
      // First, check if there's a daily challenge for today
      const today = new Date().toISOString().split('T')[0];
      const { data: challenge, error: challengeError } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_date', today)
        .single();
      
      // If no challenge exists for today or there's an error
      if (challengeError) {
        console.log('No challenge for today, fetching random player');
        
        // Get total count of players
        const { count, error: countError } = await supabase
          .from('players')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw new Error(countError.message);
        setPlayerCount(count || 0);
        
        // Fetch random player (we'll use Easy difficulty for demonstration)
        const { data: randomPlayer, error: playerError } = await supabase
          .from('players')
          .select('*')
          .eq('difficulty', 'Easy')
          .limit(1)
          .single();
          
        if (playerError) throw new Error(playerError.message);
        setPlayer(randomPlayer);
      } else {
        // Challenge exists, fetch the easy player
        const { data: easyPlayer, error: playerError } = await supabase
          .from('players')
          .select('*')
          .eq('id', challenge.easy_player_id)
          .single();
          
        if (playerError) throw new Error(playerError.message);
        setPlayer(easyPlayer);
        
        // Get total count of players
        const { count } = await supabase
          .from('players')
          .select('*', { count: 'exact', head: true });
        
        setPlayerCount(count || 0);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch colleges for validation
  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('name')
        .order('name');
        
      if (error) throw new Error(error.message);
      setColleges(data || []);
    } catch (err) {
      console.error('Error fetching colleges:', err);
    }
  };
  
  // Handle guess submission
  const handleGuess = (e) => {
    e.preventDefault();
    
    // If game is over, do nothing
    if (gameState !== 'playing') return;
    
    // Check if guess is correct (case insensitive)
    const isCorrect = guess.toLowerCase() === player?.college?.toLowerCase();
    
    if (isCorrect) {
      setGameState('correct');
    } else {
      // Increment attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      // Check if out of attempts
      if (newAttempts >= MAX_ATTEMPTS) {
        setGameState('incorrect');
      }
    }
    
    // Clear the input
    setGuess('');
  };
  
  // Handle giving up
  const handleGiveUp = () => {
    if (gameState === 'playing') {
      setGameState('gaveup');
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGuess('');
    setAttempts(0);
    setGameState('playing');
    fetchTodaysPlayer();
  };
  
  if (loading) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Today's Challenge</h1>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Error</h1>
        <div className="bg-red-100 p-4 rounded-lg text-red-800">
          <p className="font-bold">Something went wrong:</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-2">Today's Challenge</h1>
      
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Who is this NFL player?</h2>
        
        <div className="bg-gray-800 rounded-md flex items-center justify-center h-48 mb-6 text-gray-500">
          Player image not available
        </div>
        
        {player && (
          <div className="mb-4">
            <h3 className="text-lg font-bold">{player.name}</h3>
            <p className="text-gray-400">Position: {player.position}</p>
            <p className="text-gray-400">Difficulty: {player.difficulty}</p>
          </div>
        )}
        
        {gameState === 'playing' ? (
          <form onSubmit={handleGuess} className="mb-4">
            <div className="flex">
              <input
                type="text"
                className="flex-grow p-2 rounded-l text-gray-900"
                placeholder="Enter college name..."
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 min-w-[80px]"
              >
                Guess
              </button>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2
                      ${i < attempts 
                        ? 'border-red-500 bg-red-500 bg-opacity-20' 
                        : 'border-gray-600'
                      }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={handleGiveUp}
                className="text-sm text-gray-400 hover:text-white"
              >
                I Don't Know Ball
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6">
            {gameState === 'correct' && (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                <p className="font-bold">Correct!</p>
                <p>Great job! {player.name} did attend {player.college}.</p>
              </div>
            )}
            
            {gameState === 'incorrect' && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                <p className="font-bold">Wrong!</p>
                <p>You've used all your attempts. {player.name} attended {player.college}.</p>
              </div>
            )}
            
            {gameState === 'gaveup' && (
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
                <p className="font-bold">Better luck next time!</p>
                <p>{player.name} attended {player.college}.</p>
              </div>
            )}
            
            <button
              onClick={resetGame}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4">
          Players in database: {playerCount}
        </p>
      </div>
    </div>
  );
} 