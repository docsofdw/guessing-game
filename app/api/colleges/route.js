import { NextResponse } from 'next/server';

// This is a simplified list of colleges
// In a real application, you would fetch this from a database
const collegeData = [
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
  { id: 11, name: 'Cornell University' },
  { id: 12, name: 'University of Chicago' },
  { id: 13, name: 'Northwestern University' },
  { id: 14, name: 'Johns Hopkins University' },
  { id: 15, name: 'California Institute of Technology' },
  { id: 16, name: 'University of California, Los Angeles' },
  { id: 17, name: 'University of Wisconsin-Madison' },
  { id: 18, name: 'University of Texas at Austin' },
  { id: 19, name: 'New York University' },
  { id: 20, name: 'University of Washington' },
  // Add more colleges as needed
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  
  if (!search || search.length < 2) {
    return NextResponse.json([]);
  }
  
  // Filter colleges based on search term (case-insensitive)
  const filteredColleges = collegeData.filter(college => 
    college.name.toLowerCase().includes(search.toLowerCase())
  );
  
  // Limit results to prevent overwhelming the UI
  const limitedResults = filteredColleges.slice(0, 10);
  
  return NextResponse.json(limitedResults);
}