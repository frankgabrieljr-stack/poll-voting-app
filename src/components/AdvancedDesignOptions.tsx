import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { designTemplates, colorPalettes, stockImages } from '../data/designTemplates';
import { DesignTemplate, ColorPalette, StockImage } from '../types/workspace.types';

const AdvancedDesignOptions: React.FC = () => {
  const { state, setTheme, setPrimaryColor, setFontStyle, setLayout, setBackgroundImage } = useTheme();
  const [activeTab, setActiveTab] = useState<'templates' | 'colors' | 'images' | 'custom'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<StockImage | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedPaletteCategory, setSelectedPaletteCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showAllImagesModal, setShowAllImagesModal] = useState(false);
  const quickImageFilters = ['all', 'food', 'holiday', 'winter', 'vacation', 'clothes', 'business', 'lifestyle'];

  // Sync selected image with saved background image from theme state
  useEffect(() => {
    if (state.design.backgroundImage) {
      // Check if it's a stock image URL
      const matchingStockImage = stockImages.find(img => img.url === state.design.backgroundImage);
      if (matchingStockImage) {
        setSelectedImage(matchingStockImage);
        setCustomImage(null);
      } else if (state.design.backgroundImage.startsWith('data:')) {
        // It's a custom uploaded image
        setCustomImage(state.design.backgroundImage);
        setSelectedImage(null);
      }
    }
  }, [state.design.backgroundImage]);

  // Filter images by search term and theme
  const filteredImages = useMemo(() => {
    let filtered = stockImages;

    // Filter by theme
    if (selectedTheme !== 'all') {
      filtered = filtered.filter(img => img.category === selectedTheme);
    }

    // Filter by search term
    if (imageSearchTerm.trim()) {
      const searchLower = imageSearchTerm.toLowerCase();
      filtered = filtered.filter(img => 
        img.alt.toLowerCase().includes(searchLower) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        img.category.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [imageSearchTerm, selectedTheme]);

  // Get unique themes from images
  const availableThemes = useMemo(() => {
    const themes = Array.from(new Set(stockImages.map(img => img.category)));
    return ['all', ...themes];
  }, []);

  // Filter palettes by category for easier browsing with larger catalogs
  const availablePaletteCategories = useMemo(() => {
    const categories = Array.from(new Set(colorPalettes.map(p => p.category)));
    return ['all', ...categories];
  }, []);

  const filteredPalettes = useMemo(() => {
    if (selectedPaletteCategory === 'all') {
      return colorPalettes;
    }
    return colorPalettes.filter((palette) => palette.category === selectedPaletteCategory);
  }, [selectedPaletteCategory]);

  const handleTemplateSelect = (template: DesignTemplate) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedTemplate(template.id);
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
      setIsLoading(false);
    }, 300);
  };

  const handlePaletteSelect = (palette: ColorPalette) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedPalette(palette.id);
      setPrimaryColor(palette.colors.primary);
      setIsLoading(false);
    }, 200);
  };

  const handleImageSelect = (image: StockImage) => {
    setSelectedImage(image);
    setCustomImage(null);
    // Save the image URL to theme state so it persists in the poll
    setBackgroundImage(image.url);
    console.log('Background image selected:', image.url);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setCustomImage(null);
    setBackgroundImage(undefined);
    console.log('Background image cleared');
  };

  const handleCustomImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCustomImage(imageDataUrl);
        setSelectedImage(null);
        // Save the custom image URL to theme state
        setBackgroundImage(imageDataUrl);
        console.log('Custom background image uploaded:', imageDataUrl.substring(0, 50) + '...');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getThemeClasses = () => {
    const { theme, fontStyle } = state.design;
    
    let baseClasses = 'p-6 rounded-lg transition-all duration-300 ';
    
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

  const getTabClasses = (tab: string) => {
    const { theme } = state.design;
    const isActive = activeTab === tab;
    
    let baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ';
    
    if (isActive) {
      baseClasses += 'text-white shadow-lg';
    } else {
      if (theme === 'dark') {
        baseClasses += 'bg-gray-700 hover:bg-gray-600 text-white';
      } else if (theme === 'colorful') {
        baseClasses += 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm';
      } else {
        baseClasses += 'bg-gray-100 hover:bg-gray-200 text-gray-900';
      }
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

  // Use the saved background image from theme state, or fall back to selected/custom
  const selectedImageUrl = state.design.backgroundImage || selectedImage?.url || customImage;

  return (
    <div className={getThemeClasses()}>
      <h3 className="text-xl font-bold mb-6 text-gray-900">Advanced Design Options</h3>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('templates')}
          className={getTabClasses('templates')}
          style={activeTab === 'templates' ? { backgroundColor: state.design.primaryColor } : {}}
          title="Choose a design template"
        >
          🎨 Templates
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={getTabClasses('colors')}
          style={activeTab === 'colors' ? { backgroundColor: state.design.primaryColor } : {}}
          title="Pick a color scheme"
        >
          🎨 Colors
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={getTabClasses('images')}
          style={activeTab === 'images' ? { backgroundColor: state.design.primaryColor } : {}}
          title="Pick a poll background image"
        >
          🖼️ Choose Image
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={getTabClasses('custom')}
          style={activeTab === 'custom' ? { backgroundColor: state.design.primaryColor } : {}}
          title="Customize your poll design"
        >
          ⚙️ Custom
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && !isLoading && (
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-gray-900">Pick a Design Template</h4>
          {designTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                  title={`Use ${template.name} template`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{template.preview}</span>
                    <div>
                      <h5 className="font-bold text-gray-900">{template.name}</h5>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {template.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-lg font-semibold text-gray-700">No templates found</p>
              <p className="text-sm text-gray-600 mt-2">Try refreshing the page</p>
            </div>
          )}
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && !isLoading && (
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-gray-900">Pick a Color Scheme</h4>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by palette style:</label>
            <div className="flex flex-wrap gap-2">
              {availablePaletteCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedPaletteCategory(category)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    selectedPaletteCategory === category
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={`Show ${category === 'all' ? 'all' : category} palettes`}
                >
                  {category === 'all' ? '✨ All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {filteredPalettes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedPalette === palette.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => handlePaletteSelect(palette)}
                  title={`Use ${palette.name} colors`}
                >
                  <h5 className="font-bold text-gray-900 mb-2">{palette.name}</h5>
                  <p className="text-sm text-gray-600 mb-3">{palette.description}</p>
                  <div className="flex space-x-1">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.colors.primary }}
                      title="Primary color"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.colors.secondary }}
                      title="Secondary color"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.colors.accent }}
                      title="Accent color"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: palette.colors.background }}
                      title="Background color"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-3">🎨</div>
              <p className="text-lg font-semibold text-gray-700">No palettes found for this style</p>
              <p className="text-sm text-gray-600 mt-2">Try a different palette style filter</p>
            </div>
          )}
        </div>
      )}

      {/* Images Tab - Enhanced with Search */}
      {activeTab === 'images' && !isLoading && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Pick a Poll Background Image!</h4>
            
            {/* Search Box */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search images by theme or keyword:
              </label>
              <input
                type="text"
                value={imageSearchTerm}
                onChange={(e) => setImageSearchTerm(e.target.value)}
                placeholder="Try: Christmas, holiday, winter, party, vacation, clothes, chili, chili contest..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            {/* Theme Filter Buttons */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by theme:</label>
              <div className="flex flex-wrap gap-2">
                {availableThemes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      selectedTheme === theme
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={`Show ${theme === 'all' ? 'all' : theme} images`}
                  >
                    {theme === 'all' ? '✨ All' : theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
                {state.design.backgroundImage && (
                  <button
                    onClick={handleClearImage}
                    className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
                    title="Remove background image"
                  >
                    🗑️ Clear Image
                  </button>
                )}
              </div>
            </div>

            {/* Quick one-click chips for common themed polls */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quick filters:</label>
              <div className="flex flex-wrap gap-2">
                {quickImageFilters
                  .filter((theme) => theme === 'all' || availableThemes.includes(theme))
                  .map((theme) => (
                    <button
                      key={`quick-${theme}`}
                      type="button"
                      onClick={() => {
                        setSelectedTheme(theme);
                        if (theme === 'food') {
                          setImageSearchTerm('chili');
                        } else if (imageSearchTerm === 'chili') {
                          setImageSearchTerm('');
                        }
                      }}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        selectedTheme === theme
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200'
                      }`}
                      title={`Quick filter for ${theme}`}
                    >
                      {theme === 'all'
                        ? '✨ All'
                        : theme === 'food'
                          ? '🌶️ Food / Chili'
                          : `${theme.charAt(0).toUpperCase()}${theme.slice(1)}`}
                    </button>
                  ))}
              </div>
            </div>

            {/* Image Grid (show a subset, with option to view all in a modal) */}
            {filteredImages.length > 0 ? (
              <>
                <div className="max-h-96 overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.slice(0, 8).map((image) => (
                      <div
                        key={image.id}
                        className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                          selectedImage?.id === image.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                        }`}
                        onClick={() => handleImageSelect(image)}
                        title={`Use ${image.alt} as background`}
                      >
                        <img
                          src={image.thumbnail}
                          alt={image.alt}
                          className="w-full h-32 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                          <p className="text-xs font-semibold">{image.category}</p>
                        </div>
                        {selectedImage?.id === image.id && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {filteredImages.length > 8 && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAllImagesModal(true)}
                      className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm bg-[#fafaff] text-[#1a1a2e] border border-[#16a34a]/40 shadow-md hover:bg-[#eefcf4] hover:scale-105 transition-all duration-200"
                    >
                      View all {filteredImages.length} images
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-semibold text-gray-700">No images found—try typing a different word.</p>
                <p className="text-sm text-gray-600 mt-2">Try: Christmas, holiday, winter, party, vacation, clothes, chili, or chili contest</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Tab */}
      {activeTab === 'custom' && !isLoading && (
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-gray-900">Customize Your Poll</h4>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Your Own Background Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomImageUpload}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            {customImage && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Your uploaded image:</p>
                <img
                  src={customImage}
                  alt="Custom background"
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Font Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Pick a Font Style</label>
            <div className="flex flex-wrap gap-2">
              {(['sans', 'serif', 'mono'] as const).map((font) => (
                <button
                  key={font}
                  onClick={() => setFontStyle(font)}
                  className={getButtonClasses(state.design.fontStyle === font)}
                  style={getButtonStyle(state.design.fontStyle === font)}
                  title={`Use ${font} font`}
                >
                  {font.charAt(0).toUpperCase() + font.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Pick a Layout Style</label>
            <div className="flex flex-wrap gap-2">
              {(['card', 'list', 'compact'] as const).map((layout) => {
                const layoutMap: Record<string, 'card' | 'list' | 'compact'> = {
                  'card': 'card',
                  'list': 'list',
                  'compact': 'compact',
                  'modern': 'card',
                  'classic': 'list'
                };
                return (
                  <button
                    key={layout}
                    onClick={() => setLayout(layoutMap[layout] || 'card')}
                    className={getButtonClasses(state.design.layout === layout)}
                    style={getButtonStyle(state.design.layout === layout)}
                    title={`Use ${layout} layout`}
                  >
                    {layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal showing all filtered images when requested */}
      {showAllImagesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">
                All image results
              </h4>
              <button
                type="button"
                onClick={() => setShowAllImagesModal(false)}
                className="px-3 py-1 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                    selectedImage?.id === image.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                  }`}
                  onClick={() => handleImageSelect(image)}
                  title={`Use ${image.alt} as background`}
                >
                  <img
                    src={image.thumbnail}
                    alt={image.alt}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                    <p className="text-xs font-semibold">{image.category}</p>
                  </div>
                  {selectedImage?.id === image.id && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Section with Selected Image */}
      {selectedImageUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">Preview Your Poll with the Selected Image Below</h4>
          <div 
            className="p-6 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px] bg-cover bg-center bg-no-repeat relative"
            style={{ 
              backgroundImage: selectedImageUrl ? `url(${selectedImageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
            <div className="relative z-10 text-center">
              <h5 className="text-lg font-bold mb-2 text-white drop-shadow-lg">Sample Poll Question</h5>
              <div className="space-y-2">
                <div className="px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-900 font-semibold">
                  Option 1
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-900 font-semibold">
                  Option 2
                </div>
              </div>
            </div>
          </div>
          {selectedImage && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Selected: {selectedImage.alt} ({selectedImage.category})
            </p>
          )}
        </div>
      )}

      {/* Default Preview (when no image selected) */}
      {!selectedImageUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Preview</h4>
          <div className="p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <h5 className="text-lg font-bold mb-2 text-gray-900">Sample Poll Question</h5>
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
      )}
    </div>
  );
};

export default AdvancedDesignOptions;
