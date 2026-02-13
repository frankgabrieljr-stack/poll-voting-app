import React, { useState } from 'react';
import { usePoll } from '../context/PollContext';
import { useTheme } from '../context/ThemeContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { validatePoll } from '../utils/validation';
import { ValidationError } from '../utils/validation';
import DesignOptions from './DesignOptions';
import AdvancedDesignOptions from './AdvancedDesignOptions';
import { designTemplates } from '../data/designTemplates';

const PollCreator: React.FC = () => {
  const { createPoll, setViewMode } = usePoll();
  const { state: themeState, setTheme, setPrimaryColor, setFontStyle, setLayout } = useTheme();
  const { savePoll } = useWorkspace();
  const { currentUser } = useAuth();
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '']);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAdvancedTemplates, setShowAdvancedTemplates] = useState(false);

  const addChoice = () => {
    setChoices([...choices, '']);
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
    }
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user's email is verified (optional restriction)
    if (currentUser && !currentUser.emailVerified) {
      const proceed = window.confirm(
        'Your email is not verified. You can still create polls, but some features may be limited. Would you like to continue?'
      );
      if (!proceed) {
        return;
      }
    }
    
    const validationErrors = validatePoll(question, choices);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create poll object with background image included
    const poll = {
      id: Date.now().toString(),
      question: question.trim(),
      choices: choices
        .filter(choice => choice.trim())
        .map((choice, index) => ({
          id: `choice-${index}`,
          text: choice.trim(),
          votes: 0,
        })),
      createdAt: new Date(),
      design: {
        ...themeState.design,
        backgroundImage: themeState.design.backgroundImage, // Include background image
      },
      userId: currentUser?.uid, // Link poll to user
    };

    // Debug: Log poll data to verify image URL is included
    console.log('Creating poll with data:', {
      question: poll.question,
      choicesCount: poll.choices.length,
      design: poll.design,
      backgroundImage: poll.design.backgroundImage || 'No background image',
    });

    // Validate user is logged in
    if (!currentUser) {
      console.error('❌ No user logged in');
      alert('You must be logged in to create polls. Please log in and try again.');
      return;
    }

    // Auto-save poll to Firestore when created
    try {
      console.log('🚀 Starting poll creation process...', {
        pollId: poll.id,
        userId: currentUser.uid,
        question: poll.question,
        choicesCount: poll.choices.length,
      });
      
      await savePoll(poll);
      
      console.log('✅ Poll successfully saved to Firestore');
      
      // Create poll in context for immediate use
      createPoll(poll);
      setErrors([]);
      
      // Navigate to workspace to show the new poll
      setViewMode('workspace');
      
      // Show success message
      setTimeout(() => {
        alert('Poll created successfully! You can find it in "My Polls".');
      }, 100);
      
    } catch (error: any) {
      console.error('❌ CRITICAL: Failed to save poll to Firestore:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      
      // Show detailed error message
      const errorMessage = error.message || 'Unknown error occurred';
      const errorDetails = error.code ? `\nError code: ${error.code}` : '';
      
      alert(`❌ Error saving poll: ${errorMessage}${errorDetails}\n\nTroubleshooting:\n1. Check browser console for details\n2. Verify you are logged in\n3. Check Firestore security rules\n4. Verify internet connection\n5. Check Firebase project configuration`);
      
      // Don't continue if save fails
      return;
    }
  };

  const getThemeClasses = () => {
    const { fontStyle } = themeState.design;
    
    // Always use designer theme: Navy background with geometric patterns
    let baseClasses = 'min-h-screen transition-all duration-300 bg-designer-pattern text-white ';
    
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


  const getInputClasses = () => {
    // Designer theme: White/off-white inputs with violet borders
    return 'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-base bg-[#fafaff] border-[#16a34a]/20 text-[#1a1a2e] placeholder-[#6a6a8a] focus:border-[#16a34a] focus:ring-[#16a34a] shadow-md';
  };

  const handleTemplateSelect = (template: typeof designTemplates[0]) => {
    setTheme(template.backgroundStyle === 'gradient' ? 'colorful' : 'light');
    setPrimaryColor(template.colors[0]);
    setFontStyle(template.fontStyle);
    // Map template layouts to valid DesignOptions layouts
    const layoutMap: Record<string, 'card' | 'list' | 'compact'> = {
      'card': 'card',
      'list': 'list',
      'compact': 'compact',
      'modern': 'card',
      'classic': 'list'
    };
    setLayout(layoutMap[template.layout] || 'card');
    setShowTemplates(false);
    setShowAdvancedTemplates(false);
  };

  return (
    <div className={getThemeClasses()}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => setViewMode('workspace')}
              className="px-5 py-3 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-[#fafaff] shadow-lg border border-[#16a34a]/20 text-[#1a1a2e] hover:shadow-xl"
              style={{ 
                borderColor: themeState.design.primaryColor,
              }}
            >
              <span className="flex items-center space-x-2">
                <span>←</span>
                <span>Back</span>
              </span>
            </button>
            <button
              onClick={() => setViewMode('landing')}
              className="px-5 py-3 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-[#fafaff] shadow-lg border border-[#16a34a]/20 text-[#1a1a2e] hover:shadow-xl"
              style={{ 
                borderColor: themeState.design.primaryColor,
              }}
            >
              <span className="flex items-center space-x-2">
                <span>🏠</span>
                <span>Home</span>
              </span>
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Create Your Poll</h1>
          <p className="text-lg md:text-xl text-white/90 font-semibold">Design and share your custom poll with the world</p>
        </div>

        {/* Templates Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Templates Panel */}
          <div className="bg-[#fafaff] rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border border-[#16a34a]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#1a1a2e]">Templates</h2>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 bg-[#fafaff] border border-[#16a34a]/20 text-[#1a1a2e] shadow-lg"
                style={{ borderColor: themeState.design.primaryColor }}
                title="Open template options"
              >
                {showTemplates ? '✕ Close' : '🎨 Choose Template'}
              </button>
            </div>
            
            {showTemplates ? (
              <div className="space-y-4">
                <DesignOptions />
              </div>
            ) : (
              <div className="space-y-4">
                {designTemplates.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {designTemplates.slice(0, 3).map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-4 rounded-lg border-2 border-[#16a34a]/20 hover:border-[#16a34a] cursor-pointer transition-all duration-200 hover:scale-105 bg-[#fafaff] shadow-md"
                        title={`Use ${template.name} template`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{template.preview}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-lg font-semibold text-[#1a1a2e]">No templates yet!</p>
                    <p className="text-sm text-[#4a4a6a] mt-2">Click "Choose Template" to see options</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Advanced Templates Panel */}
          <div className="bg-[#fafaff] rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border border-[#16a34a]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Advanced Templates</h2>
              <button
                onClick={() => setShowAdvancedTemplates(!showAdvancedTemplates)}
                className="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 bg-[#fafaff] border border-[#16a34a]/20 text-[#1a1a2e] shadow-lg"
                style={{ borderColor: themeState.design.primaryColor }}
                title="Open advanced template options"
              >
                {showAdvancedTemplates ? '✕ Close' : '✨ Advanced Options'}
              </button>
            </div>
            
            {showAdvancedTemplates ? (
              <div className="space-y-4">
                <AdvancedDesignOptions />
              </div>
            ) : (
              <div className="space-y-4">
                {designTemplates.length > 3 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {designTemplates.slice(3).map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-4 rounded-lg border-2 border-[#16a34a]/20 hover:border-[#16a34a] cursor-pointer transition-all duration-200 hover:scale-105 bg-[#fafaff] shadow-md"
                        title={`Use ${template.name} template`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{template.preview}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="text-lg font-semibold text-gray-700">No advanced templates yet!</p>
                    <p className="text-sm text-gray-600 mt-2">Click "Advanced Options" for more choices</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Poll Creation Form */}
        <div className="bg-[#fafaff] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] border border-[#16a34a]/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Input */}
          <div>
            <label htmlFor="question" className="block text-lg md:text-xl font-bold mb-3 text-[#1a1a2e]">
              Poll Question
            </label>
                        <input
                          type="text"
                          id="question"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="What would you like to ask?"
                          className={getInputClasses()}
                          style={{ 
                            borderColor: themeState.design.primaryColor,
                            color: '#1a1a2e',
                            fontSize: '16px',
                            fontWeight: '500'
                          }}
                        />
            {errors.find(e => e.field === 'question') && (
              <p className="text-[#ff6363] font-bold text-base mt-2 bg-[#fafaff] px-3 py-2 rounded-lg shadow-lg border border-[#ff6363]/20">
                {errors.find(e => e.field === 'question')?.message}
              </p>
            )}
          </div>

          {/* Choices */}
          <div>
            <label className="block text-lg md:text-xl font-bold mb-3 text-[#1a1a2e]">
              Choices ({choices.length})
            </label>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fafaff] rounded-full flex items-center justify-center font-bold text-[#1a1a2e] shadow-lg border border-[#16a34a]/20"
                       style={{ borderColor: themeState.design.primaryColor }}>
                    {index + 1}
                  </div>
                              <input
                                type="text"
                                value={choice}
                                onChange={(e) => updateChoice(index, e.target.value)}
                                placeholder={`Enter choice ${index + 1}...`}
                                className={`${getInputClasses()} flex-1 text-lg`}
                                style={{ 
                                  borderColor: themeState.design.primaryColor,
                                  color: '#1a1a2e',
                                  fontSize: '16px',
                                  fontWeight: '500'
                                }}
                              />
                  {choices.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeChoice(index)}
                      className="px-4 py-2 bg-gradient-to-r from-[#ff6363] to-[#ff8a8a] hover:from-[#ff7575] hover:to-[#ff9999] text-white rounded-lg font-bold transition-all duration-200 hover:scale-110 shadow-lg min-w-[50px]"
                      title="Remove choice"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.find(e => e.field === 'choices') && (
              <p className="text-[#ff6363] font-bold text-base mt-2 bg-[#fafaff] px-3 py-2 rounded-lg shadow-lg border border-[#ff6363]/20">
                {errors.find(e => e.field === 'choices')?.message}
              </p>
            )}
          </div>

          {/* Add Choice Button */}
          <button
            type="button"
            onClick={addChoice}
            className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 border-4 bg-[#fafaff] shadow-xl border-[#16a34a] text-[#16a34a]"
            style={{
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 4px ${themeState.design.primaryColor}40`
            }}
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-2xl">➕</span>
              <span>Add Choice ({choices.length})</span>
            </span>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 text-white shadow-xl bg-gradient-to-r from-[#16a34a] to-[#34d399] hover:from-[#22c55e] hover:to-[#6ee7b7]"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Create Poll</span>
            </span>
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default PollCreator;
