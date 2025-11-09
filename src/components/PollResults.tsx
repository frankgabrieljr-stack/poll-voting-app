import React, { useState, useEffect } from 'react';
import { usePoll } from '../context/PollContext';
import { useTheme } from '../context/ThemeContext';
import { generatePollResults } from '../utils/exportUtils';

const PollResults: React.FC = () => {
  const { state, setViewMode, resetPoll, resetVotingState } = usePoll();
  const { state: themeState } = useTheme();
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3);

  const poll = state.currentPoll;
  if (!poll) return null;

  const results = generatePollResults(poll);
  const maxVotes = Math.max(...poll.choices.map(choice => choice.votes));
  const totalVotes = poll.choices.reduce((sum, choice) => sum + choice.votes, 0);

  const handleVoteAgain = () => {
    resetVotingState();
    setShowSuccessMessage(true);
    setAutoAdvanceEnabled(false);
    setTimeRemaining(3);
  };

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

  const getResultCardClasses = () => {
    // Designer theme: White/off-white cards
    return 'p-6 rounded-xl transition-all duration-300 hover:scale-105 bg-[#fafaff] border border-[#8f4eff]/10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]';
  };

  const getProgressBarClasses = () => {
    // Designer theme: Light background for progress bar
    return 'h-4 rounded-full transition-all duration-500 bg-[#8f4eff]/10';
  };

  const getProgressFillClasses = () => {
    // Designer theme: Gradient fill
    return 'h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#8f4eff] to-[#18e6c1]';
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

        {/* Results */}
        <div className="space-y-4 mb-8">
          {poll.choices.map((choice, index) => {
            const result = results.results.find(r => r.choice === choice.text);
            const percentage = result?.percentage || 0;
            const votes = choice.votes;
            
            return (
              <div key={choice.id} className={getResultCardClasses()}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-[#1a1a2e]">{choice.text}</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#1a1a2e]">{votes}</span>
                    <span className="text-sm text-[#4a4a6a] ml-1">votes</span>
                    <div className="text-lg font-semibold text-[#1a1a2e]">{percentage}%</div>
                  </div>
                </div>
                
                <div className={getProgressBarClasses()}>
                  <div
                    className={getProgressFillClasses()}
                    style={{
                      width: `${percentage}%`,
                      transition: 'width 1s ease-in-out'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-center text-white">Visual Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {poll.choices.map((choice, index) => {
              const result = results.results.find(r => r.choice === choice.text);
              const percentage = result?.percentage || 0;
              
              return (
                <div key={choice.id} className="text-center bg-[#fafaff] rounded-xl p-4 border border-[#8f4eff]/10 shadow-md">
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] shadow-lg"
                  >
                    {percentage}%
                  </div>
                  <p className="text-sm font-medium text-[#1a1a2e]">{choice.text}</p>
                  <p className="text-xs text-[#4a4a6a]">{choice.votes} votes</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto-Advance Toggle */}
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
      </div>
    </div>
  );
};

export default PollResults;
