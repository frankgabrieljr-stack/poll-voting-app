import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Poll, ViewMode } from '../types/poll.types';
import { useWorkspace } from './WorkspaceContext';
import { updatePublicPollVotes } from '../utils/firestoreHelpers';

interface PollState {
  currentPoll: Poll | null;
  viewMode: ViewMode;
  hasVoted: boolean;
  lastUpdatedAt?: Date;
}

type PollAction =
  | { type: 'CREATE_POLL'; payload: Poll }
  | { type: 'VOTE'; payload: { choiceId: string } }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'RESET_POLL' }
  | { type: 'RESET_VOTING_STATE' } // Reset voting state for continuous voting (keeps vote counts)
  | { type: 'SET_HAS_VOTED'; payload: boolean };

const initialState: PollState = {
  currentPoll: null,
  viewMode: 'landing',
  hasVoted: false,
  lastUpdatedAt: undefined,
};

const pollReducer = (state: PollState, action: PollAction): PollState => {
  switch (action.type) {
    case 'CREATE_POLL':
      // For shared links, keep viewMode and hasVoted as-is so that real-time
      // updates don't kick the user out of their current flow (e.g. results view).
      const isShared = state.viewMode === 'shared-poll';
      return {
        ...state,
        currentPoll: action.payload,
        viewMode: isShared ? state.viewMode : 'vote',
        hasVoted: isShared ? state.hasVoted : false,
        lastUpdatedAt: action.payload.lastUpdatedAt || new Date(),
      };
    case 'VOTE':
      if (!state.currentPoll) return state;

      const updatedChoices = state.currentPoll.choices.map(choice =>
        choice.id === action.payload.choiceId
          ? { ...choice, votes: choice.votes + 1 }
          : choice
      );

      const updatedPoll = {
        ...state.currentPoll,
        choices: updatedChoices,
      };

      return {
        ...state,
        currentPoll: updatedPoll,
        hasVoted: true,
        viewMode: 'results',
        lastUpdatedAt: new Date(),
      };
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };
    case 'RESET_POLL':
      if (!state.currentPoll) return state;
      
      const resetChoices = state.currentPoll.choices.map(choice => ({
        ...choice,
        votes: 0,
      }));
      
      return {
        ...state,
        currentPoll: {
          ...state.currentPoll,
          choices: resetChoices,
        },
        hasVoted: false,
        viewMode: 'vote',
      };
    case 'RESET_VOTING_STATE':
      // Reset voting state for continuous voting (keeps vote counts intact)
      return {
        ...state,
        hasVoted: false,
        viewMode: 'vote',
      };
    case 'SET_HAS_VOTED':
      return {
        ...state,
        hasVoted: action.payload,
      };
    default:
      return state;
  }
};

interface PollContextType {
  state: PollState;
  createPoll: (poll: Poll) => void;
  vote: (choiceId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  resetPoll: () => void;
  resetVotingState: () => void; // Reset voting state for continuous voting
  setHasVoted: (hasVoted: boolean) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pollReducer, initialState);
  const { updatePoll } = useWorkspace();

  const createPoll = useCallback((poll: Poll) => {
    dispatch({ type: 'CREATE_POLL', payload: poll });
  }, []);

  const vote = async (choiceId: string) => {
    if (!state.currentPoll) {
      return;
    }

    // Compute the updated poll so we can persist votes before/alongside the state update
    const updatedChoices = state.currentPoll.choices.map(choice =>
      choice.id === choiceId ? { ...choice, votes: choice.votes + 1 } : choice
    );

    const updatedPoll: Poll = {
      ...state.currentPoll,
      choices: updatedChoices,
    };

    // If we're in a public/shared view, allow anyone (even anonymous users) to update
    // the poll's vote counts directly in Firestore via a dedicated helper that does
    // not depend on authentication.
    if (state.viewMode === 'shared-poll') {
      try {
        await updatePublicPollVotes(updatedPoll.id, choiceId);
      } catch (error) {
        console.error('Failed to persist public poll votes to Firestore:', error);
      }
    } else {
      // Normal owner-driven update through Workspace (requires auth and ownership)
      try {
        await updatePoll(updatedPoll, updatedPoll.title, updatedPoll.description);
      } catch (error) {
        console.error('Failed to persist poll votes to Firestore:', error);
      }
    }

    // Update local voting state
    dispatch({ type: 'VOTE', payload: { choiceId } });
  };

  const setViewMode = (mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const resetPoll = () => {
    dispatch({ type: 'RESET_POLL' });
  };

  const resetVotingState = () => {
    dispatch({ type: 'RESET_VOTING_STATE' });
  };

  const setHasVoted = (hasVoted: boolean) => {
    dispatch({ type: 'SET_HAS_VOTED', payload: hasVoted });
  };

  return (
    <PollContext.Provider
      value={{
        state,
        createPoll,
        vote,
        setViewMode,
        resetPoll,
        resetVotingState,
        setHasVoted,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};

export const usePoll = () => {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
};
