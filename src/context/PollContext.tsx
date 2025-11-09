import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Poll, Choice, ViewMode } from '../types/poll.types';

// Helper function to save poll votes to storage
const savePollVotes = (poll: Poll) => {
  try {
    const existingPolls = JSON.parse(localStorage.getItem('poll-workspace') || '[]');
    const pollIndex = existingPolls.findIndex((p: any) => p.id === poll.id);
    
    if (pollIndex >= 0) {
      // Update existing poll with new vote counts
      existingPolls[pollIndex] = {
        ...existingPolls[pollIndex],
        choices: poll.choices,
        totalVotes: poll.choices.reduce((sum, choice) => sum + choice.votes, 0),
        lastModified: new Date(),
      };
      localStorage.setItem('poll-workspace', JSON.stringify(existingPolls));
    }
  } catch (error) {
    console.error('Failed to save poll votes:', error);
  }
};

interface PollState {
  currentPoll: Poll | null;
  viewMode: ViewMode;
  hasVoted: boolean;
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
};

const pollReducer = (state: PollState, action: PollAction): PollState => {
  switch (action.type) {
    case 'CREATE_POLL':
      return {
        ...state,
        currentPoll: action.payload,
        viewMode: 'vote',
        hasVoted: false,
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
      
      // Persist votes to storage
      savePollVotes(updatedPoll);
      
      return {
        ...state,
        currentPoll: updatedPoll,
        hasVoted: true,
        viewMode: 'results',
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

  const createPoll = (poll: Poll) => {
    dispatch({ type: 'CREATE_POLL', payload: poll });
  };

  const vote = (choiceId: string) => {
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
