import React, { useState } from 'react';
import { useWorkspaceManager } from '../context/WorkspaceManagerContext';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({ isOpen, onClose }) => {
  const { createWorkspace, state } = useWorkspaceManager();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8f4eff');
  const [icon, setIcon] = useState('📊');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const icons = ['📊', '🎯', '💼', '🎨', '🚀', '📝', '🏠', '👥', '⭐', '🔥'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    setLoading(true);
    try {
      await createWorkspace(name.trim(), description.trim() || undefined, color, icon);
      // Reset form
      setName('');
      setDescription('');
      setColor('#8f4eff');
      setIcon('📊');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#fafaff] rounded-2xl shadow-2xl max-w-md w-full border border-[#8f4eff]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Create New Workspace</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#8f4eff]/10 hover:bg-[#8f4eff]/20 flex items-center justify-center transition-all text-[#8f4eff] font-bold"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                Workspace Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-[#8f4eff]/20 focus:border-[#8f4eff] focus:outline-none text-[#1a1a2e]"
                placeholder="e.g., Marketing Team"
                style={{ color: '#1a1a1a', fontSize: '16px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#8f4eff]/20 focus:border-[#8f4eff] focus:outline-none text-[#1a1a2e]"
                placeholder="Describe this workspace..."
                rows={3}
                style={{ color: '#1a1a1a', fontSize: '16px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-12 rounded-lg border-2 border-[#8f4eff]/20 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {icons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                      icon === ic
                        ? 'border-[#8f4eff] bg-[#8f4eff]/10 scale-110'
                        : 'border-[#8f4eff]/20 hover:border-[#8f4eff]/40'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] text-white rounded-lg font-bold hover:from-[#a366ff] hover:to-[#2ef9d8] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Creating...' : 'Create Workspace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;

