'use client';
import { useState, useEffect } from 'react';
import { GameContainer } from "../../components/features/game/GameContainer";

export default function PlayPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once the component mounts
    setIsClient(true);
    
    // Format the current date as Month Day, Year
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Today's Challenge</h1>
          {isClient && currentDate && <p className="text-gray-500">{currentDate}</p>}
        </div>
        
        {isClient ? (
          <GameContainer />
        ) : (
          <div className="bg-gray-800 text-white p-8 rounded-lg">Loading game...</div>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Test your knowledge of NFL players and their college backgrounds.</p>
          <p className="mt-2">New challenges available daily!</p>
        </div>
      </div>
    </main>
  );
} 