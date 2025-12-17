import React, { useState, useEffect } from 'react';
import { usePoll } from '../context/PollContext';
import { generatePollResults } from '../utils/exportUtils';

interface PollResultsProps {
  isSharedView?: boolean;
}

const PollResults: React.FC<PollResultsProps> = ({ isSharedView = false }) => {
  const { state, setViewMode, resetPoll, resetVotingState } = usePoll();
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3);

  const poll = state.currentPoll;
  if (!poll) return null;

  const results = generatePollResults(poll);
  const totalVotes = poll.choices.reduce((sum, choice) => sum + choice.votes, 0);

  // Data for single pie chart + grid
  const chartColors = ['#8f4eff', '#18e6c1', '#f97316', '#ec4899', '#3b82f6', '#10b981', '#facc15', '#6366f1'];
  const chartData = poll.choices.map((choice, index) => {
    const result = results.results.find(r => r.choice === choice.text);
    const percentage = result?.percentage || 0;
    return {
      id: choice.id,
      label: choice.text,
      votes: choice.votes,
      percentage,
      color: chartColors[index % chartColors.length],
    };
  });

  // Sort by most votes to least for a cascading view
  const sortedChartData = [...chartData].sort((a, b) => b.votes - a.votes);

  let cumulativePercent = 0;
  const pieSlices =
    totalVotes > 0
      ? sortedChartData.map((item) => {
          const slice = (
            <circle
              key={item.id}
              r="15.9155"
              cx="50%"
              cy="50%"
              fill="transparent"
              stroke={item.color}
              strokeWidth="7"
              strokeDasharray={`${item.percentage} ${100 - item.percentage}`}
              strokeDashoffset={25 - cumulativePercent}
            />
          );
          cumulativePercent += item.percentage;
          return slice;
        })
      : [];

  const handleVoteAgain = () => {
    resetVotingState();
    setShowSuccessMessage(true);
    setTimeRemaining(3);
  };

  // Persist auto-advance preference per poll so it stays active once enabled
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`poll-auto-advance-${poll.id}`);
      if (stored === 'true') {
        setAutoAdvanceEnabled(true);
      }
    } catch (error) {
      console.error('Failed to read auto-advance preference from storage:', error);
    }
    // Only run when the poll changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll.id]);

  useEffect(() => {
    try {
      localStorage.setItem(`poll-auto-advance-${poll.id}`, autoAdvanceEnabled ? 'true' : 'false');
    } catch (error) {
      console.error('Failed to save auto-advance preference to storage:', error);
    }
  }, [poll.id, autoAdvanceEnabled]);

  // Auto-advance timer effect
  useEffect(() => {
    if (autoAdvanceEnabled && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoAdvanceEnabled && timeRemaining === 0) {
      handleVoteAgain();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvanceEnabled, timeRemaining]);

  // Hide success message after 2 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const toggleAutoAdvance = () => {
    setAutoAdvanceEnabled(!autoAdvanceEnabled);
    if (!autoAdvanceEnabled) {
      setTimeRemaining(3);
    }
  };

  const getThemeClasses = () => {
    const { fontStyle, backgroundImage } = poll.design;
    
    let baseClasses = 'min-h-screen transition-all duration-300 relative ';
    
    // Apply background image if available, otherwise use designer theme
    if (backgroundImage) {
      baseClasses += 'text-white';
      // Background image will be applied via inline style
    } else {
      // Designer theme: Navy background with geometric patterns
      baseClasses += 'bg-designer-pattern text-white';
    }
    
    // Font style
    switch (fontStyle) {
      case 'serif':
        baseClasses += ' font-serif';
        break;
      case 'mono':
        baseClasses += ' font-mono';
        break;
      default:
        baseClasses += ' font-sans';
    }
    
    return baseClasses;
  };

  const getBackgroundStyle = () => {
    const { backgroundImage } = poll.design;
    if (backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return {};
  };

  const getButtonClasses = () => {
    // Designer theme: Gradient buttons
    return 'px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] text-white hover:from-[#a366ff] hover:to-[#2ef9d8] focus:ring-[#8f4eff] shadow-lg';
  };

  return (
    <div className={getThemeClasses()} style={getBackgroundStyle()}>
      {/* Overlay for text readability when background image is present */}
      {poll.design.backgroundImage && (
        <div className="absolute inset-0 bg-black/40 z-0"></div>
      )}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 text-center animate-bounce-in">
            <div className="inline-block bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl text-2xl font-bold">
              ✅ Your vote has been recorded!
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Poll Results</h1>
          <h2 className="text-2xl md:text-3xl mb-2 text-white">{poll.question}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <p className="text-lg md:text-xl text-white font-semibold">
              Total votes: <span className="font-bold bg-[#fafaff] text-[#1a1a2e] px-3 py-1 rounded-lg inline-block shadow-md">{totalVotes}</span>
            </p>
            {autoAdvanceEnabled && (
              <p className="text-lg md:text-xl text-white font-semibold">
                Auto-advancing in: <span className="font-bold bg-[#fafaff] text-[#1a1a2e] px-3 py-1 rounded-lg inline-block shadow-md">{timeRemaining}s</span>
              </p>
            )}
          </div>
        </div>

        {/* Vote Again Button - Prominent and Tablet-Friendly */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={handleVoteAgain}
            className="px-12 py-6 text-3xl md:text-4xl font-bold rounded-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-4 shadow-2xl transform hover:shadow-3xl bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] hover:from-[#a366ff] hover:to-[#2ef9d8] text-white"
            style={{ 
              minHeight: '80px',
              minWidth: '300px'
            }}
          >
            🗳️ Vote Again
          </button>
        </div>

        {/* Results - single pie chart + grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-center text-white">Visual Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Pie Chart */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle
                    r="15.9155"
                    cx="18"
                    cy="18"
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth="7"
                  />
                  {pieSlices}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm text-white/80">Total Votes</span>
                  <span className="text-2xl font-bold text-white">{totalVotes}</span>
                </div>
              </div>
            </div>

            {/* Grid of counts & percentages */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm bg-[#fafaff] rounded-xl shadow-md overflow-hidden">
                <thead className="bg-[#f3f4ff]">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-[#1a1a2e]">Choice</th>
                    <th className="px-4 py-3 font-semibold text-[#1a1a2e] text-right">Votes</th>
                    <th className="px-4 py-3 font-semibold text-[#1a1a2e] text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedChartData.map((item) => (
                    <tr key={item.id} className="border-t border-[#e5e7eb]">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[#1a1a2e] font-medium">{item.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right text-[#1a1a2e] font-semibold">
                        {item.votes}
                      </td>
                      <td className="px-4 py-2 text-right text-[#4a4a6a]">
                        {item.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  {chartData.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-center text-[#4a4a6a]"
                      >
                        No choices available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Auto-Advance Toggle (available in both owner and shared views) */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={toggleAutoAdvance}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 ${
              autoAdvanceEnabled 
                ? 'bg-gradient-to-r from-[#18e6c1] to-[#2ef9d8] text-white border-[#18e6c1] shadow-lg' 
                : 'bg-[#fafaff] text-[#8f4eff] border-[#8f4eff] shadow-md'
            }`}
          >
            {autoAdvanceEnabled ? '⏸️ Pause Auto-Advance' : '▶️ Enable Auto-Advance (3s)'}
          </button>
        </div>

        {/* Action Buttons */}
        {!isSharedView && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setViewMode('landing')}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-[#8f4eff] text-[#8f4eff] bg-[#fafaff] hover:bg-[#f0f0ff] shadow-md"
            >
              🏠 Back to Home
            </button>
            
            <button
              onClick={() => setViewMode('create')}
              className={getButtonClasses()}
            >
              Create New Poll
            </button>
            
            <button
              onClick={resetPoll}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-[#ff6363] text-[#ff6363] bg-[#fafaff] hover:bg-[#fff0f0] shadow-md"
            >
              Reset Poll
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollResults;
