
import React, { useEffect, useRef } from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isFocused: boolean;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isFocused, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [isFocused]);

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
        
        {isFocused && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
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
