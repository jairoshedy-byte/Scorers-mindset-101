import React, { useState } from 'react';
import { LEGEND_CREDOS } from '../data/scorerContent';
import { Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { playClutchChime } from '../utils/audioEngine';

interface DailyCredoCardProps {
  soundEnabled: boolean;
}

export const DailyCredoCard: React.FC<DailyCredoCardProps> = ({ soundEnabled }) => {
  const [index, setIndex] = useState(0);
  const credo = LEGEND_CREDOS[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % LEGEND_CREDOS.length);
    if (soundEnabled) playClutchChime();
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + LEGEND_CREDOS.length) % LEGEND_CREDOS.length);
    if (soundEnabled) playClutchChime();
  };

  return (
    <div id="daily-credo-card" className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Quote className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Scorer's Credo
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="prev-credo-btn"
              onClick={handlePrev}
              aria-label="Previous Credo"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-semibold text-slate-500">
              {index + 1}/{LEGEND_CREDOS.length}
            </span>
            <button
              id="next-credo-btn"
              onClick={handleNext}
              aria-label="Next Credo"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <blockquote className="text-sm sm:text-base text-slate-200 font-semibold italic leading-relaxed my-3">
          "{credo.quote}"
        </blockquote>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-4">
          <div>
            <span className="text-xs font-bold text-white uppercase font-display tracking-wide block">
              {credo.author}
            </span>
            <span className="text-[11px] text-slate-400">
              {credo.context}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
        <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
          Tactical Takeaway:
        </span>
        {credo.actionablePrinciple}
      </div>
    </div>
  );
};
