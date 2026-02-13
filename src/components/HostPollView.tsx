import React, { useState, useEffect } from 'react';
import { usePoll } from '../context/PollContext';
import { useAuth } from '../context/AuthContext';
import { subscribeToPollById } from '../utils/firestoreHelpers';
import PollResults from './PollResults';
import type { Poll } from '../types/poll.types';

interface HostPollViewProps {
  pollId: string;
}

const HostPollView: React.FC<HostPollViewProps> = ({ pollId }) => {
  const { createPoll, state, setViewMode } = usePoll();
  const { currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId || !currentUser) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToPollById(
      pollId,
      (savedPoll) => {
        if (!savedPoll) {
          setError('Poll not found or no longer available.');
          setLoading(false);
          return;
        }

        if (savedPoll.userId && savedPoll.userId !== currentUser.uid) {
          setError('You do not have permission to view this host dashboard.');
          setLoading(false);
          return;
        }

        const poll: Poll = {
          id: savedPoll.id,
          question: savedPoll.question,
          choices: savedPoll.choices || [],
          createdAt: savedPoll.createdAt,
          lastUpdatedAt: savedPoll.lastModified,
          design: {
            ...savedPoll.design,
            backgroundImage: savedPoll.backgroundImage,
          },
          userId: savedPoll.userId,
          sharedWith: savedPoll.sharedWith,
          permissions: savedPoll.permissions,
        };

        createPoll(poll);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading host poll:', err);
        setError(err.message || 'Failed to load host poll.');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [pollId, currentUser, createPoll]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-designer-pattern">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a] mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading host dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-designer-pattern px-4">
        <div className="max-w-md w-full bg-[#fafaff] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] p-8 border border-[#16a34a]/10">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Host Login Required</h1>
            <p className="text-[#4a4a6a] mb-6">Please sign in as the poll owner to view host results.</p>
            <button
              onClick={() => setViewMode('login')}
              className="px-6 py-3 bg-gradient-to-r from-[#16a34a] to-[#34d399] text-white rounded-xl font-bold hover:from-[#22c55e] hover:to-[#6ee7b7] transition-all shadow-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-designer-pattern px-4">
        <div className="max-w-md w-full bg-[#fafaff] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] p-8 border border-[#16a34a]/10">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Cannot Open Host Dashboard</h1>
            <p className="text-[#4a4a6a] mb-6">{error}</p>
            <button
              onClick={() => setViewMode('workspace')}
              className="px-6 py-3 bg-gradient-to-r from-[#16a34a] to-[#34d399] text-white rounded-xl font-bold hover:from-[#22c55e] hover:to-[#6ee7b7] transition-all shadow-lg"
            >
              Go to My Polls
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.currentPoll) {
    return <PollResults isHostView />;
  }

  return null;
};

export default HostPollView;
