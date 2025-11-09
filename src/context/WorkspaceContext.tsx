import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Poll, SavedPoll } from '../types/poll.types';

interface WorkspaceState {
  savedPolls: SavedPoll[];
  isLoading: boolean;
}

type WorkspaceAction =
  | { type: 'LOAD_POLLS'; payload: SavedPoll[] }
  | { type: 'SAVE_POLL'; payload: SavedPoll }
  | { type: 'UPDATE_POLL'; payload: SavedPoll }
  | { type: 'DELETE_POLL'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: WorkspaceState = {
  savedPolls: [],
  isLoading: false,
};

const workspaceReducer = (state: WorkspaceState, action: WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case 'LOAD_POLLS':
      return {
        ...state,
        savedPolls: action.payload,
        isLoading: false,
      };
    case 'SAVE_POLL':
      return {
        ...state,
        savedPolls: [...state.savedPolls, action.payload],
      };
    case 'UPDATE_POLL':
      return {
        ...state,
        savedPolls: state.savedPolls.map(poll =>
          poll.id === action.payload.id ? action.payload : poll
        ),
      };
    case 'DELETE_POLL':
      return {
        ...state,
        savedPolls: state.savedPolls.filter(poll => poll.id !== action.payload),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

interface WorkspaceContextType {
  state: WorkspaceState;
  savePoll: (poll: Poll, title?: string, description?: string) => void;
  updatePoll: (poll: Poll, title?: string, description?: string) => void;
  deletePoll: (pollId: string) => void;
  loadPoll: (pollId: string) => Poll | null;
  loadPolls: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Load polls from localStorage on mount
  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 3000);
    
    try {
      const savedPollsData = localStorage.getItem('poll-workspace');
      if (savedPollsData) {
        const polls = JSON.parse(savedPollsData);
        // Convert date strings back to Date objects
        const pollsWithDates = polls.map((poll: SavedPoll) => ({
          ...poll,
          createdAt: new Date(poll.createdAt),
          lastModified: new Date(poll.lastModified),
        }));
        clearTimeout(timeout);
        dispatch({ type: 'LOAD_POLLS', payload: pollsWithDates });
      } else {
        clearTimeout(timeout);
        dispatch({ type: 'LOAD_POLLS', payload: [] });
      }
    } catch (error) {
      clearTimeout(timeout);
      console.error('Failed to load polls:', error);
      dispatch({ type: 'LOAD_POLLS', payload: [] });
    }
  };

  const savePoll = (poll: Poll, title?: string, description?: string) => {
    const savedPoll: SavedPoll = {
      id: poll.id,
      title: title || `Poll: ${poll.question.substring(0, 30)}${poll.question.length > 30 ? '...' : ''}`,
      description,
      question: poll.question,
      choices: poll.choices, // Store full choices with votes
      createdAt: poll.createdAt,
      lastModified: new Date(),
      totalVotes: poll.choices.reduce((sum, choice) => sum + choice.votes, 0),
      design: poll.design,
      backgroundImage: poll.design.backgroundImage, // Store background image
    };

    // Save to localStorage with error handling
    try {
      const existingPolls = JSON.parse(localStorage.getItem('poll-workspace') || '[]');
      
      // Check if poll already exists (update) or is new (add)
      const existingIndex = existingPolls.findIndex((p: SavedPoll) => p.id === poll.id);
      let updatedPolls;
      
      if (existingIndex >= 0) {
        // Update existing poll
        updatedPolls = [...existingPolls];
        updatedPolls[existingIndex] = savedPoll;
      } else {
        // Add new poll
        updatedPolls = [...existingPolls, savedPoll];
      }
      
      localStorage.setItem('poll-workspace', JSON.stringify(updatedPolls));
      
      if (existingIndex >= 0) {
        dispatch({ type: 'UPDATE_POLL', payload: savedPoll });
      } else {
        dispatch({ type: 'SAVE_POLL', payload: savedPoll });
      }
    } catch (error) {
      // Handle localStorage quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Please delete some polls.');
        throw new Error('Unable to save poll. Storage is full. Please delete some polls and try again.');
      } else {
        console.error('Failed to save poll:', error);
        throw new Error('Unable to save poll. Please try again.');
      }
    }
  };

  const updatePoll = (poll: Poll, title?: string, description?: string) => {
    const savedPoll: SavedPoll = {
      id: poll.id,
      title: title || `Poll: ${poll.question.substring(0, 30)}${poll.question.length > 30 ? '...' : ''}`,
      description,
      question: poll.question,
      choices: poll.choices, // Store full choices with votes
      createdAt: poll.createdAt,
      lastModified: new Date(),
      totalVotes: poll.choices.reduce((sum, choice) => sum + choice.votes, 0),
      design: poll.design,
      backgroundImage: poll.design.backgroundImage, // Store background image
    };

    try {
      const existingPolls = JSON.parse(localStorage.getItem('poll-workspace') || '[]');
      const updatedPolls = existingPolls.map((p: SavedPoll) => 
        p.id === poll.id ? savedPoll : p
      );
      localStorage.setItem('poll-workspace', JSON.stringify(updatedPolls));
      
      dispatch({ type: 'UPDATE_POLL', payload: savedPoll });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded.');
        throw new Error('Unable to update poll. Storage is full. Please delete some polls and try again.');
      } else {
        console.error('Failed to update poll:', error);
        throw new Error('Unable to update poll. Please try again.');
      }
    }
  };

  const deletePoll = (pollId: string) => {
    try {
      const existingPolls = JSON.parse(localStorage.getItem('poll-workspace') || '[]');
      const updatedPolls = existingPolls.filter((p: SavedPoll) => p.id !== pollId);
      localStorage.setItem('poll-workspace', JSON.stringify(updatedPolls));
      
      dispatch({ type: 'DELETE_POLL', payload: pollId });
    } catch (error) {
      console.error('Failed to delete poll:', error);
    }
  };

  const loadPoll = (pollId: string): Poll | null => {
    try {
      const existingPolls = JSON.parse(localStorage.getItem('poll-workspace') || '[]');
      const savedPoll = existingPolls.find((p: SavedPoll) => p.id === pollId);
      
      if (savedPoll) {
        // Convert SavedPoll back to Poll format with full data
        return {
          id: savedPoll.id,
          question: savedPoll.question,
          choices: savedPoll.choices || [], // Use stored choices with votes
          createdAt: new Date(savedPoll.createdAt),
          design: {
            ...savedPoll.design,
            backgroundImage: savedPoll.backgroundImage, // Include background image
          },
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to load poll:', error);
      return null;
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        savePoll,
        updatePoll,
        deletePoll,
        loadPoll,
        loadPolls,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};




