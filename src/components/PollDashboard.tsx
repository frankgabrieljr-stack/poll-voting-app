import React, { useState, useMemo } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { usePoll } from '../context/PollContext';
import { useTheme } from '../context/ThemeContext';
import { useWorkspaceManager } from '../context/WorkspaceManagerContext';
import { SavedPoll } from '../types/poll.types';
import CreateWorkspaceModal from './CreateWorkspaceModal';

type SortOption = 'recent' | 'votes' | 'alphabetical';

const PollDashboard: React.FC = () => {
  const { state: workspaceState, deletePoll, loadPolls } = useWorkspace();
  const { createPoll, setViewMode } = usePoll();
  const { state: themeState } = useTheme();
  const { state: workspaceManagerState, setCurrentWorkspace } = useWorkspaceManager();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Filter and sort polls
  const filteredAndSortedPolls = useMemo(() => {
    let polls = [...workspaceState.savedPolls];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      polls = polls.filter(poll =>
        poll.question.toLowerCase().includes(searchLower) ||
        poll.title?.toLowerCase().includes(searchLower) ||
        poll.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort polls
    switch (sortBy) {
      case 'votes':
        polls.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));
        break;
      case 'alphabetical':
        polls.sort((a, b) => a.question.localeCompare(b.question));
        break;
      case 'recent':
      default:
        polls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return polls;
  }, [workspaceState.savedPolls, searchTerm, sortBy]);

  const getThemeClasses = () => {
    const { fontStyle } = themeState.design;
    
    // Always use designer theme: Navy background with geometric patterns
    let baseClasses = 'min-h-screen transition-all duration-300 bg-designer-pattern text-white ';
    
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

  const getCardClasses = () => {
    // Designer theme: White/off-white cards with shadows
    return 'p-6 rounded-xl transition-all duration-300 hover:scale-105 bg-[#fafaff] border border-[#16a34a]/10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]';
  };

  const handleLoadPoll = (savedPoll: SavedPoll) => {
    // Convert SavedPoll back to Poll format with full data
    const poll = {
      id: savedPoll.id,
      question: savedPoll.question,
      choices: savedPoll.choices || [], // Use stored choices with votes
      createdAt: new Date(savedPoll.createdAt),
      design: {
        ...savedPoll.design,
        backgroundImage: savedPoll.backgroundImage, // Include background image
      },
    };
    
    createPoll(poll);
    setViewMode('vote');
  };

  const handleViewResults = (savedPoll: SavedPoll) => {
    const poll = {
      id: savedPoll.id,
      question: savedPoll.question,
      choices: savedPoll.choices || [],
      createdAt: new Date(savedPoll.createdAt),
      design: {
        ...savedPoll.design,
        backgroundImage: savedPoll.backgroundImage,
      },
    };
    
    createPoll(poll);
    setViewMode('results');
  };

  const handleSharePoll = async (pollId: string) => {
    const shareUrl = `${window.location.origin}/poll/${pollId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Poll link copied to clipboard! Share this link with others to let them vote.');
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Poll link copied to clipboard! Share this link with others to let them vote.');
    }
  };

  const handleShareHostPoll = async (pollId: string) => {
    const hostUrl = `${window.location.origin}/poll/${pollId}/host`;
    try {
      await navigator.clipboard.writeText(hostUrl);
      alert('Host dashboard link copied! This owner-only link opens live results.');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = hostUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Host dashboard link copied! This owner-only link opens live results.');
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    try {
      await deletePoll(pollId);
      setShowDeleteConfirm(null);
    } catch (error: any) {
      alert(error.message || 'Unable to delete poll. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={getThemeClasses()}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">My Polls</h1>
          <p className="text-lg md:text-xl text-white font-semibold">
            You have {workspaceState.savedPolls.length} saved poll{workspaceState.savedPolls.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('create')}
            className="px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 text-white shadow-xl bg-gradient-to-r from-[#16a34a] to-[#34d399] hover:from-[#22c55e] hover:to-[#6ee7b7]"
            title="Make a new poll"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>➕</span>
              <span>Create New Poll</span>
            </span>
          </button>
          
          <button
            onClick={() => setShowCreateWorkspace(true)}
            className="px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 bg-[#fafaff] border border-[#16a34a]/20 text-[#1a1a2e] shadow-lg"
            title="Create a new workspace"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>📁</span>
              <span>New Workspace</span>
            </span>
          </button>
          
          <button
            onClick={loadPolls}
            className="px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 bg-[#fafaff] border border-[#16a34a]/20 text-[#1a1a2e] shadow-lg"
            title="Reload your polls list"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🔄</span>
              <span>Refresh</span>
            </span>
          </button>
        </div>

        {/* Workspace Selector */}
        {workspaceManagerState.workspaces.length > 1 && (
          <div className="mb-6 bg-[#fafaff] rounded-xl p-4 shadow-lg border border-[#16a34a]/10">
            <label className="block text-sm font-bold text-[#1a1a2e] mb-2">Current Workspace:</label>
            <select
              value={workspaceManagerState.currentWorkspaceId || ''}
              onChange={(e) => setCurrentWorkspace(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-[#16a34a]/20 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] text-[#1a1a2e] font-semibold bg-[#fafaff]"
            >
              {workspaceManagerState.workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.icon} {workspace.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Shared Polls Section */}
        {workspaceState.sharedPolls.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Shared with Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {workspaceState.sharedPolls.map((poll) => (
                <div key={poll.id} className={getCardClasses()}>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 text-[#1a1a2e] line-clamp-2">
                      {poll.title || 'Untitled Poll'}
                    </h3>
                    <p className="text-base font-semibold mb-3 text-[#1a1a2e] line-clamp-2">
                      "{poll.question}"
                    </p>
                  </div>
                  
                  <div className="mb-4 text-sm text-[#4a4a6a] space-y-1">
                    <p className="font-medium">📊 Votes: {poll.totalVotes || 0}</p>
                    <p className="font-medium">🎯 Choices: {poll.choices?.length || 0}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleLoadPoll(poll)}
                      className="px-4 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 text-white shadow-lg text-sm bg-gradient-to-r from-[#16a34a] to-[#34d399] hover:from-[#22c55e] hover:to-[#6ee7b7]"
                      title="Open this poll to vote"
                    >
                      🚀 Open Poll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Sort Controls */}
        {workspaceState.savedPolls.length > 0 && (
          <div className="mb-6 bg-[#fafaff] rounded-xl p-4 shadow-lg border border-[#16a34a]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-bold text-[#1a1a2e] mb-2">Search polls:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search by question..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#16a34a]/20 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] text-[#1a1a2e] bg-[#fafaff]"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-bold text-[#1a1a2e] mb-2">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#16a34a]/20 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] text-[#1a1a2e] font-semibold bg-[#fafaff]"
                >
                  <option value="recent">Most Recent</option>
                  <option value="votes">Most Votes</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Polls Grid */}
        {workspaceState.isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-white font-semibold">Loading polls...</p>
          </div>
        ) : filteredAndSortedPolls.length === 0 ? (
          <div className="text-center py-16 bg-[#fafaff] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] border border-[#16a34a]/10 max-w-2xl mx-auto">
            <div className="text-7xl mb-6">📊</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
              {searchTerm ? 'No polls found!' : 'No polls yet!'}
            </h3>
            <p className="text-xl md:text-2xl text-[#4a4a6a] mb-8 font-semibold">
              {searchTerm 
                ? 'Try a different search term' 
                : "Click 'Create New Poll' to get started!"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setViewMode('create')}
                className="px-8 py-4 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 text-white shadow-xl bg-gradient-to-r from-[#16a34a] to-[#34d399] hover:from-[#22c55e] hover:to-[#6ee7b7]"
                title="Create your first poll"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>➕</span>
                  <span>Create New Poll</span>
                </span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPolls.map((poll) => (
              <div key={poll.id} className={getCardClasses()}>
                {/* Background Image Thumbnail */}
                {poll.backgroundImage && (
                  <div className="mb-4 rounded-lg overflow-hidden h-32 relative">
                    <img
                      src={poll.backgroundImage}
                      alt="Poll background"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2 text-[#1a1a2e] line-clamp-2">
                    {poll.title || 'Untitled Poll'}
                  </h3>
                  {poll.description && (
                    <p className="text-sm text-[#4a4a6a] mb-2 line-clamp-2">{poll.description}</p>
                  )}
                  <p className="text-base font-semibold mb-3 text-[#1a1a2e] line-clamp-2">
                    "{poll.question}"
                  </p>
                </div>
                
                <div className="mb-4 text-sm text-[#4a4a6a] space-y-1">
                  <p className="font-medium">📅 Made: {formatDate(poll.createdAt)}</p>
                  <p className="font-medium">📊 Votes: {poll.totalVotes || 0}</p>
                  <p className="font-medium">🎯 Choices: {poll.choices?.length || 0}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleLoadPoll(poll)}
                    className="px-4 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 text-white shadow-lg text-sm bg-gradient-to-r from-[#16a34a] to-[#34d399] hover:from-[#22c55e] hover:to-[#6ee7b7]"
                    title="Open this poll to vote"
                  >
                    🚀 Open Poll
                  </button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleViewResults(poll)}
                      className="px-3 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 bg-gradient-to-r from-[#16a34a] to-[#34d399] hover:from-[#22c55e] hover:to-[#6ee7b7] text-white text-xs shadow-lg"
                      title="View poll results"
                    >
                      📊 Results
                    </button>
                    
                    <button
                      onClick={() => handleSharePoll(poll.id)}
                      className="px-3 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 bg-gradient-to-r from-[#34d399] to-[#6ee7b7] hover:from-[#6ee7b7] hover:to-[#a7f3d0] text-white text-xs shadow-lg"
                      title="Share this poll"
                    >
                      🔗 Share
                    </button>

                    <button
                      onClick={() => handleShareHostPoll(poll.id)}
                      className="px-3 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 bg-gradient-to-r from-[#15803d] to-[#34d399] hover:from-[#16a34a] hover:to-[#6ee7b7] text-white text-xs shadow-lg"
                      title="Copy host dashboard link"
                    >
                      🎛️ Host
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(poll.id)}
                    className="px-4 py-2 bg-gradient-to-r from-[#ff6363] to-[#ff8a8a] hover:from-[#ff7575] hover:to-[#ff9999] text-white rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
                    title="Delete this poll forever"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#fafaff] rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-[#ff6363]/20">
              <h3 className="text-2xl font-bold mb-4 text-[#1a1a2e]">Delete This Poll?</h3>
              <p className="text-lg text-[#4a4a6a] mb-6 font-semibold">
                Are you sure? This will delete the poll forever. You can't undo this!
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-3 border-2 border-[#16a34a]/30 rounded-lg hover:bg-[#eefcf4] font-bold text-[#1a1a2e] transition-all duration-200 bg-[#fafaff] shadow-md"
                  title="Keep this poll"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePoll(showDeleteConfirm)}
                  className="px-6 py-3 bg-gradient-to-r from-[#ff6363] to-[#ff8a8a] hover:from-[#ff7575] hover:to-[#ff9999] text-white rounded-lg font-bold transition-all duration-200 shadow-lg"
                  title="Yes, delete it"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Workspace Modal */}
        <CreateWorkspaceModal
          isOpen={showCreateWorkspace}
          onClose={() => setShowCreateWorkspace(false)}
        />
      </div>
    </div>
  );
};

export default PollDashboard;
