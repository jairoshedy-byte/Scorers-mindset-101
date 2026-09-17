import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, RotateCcw, Zap, Sparkles, Wind, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playBreathingTone, playResetTone, playSwishSound, playClutchChime } from '../utils/audioEngine';

interface RapidResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sport: string;
  soundEnabled: boolean;
  onRecordReset: (mantra: string) => void;
}

export const RapidResetModal: React.FC<RapidResetModalProps> = ({
  isOpen,
  onClose,
  sport,
  soundEnabled,
  onRecordReset
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [isShattered, setIsShattered] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState("NEXT ONE'S CASH");
  const [customMantra, setCustomMantra] = useState('');

  const PRESET_MANTRAS = [
    "NEXT ONE'S CASH",
    "FEET SET, LET FLY",
    "HUNT THE GAP",
    "ICE IN MY VEINS",
    "THE RIM NEVER MOVED"
  ];

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBreathPhase('inhale');
      setBreathSeconds(4);
      setIsShattered(false);
    }
  }, [isOpen]);

  // Step 1: Guided physiological sigh timer
  useEffect(() => {
    if (!isOpen || step !== 1) return;

    let timer: NodeJS.Timeout;

    if (breathPhase === 'inhale') {
      if (soundEnabled) playBreathingTone('inhale');
      timer = setTimeout(() => {
        setBreathPhase('hold');
        setBreathSeconds(2);
      }, 4000);
    } else if (breathPhase === 'hold') {
      timer = setTimeout(() => {
        setBreathPhase('exhale');
        setBreathSeconds(6);
        if (soundEnabled) playBreathingTone('exhale');
      }, 2000);
    } else if (breathPhase === 'exhale') {
      timer = setTimeout(() => {
        setStep(2);
      }, 5500);
    }

    return () => clearTimeout(timer);
  }, [isOpen, step, breathPhase, soundEnabled]);

  if (!isOpen) return null;

  const handleShatter = () => {
    setIsShattered(true);
    if (soundEnabled) playResetTone();

    // Trigger subtle dark/gold confetti
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#ffffff', '#94a3b8']
      });
    } catch (e) {}

    setTimeout(() => {
      setStep(3);
      if (soundEnabled) playSwishSound();
    }, 1200);
  };

  const handleStep3Complete = () => {
    setStep(4);
    if (soundEnabled) playClutchChime();
  };

  const handleFinishReset = () => {
    const finalMantra = customMantra.trim() || selectedMantra;
    onRecordReset(finalMantra);
    onClose();
  };

  return (
    <div 
      id="rapid-reset-overlay"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div 
        id="rapid-reset-card"
        className="w-full max-w-lg bg-[#111622] border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide uppercase font-display">
                Zero-Second Flush Protocol
              </h2>
              <p className="text-xs text-slate-400">
                Step {step} of 4: {step === 1 && 'Autonomic Reset'}
                {step === 2 && 'Cognitive Dissolve'}
                {step === 3 && 'Visual Swish Anchor'}
                {step === 4 && 'Commitment Mantra'}
              </p>
            </div>
          </div>
          <button
            id="rapid-reset-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Physiological Sigh */}
        {step === 1 && (
          <div id="reset-step-1" className="text-center py-4 flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase mb-2">
              <Wind className="w-4 h-4" />
              <span>Double Nasal Inhale, Long Sigh Out</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-6">
              Drop Heart Rate & Clear Adrenaline Spike
            </h3>

            {/* Breathing Circle Visualizer */}
            <div className="relative flex items-center justify-center my-6 w-44 h-44">
              <div 
                className={`absolute inset-0 rounded-full border-2 border-amber-500/40 transition-all duration-[4000ms] ${
                  breathPhase === 'inhale' 
                    ? 'scale-110 bg-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.25)]' 
                    : breathPhase === 'hold'
                    ? 'scale-110 bg-amber-400/30'
                    : 'scale-75 bg-amber-500/5'
                }`}
              />
              <div className="relative z-10 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {breathPhase === 'inhale' && 'Inhale Deep'}
                  {breathPhase === 'hold' && 'Top Hold (Sip)'}
                  {breathPhase === 'exhale' && 'Slow Mouth Exhale'}
                </span>
                <span className="text-2xl font-extrabold text-white font-display">
                  {breathPhase.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Scientific physiological sigh: resets the nervous system so your shooting mechanics unlock naturally.
            </p>

            <button
              id="skip-breath-step-btn"
              onClick={() => setStep(2)}
              className="text-xs text-slate-500 hover:text-slate-300 underline"
            >
              Skip to Shatter Miss
            </button>
          </div>
        )}

        {/* STEP 2: Cognitive Dissolve */}
        {step === 2 && (
          <div id="reset-step-2" className="text-center py-4">
            <h3 className="text-xl font-bold text-white mb-2">
              Shatter The Previous Miss
            </h3>
            <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
              In {sport}, ruminating on a past attempt steals 40% of your working memory. Tap below to vaporize the error.
            </p>

            <div className="my-6">
              {!isShattered ? (
                <button
                  id="shatter-miss-trigger-btn"
                  onClick={handleShatter}
                  className="w-full py-8 px-6 rounded-2xl bg-gradient-to-b from-red-950/40 to-slate-900 border-2 border-dashed border-red-500/40 hover:border-red-400 text-red-300 hover:text-white transition-all transform active:scale-95 group shadow-lg flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-3xl">🚫</span>
                  <span className="font-extrabold text-base tracking-wider uppercase font-display group-hover:scale-105 transition-transform">
                    [ TAP TO SMASH & DISSOLVE MISS ]
                  </span>
                  <span className="text-xs text-slate-400">
                    Wipes the mistake from present reality
                  </span>
                </button>
              ) : (
                <div className="py-8 px-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse flex flex-col items-center gap-2">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                  <span className="font-bold text-lg uppercase tracking-wide">
                    MISS VAPORIZED • CLEAN SLATE
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Visual Swish Anchor */}
        {step === 3 && (
          <div id="reset-step-3" className="text-center py-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase mb-3">
              <Target className="w-3.5 h-3.5" />
              <span>Sensory Imprinting</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              See the Next Shot Splashing Clean
            </h3>
            <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
              Close your eyes for 3 seconds. Visualize the ball leaving your hand in pristine rotation and snapping straight through the net.
            </p>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left mb-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    The Target Visual
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "Knees loaded, eyes locked onto the back loop of the rim. High release point. Follow-through held high like a swan neck. Pure nylon sound."
                  </p>
                </div>
              </div>
            </div>

            <button
              id="visual-lock-complete-btn"
              onClick={handleStep3Complete}
              className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm uppercase tracking-wider hover:bg-amber-400 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>I See It Clearly • Set Mantra</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: Commitment Mantra */}
        {step === 4 && (
          <div id="reset-step-4" className="py-2">
            <h3 className="text-xl font-bold text-white mb-1 text-center font-display uppercase tracking-wide">
              Lock In Your Anchor Mantra
            </h3>
            <p className="text-xs text-slate-400 text-center mb-4">
              Repeat this single cue in your mind before the next touch.
            </p>

            <div className="space-y-2 mb-4">
              {PRESET_MANTRAS.map((m) => (
                <button
                  key={m}
                  id={`mantra-choice-${m.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => {
                    setSelectedMantra(m);
                    setCustomMantra('');
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-left font-bold text-sm transition-all flex items-center justify-between border ${
                    selectedMantra === m && !customMantra
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>"{m}"</span>
                  {selectedMantra === m && !customMantra && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label htmlFor="custom-mantra-input" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Or Enter Custom Verbal Cue:
              </label>
              <input
                id="custom-mantra-input"
                type="text"
                value={customMantra}
                onChange={(e) => setCustomMantra(e.target.value)}
                placeholder="e.g. RIP THROUGH AND RISE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              id="finish-reset-btn"
              onClick={handleFinishReset}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>LOCK IN • ATTACK THE NEXT PLAY</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
