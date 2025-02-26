import React from 'react';
import { motion } from 'framer-motion';

const QuestionCard = ({ question, options, onSelect, selectedOption, correctOption, showAnswer }) => {
  // Determine if the question has been answered
  const isAnswered = showAnswer && selectedOption !== null;
  
  // Get the current player to display (first option)
  const currentPlayer = options && options.length > 0 ? options[0] : null;
  
  // Function to get team color based on team name
  const getTeamColor = (teamName) => {
    // This is a simplified version - you could expand with actual team colors
    const teamColors = {
      'Lakers': 'bg-purple-600',
      'Celtics': 'bg-green-600',
      'Bulls': 'bg-red-600',
      'Warriors': 'bg-blue-500',
      // Add more teams as needed
    };
    
    return teamColors[teamName] || 'bg-gray-500';
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Question header */}
      <div className="p-6 bg-indigo-900 text-white">
        <h2 className="text-xl font-bold text-center">{question || "Who is this NBA player?"}</h2>
      </div>
      
      {/* Player info card - completely redesigned without image */}
      {currentPlayer && (
        <div className="p-6">
          <div className="w-full bg-gray-800 rounded-lg p-6 mb-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-10 bg-indigo-500"></div>
            <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full opacity-10 bg-blue-500"></div>
            
            {/* Player jersey number as large background element */}
            {currentPlayer.jersey_number && (
              <div className="absolute right-8 opacity-10 select-none">
                <span className="text-9xl font-bold text-white">
                  {currentPlayer.jersey_number}
                </span>
              </div>
            )}
            
            <div className="relative z-10">
              {/* Player position badge */}
              <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 text-white" 
                   style={{backgroundColor: 'rgba(79, 70, 229, 0.8)'}}>
                {currentPlayer.position || "Position Unknown"}
              </div>
              
              {/* Player stats in a modern layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Team info */}
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${getTeamColor(currentPlayer.team)} flex items-center justify-center mr-3`}>
                    <span className="text-white font-bold">{currentPlayer.team?.charAt(0) || "T"}</span>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Team</div>
                    <div className="text-white font-semibold">{currentPlayer.team || "Unknown"}</div>
                  </div>
                </div>
                
                {/* Jersey number */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">#</span>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Jersey</div>
                    <div className="text-white font-semibold">#{currentPlayer.jersey_number || "00"}</div>
                  </div>
                </div>
                
                {/* PPG */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">PPG</span>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Points Per Game</div>
                    <div className="text-white font-semibold">{currentPlayer.ppg || "0.0"}</div>
                  </div>
                </div>
              </div>
              
              {/* Additional stats in a horizontal bar */}
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-xs">Height</div>
                  <div className="text-white font-semibold">{currentPlayer.height || "6'0\""}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Weight</div>
                  <div className="text-white font-semibold">{currentPlayer.weight || "200 lbs"}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Experience</div>
                  <div className="text-white font-semibold">{currentPlayer.experience || "Rookie"}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Question prompt */}
          <div className="text-center mb-6 text-white">
            <p className="text-lg">Which college did this player attend?</p>
          </div>
        </div>
      )}
      
      {/* Options */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options && options.map((option, index) => {
            // Determine the state of this option
            const isSelected = selectedOption === index;
            const isCorrect = showAnswer && correctOption === index;
            const isWrong = showAnswer && isSelected && correctOption !== index;
            
            // Set the background color based on the state
            let bgColor = "bg-gray-800 hover:bg-gray-700";
            if (isCorrect) bgColor = "bg-green-600";
            else if (isWrong) bgColor = "bg-red-600";
            else if (isSelected) bgColor = "bg-indigo-600";
            
            return (
              <motion.button
                key={index}
                className={`p-4 rounded-lg text-white font-medium ${bgColor} transition-colors`}
                whileHover={{ scale: isAnswered ? 1 : 1.03 }}
                whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                onClick={() => !isAnswered && onSelect(index)}
                disabled={isAnswered}
              >
                {option.college || option.name}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard; 