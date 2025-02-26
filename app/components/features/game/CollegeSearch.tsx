'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { AlertCircle, Check, X } from 'lucide-react';

interface College {
  id: number;
  name: string;
}

interface CollegeSearchProps {
  onGuess: (college: string) => void;
  attempts?: number;
  maxAttempts?: number;
  guesses?: string[];
  gameComplete?: boolean;
  onGiveUp?: () => void;
  onSelect?: (college: string) => void;
  disabled?: boolean;
}

export default function CollegeSearch({ 
  onGuess, 
  attempts = 0, 
  maxAttempts = 3, 
  guesses = [], 
  gameComplete = false,
  onGiveUp,
  onSelect,
  disabled = false
}: CollegeSearchProps) {
  // Add client-side only rendering
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [suggestions, setSuggestions] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Fetch college suggestions when search term changes
  useEffect(() => {
    const fetchColleges = async () => {
      if (searchTerm.length >= 3) {
        setLoading(true);
        try {
          const response = await fetch(`/api/colleges?search=${encodeURIComponent(searchTerm)}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error('Error fetching colleges:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchColleges();
  }, [searchTerm]);
  
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
    
    // Add click event listener to close suggestions when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const container = document.getElementById('college-search-container');
      if (container && !container.contains(target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (searchTerm && !guesses.includes(searchTerm)) {
      if (onGuess) onGuess(searchTerm);
      if (onSelect) onSelect(searchTerm);
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (college: College) => {
    if (!guesses.includes(college.name)) {
      if (onGuess) onGuess(college.name);
      if (onSelect) onSelect(college.name);
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
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
      
      {/* Text input with autocomplete dropdown */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Enter college name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={gameComplete || attempts >= maxAttempts || disabled}
              className="w-full"
              autoComplete="off"
            />
            
            {/* Autocomplete suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((college) => (
                  <div
                    key={college.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectSuggestion(college)}
                  >
                    {college.name}
                  </div>
                ))}
              </div>
            )}
            
            {/* Loading indicator */}
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </form>
      
      {/* Give up button */}
      {!gameComplete && attempts < maxAttempts && onGiveUp && (
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