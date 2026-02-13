import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { DesignOptions } from '../types/poll.types';

interface ThemeState {
  design: DesignOptions;
}

type ThemeAction =
  | { type: 'SET_THEME'; payload: DesignOptions['theme'] }
  | { type: 'SET_PRIMARY_COLOR'; payload: string }
  | { type: 'SET_FONT_STYLE'; payload: DesignOptions['fontStyle'] }
  | { type: 'SET_LAYOUT'; payload: DesignOptions['layout'] }
  | { type: 'SET_BACKGROUND_IMAGE'; payload: string | undefined }
  | { type: 'SET_DESIGN'; payload: DesignOptions };

const defaultDesign: DesignOptions = {
  theme: 'designer', // New designer theme
  primaryColor: '#16a34a', // Green as primary
  fontStyle: 'sans',
  layout: 'card',
};

const initialState: ThemeState = {
  design: defaultDesign,
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        design: { ...state.design, theme: action.payload },
      };
    case 'SET_PRIMARY_COLOR':
      return {
        ...state,
        design: { ...state.design, primaryColor: action.payload },
      };
    case 'SET_FONT_STYLE':
      return {
        ...state,
        design: { ...state.design, fontStyle: action.payload },
      };
    case 'SET_LAYOUT':
      return {
        ...state,
        design: { ...state.design, layout: action.payload },
      };
    case 'SET_BACKGROUND_IMAGE':
      return {
        ...state,
        design: { ...state.design, backgroundImage: action.payload },
      };
    case 'SET_DESIGN':
      return {
        ...state,
        design: action.payload,
      };
    default:
      return state;
  }
};

interface ThemeContextType {
  state: ThemeState;
  setTheme: (theme: DesignOptions['theme']) => void;
  setPrimaryColor: (color: string) => void;
  setFontStyle: (fontStyle: DesignOptions['fontStyle']) => void;
  setLayout: (layout: DesignOptions['layout']) => void;
  setBackgroundImage: (imageUrl: string | undefined) => void;
  setDesign: (design: DesignOptions) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedDesign = localStorage.getItem('poll-app-design');
    if (savedDesign) {
      try {
        const design = JSON.parse(savedDesign);
        dispatch({ type: 'SET_DESIGN', payload: design });
      } catch (error) {
        console.error('Failed to load saved design:', error);
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('poll-app-design', JSON.stringify(state.design));
  }, [state.design]);

  const setTheme = (theme: DesignOptions['theme']) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setPrimaryColor = (color: string) => {
    dispatch({ type: 'SET_PRIMARY_COLOR', payload: color });
  };

  const setFontStyle = (fontStyle: DesignOptions['fontStyle']) => {
    dispatch({ type: 'SET_FONT_STYLE', payload: fontStyle });
  };

  const setLayout = (layout: DesignOptions['layout']) => {
    dispatch({ type: 'SET_LAYOUT', payload: layout });
  };

  const setBackgroundImage = (imageUrl: string | undefined) => {
    dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: imageUrl });
  };

  const setDesign = (design: DesignOptions) => {
    dispatch({ type: 'SET_DESIGN', payload: design });
  };

  return (
    <ThemeContext.Provider
      value={{
        state,
        setTheme,
        setPrimaryColor,
        setFontStyle,
        setLayout,
        setBackgroundImage,
        setDesign,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};




