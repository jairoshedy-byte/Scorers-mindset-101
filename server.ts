import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { ZipArchive } from 'archiver';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Download project ZIP archive
  app.get('/api/download-zip', (req, res) => {
    res.attachment('scorers-mindset-app.zip');
    const archive = new ZipArchive({
      zlib: { level: 9 }
    });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to create zip archive' });
      }
    });

    archive.pipe(res);

    // Glob all project source files excluding build artifacts and dependencies
    archive.glob('**/*', {
      cwd: process.cwd(),
      ignore: [
        'node_modules/**',
        'dist/**',
        '.git/**',
        '*.log',
        '.cache/**',
        '.env'
      ],
      dot: true
    });

    archive.finalize();
  });

  // AI Mental Coach Endpoint
  app.post('/api/coach', async (req, res) => {
    try {
      const { prompt, sport = 'Basketball', currentMentalState, contextType = 'general' } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const client = getAIClient();

      if (!client) {
        // High quality fallback responses tailored to context
        const fallbackAdvice = getFallbackCoaching(prompt, sport, contextType);
        return res.json({
          reply: fallbackAdvice.reply,
          anchorCue: fallbackAdvice.anchorCue,
          actionSteps: fallbackAdvice.actionSteps,
          visualizationPrompt: fallbackAdvice.visualizationPrompt,
          isAiGenerated: false
        });
      }

      const systemInstruction = `You are the legendary "Scorer's Mindset" mental performance coach for elite athletes (specializing in ${sport} and all high-tempo competitive sports). 
Your coaching philosophy is grounded in:
1. Zero-Second Memory: Misses do not exist in the present tense. The rim/goal never moves; mechanics and conviction reign supreme.
2. The "Next Shot In" doctrine: Confidence is an operational decision, not a byproduct of previous makes.
3. Decisive Aggression: Hesitation is the only true turnover. Attack spaces before defenses set.
4. Clutch Inversion: Reframe elevated heart rates and pressure as fuel and heightened visual acuity.

When a player presents a scenario, slump, anxiety, or question, provide:
1. A direct, empowering coach breakdown (2-3 concise, punchy paragraphs, athlete-to-coach tone, no generic corporate fluff).
2. A single high-impact "Anchor Cue" (a 2-4 word mantra they repeat under pressure, e.g. "FEET SET, LET FLY", "ATTACK THE GAP", "NEXT REEL").
3. 3 crisp tactical action steps for their next possession or session.
4. A 45-second micro-visualization script (what to visualize right now).

Respond in valid JSON with this exact structure:
{
  "reply": "Coaching breakdown text",
  "anchorCue": "3-word power mantra",
  "actionSteps": ["step 1", "step 2", "step 3"],
  "visualizationPrompt": "Visualization script text"
}`;

      const generatePromise = client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Player context: Sport=${sport}, State=${currentMentalState || 'In game / practice'}, Mode=${contextType}. \nPlayer's Situation: ${prompt}` }]
          }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timeout')), 6000)
      );

      const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          reply: parsed.reply || responseText,
          anchorCue: parsed.anchorCue || "NEXT ONE'S IN",
          actionSteps: parsed.actionSteps || ["Breathe in rhythm", "Lock eye on target", "Shoot with conviction"],
          visualizationPrompt: parsed.visualizationPrompt || "Picture the ball snapping clean through the cords.",
          isAiGenerated: true
        });
      } catch (jsonErr) {
        return res.json({
          reply: responseText,
          anchorCue: "NEXT ONE'S IN",
          actionSteps: ["Clear the previous play", "Find your sweet spot", "Release without hesitation"],
          visualizationPrompt: "See yourself sinking the next three opportunities smoothly.",
          isAiGenerated: true
        });
      }
    } catch (err: any) {
      console.error('Gemini coach error:', err);
      const fallback = getFallbackCoaching(req.body.prompt || '', req.body.sport || 'Basketball', req.body.contextType || 'general');
      return res.json({
        ...fallback,
        isAiGenerated: false
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Scorer's Mindset server running on http://localhost:${PORT}`);
  });
}

function getFallbackCoaching(prompt: string, sport: string, contextType: string) {
  const p = prompt.toLowerCase();
  if (p.includes('slump') || p.includes('miss') || p.includes('0 for') || p.includes('bad start')) {
    return {
      reply: `Every great scorer has missed 10 in a row. The difference between an ordinary player and a killer scorer is that the scorer views shot #11 with the exact same lethal confidence as shot #1. A slump is not mechanical—it is cognitive hesitation. When you second-guess your release, you alter your muscle memory. Strip the noise. The rim in ${sport} hasn't shrunk an inch.`,
      anchorCue: "CLEAN SLATE, PULL",
      actionSteps: [
        "Take a deep physiological sigh (double inhale through the nose, long exhale)",
        "Earn an easy touch at the rim, penalty spot, or free throw line to feel the leather touch the bottom",
        "Shoot your next open look in rhythm without letting the ball sit in your hands for more than 0.5s"
      ],
      visualizationPrompt: "Close your eyes. Watch your previous misses dissolve into dust. Now see yourself receiving the pass in perfect rhythm, your balance centered, firing, and the ball splashing dead center."
    };
  }

  if (p.includes('clutch') || p.includes('pressure') || p.includes('nervous') || p.includes('late game')) {
    return {
      reply: `That surge in your chest isn't fear—it's adrenaline priming your neuromuscular system for peak velocity. Reframe the physical sensation: your body is literally handing you supercharged reaction time. When the clock is winding down, passive players hope someone else takes charge. Scorers live for this exact moment because the stakes clarify the task.`,
      anchorCue: "ICE IN VEINS",
      actionSteps: [
        "Anchor your feet firmly to the surface; feel your center of gravity sink",
        "Narrow your visual aperture to a single dime-sized spot on the target",
        "Trust the 10,000 reps you put in when nobody was watching"
      ],
      visualizationPrompt: "Hear the arena or court noise fade into dead silence. You have the ball in your dominant pocket. You create 6 inches of daylight, rise up effortlessly, and execute your signature finish."
    };
  }

  return {
    reply: `A pure scorer doesn't negotiate with doubt. Your primary job on the floor or pitch is to put persistent pressure on the defense until they crack. When you hesitate, you give the defender a free recovery step. When you attack decisively, you dictate the terms of engagement. Play on your front foot and trust your instincts.`,
    anchorCue: "ATTACK ON SIGHT",
    actionSteps: [
      "Commit to the first clean opening you identify without surveying twice",
      "Keep your body language tall and commanding between every whistle",
      "Demand the rock with purpose on your team's next transition opportunity"
    ],
    visualizationPrompt: "Envision yourself flowing through defensive gaps with effortless speed, elevating in balance, and celebrating with focused composure."
  };
}

startServer();
