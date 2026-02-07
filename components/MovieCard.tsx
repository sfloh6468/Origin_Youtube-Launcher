
import React, { useEffect, useRef } from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isFocused: boolean;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isFocused, onClick, onDelete, onEdit }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [isFocused]);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      ref={cardRef}
      className={`flex-none w-72 md:w-96 group cursor-pointer transition-all duration-300 ${isFocused ? 'scale-110 z-30' : 'scale-100'}`}
      onClick={onClick}
    >
      <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 bg-zinc-900 ${
        isFocused ? 'ring-[6px] ring-white shadow-[0_0_40px_rgba(255,255,255,0.2)]' : 'ring-2 ring-zinc-800'
      }`}>
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className={`w-full h-full object-cover transition-all duration-500 ${isFocused ? 'brightness-110' : 'brightness-75'}`}
        />
        
        {/* Action Buttons Overlay */}
        {isFocused && (
          <div className="absolute top-4 right-4 flex gap-2 z-40">
            <button 
              onClick={(e) => handleAction(e, onEdit)}
              className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg transition-transform hover:scale-110"
              title="Edit Movie"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={(e) => handleAction(e, onDelete)}
              className="p-2 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-lg transition-transform hover:scale-110"
              title="Delete Movie"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}

        {isFocused && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Selected</span>
            </div>
            <h4 className="font-black text-xl text-white truncate">{movie.title}</h4>
          </div>
        )}
      </div>
      
      {!isFocused && (
        <div className="mt-4 px-2">
          <h4 className="font-bold text-zinc-300 truncate">{movie.title}</h4>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span>{movie.year || '2024'}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>{movie.category}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
