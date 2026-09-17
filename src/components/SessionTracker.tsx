import React from 'react';
import { SessionLog } from '../types';
import { Plus, History, Flame, CheckCircle, TrendingUp, Zap, Calendar } from 'lucide-react';

interface SessionTrackerProps {
  sessions: SessionLog[];
  onOpenLogModal: () => void;
  sport: string;
}

export const SessionTracker: React.FC<SessionTrackerProps> = ({
  sessions,
  onOpenLogModal,
  sport
}) => {
  // Aggregate stats
  const totalReps = sessions.reduce((acc, s) => acc + s.repsOrMinutes, 0);
  const avgMindset = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + s.mindsetRating, 0) / sessions.length).toFixed(1)
    : '0.0';
  const instantFlushCount = sessions.filter((s) => s.recoverySpeed === 'Instant (<2s)').length;
  const instantFlushRate = sessions.length > 0
    ? Math.round((instantFlushCount / sessions.length) * 100)
    : 0;

  return (
    <div id="session-tracker-section" className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider">
              Training Ledger
            </span>
            <span className="text-xs text-slate-500">• Mindset & Reps</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase font-display tracking-tight">
            Performance & Recovery Tracker
          </h2>
          <p className="text-xs text-slate-400">
            Log sessions, monitor hesitation counts, and build a quantitative record of your killer instinct.
          </p>
        </div>

        <button
          id="log-new-session-btn"
          onClick={onOpenLogModal}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 active:scale-95 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Log Performance</span>
        </button>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Reps / Mins
          </span>
          <span className="text-2xl font-black text-white font-display">
            {totalReps.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-400 block mt-0.5">Tracked volume</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Mindset Score
          </span>
          <span className="text-2xl font-black text-amber-400 font-display">
            {avgMindset}<span className="text-xs text-slate-500">/10</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Aggression level</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Instant Flush Rate
          </span>
          <span className="text-2xl font-black text-emerald-400 font-display">
            {instantFlushRate}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">&lt;2s memory wipe</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Sessions Logged
          </span>
          <span className="text-2xl font-black text-white font-display">
            {sessions.length}
          </span>
          <span className="text-[10px] text-amber-400 block mt-0.5">Consistency streak</span>
        </div>
      </div>

      {/* History Feed */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>Recent Performance Entries</span>
        </h4>

        {sessions.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400 mb-3">
              No sessions logged yet. Record your last workout or live game to start tracking your mental index!
            </p>
            <button
              id="empty-state-log-btn"
              onClick={onOpenLogModal}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs uppercase tracking-wider hover:bg-amber-500/30 transition-all"
            >
              + Log First Session
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                id={`session-item-${session.id}`}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
                      {session.sessionType}
                    </span>
                    <span className="text-xs font-bold text-white font-display">
                      {session.repsOrMinutes} {session.sessionType === 'Game' ? 'Mins' : 'Reps'}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {session.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "{session.keyBreakthrough}"
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Flush Speed
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {session.recoverySpeed}
                    </span>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black font-display">
                    {session.mindsetRating}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
