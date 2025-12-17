import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePoll } from '../context/PollContext';
import { useTheme } from '../context/ThemeContext';
import ExportButtons from './ExportButtons';
import { generateShareableLink } from '../utils/exportUtils';

interface NavigationProps {
  onSaveClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSaveClick }) => {
  const { currentUser, userData, logout } = useAuth();
  const { state, setViewMode } = usePoll();
  const { state: themeState } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Memoize viewMode to prevent unnecessary re-renders
  const viewMode = useMemo(() => state.viewMode, [state.viewMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      // Use a small timeout to ensure the click event is registered
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Memoize header classes to prevent recalculation on every render
  const headerClasses = useMemo(() => {
    const { theme } = themeState.design;
    
    // Always ensure Navigation is on top with high z-index and relative positioning
    // New Designer Theme: Navy background with violet accent border
    let baseClasses = 'w-full py-4 px-6 border-b transition-all duration-300 relative z-50 ';
    
    if (theme === 'dark') {
      baseClasses += 'bg-gray-800 border-gray-700';
    } else if (theme === 'colorful') {
      baseClasses += 'bg-white/20 backdrop-blur-sm border-white/30';
    } else {
      // New designer theme: Navy with violet accent
      baseClasses += 'bg-[#22243a] border-[#8f4eff]/30 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]';
    }
    
    return baseClasses;
  }, [themeState.design.theme]);

  // Memoize button classes to prevent recalculation on every render
  const buttonClasses = useMemo(() => {
    const { theme } = themeState.design;
    
    // Ensure buttons are always clickable with pointer-events and cursor
    // New Designer Theme: Gradient buttons with teal/violet/coral accents
    let baseClasses = 'px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer pointer-events-auto shadow-md ';
    
    if (theme === 'dark') {
      baseClasses += 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500';
    } else if (theme === 'colorful') {
      baseClasses += 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm focus:ring-white/50';
    } else {
      // New designer theme: Gradient buttons with accent colors
      baseClasses += 'bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] hover:from-[#a366ff] hover:to-[#2ef9d8] text-white focus:ring-[#8f4eff] shadow-lg';
    }
    
    return baseClasses;
  }, [themeState.design.theme]);

  // Memoize logout handler to prevent recreation on every render
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setViewMode('login');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout, setViewMode]);

  // Memoize page title to prevent recalculation
  const pageTitle = useMemo(() => {
    switch (viewMode) {
      case 'landing':
        return 'Welcome';
      case 'create':
        return 'Create Poll';
      case 'vote':
        return 'Vote';
      case 'results':
        return 'Results';
      case 'workspace':
        return 'My Polls';
      case 'settings':
        return 'Account Settings';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return '';
    }
  }, [viewMode]);
  
  // Memoize navigation handlers to prevent recreation
  const handleNavigate = useCallback((mode: string) => {
    setViewMode(mode as any);
    setShowUserMenu(false);
  }, [setViewMode]);
  
  const handleToggleMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  const handleShareCurrentPoll = useCallback(() => {
    if (!state.currentPoll) return;

    const link = generateShareableLink(state.currentPoll);

    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert('Share link copied to clipboard!');
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Share link copied to clipboard!');
      });
  }, [state.currentPoll]);

  // Memoize user display name
  const userDisplayName = useMemo(() => {
    return currentUser?.displayName || userData?.displayName || currentUser?.email || '';
  }, [currentUser?.displayName, userData?.displayName, currentUser?.email]);
  
  // Memoize whether to show navigation buttons
  const showNavButtons = useMemo(() => {
    return viewMode !== 'login' && viewMode !== 'register';
  }, [viewMode]);
  
  // Memoize whether to show sign in/up buttons
  const showSignInButtons = useMemo(() => {
    return !currentUser && viewMode === 'landing';
  }, [currentUser, viewMode]);

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#18e6c1] to-[#8f4eff] bg-clip-text text-transparent">
            Poll App
          </h1>
          {pageTitle && (
            <span className="text-sm text-white/80 font-semibold">
              {pageTitle}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* User Profile Dropdown - Always visible when logged in */}
          {currentUser && (
            <>
              <div className="relative user-menu-container">
                <button
                  onClick={handleToggleMenu}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8f4eff]/20 to-[#18e6c1]/20 backdrop-blur-sm hover:from-[#8f4eff]/30 hover:to-[#18e6c1]/30 border border-[#8f4eff]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#8f4eff] cursor-pointer pointer-events-auto shadow-md"
                  type="button"
                >
                  <span className="text-white font-semibold">
                    {userDisplayName}
                  </span>
                  {userData?.role === 'admin' && (
                    <span className="px-2 py-1 bg-gradient-to-r from-[#ff6363] to-[#ff8a8a] text-white text-xs font-bold rounded-lg shadow-sm">
                      ADMIN
                    </span>
                  )}
                  <span className="text-white">▼</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#fafaff] rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] z-[100] border border-[#8f4eff]/20 overflow-hidden">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-[#8f4eff]/10 bg-gradient-to-r from-[#8f4eff]/5 to-[#18e6c1]/5">
                        <p className="text-sm font-semibold text-[#1a1a2e]">
                          {userDisplayName}
                        </p>
                        <p className="text-xs text-[#4a4a6a] truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleNavigate('workspace')}
                        className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-[#8f4eff]/10 hover:to-[#18e6c1]/10 text-[#1a1a2e] transition-colors flex items-center space-x-2 rounded-lg mx-2 my-1"
                        type="button"
                      >
                        <span>📊</span>
                        <span>My Polls</span>
                      </button>
                      
                      <button
                        onClick={() => handleNavigate('settings')}
                        className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-[#8f4eff]/10 hover:to-[#18e6c1]/10 text-[#1a1a2e] transition-colors flex items-center space-x-2 rounded-lg mx-2 my-1"
                        type="button"
                      >
                        <span>⚙️</span>
                        <span>Account Settings</span>
                      </button>
                      
                      {userData?.role === 'admin' && (
                        <button
                          onClick={() => handleNavigate('admin')}
                          className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-[#8f4eff]/10 hover:to-[#18e6c1]/10 text-[#1a1a2e] transition-colors flex items-center space-x-2 rounded-lg mx-2 my-1"
                          type="button"
                        >
                          <span>👑</span>
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Always-visible Log Out button so users can sign out even if the menu has issues */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-[#ff6363] to-[#ff8a8a] text-white shadow-md"
                type="button"
                title="Log out of your account"
              >
                🚪 Log Out
              </button>
            </>
          )}

          {/* Navigation Buttons - Show on all pages except login/register */}
          {showNavButtons && (
            <>
              <button
                onClick={() => setViewMode('landing')}
                className={buttonClasses}
                title="Go back to the home page"
                type="button"
              >
                🏠 Home
              </button>
              
              {/* Create Poll and My Polls - Always visible when logged in, including on landing page */}
              {currentUser && (
                <>
                  <button
                    onClick={() => setViewMode('create')}
                    className={buttonClasses}
                    title="Create a new poll"
                    type="button"
                  >
                    ➕ Create Poll
                  </button>
                  
                  <button
                    onClick={() => setViewMode('workspace')}
                    className={buttonClasses}
                    title="View all your saved polls"
                    type="button"
                  >
                    📊 My Polls
                  </button>
                </>
              )}

              {/* Results page specific buttons */}
              {state.currentPoll && viewMode === 'results' && onSaveClick && (
                <>
                  <button
                    onClick={onSaveClick}
                    className={buttonClasses}
                    title="Save this poll to your collection"
                    type="button"
                  >
                    💾 Save
                  </button>

                  {/* Simple, mobile-friendly share button */}
                  <button
                    onClick={handleShareCurrentPoll}
                    className={buttonClasses}
                    title="Copy a shareable link to this poll"
                    type="button"
                  >
                    🔗 Share Poll
                  </button>

                  {/* Full Export & Share panel on larger screens */}
                  <div className="hidden lg:block">
                    <ExportButtons />
                  </div>
                </>
              )}
            </>
          )}

          {/* Sign In / Sign Up - Only on landing page when not logged in */}
          {showSignInButtons && (
            <>
              <button
                onClick={() => setViewMode('login')}
                className={buttonClasses}
                type="button"
              >
                Sign In
              </button>
              <button
                onClick={() => setViewMode('register')}
                className={buttonClasses}
                type="button"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// Memoize Navigation component to prevent unnecessary re-renders
export default React.memo(Navigation);

