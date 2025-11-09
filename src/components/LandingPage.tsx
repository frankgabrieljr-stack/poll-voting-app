import React, { useState, useEffect } from 'react';
import { usePoll } from '../context/PollContext';
import { useTheme } from '../context/ThemeContext';
import WhyChoosePollVotePro from './WhyChoosePollVotePro';

const LandingPage: React.FC = () => {
  const { setViewMode } = usePoll();
  const { state: themeState } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getThemeClasses = () => {
    const { fontStyle } = themeState.design;
    
    // Always use designer theme: Navy background with geometric patterns
    let baseClasses = 'min-h-screen transition-all duration-1000 bg-designer-pattern text-white ';
    
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

  const getButtonClasses = () => {
    // Designer theme: Violet to Teal gradient
    return 'px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] text-white hover:from-[#a366ff] hover:to-[#2ef9d8] focus:ring-[#8f4eff] shadow-lg';
  };

  const getSecondaryButtonClasses = () => {
    // Designer theme: Outlined button with white border
    return 'px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 border-2 border-white/30 text-white hover:bg-white/10 focus:ring-white/50 backdrop-blur-sm';
  };

  return (
    <div className={getThemeClasses()}>
      {/* Animated Background Elements - Designer Theme Accents */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#18e6c1]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8f4eff]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff6363]/8 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-[#18e6c1]/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-[#8f4eff]/5 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>

      <div className="relative z-10">
        {/* Header removed - using shared Navigation component from App.tsx */}
        
        {/* Hero Section */}
        <main className="container mx-auto px-6 pt-8 pb-16">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="text-title-pop inline-block">
                Create
              </span>
              <br />
              <span className="text-title-pop inline-block">
                Amazing Polls
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-description mb-12 max-w-3xl mx-auto leading-relaxed text-bg-pop rounded-2xl p-6">
              Design beautiful, interactive polls with professional templates, 
              real-time analytics, and seamless collaboration tools.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => setViewMode('create')}
                className={getButtonClasses()}
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                🚀 Start Creating
              </button>
              <button
                onClick={() => setViewMode('workspace')}
                className={getSecondaryButtonClasses()}
              >
                📊 View Workspace
              </button>
            </div>

            {/* Feature Showcase */}
            <WhyChoosePollVotePro />

            {/* Stats Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-[#fafaff] backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#8f4eff]/10">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#18e6c1] to-[#8f4eff] bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-[#1a1a2e] font-semibold">Polls Created</div>
              </div>
              <div className="text-center bg-[#fafaff] backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#8f4eff]/10">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#8f4eff] to-[#ff6363] bg-clip-text text-transparent mb-2">
                  50K+
                </div>
                <div className="text-[#1a1a2e] font-semibold">Votes Cast</div>
              </div>
              <div className="text-center bg-[#fafaff] backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#8f4eff]/10">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#ff6363] to-[#18e6c1] bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-[#1a1a2e] font-semibold">Uptime</div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-bounce delay-100"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-bounce delay-300"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400/20 rounded-full blur-xl animate-bounce delay-500"></div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 text-center">
          <div className="bg-[#fafaff] backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#8f4eff]/10">
            <p className="font-semibold text-[#1a1a2e]">Built with ❤️ for modern teams and creators</p>
            <p className="text-sm mt-2 text-[#4a4a6a]">© 2025 PollVote Pro. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
