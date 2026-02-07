
import React from 'react';

interface SidebarProps {
  onAddClick: () => void;
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  isFocused: boolean;
  focusedIndex: number;
  categories: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onAddClick, activeCategory, onCategorySelect, isFocused, focusedIndex, categories }) => {
  return (
    <aside className={`w-20 md:w-64 bg-zinc-950/90 backdrop-blur-3xl border-r transition-all duration-300 flex flex-col items-center py-8 z-50 ${isFocused ? 'border-blue-500 bg-zinc-900 shadow-[30px_0_60px_rgba(0,0,0,0.8)]' : 'border-zinc-900'}`}>
      <div className="mb-10 px-6 w-full">
        <h1 className="text-xl font-black bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent hidden md:block tracking-tight">
          CINESTREAM <span className="text-blue-500">TV</span>
        </h1>
      </div>

      <nav className="flex-1 w-full space-y-1 px-4 overflow-y-auto no-scrollbar">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat;
          const isItemFocused = isFocused && focusedIndex === idx;
          
          return (
            <button 
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center gap-4 group ${
                isItemFocused 
                  ? 'bg-white text-black scale-105 shadow-xl shadow-white/10' 
                  : isActive 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {cat === 'All' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              ) : (
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-blue-400 scale-150' : 'bg-zinc-700'}`} />
              )}
              <span className="hidden md:inline font-bold text-sm tracking-tight truncate">{cat}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 w-full mt-6">
        <button 
          onClick={onAddClick}
          className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${
            isFocused && focusedIndex === categories.length
              ? 'bg-blue-500 text-white scale-110 shadow-2xl shadow-blue-500/40 ring-4 ring-white'
              : 'bg-zinc-900 text-zinc-500 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          <span className="hidden md:inline text-xs tracking-widest">ADD NEW</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
