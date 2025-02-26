import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get date from query parameter or use today
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const date = dateParam || new Date().toISOString().split('T')[0];
    
    // Check if challenge already exists for this date
    const { data: existingChallenge, error: checkError } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('challenge_date', date)
      .maybeSingle();
      
    if (existingChallenge) {
      return NextResponse.json({
        success: false,
        message: 'Challenge already exists for this date',
        challenge: existingChallenge
      });
    }
    
    // Get random players for each difficulty
    // 1. Easy player - using limit instead of random() function
    const { data: easyPlayers, error: easyError } = await supabase
      .from('players')
      .select('id')
      .eq('difficulty', 'Easy')
      .limit(100);
      
    if (easyError || !easyPlayers || easyPlayers.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch Easy players: ' + (easyError?.message || 'No players found')
      }, { status: 500 });
    }
    
    // Select a random player from the results
    const randomEasyIndex = Math.floor(Math.random() * easyPlayers.length);
    const easyPlayer = easyPlayers[randomEasyIndex];
    
    // 2. Hard player - using the same approach
    const { data: hardPlayers, error: hardError } = await supabase
      .from('players')
      .select('id')
      .eq('difficulty', 'Hard')
      .limit(100);
      
    if (hardError || !hardPlayers || hardPlayers.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch Hard players: ' + (hardError?.message || 'No players found')
      }, { status: 500 });
    }
    
    // Select a random player from the results
    const randomHardIndex = Math.floor(Math.random() * hardPlayers.length);
    const hardPlayer = hardPlayers[randomHardIndex];
    
    // 3. For Hall of Fame, we'll use another Hard player for now
    // Filter out the already selected hard player
    const hofCandidates = hardPlayers.filter(p => p.id !== hardPlayer.id);
    
    let hofPlayerId;
    if (hofCandidates.length > 0) {
      // Select a random player from the filtered list
      const randomHofIndex = Math.floor(Math.random() * hofCandidates.length);
      hofPlayerId = hofCandidates[randomHofIndex].id;
    } else {
      // If no other hard player is available, use the same one
      hofPlayerId = hardPlayer.id;
    }
    
    // Create the challenge
    const { data: newChallenge, error: createError } = await supabase
      .from('daily_challenges')
      .insert({
        challenge_date: date,
        easy_player_id: easyPlayer.id,
        hard_player_id: hardPlayer.id,
        hof_player_id: hofPlayerId
      })
      .select()
      .single();
      
    if (createError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create challenge: ' + createError.message
      }, { status: 500 });
    }
    
    // Fetch the full player details to return
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, position, college, difficulty')
      .in('id', [easyPlayer.id, hardPlayer.id, hofPlayerId]);
      
    if (playersError) {
      return NextResponse.json({
        success: true,
        message: 'Challenge created but failed to fetch player details',
        challenge: newChallenge
      });
    }
    
    // Map player details
    const easyDetails = players.find(p => p.id === easyPlayer.id);
    const hardDetails = players.find(p => p.id === hardPlayer.id);
    const hofDetails = players.find(p => p.id === hofPlayerId);
    
    return NextResponse.json({
      success: true,
      message: 'Challenge created successfully',
      challenge: newChallenge,
      players: {
        easy: easyDetails,
        hard: hardDetails,
        hof: hofDetails
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'An error occurred'
    }, { status: 500 });
  }
} 