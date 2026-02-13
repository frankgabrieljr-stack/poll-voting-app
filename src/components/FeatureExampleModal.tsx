import React, { useEffect } from 'react';

interface FeatureExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: {
    icon: string;
    title: string;
    description: string;
  };
}

const FeatureExampleModal: React.FC<FeatureExampleModalProps> = ({ isOpen, onClose, feature }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Example templates for each feature
  const getExampleContent = () => {
    switch (feature.title) {
      case 'Advanced Design':
        return {
          title: 'Sample Poll with Custom Design',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#16a34a] to-[#34d399] rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-3xl font-bold mb-4">What's your favorite design style?</h3>
                <div className="space-y-3 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all cursor-pointer">
                    <span className="font-semibold">🎨 Modern Minimalist</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all cursor-pointer">
                    <span className="font-semibold">🌈 Bold & Colorful</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all cursor-pointer">
                    <span className="font-semibold">📐 Geometric Patterns</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all cursor-pointer">
                    <span className="font-semibold">🌿 Nature-Inspired</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#fafaff] rounded-xl p-6 border border-[#16a34a]/20">
                <h4 className="font-bold text-[#1a1a2e] mb-3">Design Features:</h4>
                <ul className="space-y-2 text-[#4a4a6a]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span>
                    Custom color palettes (Teal, Violet, Coral)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span>
                    Professional templates library
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span>
                    Background image support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span>
                    Custom fonts and typography
                  </li>
                </ul>
              </div>
            </div>
          ),
        };

      case 'Real-time Analytics':
        return {
          title: 'Live Analytics Dashboard',
          content: (
            <div className="space-y-6">
              <div className="bg-[#fafaff] rounded-2xl p-8 border border-[#16a34a]/20 shadow-xl">
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">Poll: "Best Team Building Activity"</h3>
                
                {/* Vote Counts */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#16a34a] to-[#34d399] rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-bold">127</div>
                    <div className="text-sm opacity-90">Total Votes</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#34d399] to-[#6ee7b7] rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-bold">4</div>
                    <div className="text-sm opacity-90">Active Choices</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-[#1a1a2e]">🏖️ Beach Day</span>
                      <span className="text-[#4a4a6a] font-bold">45% (57 votes)</span>
                    </div>
                    <div className="h-4 bg-[#16a34a]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#16a34a] to-[#34d399] rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-[#1a1a2e]">🎮 Game Night</span>
                      <span className="text-[#4a4a6a] font-bold">32% (41 votes)</span>
                    </div>
                    <div className="h-4 bg-[#16a34a]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#16a34a] to-[#34d399] rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-[#1a1a2e]">🍕 Pizza Party</span>
                      <span className="text-[#4a4a6a] font-bold">18% (23 votes)</span>
                    </div>
                    <div className="h-4 bg-[#16a34a]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#16a34a] to-[#34d399] rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-[#1a1a2e]">🎨 Art Workshop</span>
                      <span className="text-[#4a4a6a] font-bold">5% (6 votes)</span>
                    </div>
                    <div className="h-4 bg-[#16a34a]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#16a34a] to-[#34d399] rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#fafaff] rounded-xl p-6 border border-[#16a34a]/20">
                <h4 className="font-bold text-[#1a1a2e] mb-3">Analytics Features:</h4>
                <ul className="space-y-2 text-[#4a4a6a]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#34d399]">✓</span>
                    Real-time vote tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#34d399]">✓</span>
                    Visual progress bars and charts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#34d399]">✓</span>
                    Percentage breakdowns
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#34d399]">✓</span>
                    Export data anytime
                  </li>
                </ul>
              </div>
            </div>
          ),
        };

      case 'Multiple Workspaces':
        return {
          title: 'Workspace Organization',
          content: (
            <div className="space-y-6">
              <div className="bg-[#fafaff] rounded-2xl p-8 border border-[#16a34a]/20 shadow-xl">
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">Your Workspaces</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Workspace 1 */}
                  <div className="bg-gradient-to-br from-[#16a34a] to-[#34d399] rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg">🎯 Marketing Team</h4>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">12 polls</span>
                    </div>
                    <p className="text-sm opacity-90 mb-3">Campaign feedback & surveys</p>
                    <div className="flex gap-2">
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">Active</span>
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">Shared</span>
                    </div>
                  </div>

                  {/* Workspace 2 */}
                  <div className="bg-gradient-to-br from-[#34d399] to-[#6ee7b7] rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg">👥 Product Team</h4>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">8 polls</span>
                    </div>
                    <p className="text-sm opacity-90 mb-3">Feature requests & priorities</p>
                    <div className="flex gap-2">
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">Active</span>
                    </div>
                  </div>

                  {/* Workspace 3 */}
                  <div className="bg-gradient-to-br from-[#16a34a] to-[#4ade80] rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg">🎓 Education</h4>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">15 polls</span>
                    </div>
                    <p className="text-sm opacity-90 mb-3">Student feedback & quizzes</p>
                    <div className="flex gap-2">
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">Active</span>
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">Public</span>
                    </div>
                  </div>

                  {/* Workspace 4 */}
                  <div className="bg-gradient-to-br from-[#15803d] to-[#34d399] rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg">🏠 Personal</h4>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">5 polls</span>
                    </div>
                    <p className="text-sm opacity-90 mb-3">Family decisions & events</p>
                    <div className="flex gap-2">
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">Private</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#fafaff] rounded-xl p-6 border border-[#16a34a]/20">
                <h4 className="font-bold text-[#1a1a2e] mb-3">Workspace Features:</h4>
                <ul className="space-y-2 text-[#4a4a6a]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span>
                    Organize polls by project or team
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span>
                    Share workspaces with collaborators
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span>
                    Set permissions and access levels
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span>
                    Quick search and filtering
                  </li>
                </ul>
              </div>
            </div>
          ),
        };

      case 'Export & Share':
        return {
          title: 'Sharing & Export Tools',
          content: (
            <div className="space-y-6">
              <div className="bg-[#fafaff] rounded-2xl p-8 border border-[#16a34a]/20 shadow-xl">
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">Share Your Poll</h3>
                
                {/* Share Link */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">Public Share Link:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="pollvote.pro/p/abc123xyz"
                      className="flex-1 px-4 py-3 rounded-lg border-2 border-[#16a34a]/20 bg-white text-[#1a1a2e] font-mono text-sm"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-[#16a34a] to-[#34d399] text-white rounded-lg font-bold hover:from-[#22c55e] hover:to-[#6ee7b7] transition-all shadow-lg">
                      Copy
                    </button>
                  </div>
                </div>

                {/* Export Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button className="bg-gradient-to-br from-[#16a34a] to-[#34d399] rounded-xl p-6 text-white hover:scale-105 transition-all shadow-lg">
                    <div className="text-4xl mb-3">📊</div>
                    <div className="font-bold">CSV Export</div>
                    <div className="text-sm opacity-90 mt-1">Spreadsheet data</div>
                  </button>
                  <button className="bg-gradient-to-br from-[#34d399] to-[#6ee7b7] rounded-xl p-6 text-white hover:scale-105 transition-all shadow-lg">
                    <div className="text-4xl mb-3">📄</div>
                    <div className="font-bold">JSON Export</div>
                    <div className="text-sm opacity-90 mt-1">Raw data format</div>
                  </button>
                  <button className="bg-gradient-to-br from-[#15803d] to-[#34d399] rounded-xl p-6 text-white hover:scale-105 transition-all shadow-lg">
                    <div className="text-4xl mb-3">🖼️</div>
                    <div className="font-bold">Image Export</div>
                    <div className="text-sm opacity-90 mt-1">PNG/SVG charts</div>
                  </button>
                </div>

                {/* Share Options */}
                <div className="bg-gradient-to-br from-[#16a34a]/10 to-[#34d399]/10 rounded-xl p-6 border border-[#16a34a]/20">
                  <h4 className="font-bold text-[#1a1a2e] mb-4">Share via:</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-white rounded-lg border border-[#16a34a]/20 hover:bg-[#eefcf4] transition-all text-[#1a1a2e] font-semibold">
                      📧 Email
                    </button>
                    <button className="px-4 py-2 bg-white rounded-lg border border-[#16a34a]/20 hover:bg-[#eefcf4] transition-all text-[#1a1a2e] font-semibold">
                      💬 Slack
                    </button>
                    <button className="px-4 py-2 bg-white rounded-lg border border-[#16a34a]/20 hover:bg-[#eefcf4] transition-all text-[#1a1a2e] font-semibold">
                      🐦 Twitter
                    </button>
                    <button className="px-4 py-2 bg-white rounded-lg border border-[#16a34a]/20 hover:bg-[#eefcf4] transition-all text-[#1a1a2e] font-semibold">
                      📱 WhatsApp
                    </button>
                    <button className="px-4 py-2 bg-white rounded-lg border border-[#16a34a]/20 hover:bg-[#eefcf4] transition-all text-[#1a1a2e] font-semibold">
                      📋 Copy Link
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-[#fafaff] rounded-xl p-6 border border-[#16a34a]/20">
                <h4 className="font-bold text-[#1a1a2e] mb-3">Sharing Features:</h4>
                <ul className="space-y-2 text-[#4a4a6a]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#34d399]">✓</span>
                    One-click shareable links
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#34d399]">✓</span>
                    Multiple export formats (CSV, JSON, Image)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#34d399]">✓</span>
                    Direct integration with popular platforms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#34d399]">✓</span>
                    QR codes for easy access
                  </li>
                </ul>
              </div>
            </div>
          ),
        };

      default:
        return {
          title: 'Feature Example',
          content: <div className="text-[#1a1a2e]">Example content</div>,
        };
    }
  };

  const example = getExampleContent();

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-[#fafaff] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#16a34a]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#16a34a] to-[#34d399] text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{feature.icon}</span>
            <div>
              <h2 id="modal-title" className="text-2xl font-bold">{example.title}</h2>
              <p className="text-sm opacity-90">{feature.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all text-2xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {example.content}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-[#fafaff] border-t border-[#16a34a]/20 p-6 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-[#16a34a] to-[#34d399] text-white rounded-xl font-bold hover:from-[#22c55e] hover:to-[#6ee7b7] transition-all shadow-lg"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureExampleModal;

