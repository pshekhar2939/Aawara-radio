import React, { useRef } from 'react';
import { Radio, Music, Film, Calendar, AlertCircle } from 'lucide-react';
import { formatTime } from './formatters';
import { Track, PlayerStatus } from '../types';

interface NowPlayingCardProps {
  title: string;
  artist: string;
  matchedTrack: Track | null;
  currentTime: number;
  duration: number;
  status: PlayerStatus;
  errorMessage: string | null;
  onSeek: (seconds: number) => void;
}

export const NowPlayingCard: React.FC<NowPlayingCardProps> = ({
  title,
  artist,
  matchedTrack,
  currentTime,
  duration,
  status,
  errorMessage,
  onSeek,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = percentage * duration;
    onSeek(targetSeconds);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayTitle = matchedTrack?.title || title || 'Selecting 90s Classic...';
  const displayArtist = matchedTrack?.artist || artist || 'AWAARA Radio';
  const displayMovie = matchedTrack?.movie;
  const displayYear = matchedTrack?.year;

  const isBuffering = status === 'BUFFERING' || status === 'TUNING';

  return (
    <div className="w-full max-w-xl mx-auto my-4 bg-[#F4EEE0] border border-[#2C221E]/30 rounded-xl p-5 shadow-md relative overflow-hidden">
      {/* Header Label */}
      <div className="flex items-center justify-between mb-3 border-b border-[#2C221E]/15 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
          <span className="font-radio-mono text-xs font-bold text-[#2C221E] uppercase tracking-widest">
            NOW PLAYING
          </span>
        </div>
        {isBuffering ? (
          <span className="font-radio-mono text-[11px] font-bold text-amber-800 animate-pulse bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            TUNING...
          </span>
        ) : (
          <span className="font-radio-mono text-[11px] text-[#2C221E]/60 uppercase tracking-wider">
            AIRWAVES STEREO
          </span>
        )}
      </div>

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="mb-3 p-2 bg-amber-900/10 border border-amber-800/30 rounded flex items-center gap-2 text-amber-950 font-radio-mono text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-800" />
          <span className="truncate">{errorMessage}</span>
        </div>
      )}

      {/* Track Info */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-editorial text-[#1A120E] leading-tight mb-1 truncate px-2">
          {displayTitle}
        </h2>

        <div className="flex items-center justify-center gap-2 text-[#2C221E]/80 text-sm font-medium flex-wrap">
          <span className="flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-amber-800" />
            {displayArtist}
          </span>

          {displayMovie && (
            <>
              <span className="text-[#2C221E]/30">•</span>
              <span className="flex items-center gap-1 font-serif italic text-amber-950">
                <Film className="w-3.5 h-3.5 text-amber-800" />
                {displayMovie}
              </span>
            </>
          )}

          {displayYear && (
            <>
              <span className="text-[#2C221E]/30">•</span>
              <span className="flex items-center gap-1 font-radio-mono text-xs text-[#2C221E]/70">
                <Calendar className="w-3 h-3" />
                {displayYear}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div className="space-y-1.5">
        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          className="relative w-full h-3 bg-[#E2D5C3] border border-[#2C221E]/30 rounded-full cursor-pointer overflow-hidden group shadow-inner"
          title="Click to seek"
        >
          {/* Progress Fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#2C221E] transition-all duration-150 ease-linear group-hover:bg-amber-900"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber-600 border border-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between font-radio-mono text-xs text-[#2C221E]/70 font-semibold px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '00:00'}</span>
        </div>
      </div>
    </div>
  );
};
