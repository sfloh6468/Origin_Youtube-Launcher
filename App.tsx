
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, CATEGORIES, FocusSection } from './types';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Shelf from './components/Shelf';
import AddMovieModal from './components/AddMovieModal';

const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Inception',
    url: 'https://www.youtube.com/watch?v=8hP9D6kZseM',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1200&auto=format&fit=crop',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    category: 'Sci-Fi',
    year: '2010',
    rating: '8.8'
  },
  {
    id: '2',
    title: 'The Batman',
    url: 'https://www.youtube.com/watch?v=mqqft22n0Sc',
    imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop',
    description: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
    category: 'Action',
    year: '2022',
    rating: '7.8'
  },
  {
    id: '3',
    title: 'Interstellar',
    url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
    description: 'When Earth becomes uninhabitable, a team of researchers journeys to find a new planet.',
    category: 'Sci-Fi',
    year: '2014',
    rating: '8.7'
  }
];

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinestream_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });
  
  const [focusSection, setFocusSection] = useState<FocusSection>('shelves');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('cinestream_movies', JSON.stringify(movies));
  }, [movies]);

  const handleAddMovie = (newMovie: Movie) => {
    setMovies(prev => [newMovie, ...prev]);
    setIsModalOpen(false);
    setFocusSection('shelves');
    setFocusedIndex(0);
  };

  const currentMovie = movies[focusedIndex % movies.length] || movies[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Remote Back Button is usually Escape or Backspace
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (isModalOpen) {
          setIsModalOpen(false);
          setFocusSection('sidebar');
          e.preventDefault();
        } else if (focusSection !== 'sidebar') {
          setFocusSection('sidebar');
          e.preventDefault();
        }
        return;
      }

      if (isModalOpen) return;

      switch (e.key) {
        case 'ArrowRight':
          if (focusSection === 'sidebar') setFocusSection('hero');
          else if (focusSection === 'shelves') setFocusedIndex(prev => Math.min(prev + 1, movies.length - 1));
          break;
        case 'ArrowLeft':
          if (focusSection === 'shelves' && focusedIndex === 0) setFocusSection('sidebar');
          else if (focusSection === 'shelves') setFocusedIndex(prev => Math.max(prev - 1, 0));
          else if (focusSection === 'hero') setFocusSection('sidebar');
          break;
        case 'ArrowDown':
          if (focusSection === 'hero') {
            setFocusSection('shelves');
            setFocusedIndex(0);
          }
          break;
        case 'ArrowUp':
          if (focusSection === 'shelves') setFocusSection('hero');
          break;
        case 'Enter':
          if (focusSection === 'hero' || focusSection === 'shelves') {
            // Launching YouTube
            window.location.href = currentMovie.url;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusSection, focusedIndex, movies, isModalOpen, currentMovie]);

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden relative">
      <Sidebar 
        onAddClick={() => {
          setIsModalOpen(true);
          setFocusSection('modal');
        }} 
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        isFocused={focusSection === 'sidebar'}
      />
      
      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar">
        <Hero 
          movie={currentMovie} 
          isFocused={focusSection === 'hero'}
          onPlay={() => window.location.href = currentMovie.url} 
        />
        
        <div className="px-12 -mt-24 pb-20 relative z-20 space-y-12">
          <Shelf 
            title="My Collection"
            movies={movies}
            focusedMovieId={focusSection === 'shelves' ? movies[focusedIndex]?.id : null}
            onMovieClick={(movie) => window.location.href = movie.url}
          />
        </div>
      </main>

      {isModalOpen && (
        <AddMovieModal 
          onClose={() => {
            setIsModalOpen(false);
            setFocusSection('sidebar');
          }} 
          onSubmit={handleAddMovie} 
        />
      )}
    </div>
  );
};

export default App;
