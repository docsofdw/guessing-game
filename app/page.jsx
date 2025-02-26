'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Format the current date as Month Day, Year
    const date = new Date();
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-gray-800 text-white p-8 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">YDKB</h1>
          <p className="text-gray-400">Test your knowledge of NFL players' college careers</p>
          {currentDate && <p className="text-gray-500 mt-2">{currentDate}</p>}
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <Link href="/play" className="w-full">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-medium">
              Start Today's Game
            </button>
          </Link>
          
          <Link href="/archive" className="w-full">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg text-lg font-medium">
              View Archive
            </button>
          </Link>
          
          <Link href="/leaderboard" className="w-full">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg text-lg font-medium">
              Leaderboard
            </button>
          </Link>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>New challenges available daily!</p>
        </div>
      </div>
    </main>
  );
} 