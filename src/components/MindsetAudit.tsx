import React, { useState } from 'react';
import { SCORER_PILLARS } from '../data/scorerContent';
import { MindsetScore, ScorerAuditResult } from '../types';
import { Target, Award, AlertTriangle, ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react';
import { playClutchChime } from '../utils/audioEngine';

interface MindsetAuditProps {
  currentAudit: ScorerAuditResult | null;
  onSaveAudit: (audit: ScorerAuditResult) => void;
  soundEnabled: boolean;
}

export const MindsetAudit: React.FC<MindsetAuditProps> = ({
  currentAudit,
  onSaveAudit,
  soundEnabled
}) => {
  const [scores, setScores] = useState<MindsetScore>(
    currentAudit?.scores || {
      zeroSecondMemory: 7,
      unconditionalConfidence: 8,
      decisiveAttack: 6,
      clutchComposure: 7,
      sweetSpotDiscipline: 8
    }
  );

  const [isEditing, setIsEditing] = useState(!currentAudit);

  const handleSliderChange = (key: keyof MindsetScore, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const calculateResults = (): ScorerAuditResult => {
    const total = (Object.values(scores) as number[]).reduce((acc: number, curr: number) => acc + curr, 0);
    const overallIndex = Math.round((total / 50) * 100);

    // Identify highest and lowest
    const entries = Object.entries(scores) as [keyof MindsetScore, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const highest = entries[0];
    const lowest = entries[entries.length - 1];

    const highestPillar = SCORER_PILLARS.find((p) => p.key === highest[0])!;
    const lowestPillar = SCORER_PILLARS.find((p) => p.key === lowest[0])!;

    let archetype = 'The Balanced Finisher';
    if (overallIndex >= 90) archetype = 'The Cold-Blooded Assassin';
    else if (overallIndex >= 78) archetype = 'The Rhythm Gunner';
    else if (overallIndex >= 65) archetype = 'The Developing Striker';
    else archetype = 'The Hesitant Talent';

    return {
      scores,
      overallIndex,
      archetype,
      superpower: highestPillar.name,
      primaryBlindspot: lowestPillar.name,
      recommendedFocus: lowestPillar.microDrill,
      date: new Date().toISOString().split('T')[0]
    };
  };

  const handleSubmitAudit = () => {
    const result = calculateResults();
    onSaveAudit(result);
    setIsEditing(false);
    if (soundEnabled) playClutchChime();
  };

  return (
    <div id="mindset-audit-section" className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider">
              Diagnostic Matrix
            </span>
            <span className="text-xs text-slate-500">• The 5 Tenets of Scoring</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase font-display tracking-tight">
            Scorer's Mental Index (SMI)
          </h2>
          <p className="text-xs text-slate-400">
            Diagnose your psychological green light, next-play flush speed, and clutch instincts.
          </p>
        </div>

        {currentAudit && !isEditing && (
          <button
            id="retake-audit-btn"
            onClick={() => setIsEditing(true)}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:border-amber-500/50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Retake Self-Audit</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* The 5 Pillars Sliders */
        <div id="audit-form" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SCORER_PILLARS.map((pillar) => {
              const val = scores[pillar.key];
              return (
                <div
                  key={pillar.id}
                  id={`pillar-card-${pillar.id}`}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                        {pillar.name}
                      </h4>
                      <p className="text-[11px] text-amber-400/90 font-medium">
                        "{pillar.tagline}"
                      </p>
                    </div>
                    <span className="text-lg font-black text-amber-400 font-display bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                      {val}/10
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                    {pillar.description}
                  </p>

                  <div className="space-y-1">
                    <input
                      id={`slider-${pillar.key}`}
                      type="range"
                      min={1}
                      max={10}
                      value={val}
                      onChange={(e) => handleSliderChange(pillar.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-0.5">
                      <span>1: Hesitant / Dwells</span>
                      <span>5: Average</span>
                      <span>10: Pure Killer Instinct</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              id="submit-mindset-audit-btn"
              onClick={handleSubmitAudit}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm tracking-wider uppercase hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2"
            >
              <span>Calculate Mental Index</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div id="audit-results-view" className="space-y-6">
          {/* Main Hero Index Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/15 to-slate-900 border border-amber-500/30 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Overall Index
              </span>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-display">
                  {currentAudit?.overallIndex}
                </span>
                <span className="text-sm font-bold text-amber-400"> /100</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                Status: {currentAudit?.archetype}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Primary Superpower</span>
              </div>
              <p className="text-lg font-extrabold text-white my-1 font-display">
                {currentAudit?.superpower}
              </p>
              <p className="text-xs text-slate-400">
                Your sharpest psychological weapon on the floor. Lean into this strength.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Blindspot</span>
              </div>
              <p className="text-lg font-extrabold text-white my-1 font-display">
                {currentAudit?.primaryBlindspot}
              </p>
              <p className="text-xs text-slate-400">
                Where defensive opponents extract hesitation or psychological leverage.
              </p>
            </div>
          </div>

          {/* Breakdown Bars & Micro Drill */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* 5 Pillars Progress Bars */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Five-Pillar Breakdown
              </h4>
              {SCORER_PILLARS.map((pillar) => {
                const score = currentAudit?.scores[pillar.key] || 0;
                return (
                  <div key={pillar.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{pillar.name}</span>
                      <span className="text-amber-400 font-bold">{score}/10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Targeted Micro-Drill Recommendation */}
            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Prescribed Mindset Protocol</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Fixing "{currentAudit?.primaryBlindspot}"
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {currentAudit?.recommendedFocus}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Execute this drill in your next 3 live training sessions.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
