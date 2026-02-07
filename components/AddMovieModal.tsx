
import React, { useState } from 'react';
import { Movie, CATEGORIES } from '../types';
import { autoFillMovieData } from '../geminiService';

interface AddMovieModalProps {
  onClose: () => void;
  onSubmit: (movie: Movie) => void;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    imageUrl: '',
    description: '',
    category: CATEGORIES[0] as string
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutoFill = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    const data = await autoFillMovieData(formData.title);
    if (data) {
      setFormData(prev => ({
        ...prev,
        description: data.description || prev.description,
        category: CATEGORIES.includes(data.category as any) ? data.category : prev.category
      }));
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    const newMovie: Movie = {
      id: Date.now().toString(),
      ...formData,
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.title}/1280/720`,
      year: '2024',
      rating: 'New'
    };

    onSubmit(newMovie);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">Add New Movie</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400">Movie Title</label>
              <div className="relative">
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="e.g. Interstellar"
                />
                <button 
                  type="button"
                  onClick={handleAutoFill}
                  disabled={!formData.title || isGenerating}
                  className="absolute right-2 top-2 p-1.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-xs font-bold rounded-lg transition-all"
                >
                  {isGenerating ? '...' : 'Auto-Fill ✨'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400">YouTube URL</label>
              <input 
                required
                type="url" 
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400">Poster Image URL (Optional)</label>
              <input 
                type="url" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400">Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              placeholder="A brief overview of the content..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-500/20"
            >
              Add to Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;
