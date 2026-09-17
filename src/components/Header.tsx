import React from 'react';
import { Target, Zap, Volume2, VolumeX, Flame, Download } from 'lucide-react';
import { SportType } from '../types';

interface HeaderProps {
  currentSport: SportType;
  onSportChange: (sport: SportType) => void;
  onOpenReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  smiScore: number;
  onOpenDownload: () => void;
}

const SPORTS: SportType[] = ['Basketball', 'Soccer', 'Hockey', 'Lacrosse', 'Tennis', 'Other'];

export const Header: React.FC<HeaderProps> = ({
  currentSport,
  onSportChange,
  onOpenReset,
  soundEnabled,
  onToggleSound,
  smiScore,
  onOpenDownload
}) => {
  return (
    <header id="app-header" className="border-b border-slate-800 bg-[#0B0F17]/95 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white uppercase font-display">
                  Scorer's Mindset
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  FLOW STATE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Zero-Second Memory • Unconditional Green Light • Clutch Execution
              </p>
            </div>
          </div>

          {/* Quick mobile reset trigger */}
          <button
            id="mobile-rapid-flush-btn"
            onClick={onOpenReset}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-transform"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>RESET</span>
          </button>
        </div>

        {/* Sport switcher & Quick Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sport Selector */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
            {SPORTS.slice(0, 4).map((sport) => (
              <button
                key={sport}
                id={`sport-select-${sport.toLowerCase()}`}
                onClick={() => onSportChange(sport)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  currentSport === sport
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Scorer Mental Index Badge */}
          <div 
            id="header-smi-indicator"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300"
            title="Scorer's Mental Index"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-400">SMI:</span>
            <span className="font-bold text-amber-400">{smiScore > 0 ? `${smiScore}/100` : 'Audit Req'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="header-sound-toggle-btn"
            onClick={onToggleSound}
            aria-label="Toggle Sound Effects"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Download / Install App Button */}
          <button
            id="header-download-app-btn"
            onClick={onOpenDownload}
            aria-label="Download or Install App"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 hover:text-amber-300 font-bold text-xs transition-all active:scale-95"
            title="Download ZIP or Install App"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Big Rapid Reset Button */}
          <button
            id="header-rapid-flush-btn"
            onClick={onOpenReset}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>FLUSH MISS (0-SEC RESET)</span>
          </button>
        </div>

      </div>
    </header>
  );
};
