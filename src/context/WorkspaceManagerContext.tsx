import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Workspace } from '../types/workspace.types';
import { useAuth } from './AuthContext';
import {
  createWorkspaceInFirestore,
  loadWorkspacesFromFirestore,
  updateWorkspaceInFirestore,
  deleteWorkspaceFromFirestore,
} from '../utils/firestoreHelpers';

interface WorkspaceManagerState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  isLoading: boolean;
  error: string | null;
}

type WorkspaceManagerAction =
  | { type: 'LOAD_WORKSPACES'; payload: Workspace[] }
  | { type: 'CREATE_WORKSPACE'; payload: Workspace }
  | { type: 'UPDATE_WORKSPACE'; payload: Workspace }
  | { type: 'DELETE_WORKSPACE'; payload: string }
  | { type: 'SET_CURRENT_WORKSPACE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: WorkspaceManagerState = {
  workspaces: [],
  currentWorkspaceId: null,
  isLoading: false,
  error: null,
};

const workspaceManagerReducer = (state: WorkspaceManagerState, action: WorkspaceManagerAction): WorkspaceManagerState => {
  switch (action.type) {
    case 'LOAD_WORKSPACES':
      return {
        ...state,
        workspaces: action.payload,
        isLoading: false,
        error: null,
      };
    case 'CREATE_WORKSPACE':
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
        currentWorkspaceId: action.payload.id,
        error: null,
      };
    case 'UPDATE_WORKSPACE':
      return {
        ...state,
        workspaces: state.workspaces.map(workspace =>
          workspace.id === action.payload.id ? action.payload : workspace
        ),
        error: null,
      };
    case 'DELETE_WORKSPACE':
      return {
        ...state,
        workspaces: state.workspaces.filter(workspace => workspace.id !== action.payload),
        currentWorkspaceId: state.currentWorkspaceId === action.payload ? null : state.currentWorkspaceId,
        error: null,
      };
    case 'SET_CURRENT_WORKSPACE':
      return {
        ...state,
        currentWorkspaceId: action.payload,
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

interface WorkspaceManagerContextType {
  state: WorkspaceManagerState;
  createWorkspace: (name: string, description?: string, color?: string, icon?: string) => Promise<void>;
  updateWorkspace: (workspace: Workspace) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  setCurrentWorkspace: (workspaceId: string) => void;
  getCurrentWorkspace: () => Workspace | null;
  loadWorkspaces: () => Promise<void>;
}

const WorkspaceManagerContext = createContext<WorkspaceManagerContextType | undefined>(undefined);

export const WorkspaceManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(workspaceManagerReducer, initialState);
  const { currentUser } = useAuth();

  // Load workspaces when user logs in
  useEffect(() => {
    if (currentUser) {
      loadWorkspaces();
    } else {
      // Clear workspaces when user logs out
      dispatch({ type: 'LOAD_WORKSPACES', payload: [] });
      dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: '' });
    }
  }, [currentUser]);

  const loadWorkspaces = async () => {
    if (!currentUser) {
      dispatch({ type: 'LOAD_WORKSPACES', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const workspaces = await loadWorkspacesFromFirestore(currentUser.uid);
      
      if (workspaces.length === 0) {
        // Create default workspace if none exist
        await createDefaultWorkspace();
      } else {
        dispatch({ type: 'LOAD_WORKSPACES', payload: workspaces });
        
        // Set first workspace as current if none is selected
        if (!state.currentWorkspaceId && workspaces.length > 0) {
          dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspaces[0].id });
        }
      }
    } catch (error: any) {
      console.error('Failed to load workspaces:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load workspaces' });
      dispatch({ type: 'LOAD_WORKSPACES', payload: [] });
    }
  };

  const createDefaultWorkspace = async () => {
    if (!currentUser) return;

    try {
      const defaultWorkspace: Omit<Workspace, 'id'> = {
        name: 'My Polls',
        description: 'Default workspace for your polls',
        color: '#16a34a',
        icon: '📊',
        createdAt: new Date(),
        lastModified: new Date(),
        pollCount: 0,
      };

      const workspaceId = await createWorkspaceInFirestore(defaultWorkspace, currentUser.uid);
      const newWorkspace: Workspace = {
        ...defaultWorkspace,
        id: workspaceId,
      };

      dispatch({ type: 'CREATE_WORKSPACE', payload: newWorkspace });
    } catch (error) {
      console.error('Failed to create default workspace:', error);
    }
  };

  const createWorkspace = async (name: string, description?: string, color?: string, icon?: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to create workspaces');
    }

    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const workspace: Omit<Workspace, 'id'> = {
        name,
        description,
        color: color || '#16a34a',
        icon: icon || '📊',
        createdAt: new Date(),
        lastModified: new Date(),
        pollCount: 0,
      };

      const workspaceId = await createWorkspaceInFirestore(workspace, currentUser.uid);
      const newWorkspace: Workspace = {
        ...workspace,
        id: workspaceId,
      };

      dispatch({ type: 'CREATE_WORKSPACE', payload: newWorkspace });
    } catch (error: any) {
      console.error('Failed to create workspace:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create workspace' });
      throw error;
    }
  };

  const updateWorkspace = async (workspace: Workspace): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to update workspaces');
    }

    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await updateWorkspaceInFirestore(workspace.id, workspace, currentUser.uid);
      dispatch({ type: 'UPDATE_WORKSPACE', payload: { ...workspace, lastModified: new Date() } });
    } catch (error: any) {
      console.error('Failed to update workspace:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update workspace' });
      throw error;
    }
  };

  const deleteWorkspace = async (workspaceId: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to delete workspaces');
    }

    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await deleteWorkspaceFromFirestore(workspaceId, currentUser.uid);
      dispatch({ type: 'DELETE_WORKSPACE', payload: workspaceId });
    } catch (error: any) {
      console.error('Failed to delete workspace:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete workspace' });
      throw error;
    }
  };

  const setCurrentWorkspace = (workspaceId: string) => {
    dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspaceId });
  };

  const getCurrentWorkspace = (): Workspace | null => {
    return state.workspaces.find(w => w.id === state.currentWorkspaceId) || null;
  };

  return (
    <WorkspaceManagerContext.Provider
      value={{
        state,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        setCurrentWorkspace,
        getCurrentWorkspace,
        loadWorkspaces,
      }}
    >
      {children}
    </WorkspaceManagerContext.Provider>
  );
};

export const useWorkspaceManager = () => {
  const context = useContext(WorkspaceManagerContext);
  if (context === undefined) {
    throw new Error('useWorkspaceManager must be used within a WorkspaceManagerProvider');
  }
  return context;
};
