import React, { useState, useEffect } from 'react';
import { usePoll } from '../context/PollContext';
import { loadPollByIdFromFirestore } from '../utils/firestoreHelpers';
import PollVoting from './PollVoting';
import PollResults from './PollResults';
import type { Poll } from '../types/poll.types';

interface SharedPollViewProps {
  pollId: string;
}

const SharedPollView: React.FC<SharedPollViewProps> = ({ pollId }) => {
  const { createPoll, state } = usePoll();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPoll = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load from Firestore using the public/shareable poll ID.
        const savedPoll = await loadPollByIdFromFirestore(pollId);

        if (!isMounted) return;

        if (savedPoll) {
          const poll: Poll = {
            id: savedPoll.id,
            question: savedPoll.question,
            choices: savedPoll.choices || [],
            createdAt: savedPoll.createdAt,
            design: {
              ...savedPoll.design,
              backgroundImage: savedPoll.backgroundImage,
            },
            userId: savedPoll.userId,
            sharedWith: savedPoll.sharedWith,
            permissions: savedPoll.permissions,
          };

          createPoll(poll);
        } else {
          setError(
            'Poll not found. The link may be invalid, the poll may have been deleted, or you may not have permission to view it.'
          );
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error loading poll:', err);
        setError(err.message || 'Failed to load poll. Please try again.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (pollId) {
      fetchPoll();
    }

    return () => {
      isMounted = false;
    };
  }, [pollId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-designer-pattern">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f4eff] mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-designer-pattern px-4">
        <div className="max-w-md w-full bg-[#fafaff] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] p-8 border border-[#8f4eff]/10">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Poll Not Found</h1>
            <p className="text-[#4a4a6a] mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] text-white rounded-xl font-bold hover:from-[#a366ff] hover:to-[#2ef9d8] transition-all shadow-lg"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show voting interface if poll is loaded
  if (state.currentPoll && !state.hasVoted) {
    return <PollVoting />;
  }

  // Show results if user has voted
  if (state.currentPoll && state.hasVoted) {
    return <PollResults />;
  }

  return null;
};

export default SharedPollView;

