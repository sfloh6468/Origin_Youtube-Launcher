
import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface ShelfProps {
  title: string;
  movies: Movie[];
  focusedMovieId: string | null;
  onMovieClick: (movie: Movie) => void;
  onDelete: (id: string) => void;
  onEdit: (movie: Movie) => void;
}

const Shelf: React.FC<ShelfProps> = ({ title, movies, focusedMovieId, onMovieClick, onDelete, onEdit }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl md:text-3xl font-black px-4 md:px-0 text-zinc-100 tracking-tight flex items-center gap-3">
        {title}
        <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
      </h3>
      <div className="flex overflow-x-auto space-x-8 pb-8 px-4 md:px-0 scroll-smooth no-scrollbar">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            isFocused={focusedMovieId === movie.id}
            onClick={() => onMovieClick(movie)}
            onDelete={() => onDelete(movie.id)}
            onEdit={() => onEdit(movie)}
          />
        ))}
      </div>
    </div>
  );
};

export default Shelf;
