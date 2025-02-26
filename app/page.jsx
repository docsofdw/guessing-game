/**
 * YDKB - You Don't Know Ball
 * 
 * NON-AUTHENTICATED HOMEPAGE
 * 
 * This file contains the landing page shown to users who are not logged in.
 * For the authenticated user experience, see: app/components/home/AuthenticatedHome.tsx
 */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import AuthenticatedHome from './components/home/AuthenticatedHome';

export default function HomePage() {
  // This component handles both authenticated and non-authenticated states
  // and renders the appropriate UI based on the user's authentication status
  const { isLoaded, isSignedIn } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [stats, setStats] = useState({
    totalPlayers: 1842,
    totalGames: 15783,
    averageScore: 78.4
  });

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is signed in, show the authenticated home page
  if (isSignedIn) {
    return <AuthenticatedHome />;
  }

  // ========================================================================
  // NON-AUTHENTICATED USER LANDING PAGE STARTS HERE
  // ========================================================================
  return (
    <div style={{ backgroundColor: '#111827', color: 'white', minHeight: '100vh', padding: '2rem' }}>
      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div>
          <span style={{ 
            backgroundColor: '#F59E0B', 
            color: '#111827', 
            padding: '0.5rem 1rem', 
            fontWeight: 'bold', 
            borderRadius: '0.25rem', 
            textTransform: 'uppercase', 
            fontSize: '0.875rem',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            Test Your Knowledge Daily
          </span>
          
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            marginBottom: '1.5rem', 
            lineHeight: '1.2'
          }}>
            You Don't Know <span style={{ color: '#F59E0B' }}>Ball</span>
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#D1D5DB', 
            marginBottom: '2.5rem', 
            maxWidth: '48rem', 
            margin: '0 auto 2.5rem'
          }}>
            Test your college football knowledge with our daily challenges and dominate the leaderboard!
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            <Link href="/signup" style={{ 
              backgroundColor: '#F59E0B', 
              color: '#111827', 
              fontWeight: 'bold', 
              padding: '1rem 2.5rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              width: '100%',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              Sign Up Free
            </Link>
            <Link href="/login" style={{ 
              backgroundColor: '#1F2937', 
              color: 'white', 
              fontWeight: 'bold', 
              padding: '1rem 2.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid #374151',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              width: '100%',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: '#1F2937', padding: '4rem 2rem', marginTop: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ 
              backgroundColor: '#F59E0B', 
              color: '#111827', 
              padding: '0.25rem 0.75rem', 
              fontWeight: 'bold', 
              borderRadius: '0.25rem', 
              textTransform: 'uppercase', 
              fontSize: '0.75rem',
              display: 'inline-block',
              marginBottom: '0.75rem'
            }}>
              Intense & Competitive
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              How It Works
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{ 
              backgroundColor: '#374151', 
              padding: '2rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              borderLeft: '4px solid #F59E0B' 
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🏈</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Daily Challenges
              </h3>
              <p style={{ color: '#D1D5DB' }}>
                New football players to identify every day with increasing difficulty levels.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#374151', 
              padding: '2rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              borderLeft: '4px solid #F59E0B' 
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🏆</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Compete & Rank
              </h3>
              <p style={{ color: '#D1D5DB' }}>
                Compare your scores with other players and dominate the global leaderboard.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#374151', 
              padding: '2rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              borderLeft: '4px solid #F59E0B' 
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Track Progress
              </h3>
              <p style={{ color: '#D1D5DB' }}>
                Monitor your performance over time and unlock achievements as you improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '4rem 2rem', 
        borderTop: '1px solid #374151', 
        borderBottom: '1px solid #374151' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '3rem', 
            textTransform: 'uppercase' 
          }}>
            Community Stats
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '1.5rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              textAlign: 'center', 
              borderTop: '4px solid #F59E0B' 
            }}>
              <p style={{ 
                color: '#F59E0B', 
                fontSize: '0.875rem', 
                textTransform: 'uppercase', 
                fontWeight: 'bold', 
                letterSpacing: '0.05em' 
              }}>
                PLAYERS
              </p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', marginTop: '0.75rem' }}>
                {stats.totalPlayers.toLocaleString()}
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '1.5rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              textAlign: 'center', 
              borderTop: '4px solid #F59E0B' 
            }}>
              <p style={{ 
                color: '#F59E0B', 
                fontSize: '0.875rem', 
                textTransform: 'uppercase', 
                fontWeight: 'bold', 
                letterSpacing: '0.05em' 
              }}>
                GAMES PLAYED
              </p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', marginTop: '0.75rem' }}>
                {stats.totalGames.toLocaleString()}
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '1.5rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              textAlign: 'center', 
              borderTop: '4px solid #F59E0B' 
            }}>
              <p style={{ 
                color: '#F59E0B', 
                fontSize: '0.875rem', 
                textTransform: 'uppercase', 
                fontWeight: 'bold', 
                letterSpacing: '0.05em' 
              }}>
                AVG SCORE
              </p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', marginTop: '0.75rem' }}>
                {stats.averageScore}
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '1.5rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              textAlign: 'center', 
              borderTop: '4px solid #F59E0B' 
            }}>
              <p style={{ 
                color: '#F59E0B', 
                fontSize: '0.875rem', 
                textTransform: 'uppercase', 
                fontWeight: 'bold', 
                letterSpacing: '0.05em' 
              }}>
                TODAY'S DATE
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '0.75rem' }}>
                {currentDate}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '5rem 2rem', 
        textAlign: 'center', 
        background: 'linear-gradient(to bottom, #111827, #1F2937)' 
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem', 
            textTransform: 'uppercase' 
          }}>
            Ready to Test Your Knowledge?
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#D1D5DB', 
            marginBottom: '2.5rem', 
            fontWeight: '500' 
          }}>
            Join thousands of football fans and put your college gridiron expertise to the test.
          </p>
          
          <Link href="/signup" style={{ 
            backgroundColor: '#F59E0B', 
            color: '#111827', 
            fontWeight: 'bold', 
            padding: '1rem 2.5rem', 
            borderRadius: '0.25rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
} 