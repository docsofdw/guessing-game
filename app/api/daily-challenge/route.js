import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    // Get date parameter or use today
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    // Format date as YYYY-MM-DD
    const formattedDate = dateParam || new Date().toISOString().split('T')[0];
    
    // Get daily challenge
    const { data: challenge, error: challengeError } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('challenge_date', formattedDate)
      .single();
    
    if (challengeError) {
      return NextResponse.json(
        { error: 'No challenge found for this date' },
        { status: 404 }
      );
    }
    
    // Get all players in a single query for better performance
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, position, college, difficulty, team, jersey_number, ppg, points_per_game')
      .in('id', [challenge.easy_player_id, challenge.hard_player_id, challenge.hof_player_id]);
    
    if (playersError) {
      return NextResponse.json(
        { error: 'Error loading player data' },
        { status: 500 }
      );
    }
    
    // Map players to their difficulty levels
    const playerMap = players.reduce((acc, player) => {
      if (player.id === challenge.easy_player_id) acc.easy = player;
      if (player.id === challenge.hard_player_id) acc.hard = player;
      if (player.id === challenge.hof_player_id) acc.hof = player;
      return acc;
    }, {});
    
    // Check if we have all required players
    if (!playerMap.easy || !playerMap.hard || !playerMap.hof) {
      return NextResponse.json(
        { error: 'Missing player data for challenge' },
        { status: 500 }
      );
    }
    
    // Make sure we're returning the player data we need for the redesigned card
    const formattedOptions = players.map(player => ({
      id: player.id,
      name: player.name,
      team: player.team,
      position: player.position,
      jersey_number: player.jersey_number,
      ppg: player.ppg || player.points_per_game,
      college: player.college,
      // Add any other fields you have in your database
    }));
    
    // Determine which player to use as the question subject (e.g., the easy player)
    const questionPlayer = playerMap.easy;
    const correctIndex = formattedOptions.findIndex(player => player.id === questionPlayer.id);
    
    // Build response object
    const response = {
      date: formattedDate,
      challenge_id: challenge.id,
      players: playerMap,
      question: "Which college did this player attend?",
      options: formattedOptions,
      correctOption: correctIndex
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 