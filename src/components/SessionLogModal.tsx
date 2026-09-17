import React, { useState } from 'react';
import { X, Plus, Check, Target, Flame } from 'lucide-react';
import { SessionLog, SportType } from '../types';
import { playClutchChime } from '../utils/audioEngine';

interface SessionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  sport: SportType;
  onSaveSession: (session: SessionLog) => void;
  soundEnabled: boolean;
  activeAnchor: string;
}

export const SessionLogModal: React.FC<SessionLogModalProps> = ({
  isOpen,
  onClose,
  sport,
  onSaveSession,
  soundEnabled,
  activeAnchor
}) => {
  const [sessionType, setSessionType] = useState<SessionLog['sessionType']>('Shooting Practice');
  const [repsOrMinutes, setRepsOrMinutes] = useState(250);
  const [mindsetRating, setMindsetRating] = useState(8);
  const [hesitationsCount, setHesitationsCount] = useState(2);
  const [recoverySpeed, setRecoverySpeed] = useState<SessionLog['recoverySpeed']>('Instant (<2s)');
  const [keyBreakthrough, setKeyBreakthrough] = useState('');
  const [anchorCueUsed, setAnchorCueUsed] = useState(activeAnchor || "NEXT ONE'S CASH");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: SessionLog = {
      id: 'session-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      sport,
      sessionType,
      repsOrMinutes: Number(repsOrMinutes) || 0,
      mindsetRating: Number(mindsetRating),
      hesitationsCount: Number(hesitationsCount) || 0,
      recoverySpeed,
      keyBreakthrough: keyBreakthrough.trim() || 'Attacked with zero hesitation and held follow-through high.',
      anchorCueUsed: anchorCueUsed.trim() || "NEXT ONE'S CASH"
    };

    onSaveSession(newSession);
    if (soundEnabled) playClutchChime();
    onClose();
  };

  return (
    <div 
      id="session-log-overlay"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div 
        id="session-log-modal-card"
        className="w-full max-w-lg bg-[#111622] border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase font-display tracking-wide">
                Log Performance & Mindset
              </h2>
              <p className="text-xs text-slate-400">
                Track reps, hesitations, and flush speed in {sport}.
              </p>
            </div>
          </div>
          <button
            id="close-session-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Session Type */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Session Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Shooting Practice', 'Game', 'Scrimmage', 'Pre-Game Warmup'] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  id={`type-btn-${type.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSessionType(type)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    sessionType === type
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Reps & Mindset Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reps-minutes-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Reps or Minutes:
              </label>
              <input
                id="reps-minutes-input"
                type="number"
                min={1}
                max={5000}
                value={repsOrMinutes}
                onChange={(e) => setRepsOrMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="mindset-rating-slider" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mindset Score:
                </label>
                <span className="text-xs font-black text-amber-400 font-display">
                  {mindsetRating}/10
                </span>
              </div>
              <input
                id="mindset-rating-slider"
                type="range"
                min={1}
                max={10}
                value={mindsetRating}
                onChange={(e) => setMindsetRating(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2"
              />
            </div>
          </div>

          {/* Hesitations & Recovery Speed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hesitations-count-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Hesitations Observed:
              </label>
              <input
                id="hesitations-count-input"
                type="number"
                min={0}
                max={50}
                value={hesitationsCount}
                onChange={(e) => setHesitationsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Flush Speed After Miss:
              </label>
              <select
                id="recovery-speed-select"
                value={recoverySpeed}
                onChange={(e) => setRecoverySpeed(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Instant (<2s)">Instant (&lt;2s) - Zero Memory</option>
                <option value="Quick (<30s)">Quick (&lt;30s) - Minor delay</option>
                <option value="Dwelt on errors">Dwelt on errors - Carried it</option>
              </select>
            </div>
          </div>

          {/* Anchor Cue Used */}
          <div>
            <label htmlFor="session-anchor-cue-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Anchor Cue Repeated:
            </label>
            <input
              id="session-anchor-cue-input"
              type="text"
              value={anchorCueUsed}
              onChange={(e) => setAnchorCueUsed(e.target.value)}
              placeholder="e.g. NEXT ONE'S CASH"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Key Breakthrough / Reflection */}
          <div>
            <label htmlFor="breakthrough-notes-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Key Breakthrough / Learning:
            </label>
            <textarea
              id="breakthrough-notes-input"
              rows={2}
              value={keyBreakthrough}
              onChange={(e) => setKeyBreakthrough(e.target.value)}
              placeholder="What mental trigger kept your aggression pure?"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              id="save-session-submit-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Performance Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
