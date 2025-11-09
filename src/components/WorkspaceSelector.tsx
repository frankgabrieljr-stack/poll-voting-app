import React, { useState } from 'react';
import { useWorkspaceManager } from '../context/WorkspaceManagerContext';
import { useTheme } from '../context/ThemeContext';

const WorkspaceSelector: React.FC = () => {
  const { state, createWorkspace, setCurrentWorkspace, getCurrentWorkspace } = useWorkspaceManager();
  const { state: themeState } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [newWorkspaceColor, setNewWorkspaceColor] = useState('#3b82f6');
  const [newWorkspaceIcon, setNewWorkspaceIcon] = useState('📊');

  const currentWorkspace = getCurrentWorkspace();

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      createWorkspace(
        newWorkspaceName.trim(),
        newWorkspaceDescription.trim() || undefined,
        newWorkspaceColor,
        newWorkspaceIcon
      );
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      setNewWorkspaceColor('#3b82f6');
      setNewWorkspaceIcon('📊');
      setShowCreateModal(false);
    }
  };

  const getThemeClasses = () => {
    const { theme, fontStyle } = themeState.design;
    
    let baseClasses = 'p-4 rounded-lg transition-all duration-300 ';
    
    // Theme-based background
    switch (theme) {
      case 'dark':
        baseClasses += 'bg-gray-800 border border-gray-700';
        break;
      case 'colorful':
        baseClasses += 'bg-white/20 backdrop-blur-sm border border-white/30';
        break;
      default:
        baseClasses += 'bg-white border border-gray-200 shadow-lg';
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

  const getButtonClasses = () => {
    const { theme } = themeState.design;
    const primaryColor = themeState.design.primaryColor;
    
    let baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ';
    
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
    
    let baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 ';
    
    if (theme === 'dark') {
      baseClasses += 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500';
    } else if (theme === 'colorful') {
      baseClasses += 'border-white/30 text-white hover:bg-white/10 focus:ring-white/50';
    } else {
      baseClasses += 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500';
    }
    
    return baseClasses;
  };

  const getInputClasses = () => {
    const { theme } = themeState.design;
    
    let baseClasses = 'w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-base';
    
    if (theme === 'dark') {
      baseClasses += ' bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400';
    } else if (theme === 'colorful') {
      // For colorful backgrounds, use solid white background with dark text for visibility
      baseClasses += ' bg-white border-white/50 text-gray-900 placeholder-gray-500 focus:border-white focus:ring-white/50 shadow-lg';
    } else {
      // Light theme: solid white background with dark text
      baseClasses += ' bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500';
    }
    
    return baseClasses;
  };

  const workspaceIcons = ['📊', '💼', '🎨', '🚀', '💡', '🌟', '🎯', '📈', '🔬', '🎪'];

  return (
    <div className={getThemeClasses()}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Workspaces</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`${getButtonClasses()}`}
          style={{ backgroundColor: themeState.design.primaryColor }}
        >
          ➕ New Workspace
        </button>
      </div>

      {/* Current Workspace */}
      {currentWorkspace && (
        <div className="mb-4 p-3 rounded-lg border-2 border-blue-500 bg-blue-50">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentWorkspace.icon}</span>
            <div>
              <h4 className="font-semibold">{currentWorkspace.name}</h4>
              {currentWorkspace.description && (
                <p className="text-sm text-gray-600">{currentWorkspace.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {currentWorkspace.pollCount} polls • Created {new Date(currentWorkspace.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Workspace List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {state.workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              currentWorkspace?.id === workspace.id
                ? 'bg-blue-100 border-2 border-blue-300'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => setCurrentWorkspace(workspace.id)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{workspace.icon}</span>
              <div className="flex-1">
                <h5 className="font-semibold">{workspace.name}</h5>
                {workspace.description && (
                  <p className="text-sm text-gray-600">{workspace.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  {workspace.pollCount} polls
                </p>
              </div>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: workspace.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Create New Workspace</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Workspace Name *</label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="Enter workspace name"
                  className={getInputClasses()}
                  style={{ 
                    color: '#1a1a1a',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={newWorkspaceDescription}
                  onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                  placeholder="Enter workspace description"
                  rows={3}
                  className={getInputClasses()}
                  style={{ 
                    color: '#1a1a1a',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={newWorkspaceColor}
                    onChange={(e) => setNewWorkspaceColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newWorkspaceColor}
                    onChange={(e) => setNewWorkspaceColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {workspaceIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewWorkspaceIcon(icon)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                        newWorkspaceIcon === icon
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className={getSecondaryButtonClasses()}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkspace}
                className={`${getButtonClasses()}`}
                style={{ backgroundColor: themeState.design.primaryColor }}
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;




