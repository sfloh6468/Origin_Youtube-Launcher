
import React, { useEffect, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onClose }) => {
  const [videoId, setVideoId] = useState<string>('');

  useEffect(() => {
    let id = '';
    try {
      if (url.includes('v=')) {
        id = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        id = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('embed/')) {
        id = url.split('embed/')[1].split('?')[0];
      }
    } catch (e) {
      console.error("URL Parsing failed", e);
    }
    setVideoId(id);
  }, [url]);

  // Error 153 is often caused by 'origin' mismatches in non-standard environments like TV WebViews.
  // We use the most basic embed URL possible and suppress the referrer to bypass domain blocks.
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3`;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-8 left-8 right-8 z-[210] flex justify-between items-center pointer-events-none">
        <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 pointer-events-auto">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Cinema Experience</p>
          <p className="text-white text-sm font-bold truncate max-w-xs">Press Back to Exit</p>
        </div>
        
        <div className="flex gap-4 pointer-events-auto">
          <button 
            onClick={() => window.open(url, "_blank")}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black text-xs transition-all shadow-xl shadow-red-600/20"
          >
            LAUNCH APP
          </button>
          
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all border border-white/10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      
      {videoId ? (
        <iframe 
          src={embedUrl}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer"
          title="YouTube Video Player"
        />
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 font-black tracking-widest uppercase text-xs">Loading Content...</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
