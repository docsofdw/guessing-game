'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AlertCircle, Check, X } from 'lucide-react';

export default function CollegeSearch({ 
  onGuess, 
  attempts = 0, 
  maxAttempts = 3, 
  guesses = [], 
  gameComplete = false,
  onGiveUp
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Search for colleges directly from Supabase
  const searchColleges = async (search) => {
    if (!search || search.length < 2) {
      setColleges([]);
      return;
    }
    
    try {
      setLoading(true);
      
      // Use Supabase directly instead of API
      const supabase = createClientComponentClient();
      
      // Query the colleges table
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name')
        .ilike('name', `%${search}%`)
        .limit(10);
      
      if (error) {
        console.error('Error searching colleges:', error);
        // Fallback to hardcoded list if database query fails
        const filteredColleges = fallbackColleges.filter(college => 
          college.name.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 10);
        
        setColleges(filteredColleges);
        return;
      }
      
      setColleges(data || []);
      
    } catch (err) {
      console.error('Error:', err);
      // Fallback to hardcoded list
      const filteredColleges = fallbackColleges.filter(college => 
        college.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 10);
      
      setColleges(filteredColleges);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      searchColleges(value);
      setShowDropdown(true);
    } else {
      setColleges([]);
      setShowDropdown(false);
    }
  };
  
  // Handle college selection
  const handleSelectCollege = (college) => {
    setSearchTerm(college.name);
    setShowDropdown(false);
    
    // If already guessed, don't submit again
    if (guesses.includes(college.name)) {
      return;
    }
    
    // Submit guess
    onGuess(college.name);
    setSearchTerm('');
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchTerm || searchTerm.length < 2) return;
    
    // If already guessed, don't submit again
    if (guesses.includes(searchTerm)) {
      return;
    }
    
    // Submit guess
    onGuess(searchTerm);
    setSearchTerm('');
    setShowDropdown(false);
  };
  
  // Fallback college list in case the database query fails
  const fallbackColleges = [
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
    { id: 11, name: 'Penn State' },
    { id: 12, name: 'USC' },
    { id: 13, name: 'Auburn' },
    { id: 14, name: 'Wisconsin' },
    { id: 15, name: 'Oregon' },
    // Add more colleges as needed
  ];
  
  return (
    <div className="space-y-4">
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
      
      {/* Search form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for a college..."
              value={searchTerm}
              onChange={handleInputChange}
              disabled={gameComplete || attempts >= maxAttempts}
              className="w-full"
            />
            
            {/* Dropdown */}
            {showDropdown && colleges.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
              >
                {colleges.map(college => (
                  <div
                    key={college.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      guesses.includes(college.name) ? 'opacity-50' : ''
                    }`}
                    onClick={() => handleSelectCollege(college)}
                  >
                    {college.name}
                    {guesses.includes(college.name) && (
                      <span className="ml-2 text-gray-500 text-xs">(already guessed)</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
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
            Give Up
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