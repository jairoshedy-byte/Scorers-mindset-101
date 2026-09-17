export type SportType = 'Basketball' | 'Soccer' | 'Hockey' | 'Lacrosse' | 'Tennis' | 'Other';

export interface MindsetScore {
  zeroSecondMemory: number; // 1-10
  unconditionalConfidence: number; // 1-10
  decisiveAttack: number; // 1-10
  clutchComposure: number; // 1-10
  sweetSpotDiscipline: number; // 1-10
}

export interface ScorerAuditResult {
  scores: MindsetScore;
  overallIndex: number; // 0-100
  archetype: string;
  superpower: string;
  primaryBlindspot: string;
  recommendedFocus: string;
  date: string;
}

export interface SessionLog {
  id: string;
  date: string;
  sport: SportType;
  sessionType: 'Game' | 'Scrimmage' | 'Shooting Practice' | 'Pre-Game Warmup';
  repsOrMinutes: number;
  mindsetRating: number; // 1-10
  hesitationsCount: number;
  recoverySpeed: 'Instant (<2s)' | 'Quick (<30s)' | 'Dwelt on errors';
  keyBreakthrough: string;
  anchorCueUsed: string;
}

export interface CoachScenario {
  id: string;
  title: string;
  category: 'Slump' | 'Clutch' | 'Aggression' | 'Focus' | 'Defense';
  situation: string;
  defaultAdvice: string;
  defaultAnchor: string;
  steps: string[];
}

export interface DailyCredo {
  id: string;
  author: string;
  context: string;
  quote: string;
  actionablePrinciple: string;
}
