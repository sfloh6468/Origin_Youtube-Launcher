
import React from 'react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie;
  isFocused: boolean;
  onPlay: () => void;
}

const Hero: React.FC<HeroProps> = ({ movie, isFocused, onPlay }) => {
  if (!movie) return null;

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image with Gradients */}
      <div className="absolute inset-0">
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${isFocused ? 'scale-110 brightness-110' : 'scale-100 brightness-75'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-24 max-w-4xl space-y-6 transition-transform duration-500">
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="px-3 py-1 bg-red-600 text-white rounded text-[10px] uppercase tracking-widest">YouTube</span>
          <span className="text-zinc-300">{movie.year || '2024'}</span>
          <span className="text-zinc-300">{movie.category}</span>
        </div>

        <h2 className={`text-6xl md:text-8xl font-black tracking-tighter leading-none transition-all duration-500 ${isFocused ? 'translate-x-4 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]' : 'text-zinc-300'}`}>
          {movie.title}
        </h2>

        <p className="text-xl md:text-2xl text-zinc-300/80 max-w-2xl line-clamp-3 leading-relaxed drop-shadow">
          {movie.description}
        </p>

        <div className="flex gap-6 pt-4">
          <button 
            onClick={onPlay}
            className={`group px-10 py-5 font-black rounded-2xl flex items-center gap-3 transition-all duration-300 ${
              isFocused ? 'bg-white text-black scale-110 shadow-[0_0_50px_rgba(255,255,255,0.5)] ring-4 ring-blue-500' : 'bg-white/10 text-white backdrop-blur-md'
            }`}
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            PLAY
          </button>
          <button className="px-10 py-5 bg-zinc-800/50 backdrop-blur text-zinc-300 font-bold rounded-2xl transition-all hover:bg-zinc-700">
            DETAILS
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
