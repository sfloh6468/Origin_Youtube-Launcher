
import React, { useState, useEffect, useRef } from 'react';
import { Movie, DEFAULT_CATEGORIES, FocusSection } from './types';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Shelf from './components/Shelf';
import AddMovieModal from './components/AddMovieModal';
import VideoPlayer from './components/VideoPlayer';

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
  }
];

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinestream_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });
  
  const [focusSection, setFocusSection] = useState<FocusSection>('shelves');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [sidebarIndex, setSidebarIndex] = useState(0); // For remote navigation in sidebar
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  
  const mainRef = useRef<HTMLDivElement>(null);

  const allCategories = Array.from(new Set([
    'All',
    ...DEFAULT_CATEGORIES,
    ...movies.map(m => m.category)
  ])).sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));

  useEffect(() => {
    localStorage.setItem('cinestream_movies', JSON.stringify(movies));
  }, [movies]);

  const filteredMovies = activeCategory === 'All' 
    ? movies 
    : movies.filter(m => m.category === activeCategory);

  const currentMovie = filteredMovies[focusedIndex % (filteredMovies.length || 1)] || filteredMovies[0];

  const handleAddOrEditMovie = (movieData: Movie) => {
    if (editingMovie) {
      setMovies(prev => prev.map(m => m.id === editingMovie.id ? movieData : m));
    } else {
      setMovies(prev => [movieData, ...prev]);
    }
    closeModal();
  };

  const handleDeleteMovie = (id: string) => {
    if (window.confirm('Delete this entry?')) {
      setMovies(prev => prev.filter(m => m.id !== id));
      setFocusedIndex(0);
    }
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
    setFocusSection('modal');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
    setFocusSection('shelves');
  };

  const playMovie = (movie: Movie) => {
    setPlayingMovie(movie);
    setFocusSection('player');
  };

  const resetToHome = () => {
    setActiveCategory('All');
    setFocusedIndex(0);
    setFocusSection('shelves');
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (playingMovie) { setPlayingMovie(null); setFocusSection('hero'); e.preventDefault(); }
        else if (isModalOpen) { closeModal(); e.preventDefault(); }
        else if (focusSection !== 'sidebar') { setFocusSection('sidebar'); e.preventDefault(); }
        return;
      }

      if (isModalOpen || playingMovie) return;

      switch (e.key) {
        case 'ArrowRight':
          if (focusSection === 'sidebar') setFocusSection('hero');
          else if (focusSection === 'shelves') setFocusedIndex(p => Math.min(p + 1, filteredMovies.length - 1));
          break;
        case 'ArrowLeft':
          if (focusSection === 'shelves' && focusedIndex === 0) setFocusSection('sidebar');
          else if (focusSection === 'shelves') setFocusedIndex(p => Math.max(p - 1, 0));
          else if (focusSection === 'hero') setFocusSection('sidebar');
          break;
        case 'ArrowDown':
          if (focusSection === 'sidebar') setSidebarIndex(p => Math.min(p + allCategories.length, allCategories.length)); // +1 for Add button
          else if (focusSection === 'hero') { setFocusSection('shelves'); setFocusedIndex(0); }
          break;
        case 'ArrowUp':
          if (focusSection === 'sidebar') setSidebarIndex(p => Math.max(p - 1, 0));
          else if (focusSection === 'shelves') { setFocusSection('hero'); mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }
          break;
        case 'Enter':
          if (focusSection === 'sidebar') {
            if (sidebarIndex === allCategories.length) { // Add Button
              setEditingMovie(null); setIsModalOpen(true); setFocusSection('modal');
            } else {
              const cat = allCategories[sidebarIndex];
              if (cat === 'All') resetToHome(); else { setActiveCategory(cat); setFocusedIndex(0); setFocusSection('hero'); }
            }
          } else if ((focusSection === 'hero' || focusSection === 'shelves') && currentMovie) {
            playMovie(currentMovie);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusSection, focusedIndex, sidebarIndex, filteredMovies, allCategories, isModalOpen, currentMovie, playingMovie]);

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden relative">
      <Sidebar 
        onAddClick={() => { setEditingMovie(null); setIsModalOpen(true); setFocusSection('modal'); }} 
        activeCategory={activeCategory}
        onCategorySelect={(cat) => { if (cat === 'All') resetToHome(); else { setActiveCategory(cat); setFocusedIndex(0); } }}
        isFocused={focusSection === 'sidebar'}
        focusedIndex={sidebarIndex}
        categories={allCategories}
      />
      
      <main ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar relative">
        {filteredMovies.length > 0 && (
          <Hero movie={currentMovie} isFocused={focusSection === 'hero'} onPlay={() => playMovie(currentMovie)} />
        )}
        
        <div className="px-12 -mt-24 pb-20 relative z-20 space-y-12">
          {filteredMovies.length > 0 ? (
            <Shelf 
              title={activeCategory === 'All' ? "My Collection" : activeCategory}
              movies={filteredMovies}
              focusedMovieId={focusSection === 'shelves' ? filteredMovies[focusedIndex]?.id : null}
              onMovieClick={playMovie}
              onDelete={handleDeleteMovie}
              onEdit={openEditModal}
            />
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-900 rounded-[3rem] mt-32">
              <p className="text-xl font-black uppercase tracking-tighter">Category Empty</p>
              <button onClick={resetToHome} className="mt-4 px-6 py-2 bg-blue-600/10 text-blue-500 rounded-full font-bold">Return Home</button>
            </div>
          )}
        </div>
      </main>

      {playingMovie && <VideoPlayer url={playingMovie.url} onClose={() => { setPlayingMovie(null); setFocusSection('hero'); }} />}
      {isModalOpen && <AddMovieModal initialData={editingMovie || undefined} onClose={closeModal} onSubmit={handleAddOrEditMovie} />}
    </div>
  );
};

export default App;
