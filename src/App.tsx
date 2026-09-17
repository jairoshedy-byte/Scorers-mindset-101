import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RapidResetModal } from './components/RapidResetModal';
import { MindsetAudit } from './components/MindsetAudit';
import { VisualizationChamber } from './components/VisualizationChamber';
import { AICoachPanel } from './components/AICoachPanel';
import { SessionTracker } from './components/SessionTracker';
import { SessionLogModal } from './components/SessionLogModal';
import { DailyCredoCard } from './components/DailyCredoCard';
import { DownloadModal } from './components/DownloadModal';
import { SportType, ScorerAuditResult, SessionLog } from './types';
import { Target, Zap, Brain, ShieldAlert, Activity, Sparkles, Volume2, Award, Flame, RefreshCw } from 'lucide-react';
import { playClutchChime, playResetTone } from './utils/audioEngine';

// Seed initial audit
const INITIAL_AUDIT: ScorerAuditResult = {
  scores: {
    zeroSecondMemory: 8,
    unconditionalConfidence: 9,
    decisiveAttack: 7,
    clutchComposure: 8,
    sweetSpotDiscipline: 8
  },
  overallIndex: 80,
  archetype: 'The Rhythm Gunner',
  superpower: 'Unconditional Confidence',
  primaryBlindspot: 'The 0.5-Second Rule',
  recommendedFocus: 'In scrimmage, ban ball-stopping: catch-and-shoot or direct downhill drive on the first bounce.',
  date: '2026-09-17'
};

// Seed initial sessions
const INITIAL_SESSIONS: SessionLog[] = [
  {
    id: 'seed-1',
    date: '2026-09-16',
    sport: 'Basketball',
    sessionType: 'Game',
    repsOrMinutes: 32,
    mindsetRating: 9,
    hesitationsCount: 1,
    recoverySpeed: 'Instant (<2s)',
    keyBreakthrough: 'After missing 2 early threes, immediately ran the floor for a fastbreak dunk. Shot 5/7 afterwards.',
    anchorCueUsed: "NEXT ONE'S CASH"
  },
  {
    id: 'seed-2',
    date: '2026-09-15',
    sport: 'Basketball',
    sessionType: 'Shooting Practice',
    repsOrMinutes: 400,
    mindsetRating: 8,
    hesitationsCount: 3,
    recoverySpeed: 'Instant (<2s)',
    keyBreakthrough: 'Held follow-through on every single rep. Focused on the back of the rim instead of mechanics.',
    anchorCueUsed: 'FEET SET, LET FLY'
  }
];

export default function App() {
  const [currentSport, setCurrentSport] = useState<SportType>(() => {
    return (localStorage.getItem('sm_sport') as SportType) || 'Basketball';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('sm_sound');
    return saved !== null ? saved === 'true' : true;
  });

  const [activeAnchor, setActiveAnchor] = useState<string>(() => {
    return localStorage.getItem('sm_anchor') || "NEXT ONE'S CASH";
  });

  const [auditResult, setAuditResult] = useState<ScorerAuditResult | null>(() => {
    const saved = localStorage.getItem('sm_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT;
  });

  const [sessions, setSessions] = useState<SessionLog[]>(() => {
    const saved = localStorage.getItem('sm_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [flushesCount, setFlushesCount] = useState<number>(() => {
    const saved = localStorage.getItem('sm_flushes');
    return saved ? parseInt(saved) : 14;
  });

  const [activeTab, setActiveTab] = useState<'cockpit' | 'coach' | 'audit' | 'tracker'>('cockpit');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sm_sport', currentSport);
  }, [currentSport]);

  useEffect(() => {
    localStorage.setItem('sm_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('sm_anchor', activeAnchor);
  }, [activeAnchor]);

  useEffect(() => {
    if (auditResult) {
      localStorage.setItem('sm_audit', JSON.stringify(auditResult));
    }
  }, [auditResult]);

  useEffect(() => {
    localStorage.setItem('sm_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('sm_flushes', String(flushesCount));
  }, [flushesCount]);

  const handleRecordReset = (mantra: string) => {
    setActiveAnchor(mantra);
    setFlushesCount((prev) => prev + 1);
  };

  const handleSaveSession = (newSession: SessionLog) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  const smiScore = auditResult?.overallIndex || 0;

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* App Header */}
      <Header
        currentSport={currentSport}
        onSportChange={setCurrentSport}
        onOpenReset={() => setIsResetModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        smiScore={smiScore}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
      />

      {/* Active Anchor Cue Banner */}
      <div id="active-anchor-banner" className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-900 border-b border-amber-500/20 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Active In-Game Mantra:
            </span>
            <strong className="text-white tracking-wide font-extrabold font-display uppercase text-sm sm:text-base">
              "{activeAnchor}"
            </strong>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Flushes Completed: <strong className="text-white">{flushesCount}</strong></span>
            </span>
            <button
              id="trigger-flush-banner-btn"
              onClick={() => setIsResetModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider underline flex items-center gap-1"
            >
              <span>Instant Flush</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div id="main-nav-tabs" className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          <button
            id="tab-btn-cockpit"
            onClick={() => setActiveTab('cockpit')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cockpit'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Mental Cockpit</span>
          </button>

          <button
            id="tab-btn-coach"
            onClick={() => setActiveTab('coach')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'coach'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>AI Mental Coach</span>
          </button>

          <button
            id="tab-btn-audit"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>5 Pillars Diagnostic (SMI)</span>
          </button>

          <button
            id="tab-btn-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tracker'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Performance Ledger</span>
          </button>
        </div>

        {/* Tab 1: Mental Cockpit */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6">
            {/* Quick Hero Banner */}
            <div id="cockpit-hero" className="p-6 rounded-2xl bg-gradient-to-br from-[#121824] via-[#0E131D] to-[#070A0F] border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" />
                  <span>The Scorer's Standard</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display tracking-tight">
                  Shoot Without Memory. Attack Without Hesitation.
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Average athletes let a missed attempt define their next possession. Pure scorers view each touch as an independent event with 100% conviction. Train your nervous system to stay lethal under pressure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
                <button
                  id="cockpit-flush-btn"
                  onClick={() => setIsResetModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs tracking-wider uppercase hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>FLUSH RECENT MISS</span>
                </button>
                <button
                  id="cockpit-log-btn"
                  onClick={() => setIsLogModalOpen(true)}
                  className="px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-xs tracking-wider uppercase transition-all text-center"
                >
                  + Log Session
                </button>
              </div>
            </div>

            {/* Credo & Visualization Chamber Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <DailyCredoCard soundEnabled={soundEnabled} />
              </div>
              <div className="lg:col-span-8">
                <VisualizationChamber sport={currentSport} soundEnabled={soundEnabled} />
              </div>
            </div>

            {/* Quick Diagnostic Teaser */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Current Mental Index
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold font-display">
                      {auditResult?.archetype}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-4xl font-black text-white font-display">
                      {smiScore}
                    </span>
                    <span className="text-xs text-slate-400">/ 100 SMI</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">
                    Superpower: <strong className="text-emerald-400">{auditResult?.superpower}</strong> • Blindspot: <strong className="text-red-400">{auditResult?.primaryBlindspot}</strong>
                  </p>
                </div>
                <button
                  id="jump-to-audit-btn"
                  onClick={() => setActiveTab('audit')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-wider text-center transition-all"
                >
                  View Full 5-Pillar Matrix →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#111622] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Recent Recovery Record
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      {sessions.length} sessions logged
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white my-1">
                    "{sessions[0]?.keyBreakthrough || 'Commitment to the next shot without hesitation.'}"
                  </p>
                  <p className="text-xs text-slate-400 mb-3">
                    Last session: {sessions[0]?.repsOrMinutes || 0} reps • Mindset: {sessions[0]?.mindsetRating || 8}/10
                  </p>
                </div>
                <button
                  id="jump-to-tracker-btn"
                  onClick={() => setActiveTab('tracker')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-wider text-center transition-all"
                >
                  Open Training Ledger →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI Mental Coach */}
        {activeTab === 'coach' && (
          <AICoachPanel
            sport={currentSport}
            soundEnabled={soundEnabled}
            onSetActiveAnchor={(anchor) => {
              setActiveAnchor(anchor);
              if (soundEnabled) playClutchChime();
            }}
          />
        )}

        {/* Tab 3: 5 Pillars Audit */}
        {activeTab === 'audit' && (
          <MindsetAudit
            currentAudit={auditResult}
            onSaveAudit={(result) => setAuditResult(result)}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Tab 4: Performance Ledger */}
        {activeTab === 'tracker' && (
          <SessionTracker
            sessions={sessions}
            onOpenLogModal={() => setIsLogModalOpen(true)}
            sport={currentSport}
          />
        )}

      </main>

      {/* Rapid Reset Modal */}
      <RapidResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        sport={currentSport}
        soundEnabled={soundEnabled}
        onRecordReset={handleRecordReset}
      />

      {/* Session Log Modal */}
      <SessionLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        sport={currentSport}
        onSaveSession={handleSaveSession}
        soundEnabled={soundEnabled}
        activeAnchor={activeAnchor}
      />

      {/* Download / Install Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Footer */}
      <footer id="app-footer" className="border-t border-slate-900 bg-[#070A0F] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-wider font-display uppercase">
              Scorer's Mindset
            </span>
            <span>• Flow State & Mental Performance</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="footer-download-app-btn"
              onClick={() => setIsDownloadModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
            >
              Download App / Install
            </button>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              "The rim never moves. Trust the work."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
