
import React, { useState, useEffect } from 'react';
import { Movie, DEFAULT_CATEGORIES } from '../types';
import { autoFillMovieData } from '../geminiService';

interface AddMovieModalProps {
  initialData?: Movie;
  onClose: () => void;
  onSubmit: (movie: Movie) => void;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({ initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    url: initialData?.url || '',
    imageUrl: initialData?.imageUrl || '',
    description: initialData?.description || '',
    category: initialData?.category || DEFAULT_CATEGORIES[0],
    customCategory: ''
  });
  const [showCustomCat, setShowCustomCat] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      const isCustom = !DEFAULT_CATEGORIES.includes(initialData.category as any);
      setFormData({
        ...formData,
        title: initialData.title,
        url: initialData.url,
        imageUrl: initialData.imageUrl,
        description: initialData.description,
        category: isCustom ? 'Other' : initialData.category,
        customCategory: isCustom ? initialData.category : ''
      });
      setShowCustomCat(isCustom);
    }
  }, [initialData]);

  const handleAutoFill = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    const data = await autoFillMovieData(formData.title);
    if (data) {
      setFormData(prev => ({
        ...prev,
        description: data.description || prev.description,
        category: DEFAULT_CATEGORIES.includes(data.category as any) ? data.category : prev.category
      }));
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;

    const movie: Movie = {
      id: initialData?.id || Date.now().toString(),
      title: formData.title,
      url: formData.url,
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.title}/1280/720`,
      description: formData.description,
      category: finalCategory || 'Uncategorized',
      year: initialData?.year || new Date().getFullYear().toString(),
      rating: initialData?.rating || 'New'
    };

    onSubmit(movie);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-zinc-800/50 animate-in fade-in zoom-in duration-300">
        <div className="px-10 py-8 bg-zinc-800/30 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              {initialData ? 'Edit Movie' : 'New Entry'}
            </h2>
            <p className="text-zinc-500 text-sm font-medium mt-1">Configure your content details below</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-zinc-700/50 rounded-2xl transition-all text-zinc-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Movie Title</label>
              <div className="relative">
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 rounded-2xl px-5 py-4 focus:border-blue-500 focus:bg-zinc-800 focus:outline-none transition-all font-bold"
                  placeholder="e.g. Olympics Highlights"
                />
                <button 
                  type="button"
                  onClick={handleAutoFill}
                  disabled={!formData.title || isGenerating}
                  className="absolute right-3 top-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-[10px] font-black rounded-lg transition-all text-white uppercase tracking-tighter"
                >
                  {isGenerating ? '...' : 'AI Fill ✨'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">YouTube URL</label>
              <input 
                required
                type="url" 
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 rounded-2xl px-5 py-4 focus:border-blue-500 focus:bg-zinc-800 focus:outline-none transition-all font-bold"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Category</label>
              <div className="space-y-3">
                <select 
                  value={formData.category}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({...formData, category: val});
                    setShowCustomCat(val === 'Other');
                  }}
                  className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 rounded-2xl px-5 py-4 focus:border-blue-500 focus:outline-none transition-all font-bold appearance-none cursor-pointer"
                >
                  {DEFAULT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Other">Other...</option>
                </select>
                
                {showCustomCat && (
                  <input 
                    type="text"
                    required
                    value={formData.customCategory}
                    onChange={(e) => setFormData({...formData, customCategory: e.target.value})}
                    className="w-full bg-zinc-800/50 border-2 border-blue-500/50 rounded-2xl px-5 py-4 focus:border-blue-500 focus:outline-none transition-all font-bold animate-in slide-in-from-top-2"
                    placeholder="Enter custom category (e.g. Sports)"
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Poster URL (Optional)</label>
              <input 
                type="url" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 rounded-2xl px-5 py-4 focus:border-blue-500 focus:outline-none transition-all font-bold"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 rounded-2xl px-5 py-4 focus:border-blue-500 focus:outline-none transition-all font-medium resize-none"
              placeholder="Tell us about this video..."
            />
          </div>

          <div className="pt-6 flex gap-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-5 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-[1.5rem] transition-all"
            >
              CANCEL
            </button>
            <button 
              type="submit"
              className="flex-[2] px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[1.5rem] transition-all shadow-2xl shadow-blue-600/30"
            >
              {initialData ? 'SAVE CHANGES' : 'CREATE ENTRY'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;
