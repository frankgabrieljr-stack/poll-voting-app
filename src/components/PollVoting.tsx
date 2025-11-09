import React, { useState } from 'react';
import { usePoll } from '../context/PollContext';
import { useTheme } from '../context/ThemeContext';

const PollVoting: React.FC = () => {
  const { state, vote, setViewMode } = usePoll();
  const { state: themeState } = useTheme();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const poll = state.currentPoll;
  if (!poll) return null;

  const handleVote = async (choiceId: string) => {
    if (state.hasVoted) return;
    
    setSelectedChoice(choiceId);
    setIsVoting(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      vote(choiceId);
      setIsVoting(false);
    }, 300);
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

  const getChoiceButtonClasses = (choiceId: string) => {
    const { theme, layout } = themeState.design;
    const primaryColor = themeState.design.primaryColor;
    const isSelected = selectedChoice === choiceId;
    const hasVoted = state.hasVoted;
    
    let baseClasses = 'w-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ';
    
    // Layout-based styling
    switch (layout) {
      case 'compact':
        baseClasses += 'px-4 py-2 text-sm';
        break;
      case 'list':
        baseClasses += 'px-6 py-4 text-base';
        break;
      default: // card
        baseClasses += 'px-8 py-6 text-lg';
    }
    
    baseClasses += ' rounded-lg font-semibold ';
    
    // Theme and state-based styling
    if (hasVoted) {
      baseClasses += 'cursor-not-allowed opacity-50';
    } else if (isSelected) {
      baseClasses += 'scale-105 shadow-lg';
    }
    
    if (theme === 'dark') {
      if (isSelected) {
        baseClasses += ' bg-blue-600 text-white shadow-blue-500/50';
      } else {
        baseClasses += ' bg-gray-700 hover:bg-gray-600 text-white focus:ring-blue-400';
      }
    } else if (theme === 'colorful') {
      if (isSelected) {
        baseClasses += ' bg-white/30 text-white shadow-white/50 backdrop-blur-sm';
      } else {
        baseClasses += ' bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm focus:ring-white/50';
      }
    } else {
      // Designer theme: White/off-white cards with violet borders
      if (isSelected) {
        baseClasses += ' bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] text-white shadow-lg';
      } else {
        baseClasses += ' bg-[#fafaff] hover:bg-[#f0f0ff] text-[#1a1a2e] border-2 border-[#8f4eff]/30 hover:border-[#8f4eff] focus:ring-[#8f4eff] shadow-md';
      }
    }
    
    return baseClasses;
  };

  const getButtonStyle = (choiceId: string) => {
    const isSelected = selectedChoice === choiceId;
    const primaryColor = themeState.design.primaryColor;
    
    if (isSelected && themeState.design.theme !== 'colorful') {
      return { backgroundColor: primaryColor };
    }
    
    return {};
  };

  return (
    <div className={getThemeClasses()} style={getBackgroundStyle()}>
      {/* Overlay for text readability when background image is present */}
      {poll.design.backgroundImage && (
        <div className="absolute inset-0 bg-black/40 z-0"></div>
      )}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{poll.question}</h1>
          <p className="text-lg md:text-xl text-white font-semibold">
            {state.hasVoted ? 'Thanks for voting! View results below.' : 'Choose your answer below'}
          </p>
          {!state.hasVoted && (
            <p className="text-base md:text-lg text-white/90 mt-2">
              Total votes so far: <span className="font-bold bg-[#fafaff] text-[#1a1a2e] px-3 py-1 rounded-lg inline-block shadow-md">{poll.choices.reduce((sum, choice) => sum + choice.votes, 0)}</span>
            </p>
          )}
        </div>

        {/* Choices */}
        <div className="space-y-4 mb-8">
          {poll.choices.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => handleVote(choice.id)}
              disabled={state.hasVoted || isVoting}
              className={getChoiceButtonClasses(choice.id)}
              style={getButtonStyle(choice.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-left">{choice.text}</span>
                {state.hasVoted && (
                  <span className="text-sm opacity-75">
                    {choice.votes} vote{choice.votes !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setViewMode('landing')}
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2"
            style={{ 
              borderColor: themeState.design.primaryColor,
              color: themeState.design.primaryColor,
              backgroundColor: 'transparent'
            }}
          >
            🏠 Back to Home
          </button>
          
          {state.hasVoted && (
            <button
              onClick={() => setViewMode('results')}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                backgroundColor: themeState.design.primaryColor,
                color: 'white'
              }}
            >
              View Results
            </button>
          )}
          
          <button
            onClick={() => setViewMode('create')}
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2"
            style={{ 
              borderColor: themeState.design.primaryColor,
              color: themeState.design.primaryColor,
              backgroundColor: 'transparent'
            }}
          >
            Create New Poll
          </button>
        </div>

        {/* Loading State */}
        {isVoting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Recording your vote...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollVoting;
