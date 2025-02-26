import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Test query to verify connection and check data
    const { data: playersData, error: playersError, count: playersCount } = await supabase
      .from('players')
      .select('*', { count: 'exact' })
      .limit(5);
      
    if (playersError) {
      return NextResponse.json({
        success: false,
        error: playersError.message,
        details: 'Failed to query players table'
      }, { status: 500 });
    }
    
    // Check for colleges table
    const { data: collegesData, error: collegesError, count: collegesCount } = await supabase
      .from('colleges')
      .select('*', { count: 'exact' })
      .limit(5);
      
    // Check for daily_challenges table
    const { data: challengesData, error: challengesError } = await supabase
      .from('daily_challenges')
      .select('*')
      .limit(1);
    
    return NextResponse.json({
      success: true,
      connection: "Successful",
      tables: {
        players: {
          exists: !playersError,
          count: playersCount || 0,
          sample: playersData || []
        },
        colleges: {
          exists: !collegesError,
          count: collegesCount || 0,
          sample: collegesData || []
        },
        dailyChallenges: {
          exists: !challengesError,
          sample: challengesData || []
        }
      },
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined" : "Missing",
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined" : "Missing"
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Error testing Supabase connection'
    }, { status: 500 });
  }
} 