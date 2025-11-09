import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Workspace, WorkspaceSettings } from '../types/workspace.types';

interface WorkspaceManagerState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  isLoading: boolean;
}

type WorkspaceManagerAction =
  | { type: 'LOAD_WORKSPACES'; payload: Workspace[] }
  | { type: 'CREATE_WORKSPACE'; payload: Workspace }
  | { type: 'UPDATE_WORKSPACE'; payload: Workspace }
  | { type: 'DELETE_WORKSPACE'; payload: string }
  | { type: 'SET_CURRENT_WORKSPACE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: WorkspaceManagerState = {
  workspaces: [],
  currentWorkspaceId: null,
  isLoading: false,
};

const workspaceManagerReducer = (state: WorkspaceManagerState, action: WorkspaceManagerAction): WorkspaceManagerState => {
  switch (action.type) {
    case 'LOAD_WORKSPACES':
      return {
        ...state,
        workspaces: action.payload,
        isLoading: false,
      };
    case 'CREATE_WORKSPACE':
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
      };
    case 'UPDATE_WORKSPACE':
      return {
        ...state,
        workspaces: state.workspaces.map(workspace =>
          workspace.id === action.payload.id ? action.payload : workspace
        ),
      };
    case 'DELETE_WORKSPACE':
      return {
        ...state,
        workspaces: state.workspaces.filter(workspace => workspace.id !== action.payload),
        currentWorkspaceId: state.currentWorkspaceId === action.payload ? null : state.currentWorkspaceId,
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
    default:
      return state;
  }
};

interface WorkspaceManagerContextType {
  state: WorkspaceManagerState;
  createWorkspace: (name: string, description?: string, color?: string, icon?: string) => void;
  updateWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  setCurrentWorkspace: (workspaceId: string) => void;
  getCurrentWorkspace: () => Workspace | null;
  loadWorkspaces: () => void;
}

const WorkspaceManagerContext = createContext<WorkspaceManagerContextType | undefined>(undefined);

export const WorkspaceManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(workspaceManagerReducer, initialState);

  // Load workspaces from localStorage on mount
  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const workspacesData = localStorage.getItem('poll-workspaces');
      if (workspacesData) {
        const workspaces = JSON.parse(workspacesData);
        dispatch({ type: 'LOAD_WORKSPACES', payload: workspaces });
        
        // Set first workspace as current if none is selected
        if (workspaces.length > 0 && !state.currentWorkspaceId) {
          dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspaces[0].id });
        }
      } else {
        // Create default workspace if none exist
        createDefaultWorkspace();
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
      dispatch({ type: 'LOAD_WORKSPACES', payload: [] });
    }
  };

  const createDefaultWorkspace = () => {
    const defaultWorkspace: Workspace = {
      id: 'default-workspace',
      name: 'My Polls',
      description: 'Default workspace for your polls',
      color: '#3b82f6',
      icon: '📊',
      createdAt: new Date(),
      lastModified: new Date(),
      pollCount: 0,
    };
    
    try {
      localStorage.setItem('poll-workspaces', JSON.stringify([defaultWorkspace]));
      dispatch({ type: 'LOAD_WORKSPACES', payload: [defaultWorkspace] });
      dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: defaultWorkspace.id });
    } catch (error) {
      console.error('Failed to create default workspace:', error);
    }
  };

  const createWorkspace = (name: string, description?: string, color?: string, icon?: string) => {
    const workspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      description,
      color: color || '#3b82f6',
      icon: icon || '📊',
      createdAt: new Date(),
      lastModified: new Date(),
      pollCount: 0,
    };

    try {
      const existingWorkspaces = JSON.parse(localStorage.getItem('poll-workspaces') || '[]');
      const updatedWorkspaces = [...existingWorkspaces, workspace];
      localStorage.setItem('poll-workspaces', JSON.stringify(updatedWorkspaces));
      
      dispatch({ type: 'CREATE_WORKSPACE', payload: workspace });
      dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspace.id });
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const updateWorkspace = (workspace: Workspace) => {
    try {
      const existingWorkspaces = JSON.parse(localStorage.getItem('poll-workspaces') || '[]');
      const updatedWorkspaces = existingWorkspaces.map((w: Workspace) => 
        w.id === workspace.id ? { ...workspace, lastModified: new Date() } : w
      );
      localStorage.setItem('poll-workspaces', JSON.stringify(updatedWorkspaces));
      
      dispatch({ type: 'UPDATE_WORKSPACE', payload: { ...workspace, lastModified: new Date() } });
    } catch (error) {
      console.error('Failed to update workspace:', error);
    }
  };

  const deleteWorkspace = (workspaceId: string) => {
    try {
      const existingWorkspaces = JSON.parse(localStorage.getItem('poll-workspaces') || '[]');
      const updatedWorkspaces = existingWorkspaces.filter((w: Workspace) => w.id !== workspaceId);
      localStorage.setItem('poll-workspaces', JSON.stringify(updatedWorkspaces));
      
      dispatch({ type: 'DELETE_WORKSPACE', payload: workspaceId });
    } catch (error) {
      console.error('Failed to delete workspace:', error);
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




