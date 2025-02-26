/**
 * YDKB - You Don't Know Ball
 * 
 * AUTHENTICATED HOMEPAGE COMPONENT
 * 
 * This file contains the homepage shown to users who are logged in.
 * For the non-authenticated user experience, see: app/page.jsx
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AuthenticatedHome() {
  // This component handles the authenticated user experience
  // It displays personalized content, daily challenges, user stats, and community activity
  
  const [dailyChallenge, setDailyChallenge] = useState({
    title: "Today's Challenge",
    description: "Identify these 10 players from their college stats",
    difficulty: "Medium",
    completionRate: 68,
  });
  
  const [userStats, setUserStats] = useState({
    rank: 423,
    totalPlayed: 47,
    averageScore: 82.5,
    streak: 12,
    recentScores: [85, 90, 75, 95, 80]
  });
  
  const [recentActivity, setRecentActivity] = useState([
    { user: "MarchMadness23", score: 95, time: "2h ago" },
    { user: "HoopsDreams", score: 92, time: "3h ago" },
    { user: "BballFanatic", score: 90, time: "4h ago" },
    { user: "CourtVision", score: 88, time: "5h ago" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Welcome Section */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-gray-600 mb-6">Ready to test your basketball knowledge today?</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/play" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center">
                Play Today's Challenge
              </Link>
              <Link href="/profile" className="bg-white text-indigo-600 font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-indigo-200 text-center">
                View Your Stats
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Challenge Card */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🏀</span> 
              {dailyChallenge.title}
            </h2>
            <p className="text-gray-600 mb-3">{dailyChallenge.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {dailyChallenge.difficulty}
              </span>
              <span className="text-sm text-gray-500">
                {dailyChallenge.completionRate}% completion rate
              </span>
            </div>
            <Link href="/play" className="w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700 transition-colors block">
              Start Challenge
            </Link>
          </motion.div>

          {/* User Stats Card */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span> 
              Your Stats
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Current Rank</p>
                <p className="text-xl font-bold">{userStats.rank}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Avg Score</p>
                <p className="text-xl font-bold">{userStats.averageScore}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Games Played</p>
                <p className="text-xl font-bold">{userStats.totalPlayed}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Current Streak</p>
                <p className="text-xl font-bold">{userStats.streak} days</p>
              </div>
            </div>
            <Link href="/profile" className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors flex items-center justify-center">
              View Full Stats <span className="ml-1">→</span>
            </Link>
          </motion.div>

          {/* Community Activity Card */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🏆</span> 
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {activity.score}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/leaderboard" className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors flex items-center justify-center mt-4">
              View Leaderboard <span className="ml-1">→</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 