import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { PlayerStatus } from '../types';

interface PlaybackControlsProps {
  isPlaying: boolean;
  status: PlayerStatus;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  status,
  volume,
  isMuted,
  onTogglePlay,
  onNext,
  onPrevious,
  onVolumeChange,
  onToggleMute,
}) => {
  const isBuffering = status === 'BUFFERING' || status === 'TUNING';

  return (
    <div className="w-full max-w-xl mx-auto my-4 bg-[#F4EEE0] border border-[#2C221E]/30 rounded-xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Radio Volume Control */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-center md:justify-start">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-lg bg-[#E2D5C3] text-[#2C221E] hover:bg-[#D5C7B0] transition-colors border border-[#2C221E]/20 cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-rose-900" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 sm:w-28 accent-[#2C221E] cursor-pointer"
            title={`Volume: ${isMuted ? 0 : volume}%`}
          />
          <span className="font-radio-mono text-xs font-bold text-[#2C221E]/70 w-8 text-right">
            {isMuted ? '0%' : `${volume}%`}
          </span>
        </div>
      </div>

      {/* Main Playback Buttons */}
      <div className="flex items-center gap-4">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={onPrevious}
          className="p-3 rounded-full bg-[#E2D5C3] text-[#2C221E] hover:bg-[#D5C7B0] active:scale-95 transition-all border border-[#2C221E]/30 shadow-xs cursor-pointer flex items-center justify-center"
          title="Previous Track (Restarts if >5s)"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>

        {/* PLAY / PAUSE MAIN BUTTON */}
        <button
          onClick={onTogglePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-[#FBF8F1] transition-all shadow-lg active:scale-95 cursor-pointer border-2 border-[#1A120E] ${
            isPlaying
              ? 'bg-[#2C221E] hover:bg-[#3D2E29]'
              : 'bg-amber-900 hover:bg-amber-950 animate-bounce-subtle'
          }`}
          title={isPlaying ? 'Pause' : 'Play 90s Nostalgia Radio'}
        >
          {isBuffering ? (
            <div className="w-6 h-6 border-2 border-[#FBF8F1] border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 fill-current ml-1" />
          )}
        </button>

        {/* NEXT BUTTON */}
        <button
          onClick={onNext}
          className="p-3 rounded-full bg-[#E2D5C3] text-[#2C221E] hover:bg-[#D5C7B0] active:scale-95 transition-all border border-[#2C221E]/30 shadow-xs cursor-pointer flex items-center justify-center"
          title="Next Track"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Radio Frequency & Mode Badge */}
      <div className="hidden md:flex flex-col items-end text-right font-radio-mono text-[10px] text-[#2C221E]/60">
        <span className="font-bold text-[#2C221E]">CASSETTE MODE</span>
        <span>HIGH FIDELITY</span>
      </div>
    </div>
  );
};
