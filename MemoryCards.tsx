import React from 'react';
import { NOSTALGIA_NOTES } from "./tracks";
import { Sparkles, Disc } from 'lucide-react';

export const MemoryCards: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto my-6 border-t border-[#2C221E]/15 pt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-800" />
        <span className="font-radio-mono text-xs font-bold text-[#2C221E] uppercase tracking-widest">
          90s STEREO MEMORIES
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {NOSTALGIA_NOTES.map((note) => (
          <div
            key={note.id}
            className="p-3.5 bg-[#F4EEE0] border border-[#2C221E]/20 rounded-lg shadow-2xs hover:border-[#2C221E]/40 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] font-radio-mono text-amber-900 font-bold mb-1">
              <span>{note.movie}</span>
              <span>{note.year}</span>
            </div>
            <p className="font-serif italic text-sm text-[#2C221E]/90 leading-snug">
              "{note.quote}"
            </p>
            <p className="mt-2 text-[10px] font-radio-mono text-[#2C221E]/60 truncate">
              {note.artists}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
