import React from 'react';
import { Clock, X, Check } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMinutes: number | null;
  onSetTimer: (minutes: number | null) => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  activeMinutes,
  onSetTimer,
}) => {
  if (!isOpen) return null;

  const options = [15, 30, 45, 60, 90];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[#FBF8F1] border border-[#2C221E]/30 rounded-xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#2C221E]/15 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-800" />
            <h3 className="font-radio-mono text-xs font-bold text-[#2C221E] uppercase tracking-widest">
              RADIO SLEEP TIMER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-[#F4EEE0] border border-[#2C221E]/20 text-[#2C221E] hover:bg-[#EBE2D0]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="font-serif italic text-sm text-[#2C221E]/80 mb-4 text-center">
          Auto-stop radio playback when falling asleep to classic 90s melodies.
        </p>

        <div className="space-y-2 mb-4">
          <button
            onClick={() => {
              onSetTimer(null);
              onClose();
            }}
            className={`w-full p-2.5 rounded-lg border text-xs font-radio-mono flex items-center justify-between transition-colors ${
              activeMinutes === null
                ? 'bg-[#2C221E] text-white border-[#2C221E]'
                : 'bg-[#F4EEE0] text-[#2C221E] border-[#2C221E]/20 hover:bg-[#EBE2D0]'
            }`}
          >
            <span>TIMER OFF</span>
            {activeMinutes === null && <Check className="w-4 h-4 text-amber-400" />}
          </button>

          {options.map((mins) => (
            <button
              key={mins}
              onClick={() => {
                onSetTimer(mins);
                onClose();
              }}
              className={`w-full p-2.5 rounded-lg border text-xs font-radio-mono flex items-center justify-between transition-colors ${
                activeMinutes === mins
                  ? 'bg-[#2C221E] text-white border-[#2C221E]'
                  : 'bg-[#F4EEE0] text-[#2C221E] border-[#2C221E]/20 hover:bg-[#EBE2D0]'
              }`}
            >
              <span>{mins} MINUTES</span>
              {activeMinutes === mins && <Check className="w-4 h-4 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
