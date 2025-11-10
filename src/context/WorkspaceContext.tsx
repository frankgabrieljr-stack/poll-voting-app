import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Poll, SavedPoll } from '../types/poll.types';
import { useAuth } from './AuthContext';
import { useWorkspaceManager } from './WorkspaceManagerContext';
import {
  savePollToFirestore,
  loadPollsFromFirestore,
  loadSharedPollsFromFirestore,
  updatePollInFirestore,
  deletePollFromFirestore,
  loadPollByIdFromFirestore,
} from '../utils/firestoreHelpers';

interface WorkspaceState {
  savedPolls: SavedPoll[];
  sharedPolls: SavedPoll[];
  isLoading: boolean;
  error: string | null;
}

type WorkspaceAction =
  | { type: 'LOAD_POLLS'; payload: SavedPoll[] }
  | { type: 'LOAD_SHARED_POLLS'; payload: SavedPoll[] }
  | { type: 'SAVE_POLL'; payload: SavedPoll }
  | { type: 'UPDATE_POLL'; payload: SavedPoll }
  | { type: 'DELETE_POLL'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: WorkspaceState = {
  savedPolls: [],
  sharedPolls: [],
  isLoading: false,
  error: null,
};

const workspaceReducer = (state: WorkspaceState, action: WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case 'LOAD_POLLS':
      return {
        ...state,
        savedPolls: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOAD_SHARED_POLLS':
      return {
        ...state,
        sharedPolls: action.payload,
      };
    case 'SAVE_POLL':
      return {
        ...state,
        savedPolls: [...state.savedPolls, action.payload],
        error: null,
      };
    case 'UPDATE_POLL':
      return {
        ...state,
        savedPolls: state.savedPolls.map(poll =>
          poll.id === action.payload.id ? action.payload : poll
        ),
        error: null,
      };
    case 'DELETE_POLL':
      return {
        ...state,
        savedPolls: state.savedPolls.filter(poll => poll.id !== action.payload),
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

interface WorkspaceContextType {
  state: WorkspaceState;
  savePoll: (poll: Poll, title?: string, description?: string) => Promise<void>;
  updatePoll: (poll: Poll, title?: string, description?: string) => Promise<void>;
  deletePoll: (pollId: string) => Promise<void>;
  loadPoll: (pollId: string) => Promise<Poll | null>;
  loadPolls: () => Promise<void>;
  loadSharedPolls: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  const { currentUser } = useAuth();
  const { getCurrentWorkspace } = useWorkspaceManager();

  // Load polls when user logs in or workspace changes
  useEffect(() => {
    if (currentUser) {
      loadPolls();
      loadSharedPolls();
    } else {
      // Clear polls when user logs out
      dispatch({ type: 'LOAD_POLLS', payload: [] });
      dispatch({ type: 'LOAD_SHARED_POLLS', payload: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Reload polls when workspace changes
  const currentWorkspace = getCurrentWorkspace();
  useEffect(() => {
    if (currentUser && currentWorkspace) {
      loadPolls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?.id]);

  const loadPolls = async () => {
    if (!currentUser) {
      dispatch({ type: 'LOAD_POLLS', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const workspace = getCurrentWorkspace();
      const workspaceId = workspace?.id;
      const polls = await loadPollsFromFirestore(currentUser.uid, workspaceId);
      dispatch({ type: 'LOAD_POLLS', payload: polls });
    } catch (error: any) {
      console.error('Failed to load polls:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load polls' });
      dispatch({ type: 'LOAD_POLLS', payload: [] });
    }
  };

  const loadSharedPolls = async () => {
    if (!currentUser?.email) {
      return;
    }

    try {
      const sharedPolls = await loadSharedPollsFromFirestore(currentUser.email);
      dispatch({ type: 'LOAD_SHARED_POLLS', payload: sharedPolls });
    } catch (error) {
      console.error('Failed to load shared polls:', error);
    }
  };

  const savePoll = async (poll: Poll, title?: string, description?: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to save polls');
    }

    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const workspace = getCurrentWorkspace();
      const workspaceId = workspace?.id;
      
      await savePollToFirestore(poll, currentUser.uid, workspaceId, title, description);
      
      const savedPoll: SavedPoll = {
        id: poll.id,
        title: title || `Poll: ${poll.question.substring(0, 30)}${poll.question.length > 30 ? '...' : ''}`,
        description,
        question: poll.question,
        choices: poll.choices,
        createdAt: poll.createdAt,
        lastModified: new Date(),
        totalVotes: poll.choices.reduce((sum, choice) => sum + choice.votes, 0),
        design: poll.design,
        backgroundImage: poll.design?.backgroundImage,
        userId: currentUser.uid,
        sharedWith: poll.sharedWith || [],
        permissions: poll.permissions || {},
      };

      // Check if poll already exists (update) or is new (add)
      const existingIndex = state.savedPolls.findIndex(p => p.id === poll.id);
      if (existingIndex >= 0) {
        dispatch({ type: 'UPDATE_POLL', payload: savedPoll });
      } else {
        dispatch({ type: 'SAVE_POLL', payload: savedPoll });
      }
    } catch (error: any) {
      console.error('Failed to save poll:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to save poll' });
      throw error;
    }
  };

  const updatePoll = async (poll: Poll, title?: string, description?: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to update polls');
    }

    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const workspace = getCurrentWorkspace();
      const workspaceId = workspace?.id;
      
      await updatePollInFirestore(poll, currentUser.uid, workspaceId, title, description);
      
      const savedPoll: SavedPoll = {
        id: poll.id,
        title: title || poll.id,
        description,
        question: poll.question,
        choices: poll.choices,
        createdAt: poll.createdAt,
        lastModified: new Date(),
        totalVotes: poll.choices.reduce((sum, choice) => sum + choice.votes, 0),
        design: poll.design,
        backgroundImage: poll.design?.backgroundImage,
        userId: currentUser.uid,
        sharedWith: poll.sharedWith || [],
        permissions: poll.permissions || {},
      };

      dispatch({ type: 'UPDATE_POLL', payload: savedPoll });
    } catch (error: any) {
      console.error('Failed to update poll:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update poll' });
      throw error;
    }
  };

  const deletePoll = async (pollId: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to delete polls');
    }

    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await deletePollFromFirestore(pollId, currentUser.uid);
      dispatch({ type: 'DELETE_POLL', payload: pollId });
    } catch (error: any) {
      console.error('Failed to delete poll:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete poll' });
      throw error;
    }
  };

  const loadPoll = async (pollId: string): Promise<Poll | null> => {
    try {
      // First try to load from Firestore
      const savedPoll = await loadPollByIdFromFirestore(pollId);
      
      if (savedPoll) {
        return {
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
      }
      
      // Fallback to local state
      const localPoll = state.savedPolls.find(p => p.id === pollId);
      if (localPoll) {
        return {
          id: localPoll.id,
          question: localPoll.question,
          choices: localPoll.choices || [],
          createdAt: localPoll.createdAt,
          design: {
            ...localPoll.design,
            backgroundImage: localPoll.backgroundImage,
          },
          userId: localPoll.userId,
          sharedWith: localPoll.sharedWith,
          permissions: localPoll.permissions,
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
        loadSharedPolls,
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
