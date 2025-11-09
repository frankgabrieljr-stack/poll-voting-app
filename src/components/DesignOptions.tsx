import React from 'react';
import { useTheme } from '../context/ThemeContext';

const DesignOptions: React.FC = () => {
  const { state, setTheme, setPrimaryColor, setFontStyle, setLayout } = useTheme();

  const getThemeClasses = () => {
    const { theme, fontStyle } = state.design;
    
    let baseClasses = 'p-6 rounded-lg transition-all duration-300 ';
    
    // Theme-based background
    switch (theme) {
      case 'dark':
        baseClasses += 'bg-gray-800 border border-gray-700';
        break;
      case 'colorful':
        baseClasses += 'bg-white/20 backdrop-blur-sm border border-white/30';
        break;
      default:
        baseClasses += 'bg-white border border-gray-200 shadow-lg';
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
  };

  const getSelectClasses = () => {
    const { theme } = state.design;
    
    let baseClasses = 'w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ';
    
    if (theme === 'dark') {
      baseClasses += 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400';
    } else if (theme === 'colorful') {
      baseClasses += 'bg-white/20 border-white/30 text-white focus:border-white focus:ring-white/50';
    } else {
      baseClasses += 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500';
    }
    
    return baseClasses;
  };

  const getButtonClasses = (isActive: boolean) => {
    const { theme } = state.design;
    
    let baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ';
    
    if (isActive) {
      baseClasses += 'text-white shadow-lg';
    } else {
      if (theme === 'dark') {
        baseClasses += 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500';
      } else if (theme === 'colorful') {
        baseClasses += 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm focus:ring-white/50';
      } else {
        baseClasses += 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-blue-500';
      }
    }
    
    return baseClasses;
  };

  const getButtonStyle = (isActive: boolean) => {
    if (isActive) {
      return { backgroundColor: state.design.primaryColor };
    }
    return {};
  };

  return (
    <div className={getThemeClasses()}>
      <h3 className="text-xl font-bold mb-6">Design Options</h3>
      
      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-semibold mb-3">Theme</label>
          <div className="flex flex-wrap gap-2">
            {(['light', 'dark', 'colorful'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => setTheme(theme)}
                className={getButtonClasses(state.design.theme === theme)}
                style={getButtonStyle(state.design.theme === theme)}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-semibold mb-3">Primary Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={state.design.primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={state.design.primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        {/* Font Style */}
        <div>
          <label className="block text-sm font-semibold mb-3">Font Style</label>
          <select
            value={state.design.fontStyle}
            onChange={(e) => setFontStyle(e.target.value as 'sans' | 'serif' | 'mono')}
            className={getSelectClasses()}
          >
            <option value="sans">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
          </select>
        </div>

        {/* Layout Style */}
        <div>
          <label className="block text-sm font-semibold mb-3">Layout Style</label>
          <div className="flex flex-wrap gap-2">
            {(['card', 'list', 'compact'] as const).map((layout) => (
              <button
                key={layout}
                onClick={() => setLayout(layout)}
                className={getButtonClasses(state.design.layout === layout)}
                style={getButtonStyle(state.design.layout === layout)}
              >
                {layout.charAt(0).toUpperCase() + layout.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-semibold mb-3">Preview</label>
          <div className="p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <h4 className="text-lg font-bold mb-2">Sample Poll Question</h4>
              <div className="space-y-2">
                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                  Option 1
                </div>
                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                  Option 2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignOptions;
