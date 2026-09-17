import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Eye, Sparkles, Volume2 } from 'lucide-react';
import { VISUALIZATION_STAGES } from '../data/scorerContent';
import { playSwishSound, playClutchChime, playBreathingTone } from '../utils/audioEngine';

interface VisualizationChamberProps {
  sport: string;
  soundEnabled: boolean;
}

export const VisualizationChamber: React.FC<VisualizationChamberProps> = ({
  sport,
  soundEnabled
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(VISUALIZATION_STAGES[0].durationSeconds);

  const stage = VISUALIZATION_STAGES[currentStageIdx];

  // Stage timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      // Auto advance or complete
      if (soundEnabled) playSwishSound();
      if (currentStageIdx < VISUALIZATION_STAGES.length - 1) {
        setCurrentStageIdx((prev) => prev + 1);
        setTimeLeft(VISUALIZATION_STAGES[currentStageIdx + 1].durationSeconds);
      } else {
        setIsPlaying(false);
        if (soundEnabled) playClutchChime();
      }
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, currentStageIdx, soundEnabled]);

  const handleTogglePlay = () => {
    if (!isPlaying && soundEnabled) {
      playBreathingTone('inhale');
    }
    setIsPlaying(!isPlaying);
  };

  const handleSelectStage = (idx: number) => {
    setCurrentStageIdx(idx);
    setTimeLeft(VISUALIZATION_STAGES[idx].durationSeconds);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeLeft(stage.durationSeconds);
  };

  return (
    <div id="visualization-chamber" className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider">
              Mental Rehearsal
            </span>
            <span className="text-xs text-slate-500">• {sport} Pre-Game Chamber</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase font-display tracking-tight">
            Flow State Visualization
          </h2>
          <p className="text-xs text-slate-400">
            Neuro-visual priming: encode neural firing patterns before your sneakers touch the court.
          </p>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          {VISUALIZATION_STAGES.map((s, idx) => (
            <button
              key={s.stage}
              id={`stage-pill-${s.stage}`}
              onClick={() => handleSelectStage(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                currentStageIdx === idx
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.stage}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chamber Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Pulse Circle */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800/60 relative">
          <div className="relative flex items-center justify-center w-40 h-40">
            {/* Animated Pulser */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-amber-500/30 transition-all duration-1000 ${
                isPlaying ? 'animate-ping opacity-25 scale-125' : 'opacity-40'
              }`}
            />
            <div
              className={`absolute inset-2 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/40 flex items-center justify-center transition-transform duration-700 ${
                isPlaying ? 'scale-105 shadow-[0_0_25px_rgba(245,158,11,0.2)]' : 'scale-95'
              }`}
            >
              <div className="text-center">
                <span className="text-3xl font-black text-white font-display">
                  {timeLeft}s
                </span>
                <span className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-0.5">
                  {isPlaying ? 'ACTIVE PRIMING' : 'READY'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              id="viz-toggle-play-btn"
              onClick={handleTogglePlay}
              className={`px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'START REHEARSAL'}</span>
            </button>

            <button
              id="viz-reset-timer-btn"
              onClick={handleReset}
              aria-label="Reset Timer"
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Narrative & Guided Prompt */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>Phase {stage.stage}: {stage.title}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold">
              Power Cue: <strong className="text-amber-300">{stage.cue}</strong>
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 min-h-[120px] flex items-center">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              "{stage.prompt}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              id="viz-prev-stage-btn"
              disabled={currentStageIdx === 0}
              onClick={() => handleSelectStage(currentStageIdx - 1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Stage</span>
            </button>

            <span className="text-xs text-slate-500">
              Stage {currentStageIdx + 1} of {VISUALIZATION_STAGES.length}
            </span>

            <button
              id="viz-next-stage-btn"
              disabled={currentStageIdx === VISUALIZATION_STAGES.length - 1}
              onClick={() => handleSelectStage(currentStageIdx + 1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
