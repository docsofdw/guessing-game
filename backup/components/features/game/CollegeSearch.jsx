'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Check, X } from 'lucide-react';

export default function CollegeSearch({ 
  onGuess, 
  attempts = 0, 
  maxAttempts = 3, 
  guesses = [], 
  gameComplete = false,
  onGiveUp
}) {
  // Add client-side only rendering
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  // Simple hardcoded list - no Supabase for now to eliminate potential issues
  const collegeList = [
    { id: 1, name: 'Alabama' },
    { id: 2, name: 'Ohio State' },
    { id: 3, name: 'Michigan' },
    { id: 4, name: 'Georgia' },
    { id: 5, name: 'Clemson' },
    { id: 6, name: 'Oklahoma' },
    { id: 7, name: 'Notre Dame' },
    { id: 8, name: 'Texas' },
    { id: 9, name: 'LSU' },
    { id: 10, name: 'Florida' },
  ];
  
  // Only run on client side
  useEffect(() => {
    setMounted(true);
    setIsClient(true);
    
    // Clean up any potential browser extension interference
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'SCRIPT' || 
                (node.nodeType === 1 && (node instanceof Element) && node.hasAttribute('data-is-priority'))) {
              node.parentNode?.removeChild(node);
            }
          });
        }
      });
    });
    
    // Start observing the document with the configured parameters
    const container = document.getElementById('college-search-container');
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchTerm && !guesses.includes(searchTerm)) {
      onGuess(searchTerm);
      setSearchTerm('');
    }
  };
  
  // Return placeholder during SSR and initial hydration
  if (!mounted || !isClient) {
    return (
      <div className="space-y-4" id="college-search-container">
        <div className="flex gap-2">
          <Input disabled placeholder="Loading..." className="w-full" />
          <Button disabled>Guess</Button>
        </div>
      </div>
    );
  }
  
  // Client-side only UI
  return (
    <div className="space-y-4" id="college-search-container">
      {/* Previous guesses */}
      {guesses.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Previous guesses:</p>
          <div className="flex flex-wrap gap-2">
            {guesses.map((guess, index) => (
              <div 
                key={index} 
                className="px-2 py-1 bg-gray-100 rounded-md text-sm flex items-center"
              >
                <span>{guess}</span>
                <X className="ml-1 h-3 w-3 text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Simple form - no dropdown for now */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter college name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={gameComplete || attempts >= maxAttempts}
            className="w-full"
            autoComplete="off"
          />
          
          <Button 
            type="submit" 
            disabled={!searchTerm || gameComplete || attempts >= maxAttempts}
          >
            Guess
          </Button>
        </div>
      </form>
      
      {/* Give up button */}
      {!gameComplete && attempts < maxAttempts && (
        <div className="flex justify-end mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onGiveUp}
            className="text-gray-500 hover:text-gray-700"
          >
            I Don't Know
          </Button>
        </div>
      )}
      
      {/* Game status */}
      {gameComplete && (
        <div className={`mt-4 p-3 rounded-md ${
          guesses.length > 0 && guesses.length <= maxAttempts 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <div className="flex items-center">
            {guesses.length > 0 && guesses.length <= maxAttempts ? (
              <Check className="mr-2 h-5 w-5" />
            ) : (
              <AlertCircle className="mr-2 h-5 w-5" />
            )}
            <span className="font-medium">
              {guesses.length > 0 && guesses.length <= maxAttempts 
                ? `Correct! You got it in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}.` 
                : 'You gave up on this challenge.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}