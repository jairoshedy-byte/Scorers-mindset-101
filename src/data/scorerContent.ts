import { CoachScenario, DailyCredo } from '../types';

export const SCORER_PILLARS = [
  {
    id: 'zero-memory',
    name: 'Zero-Second Memory',
    key: 'zeroSecondMemory' as const,
    tagline: 'Misses do not exist in the present moment',
    description: 'The ability to completely wipe a missed shot, turnover, or blown opportunity within 1.5 seconds so it never infects the next possession.',
    microDrill: 'Tap the court surface twice after a miss and say your reset cue before crossing half court.',
    lowScoreWarning: 'You replay your misses in your head, causing hesitation on the subsequent open look.',
    highScorePraise: 'You treat shot #10 after 9 misses with the exact same lethal optimism as shot #1.'
  },
  {
    id: 'unconditional-confidence',
    name: 'Unconditional Confidence',
    key: 'unconditionalConfidence' as const,
    tagline: 'Belief precedes execution, never follows it',
    description: 'True scorers do not need to see the ball go in early to feel hot. Your confidence is grounded in the thousands of unseen reps in an empty gym.',
    microDrill: 'Identify your 2 primary kill spots on the floor and commit to demanding the ball there.',
    lowScoreWarning: 'Your aggression depends on whether your first shot went in. That gives the defense control over your spirit.',
    highScorePraise: 'You carry an unwavering green light. When defenses sag, you punish without remorse.'
  },
  {
    id: 'decisive-attack',
    name: 'The 0.5-Second Rule',
    key: 'decisiveAttack' as const,
    tagline: 'Hesitation is the only true turnover',
    description: 'When you catch the ball, make your decision (shoot, drive, or pass) in under half a second before help rotations solidify.',
    microDrill: 'In scrimmage, ban ball-stopping: catch-and-shoot or direct downhill drive on the first bounce.',
    lowScoreWarning: 'Catching, holding, surveying, and letting defensive closeouts take away your daylight.',
    highScorePraise: 'Explosive first step and lightning-fast trigger that leaves defenders in perpetual recovery mode.'
  },
  {
    id: 'clutch-composure',
    name: 'Clutch Inversion',
    key: 'clutchComposure' as const,
    tagline: 'Pressure is not weight; it is high-definition focus',
    description: 'Transforming rapid heartbeats, tight fourth-quarter scorelines, and hostile crowds into heightened peripheral clarity.',
    microDrill: 'Two deep nasal physiological sighs at the dead-ball whistle to drop heart rate by 15-20 BPM.',
    lowScoreWarning: 'Shrinking from the ball or rushing your release when the game hangs in the balance.',
    highScorePraise: 'You crave the final possession. The noise drops to absolute silence in your mind.'
  },
  {
    id: 'sweet-spot-discipline',
    name: 'Shot Diet & Hunting Spots',
    key: 'sweetSpotDiscipline' as const,
    tagline: 'Elite scorers get to their spots, not where the defense guides them',
    description: 'A disciplined commitment to your highest-percentage scoring zones. Not taking whatever crumbs the defense offers.',
    microDrill: 'Map your 3 top scoring zones and ensure 70% of your attempts come from those coordinates.',
    lowScoreWarning: 'Settling for contested off-balance floaters or contested jumpers late in the clock.',
    highScorePraise: 'Relentless footwork and angles to manufacture looks exactly where you are deadliest.'
  }
];

export const PRESET_SCENARIOS: CoachScenario[] = [
  {
    id: 'cold-start',
    title: '0-for-4 Cold Start Slump',
    category: 'Slump',
    situation: 'You missed your first 4 shots, the crowd or bench went quiet, and your teammate yelled to pass the ball.',
    defaultAdvice: 'A cold start is a statistical variance test. The greatest pure shooters in history relish this moment because probability dictates an incoming barrage. The rim hasn’t shrunk; only your visual focus tightened into a knot. Get to the charity stripe, attack the rim off a cut, or run hard in transition to score an uncontested layup and activate muscle memory.',
    defaultAnchor: 'NEXT ONE RAINS',
    steps: [
      'Take a physiological double-inhale through your nose, slow 4-second mouth exhale.',
      'Cut without the ball to secure a point-blank finish or draw contact.',
      'On the next catch, do not think about arm mechanics—focus entirely on the back of the rim.'
    ]
  },
  {
    id: 'clutch-free-throws',
    title: 'Down 1, Final 10 Seconds',
    category: 'Clutch',
    situation: 'Down 1 point with 10 seconds left on the clock. You have the ball in your hands or are stepping up to the foul line.',
    defaultAdvice: 'Your autonomic nervous system is pumping adrenaline. Average players interpret adrenaline as shaking fear; elite scorers interpret it as hyper-speed vision. Slow your bounce rhythm down. Lock onto the front iron, elevate on your terms, and follow through high with relaxed fingertips.',
    defaultAnchor: 'JUST ANOTHER REP',
    steps: [
      'Feel your sneakers dig into the floorboards—ground your center of gravity.',
      'Bounce the ball three times at your exact habitual tempo without rushing.',
      'Exhale on the upward gather; let muscle memory do 100% of the work.'
    ]
  },
  {
    id: 'physical-defender',
    title: 'Suffocating Physical Defender',
    category: 'Aggression',
    situation: 'A physical lockdown defender is hand-checking, bumping your cuts, and trying to get into your head.',
    defaultAdvice: 'A defender who plays overly aggressive is an over-eager fish biting on bait. Use their momentum against them. A sharp shot fake, a hard change of pace, or a shoulder into their chest immediately puts them in foul trouble or leaves them sliding past you. Welcome the contact and finish through their body.',
    defaultAnchor: 'THEY BITE, I STRIKE',
    steps: [
      'Lower your hips lower than theirs on the catch to own the leverage battle.',
      'Use crisp rip-throughs and decisive head fakes to make them lunge.',
      'Initiate legal contact with your inside shoulder when elevating at the cup.'
    ]
  },
  {
    id: 'benched-after-turnover',
    title: 'Pulled to Bench After Mistake',
    category: 'Focus',
    situation: 'Coach yanked you out of the game after a bad miss or a turnover. You are burning with frustration on the pine.',
    defaultAdvice: 'Do not sit with bad posture or stare at the floor. That communicates submission to the opposing scout. Sit upright, watch the defensive coverages, track how they rotate when your substitute attacks, and find the open spaces you will exploit the second you check back in. Turn frustration into tactical recon.',
    defaultAnchor: 'RELOAD AND RE-ENTER',
    steps: [
      'Take 3 deep box-breaths: 4s inhale, 4s hold, 4s exhale, 4s hold.',
      'Identify two specific defensive rotations from your vantage point on the bench.',
      'Stand up and cheer on the next defensive stop to keep your energy vibrating high.'
    ]
  }
];

export const LEGEND_CREDOS: DailyCredo[] = [
  {
    id: 'kobe',
    author: 'Kobe Bryant',
    context: 'After going 0-for-30 in a playoff game mindset',
    quote: "I would go 0-for-30 before I would go 0-for-9. 0-for-9 means you beat yourself, you psyched yourself out of the game.",
    actionablePrinciple: "A scorer never stops shooting when the team needs offense. Fear of missing is the only true failure."
  },
  {
    id: 'jordan',
    author: 'Michael Jordan',
    context: 'On failure and repetition',
    quote: "I've missed more than 9,000 shots in my career. I've lost almost 300 games. 26 times I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.",
    actionablePrinciple: "Failure is merely the friction that polishes clutch execution. Step up every single time."
  },
  {
    id: 'curry',
    author: 'Stephen Curry',
    context: 'On release confidence',
    quote: "The only shot that matters is the next one. Once the ball leaves your fingers, it’s out of your control. You did the work. Let it go.",
    actionablePrinciple: "Focus purely on process, balance, and release rhythm—divorce your emotion from the ball's trajectory."
  },
  {
    id: 'haaland',
    author: 'Erling Haaland',
    context: 'On striker psychology',
    quote: "I don't think about the chances I missed. I only live for the next touch in the box. A striker has to be obsessed with the next second.",
    actionablePrinciple: "Predatory anticipation: be completely awake to the millimeter of space in the box before it opens."
  },
  {
    id: 'bird',
    author: 'Larry Bird',
    context: 'Before the 3-Point Contest locker room',
    quote: "I just walked in and looked around and asked which one of you guys is coming in second.",
    actionablePrinciple: "Project quiet, sovereign certainty before the contest even begins. Confidence is infectious."
  }
];

export const VISUALIZATION_STAGES = [
  {
    stage: 1,
    title: 'The Tunnel & Sensory Grounding',
    durationSeconds: 20,
    prompt: 'Feel the grip of the ball in your fingertips. Hear the hum of the gym lights and the squeak of sneakers on polished hardwood or studs digging into turf. Breathe in through your nose for 4 seconds, holding for 2. You are here to dominate.',
    cue: 'GROUNDED & READY'
  },
  {
    stage: 2,
    title: 'The First High-Rhythm Make',
    durationSeconds: 25,
    prompt: 'Visualize receiving the ball right in your shooting pocket. Your footwork is crisp—1-2 step, knees coiled, chest proud. You elevate effortlessly. The ball rolls off your index and middle finger with perfect backspin. SWISH. Nothing but cords.',
    cue: 'EFFORTLESS FLOW'
  },
  {
    stage: 3,
    title: 'The Adversity Flush Drill',
    durationSeconds: 20,
    prompt: 'Now see yourself taking a tough shot that rims out. An opponent taunts you. Notice what you do: you clap your hands once, sprint into transition defense, get a stop, and sprint back down. The miss is gone like smoke in the wind.',
    cue: 'ZERO SECONDS'
  },
  {
    stage: 4,
    title: 'The Final Dagger / Clutch Execution',
    durationSeconds: 25,
    prompt: 'The clock is at 5 seconds. Tied game. You create separation with your go-to move. You rise above the outstretched hand. The buzzer sounds as the ball hangs in the air... Rip. Clean through the net. Total composure.',
    cue: 'COLD BLOODED'
  }
];
