import React from 'react';

interface RadioDialProps {
  currentFrequency: number;
  onSelectFrequency: (freq: number) => void;
  isPlaying: boolean;
}

export const RadioDial: React.FC<RadioDialProps> = ({
  currentFrequency,
  onSelectFrequency,
  isPlaying,
}) => {
  const frequencies = [88.0, 90.0, 92.5, 95.0, 98.3, 101.1, 104.5, 108.0];

  return (
    <div className="w-full max-w-xl mx-auto my-4 bg-[#F4EEE0] border border-[#2C221E]/30 rounded-lg p-3 shadow-inner relative overflow-hidden">
      {/* Radio Tube Glow Effect */}
      {isPlaying && (
        <div className="absolute inset-0 bg-amber-500/5 pointer-events-none transition-opacity duration-1000" />
      )}

      <div className="flex items-center justify-between mb-1.5 px-2">
        <span className="font-radio-mono text-[10px] text-[#2C221E]/60 uppercase tracking-widest">
          RADIO FREQUENCY TUNER
        </span>
        <span className="font-radio-mono text-[10px] text-amber-800 font-bold uppercase tracking-wider">
          MW • FM STEREO
        </span>
      </div>

      {/* Dial Scale */}
      <div className="relative h-12 bg-[#EBE2D0] border border-[#2C221E]/20 rounded flex items-center justify-between px-4 overflow-hidden shadow-inner">
        {/* Tick Marks */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-between px-6 pointer-events-none">
          {Array.from({ length: 41 }).map((_, i) => (
            <div
              key={i}
              className={`w-[1px] bg-[#2C221E]/30 ${
                i % 5 === 0 ? 'h-6 bg-[#2C221E]/70' : 'h-3'
              }`}
            />
          ))}
        </div>

        {/* Frequency Labels */}
        <div className="relative z-10 w-full flex items-center justify-between font-radio-mono text-[11px] font-bold text-[#2C221E]/80">
          {frequencies.map((freq) => (
            <button
              key={freq}
              onClick={() => onSelectFrequency(freq)}
              className={`hover:text-amber-900 transition-colors cursor-pointer px-1 py-0.5 rounded ${
                freq === currentFrequency ? 'text-amber-900 font-black underline decoration-2' : ''
              }`}
            >
              {freq.toFixed(1)}
            </button>
          ))}
        </div>

        {/* Tuner Needle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-700 z-20 shadow-sm transition-all duration-300 ease-out flex flex-col items-center justify-between"
          style={{
            left: `${((currentFrequency - 88) / (108 - 88)) * 90 + 5}%`,
          }}
        >
          <div className="w-2 h-2 bg-amber-800 rounded-full -mt-1 shadow-xs" />
          <div className="w-2 h-2 bg-amber-800 rounded-full -mb-1 shadow-xs" />
        </div>
      </div>
    </div>
  );
};
