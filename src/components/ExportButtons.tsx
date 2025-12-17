import React from 'react';
import { usePoll } from '../context/PollContext';
import { useTheme } from '../context/ThemeContext';
import { exportToCSV, exportToJSON, generateShareableLink } from '../utils/exportUtils';

const ExportButtons: React.FC = () => {
  const { state } = usePoll();
  const { state: themeState } = useTheme();

  const poll = state.currentPoll;
  if (!poll) return null;

  const handleCSVExport = () => {
    exportToCSV(poll);
  };

  const handleJSONExport = () => {
    exportToJSON(poll);
  };

  const handleShare = () => {
    const shareLink = generateShareableLink(poll);
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Share link copied to clipboard!');
    });
  };

  const getButtonClasses = () => {
    const { theme } = themeState.design;
    
    let baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ';
    
    if (theme === 'dark') {
      baseClasses += 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500';
    } else if (theme === 'colorful') {
      baseClasses += 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm focus:ring-white/50';
    } else {
      baseClasses += 'text-white focus:ring-blue-500';
    }
    
    return baseClasses;
  };

  const getSecondaryButtonClasses = () => {
    const { theme } = themeState.design;
    
    let baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 ';
    
    if (theme === 'dark') {
      baseClasses += 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500';
    } else if (theme === 'colorful') {
      baseClasses += 'border-white/30 text-white hover:bg-white/10 focus:ring-white/50';
    } else {
      baseClasses += 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500';
    }
    
    return baseClasses;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Export & Share</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCSVExport}
          className={`${getButtonClasses()}`}
          style={{ backgroundColor: themeState.design.primaryColor }}
        >
          📊 Export CSV
        </button>
        
        <button
          onClick={handleJSONExport}
          className={`${getButtonClasses()}`}
          style={{ backgroundColor: themeState.design.primaryColor }}
        >
          📄 Export JSON
        </button>
        
        <button
          onClick={handleShare}
          className={`${getButtonClasses()}`}
          style={{ backgroundColor: themeState.design.primaryColor }}
        >
          🔗 Copy Share Link
        </button>
      </div>
      
      <div className="text-sm opacity-75">
        <p>• CSV: Download results as spreadsheet</p>
        <p>• JSON: Download complete poll data</p>
        <p>• Share: Copy link to share with others</p>
      </div>
    </div>
  );
};

export default ExportButtons;




