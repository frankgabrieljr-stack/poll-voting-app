import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { usePoll } from '../context/PollContext';
import { useTheme } from '../context/ThemeContext';

interface SavePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const SavePollModal: React.FC<SavePollModalProps> = ({ isOpen, onClose, onSave }) => {
  const { savePoll, updatePoll, state: workspaceState } = useWorkspace();
  const { state: pollState } = usePoll();
  const { state: themeState } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const poll = pollState.currentPoll;
  if (!poll || !isOpen) return null;

  const isExistingPoll = workspaceState.savedPolls.some(p => p.id === poll.id);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your poll');
      return;
    }

    try {
      if (isExistingPoll) {
        updatePoll(poll, title.trim(), description.trim() || undefined);
        setIsUpdating(true);
      } else {
        savePoll(poll, title.trim(), description.trim() || undefined);
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      alert(error.message || 'Unable to save poll. Please try again.');
      setIsUpdating(false);
    }
  };

  const getInputClasses = () => {
    const { theme } = themeState.design;
    
    let baseClasses = 'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-base';
    
    if (theme === 'dark') {
      baseClasses += ' bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400';
    } else if (theme === 'colorful') {
      // For colorful backgrounds, use solid white background with dark text for visibility
      baseClasses += ' bg-white border-white/50 text-gray-900 placeholder-gray-500 focus:border-white focus:ring-white/50 shadow-lg';
    } else {
      // Light theme: solid white background with dark text
      baseClasses += ' bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500';
    }
    
    return baseClasses;
  };

  const getButtonClasses = () => {
    const { theme } = themeState.design;
    const primaryColor = themeState.design.primaryColor;
    
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isExistingPoll ? 'Update Poll' : 'Save Poll to Workspace'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Poll Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your poll"
              className={getInputClasses()}
              style={{ 
                borderColor: themeState.design.primaryColor,
                color: '#1a1a1a',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your poll"
              rows={3}
              className={getInputClasses()}
              style={{ 
                borderColor: themeState.design.primaryColor,
                color: '#1a1a1a',
                fontSize: '16px'
              }}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Poll Preview:</h4>
            <p className="text-sm text-gray-600 mb-2">"{poll.question}"</p>
            <p className="text-xs text-gray-500">
              {poll.choices.length} choices • {poll.choices.reduce((sum, choice) => sum + choice.votes, 0)} total votes
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className={getSecondaryButtonClasses()}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`${getButtonClasses()}`}
            style={{ backgroundColor: themeState.design.primaryColor }}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : (isExistingPoll ? 'Update Poll' : 'Save Poll')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePollModal;




