
import React from 'react';
import { CATEGORIES } from '../types';

interface SidebarProps {
  onAddClick: () => void;
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  isFocused: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddClick, activeCategory, onCategorySelect, isFocused }) => {
  return (
    <aside className={`w-20 md:w-64 bg-zinc-950/80 backdrop-blur-xl border-r transition-colors duration-300 flex flex-col items-center py-8 z-50 ${isFocused ? 'border-blue-500 bg-zinc-900' : 'border-zinc-800/50'}`}>
      <div className="mb-12">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent hidden md:block">
          CINESTREAM
        </h1>
        <div className="w-8 h-8 bg-blue-500 rounded-lg md:hidden" />
      </div>

      <nav className="flex-1 w-full space-y-2 px-4">
        <button 
          className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
            activeCategory === 'All' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="hidden md:inline font-medium">Home</span>
        </button>

        <div className="pt-4 pb-2 px-4 text-xs font-bold text-zinc-500 uppercase tracking-widest hidden md:block">
          Categories
        </div>
        
        {CATEGORIES.slice(0, 4).map(cat => (
          <button 
            key={cat}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
              activeCategory === cat ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeCategory === cat ? 'bg-blue-500' : 'bg-zinc-700'}`} />
            <span className="hidden md:inline font-medium">{cat}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 w-full">
        <button 
          onClick={onAddClick}
          className={`w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
            isFocused ? 'bg-blue-500 scale-105 shadow-xl shadow-blue-500/40 ring-4 ring-white' : 'bg-blue-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          <span className="hidden md:inline">Add Movie</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
