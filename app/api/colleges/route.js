import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Fallback data in case the database query fails
const fallbackCollegeData = [
  { id: 1, name: 'Harvard University' },
  { id: 2, name: 'Stanford University' },
  { id: 3, name: 'Massachusetts Institute of Technology' },
  { id: 4, name: 'Yale University' },
  { id: 5, name: 'Princeton University' },
  { id: 6, name: 'University of California, Berkeley' },
  { id: 7, name: 'University of Michigan' },
  { id: 8, name: 'Duke University' },
  { id: 9, name: 'Columbia University' },
  { id: 10, name: 'University of Pennsylvania' },
  // Add more colleges as needed
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  
  if (!search || search.length < 3) {
    return NextResponse.json([]);
  }
  
  try {
    // Create a Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Query the colleges table
    const { data, error } = await supabase
      .from('colleges')
      .select('id, name')
      .ilike('name', `%${search}%`)
      .order('name')
      .limit(10);
    
    if (error) {
      console.error('Error fetching colleges from database:', error);
      // Fall back to the hardcoded data if there's an error
      const filteredFallbackData = fallbackCollegeData.filter(college => 
        college.name.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json(filteredFallbackData.slice(0, 10));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in colleges API route:', error);
    
    // Fall back to the hardcoded data if there's an error
    const filteredFallbackData = fallbackCollegeData.filter(college => 
      college.name.toLowerCase().includes(search.toLowerCase())
    );
    
    return NextResponse.json(filteredFallbackData.slice(0, 10));
  }
}