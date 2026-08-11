import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#2C221E]/15 mt-10 pt-6 pb-8 text-center">
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="font-radio-mono text-xs font-bold tracking-[0.3em] text-[#2C221E] uppercase">
          EST. 1990s
        </p>
        <p className="font-serif italic text-sm text-[#2C221E]/80 tracking-wider">
          MEMORIES NEVER FADE
        </p>
        <div className="flex items-center gap-2 mt-2 font-radio-mono text-[10px] text-[#2C221E]/50">
          <span>AWAARA 90s NOSTALGIA RADIO</span>
          <span>•</span>
          <span>FM 90.0 MHz</span>
        </div>
      </div>
    </footer>
  );
};
