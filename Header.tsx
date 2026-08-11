import React from 'react';
import { Radio, ListMusic, Clock, Heart, MonitorPlay, Sparkles } from 'lucide-react';

interface HeaderProps {
  frequency: number;
  isPlaying: boolean;
  onOpenTracklist: () => void;
  onOpenSleepTimer: () => void;
  showVideo: boolean;
  onToggleShowVideo: () => void;
  favoriteCount: number;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  frequency,
  isPlaying,
  onOpenTracklist,
  onOpenSleepTimer,
  showVideo,
  onToggleShowVideo,
  favoriteCount,
  onOpenFavorites,
}) => {
  return (
    <header className="w-full border-b border-[#2C221E]/15 pb-4 mb-6 pt-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Station Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[#2C221E]/20 bg-[#F4EEE0] shadow-xs">
            <Radio className={`w-5 h-5 text-[#2C221E] ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-600 rounded-full border-2 border-[#FBF8F1] animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-radio-mono text-[11px] font-bold tracking-widest text-[#2C221E]/70 uppercase">
                AWAARA STEREO
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-radio-mono uppercase tracking-wider bg-[#2C221E]/10 text-[#2C221E]">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-amber-700'}`} />
                {isPlaying ? 'LIVE SIGNAL' : 'STANDBY'}
              </span>
            </div>
            <p className="text-xs text-[#2C221E]/60 font-serif italic">
              Nostalgic Frequency broadcast from Bombay
            </p>
          </div>
        </div>

        {/* Center: Frequency Indicator */}
        <div className="flex items-center gap-3 px-4 py-1.5 bg-[#F4EEE0] border border-[#2C221E]/20 rounded-md shadow-inner">
          <span className="font-radio-mono text-xs font-bold text-[#2C221E]/60">FM</span>
          <span className="font-radio-mono text-lg font-bold text-[#1A120E] tracking-wider">
            {frequency.toFixed(1)}
          </span>
          <span className="font-radio-mono text-xs font-bold text-[#2C221E]/60">MHz</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleShowVideo}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-radio-mono rounded border transition-colors ${
              showVideo
                ? 'bg-[#2C221E] text-[#FBF8F1] border-[#2C221E]'
                : 'bg-[#F4EEE0] text-[#2C221E] border-[#2C221E]/20 hover:bg-[#EBE2D0]'
            }`}
            title="Toggle Vintage CRT Video Frame"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showVideo ? 'HIDE VIDEO' : 'WATCH VIDEO'}</span>
          </button>

          <button
            onClick={onOpenFavorites}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-radio-mono rounded bg-[#F4EEE0] text-[#2C221E] border border-[#2C221E]/20 hover:bg-[#EBE2D0] transition-colors relative"
            title="Saved Favorites"
          >
            <Heart className="w-3.5 h-3.5 text-rose-800" />
            <span className="hidden sm:inline">FAVORITES</span>
            {favoriteCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-900 text-white rounded-full text-[10px]">
                {favoriteCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenTracklist}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-radio-mono rounded bg-[#2C221E] text-[#FBF8F1] hover:bg-[#3D2E29] transition-colors shadow-xs"
            title="Playlist Lineup"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>LINEUP</span>
          </button>

          <button
            onClick={onOpenSleepTimer}
            className="p-1.5 text-xs font-radio-mono rounded bg-[#F4EEE0] text-[#2C221E] border border-[#2C221E]/20 hover:bg-[#EBE2D0] transition-colors"
            title="Sleep Timer"
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
