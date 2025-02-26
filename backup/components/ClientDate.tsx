'use client';
import { useState, useEffect } from 'react';

interface ClientDateProps {
  className?: string;
}

export function ClientDate({ className = '' }: ClientDateProps) {
  const [date, setDate] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Format the current date as Month Day, Year
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    // Use a fixed locale to avoid hydration mismatches
    setDate(currentDate.toLocaleDateString('en-US', options));
  }, []);
  
  // During SSR or hydration, return an empty element to avoid mismatches
  if (!isClient) {
    return <p className={className}></p>;
  }
  
  return <p className={className}>{date}</p>;
} 