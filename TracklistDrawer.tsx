import React, { useState } from 'react';
import { X, Play, Music, Film, Calendar, Search, Heart } from 'lucide-react';
import { Track } from '../types';
import { NOSTALGIA_TRACKS } from './tracks';

interface TracklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
  favorites: string[];
  onToggleFavorite: (trackId: string) => void;
}

export const TracklistDrawer: React.FC<TracklistDrawerProps> = ({
  isOpen,
  onClose,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTracks = NOSTALGIA_TRACKS.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      (t.movie && t.movie.toLowerCase().includes(q)) ||
      (t.year && t.year.includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      {/* Drawer Container */}
      <div className="w-full max-w-md bg-[#FBF8F1] h-full shadow-2xl flex flex-col border-l border-[#2C221E]/30 p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2C221E]/20">
          <div>
            <span className="font-radio-mono text-[10px] uppercase font-bold text-amber-900 tracking-widest">
              AWAARA RADIO LINEUP
            </span>
            <h3 className="text-2xl font-bold font-serif-editorial text-[#1A120E]">
              90s Track Catalog
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-[#F4EEE0] border border-[#2C221E]/20 text-[#2C221E] hover:bg-[#EBE2D0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="my-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2C221E]/50" />
          <input
            type="text"
            placeholder="Search song, artist, or movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F4EEE0] border border-[#2C221E]/20 rounded-md font-sans text-xs text-[#2C221E] focus:outline-none focus:border-[#2C221E]"
          />
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredTracks.map((track, idx) => {
            const originalIndex = NOSTALGIA_TRACKS.findIndex((t) => t.id === track.id);
            const isCurrent = originalIndex === currentTrackIndex;
            const isFav = favorites.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => {
                  onSelectTrack(originalIndex);
                  onClose();
                }}
                className={`group p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#2C221E] text-[#FBF8F1] border-[#2C221E] shadow-sm'
                    : 'bg-[#F4EEE0] text-[#2C221E] border-[#2C221E]/15 hover:border-[#2C221E]/40 hover:bg-[#EBE2D0]'
                }`}
              >
                {/* Track Number / Play Indicator */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-radio-mono text-xs font-bold ${
                      isCurrent
                        ? 'bg-amber-600 text-white'
                        : 'bg-[#E2D5C3] text-[#2C221E] group-hover:bg-[#2C221E] group-hover:text-white'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    ) : (
                      originalIndex + 1
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`font-semibold font-serif text-base leading-tight truncate ${isCurrent ? 'text-white' : 'text-[#1A120E]'}`}>
                      {track.title}
                    </h4>
                    <p className={`text-xs truncate flex items-center gap-1.5 ${isCurrent ? 'text-amber-200/90' : 'text-[#2C221E]/70'}`}>
                      <span>{track.artist}</span>
                      {track.movie && (
                        <>
                          <span>•</span>
                          <span className="italic font-serif">{track.movie} ({track.year})</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Favorite & Duration */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(track.id);
                    }}
                    className={`p-1.5 rounded hover:bg-black/10 transition-colors ${
                      isFav ? 'text-rose-600' : isCurrent ? 'text-white/40' : 'text-[#2C221E]/30'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-600' : ''}`} />
                  </button>

                  <span className={`font-radio-mono text-xs ${isCurrent ? 'text-amber-200' : 'text-[#2C221E]/60'}`}>
                    {track.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-[#2C221E]/15 text-center font-radio-mono text-[11px] text-[#2C221E]/60">
          PLPjVGzmZ5fQz7l9kK5rEV5B-SgciIm-Q3
        </div>
      </div>
    </div>
  );
};
