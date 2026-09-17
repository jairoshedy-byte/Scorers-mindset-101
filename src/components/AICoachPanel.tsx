import React, { useState } from 'react';
import { Bot, Send, Sparkles, Zap, CheckCircle2, ChevronRight, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/scorerContent';
import { CoachScenario } from '../types';
import { playClutchChime } from '../utils/audioEngine';

interface AICoachPanelProps {
  sport: string;
  soundEnabled: boolean;
  onSetActiveAnchor: (anchor: string) => void;
}

interface CoachResponse {
  reply: string;
  anchorCue: string;
  actionSteps: string[];
  visualizationPrompt: string;
  isAiGenerated: boolean;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({
  sport,
  soundEnabled,
  onSetActiveAnchor
}) => {
  const [selectedScenario, setSelectedScenario] = useState<CoachScenario | null>(PRESET_SCENARIOS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CoachResponse>({
    reply: PRESET_SCENARIOS[0].defaultAdvice,
    anchorCue: PRESET_SCENARIOS[0].defaultAnchor,
    actionSteps: PRESET_SCENARIOS[0].steps,
    visualizationPrompt: "See yourself receiving the ball on the wing, catching on a strong 1-2 hop, and firing with zero hesitation.",
    isAiGenerated: false
  });
  const [copiedAnchor, setCopiedAnchor] = useState(false);

  const handleSelectPreset = (scenario: CoachScenario) => {
    setSelectedScenario(scenario);
    setCustomPrompt('');
    setResponse({
      reply: scenario.defaultAdvice,
      anchorCue: scenario.defaultAnchor,
      actionSteps: scenario.steps,
      visualizationPrompt: "Close your eyes. Picture your posture tall and commanding as you enter the next offensive sequence.",
      isAiGenerated: false
    });
  };

  const handleConsultCoach = async (promptToSubmit?: string) => {
    const text = promptToSubmit || customPrompt.trim();
    if (!text && !selectedScenario) return;

    setLoading(true);
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text || selectedScenario?.situation,
          sport,
          currentMentalState: 'Competitive focus',
          contextType: selectedScenario?.category || 'general'
        })
      });

      if (!res.ok) throw new Error('Failed to get coach breakdown');
      const data = await res.json();
      setResponse(data);
      if (soundEnabled) playClutchChime();
    } catch (err) {
      console.error(err);
      // Fallback is handled by server, but if network error happens:
      if (selectedScenario) {
        setResponse({
          reply: selectedScenario.defaultAdvice,
          anchorCue: selectedScenario.defaultAnchor,
          actionSteps: selectedScenario.steps,
          visualizationPrompt: "See yourself attacking the rim and finishing through contact.",
          isAiGenerated: false
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnchor = () => {
    onSetActiveAnchor(response.anchorCue);
    setCopiedAnchor(true);
    setTimeout(() => setCopiedAnchor(false), 2000);
  };

  return (
    <div id="ai-coach-panel" className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider">
              Real-Time AI Corner
            </span>
            <span className="text-xs text-slate-500">• Mental Conditioning Assistant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase font-display tracking-tight flex items-center gap-2">
            <span>The Scorer's Corner Coach</span>
            {response.isAiGenerated && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md font-bold tracking-wider uppercase">
                Gemini Live
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">
            Ask about slumps, defender mind games, late-game nerves, or bench frustration.
          </p>
        </div>
      </div>

      {/* Quick Situation Selector */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Select Common In-Game Scenarios:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_SCENARIOS.map((sc) => {
            const isSelected = selectedScenario?.id === sc.id && !customPrompt;
            return (
              <button
                key={sc.id}
                id={`preset-btn-${sc.id}`}
                onClick={() => handleSelectPreset(sc)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {sc.category}
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5 line-clamp-1">
                    {sc.title}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  {sc.situation}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Situation Input */}
      <div className="mb-6">
        <label htmlFor="custom-coach-prompt-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Or Describe Your Current Dilemma / Opponent:
        </label>
        <div className="flex gap-2">
          <input
            id="custom-coach-prompt-input"
            type="text"
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              setSelectedScenario(null);
            }}
            placeholder={`e.g. "I missed 3 easy layups and now I'm hesitating to drive in ${sport}..."`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConsultCoach();
            }}
          />
          <button
            id="ask-coach-btn"
            disabled={loading || (!customPrompt.trim() && !selectedScenario)}
            onClick={() => handleConsultCoach()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs tracking-wider uppercase hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5 shadow-md"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 fill-current" />
            )}
            <span>{loading ? 'ANALYZING...' : 'GET READ'}</span>
          </button>
        </div>
      </div>

      {/* Coach Output Card */}
      <div id="coach-output-card" className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
        {/* Anchor Cue Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
              Target Anchor Cue
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-display tracking-wide uppercase">
              "{response.anchorCue}"
            </span>
          </div>
          <button
            id="set-active-anchor-btn"
            onClick={handleCopyAnchor}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-1.5"
          >
            {copiedAnchor ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
            <span>{copiedAnchor ? 'LOCKED IN!' : 'SET AS ACTIVE CUE'}</span>
          </button>
        </div>

        {/* Breakdown Text */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Psychological Tactical Assessment</span>
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
            {response.reply}
          </p>
        </div>

        {/* 3 Immediate Action Steps */}
        {response.actionSteps && response.actionSteps.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Immediate Possession Action Steps
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {response.actionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] mb-1.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-300 font-medium leading-normal">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Micro-Visualization Script */}
        {response.visualizationPrompt && (
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider mb-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>30-Second Mental Rehearsal</span>
            </div>
            <p className="text-slate-300 italic leading-relaxed">
              "{response.visualizationPrompt}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
