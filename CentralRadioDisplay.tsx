import React from 'react';
import { Disc, Radio, Tv, Sparkles } from 'lucide-react';
import { Track, PlayerStatus } from '../types';

interface CentralRadioDisplayProps {
  track: Track | null;
  isPlaying: boolean;
  status: PlayerStatus;
  frequency: number;
  showVideo: boolean;
  onToggleVideo: () => void;
  containerId: string;
  tuningState: boolean;
}

export const CentralRadioDisplay: React.FC<CentralRadioDisplayProps> = ({
  track,
  isPlaying,
  status,
  frequency,
  showVideo,
  onToggleVideo,
  containerId,
  tuningState,
}) => {
  const isBuffering = status === 'BUFFERING' || status === 'TUNING' || tuningState;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center my-4 relative">
      {/* Station Title Branding */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-1 px-3 py-0.5 rounded-full border border-[#2C221E]/20 bg-[#F4EEE0] text-[11px] font-radio-mono text-[#2C221E]/80 tracking-widest uppercase">
          <Sparkles className="w-3 h-3 text-amber-800" />
          <span>INDIAN VINTAGE STEREO</span>
          <span>•</span>
          <span>FM {frequency.toFixed(1)}</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight font-serif-editorial text-[#1A120E] select-none drop-shadow-xs">
          AWAARA
        </h1>

        <p className="font-radio-mono text-xs sm:text-sm tracking-[0.25em] text-[#2C221E]/80 uppercase mt-1 font-semibold">
          90S NOSTALGIA RADIO
        </p>
      </div>

      {/* Central Radio Unit Container */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md">
        {/* Animated Concentric Pulse Rings when Music Plays */}
        {isPlaying && !isBuffering && (
          <>
            <div className="absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border border-amber-800/20 animate-pulse-ring pointer-events-none" />
            <div
              className="absolute w-[320px] h-[320px] sm:w-[390px] sm:h-[390px] rounded-full border border-amber-900/15 animate-pulse-ring pointer-events-none"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-amber-950/10 animate-pulse-ring pointer-events-none"
              style={{ animationDelay: '2s' }}
            />
          </>
        )}

        {/* Permanent YouTube IFrame Container - Always in DOM with valid min size 200px x 200px */}
        <div
          className={
            showVideo
              ? 'w-full bg-[#1A120E] border-8 border-[#3A2E2B] rounded-2xl p-3 shadow-2xl relative overflow-hidden transition-all duration-300 z-20'
              : 'absolute left-0 top-0 w-[200px] h-[200px] opacity-0 pointer-events-none overflow-hidden z-0'
          }
        >
          {showVideo && (
            <div className="flex items-center justify-between mb-2 px-2 text-[#E2D5C3]">
              <div className="flex items-center gap-1.5 font-radio-mono text-[10px]">
                <Tv className="w-3.5 h-3.5 text-amber-500" />
                <span>CRT COLOR 1995 • CH 03</span>
              </div>
              <button
                onClick={onToggleVideo}
                className="text-[10px] font-radio-mono uppercase text-amber-400 hover:underline cursor-pointer"
              >
                CLOSE VIDEO
              </button>
            </div>
          )}

          <div
            className={
              showVideo
                ? 'relative aspect-video w-full bg-black rounded overflow-hidden border border-amber-900/40'
                : 'w-full h-full min-w-[200px] min-h-[200px]'
            }
          >
            <div id={containerId} className="w-full h-full min-w-[200px] min-h-[200px]" />
          </div>
        </div>

        {/* Main Vintage Circular Cassette / Speaker Unit */}
        {!showVideo && (
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#F4EEE0] border-4 border-[#2C221E] shadow-xl p-4 flex items-center justify-center transition-transform duration-500 hover:scale-[1.01]">
            {/* Outer Dial Ring */}
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#2C221E]/30 pointer-events-none" />

            {/* Central Circle Deck */}
            <div className="relative w-full h-full rounded-full bg-[#2C221E] p-3 shadow-inner flex flex-col items-center justify-center overflow-hidden">
              {/* Cover Image or Vintage Reel Background */}
              {track?.coverImage ? (
                <img
                  src={track.coverImage}
                  alt={track.title}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay ${
                    isPlaying && !isBuffering ? 'scale-105 transition-transform duration-1000' : ''
                  }`}
                />
              ) : null}

              {/* Cassette Tape Reel Graphic */}
              <div className="relative z-10 w-full h-full rounded-full border-2 border-amber-500/30 flex flex-col items-center justify-center p-4">
                {/* Dual Spinning Cassette Wheels */}
                <div className="flex items-center justify-center gap-8 mb-2">
                  <div
                    className={`w-12 h-12 rounded-full border-4 border-[#F4EEE0] bg-[#1A120E] flex items-center justify-center shadow-inner ${
                      isPlaying && !isBuffering ? 'animate-spin-cassette' : ''
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-dashed border-amber-500" />
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full border-4 border-[#F4EEE0] bg-[#1A120E] flex items-center justify-center shadow-inner ${
                      isPlaying && !isBuffering ? 'animate-spin-cassette-reverse' : ''
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-dashed border-amber-500" />
                  </div>
                </div>

                {/* Tape Label */}
                <div className="px-3 py-1 bg-[#F4EEE0] border border-[#2C221E] rounded text-center max-w-[85%] shadow-sm">
                  <span className="block font-radio-mono text-[9px] font-bold text-[#2C221E] tracking-widest uppercase">
                    AWAARA • VOL. 1
                  </span>
                  <span className="block font-serif italic text-xs text-[#2C221E]/80 truncate">
                    {track?.movie ? track.movie : '90s Hit Parade'}
                  </span>
                </div>
              </div>

              {/* Tuning / Buffering Overlay */}
              {isBuffering && (
                <div className="absolute inset-0 bg-[#1A120E]/90 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-4 text-[#F4EEE0]">
                  <Radio className="w-8 h-8 text-amber-500 animate-bounce mb-2" />
                  <span className="font-radio-mono text-xs font-bold tracking-widest text-amber-400 animate-pulse">
                    TUNING FREQUENCY...
                  </span>
                  <span className="text-[10px] font-serif italic text-[#F4EEE0]/70 mt-1">
                    Connecting 90s audio stream
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
