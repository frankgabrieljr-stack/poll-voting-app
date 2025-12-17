import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PollProvider } from './context/PollContext';
import { ThemeProvider } from './context/ThemeContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { WorkspaceManagerProvider } from './context/WorkspaceManagerContext';
import { useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import PollCreator from './components/PollCreator';
import PollVoting from './components/PollVoting';
import PollResults from './components/PollResults';
import PollDashboard from './components/PollDashboard';
import SavePollModal from './components/SavePollModal';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import EmailVerificationBanner from './components/EmailVerificationBanner';
import Navigation from './components/Navigation';
import SharedPollView from './components/SharedPollView';
import { usePoll } from './context/PollContext';
import { useTheme } from './context/ThemeContext';

// Memoize page components to prevent unnecessary re-renders
const MemoizedLandingPage = React.memo(LandingPage);
const MemoizedLogin = React.memo(Login);
const MemoizedRegister = React.memo(Register);
const MemoizedPollVoting = React.memo(PollVoting);
const MemoizedPollResults = React.memo(PollResults);

const AppContent: React.FC = () => {
  const { state, setViewMode } = usePoll();
  const { state: themeState } = useTheme();
  const { currentUser, loading: authLoading } = useAuth();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sharedPollId, setSharedPollId] = useState<string | null>(null);

  // Check for poll ID in URL (for sharing)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pollParam = urlParams.get('poll');
    const pathPollId = window.location.pathname.split('/poll/')[1];
    
    if (pollParam) {
      setSharedPollId(pollParam);
      setViewMode('shared-poll');
    } else if (pathPollId) {
      setSharedPollId(pathPollId);
      setViewMode('shared-poll');
    } else {
      setSharedPollId(null);
    }
  }, [setViewMode]);

  // Memoize theme classes to prevent recalculation
  const themeClasses = useMemo(() => {
    const { theme, fontStyle } = themeState.design;
    
    let baseClasses = 'min-h-screen transition-all duration-300 ';
    
    // Theme-based background - New Designer Theme
    switch (theme) {
      case 'dark':
        baseClasses += 'bg-gray-900 text-white';
        break;
      case 'colorful':
        baseClasses += 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white';
        break;
      case 'designer':
        // New designer theme: Navy background
        baseClasses += 'bg-[#22243a] text-white';
        break;
      default:
        // Default to new designer theme
        baseClasses += 'bg-[#22243a] text-white';
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
  }, [themeState.design.theme, themeState.design.fontStyle]);

  // Memoize current view to prevent unnecessary re-renders
  const currentView = useMemo(() => {
    // Handle shared poll view
    if (state.viewMode === 'shared-poll' && sharedPollId) {
      return <SharedPollView pollId={sharedPollId} />;
    }

    switch (state.viewMode) {
      case 'login':
        return <MemoizedLogin />;
      case 'register':
        return <MemoizedRegister />;
      case 'landing':
        return <MemoizedLandingPage />;
      case 'create':
        return (
          <ProtectedRoute>
            <PollCreator />
          </ProtectedRoute>
        );
      case 'vote':
        return <MemoizedPollVoting />;
      case 'results':
        return <MemoizedPollResults />;
      case 'workspace':
        return (
          <ProtectedRoute>
            <PollDashboard />
          </ProtectedRoute>
        );
      case 'settings':
        return (
          <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center">
              <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
                <p className="text-gray-600">Settings page coming soon...</p>
              </div>
            </div>
          </ProtectedRoute>
        );
      case 'admin':
        return (
          <ProtectedRoute requireAdmin>
            <div className="min-h-screen flex items-center justify-center">
              <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
                <p className="text-gray-600">Admin dashboard coming soon...</p>
              </div>
            </div>
          </ProtectedRoute>
        );
      default:
        return <MemoizedLandingPage />;
    }
  }, [state.viewMode, sharedPollId]);
  
  // Memoize save modal handlers to prevent recreation
  const handleSaveClick = useCallback(() => {
    setShowSaveModal(true);
  }, []);
  
  const handleCloseSaveModal = useCallback(() => {
    setShowSaveModal(false);
  }, []);
  
  // Memoize email verification banner visibility
  const showEmailBanner = useMemo(() => {
    return currentUser && currentUser.email && !currentUser.emailVerified;
  }, [currentUser]);

  // Show loading state while auth is initializing, but do NOT block shared poll links.
  // This ensures public /poll/:id links work even if Firebase Auth is still initializing
  // or fails to initialize in some browsers.
  if (authLoading && state.viewMode !== 'shared-poll') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={themeClasses}>
      {/* Shared Navigation Header - Always visible on all pages (landing, create, workspace, etc.) */}
      {/* Includes: User profile dropdown, Create Poll button, My Polls button, and other navigation */}
      {/* Navigation is memoized and mounted once, preventing flicker on route changes */}
      <Navigation onSaveClick={handleSaveClick} />

      {/* Email Verification Banner */}
      {showEmailBanner && (
        <div className="container mx-auto px-4 pt-4">
          <EmailVerificationBanner user={currentUser!} />
        </div>
      )}

      {/* Save Poll Modal */}
      {showSaveModal && (
        <SavePollModal
          isOpen={showSaveModal}
          onClose={handleCloseSaveModal}
          onSave={handleCloseSaveModal}
        />
      )}

      {/* Main Content - Memoized to prevent unnecessary re-renders */}
      <main>
        {currentView}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WorkspaceManagerProvider>
        <WorkspaceProvider>
          <PollProvider>
            <AppContent />
          </PollProvider>
        </WorkspaceProvider>
      </WorkspaceManagerProvider>
    </ThemeProvider>
  );
};

export default App;
