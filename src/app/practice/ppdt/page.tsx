'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Timer, Brain, Award, CheckCircle2, AlertCircle, ArrowRight, Eye, Edit3 } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function PpdtPracticePage() {
  const [phase, setPhase] = useState<'VIEW' | 'WRITE' | 'RESULT'>('VIEW');
  const [viewTimer, setViewTimer] = useState(30);
  const [writeTimer, setWriteTimer] = useState(240); // 4 minutes
  const [story, setStory] = useState('');
  const [characterData, setCharacterData] = useState({ age: '24', sex: 'M', mood: '+' });
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  // 30s View Phase Timer
  useEffect(() => {
    if (phase !== 'VIEW') return;
    const t = setInterval(() => {
      setViewTimer((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setPhase('WRITE');
          tacticalAudio.playRadarPing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // 4m Write Phase Timer
  useEffect(() => {
    if (phase !== 'WRITE') return;
    const t = setInterval(() => {
      setWriteTimer((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleEvaluateStory();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const handleEvaluateStory = async () => {
    setEvaluating(true);
    tacticalAudio.playRadarPing();

    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'PPDT_STORY',
          prompt: 'PPDT Picture Scenario #1 - Rural bridge damaged after flood, youth organizing relief',
          studentResponse: story,
          targetForce: 'ARMY'
        })
      });

      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        setPhase('RESULT');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const wordCount = story.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase">
            <Brain className="w-4 h-4" />
            <span>STAGE 1 SCREENING TEST</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
            PPDT — PICTURE PERCEPTION & STORY WRITING
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-xl mx-auto">
            30 seconds picture observation followed by 4 minutes story writing and structured character perception box.
          </p>
        </div>

        {/* Phase 1: Picture Observation (30s) */}
        {phase === 'VIEW' && (
          <div className="glass-panel rounded-2xl p-8 border border-gold-500/40 text-center space-y-6 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-navy-800 pb-3">
              <span className="flex items-center gap-2 text-gold-400 font-bold">
                <Eye className="w-4 h-4" />
                <span>OBSERVE THE HAZY PICTURE</span>
              </span>
              <span className="text-xl font-bold text-red-400 font-mono animate-pulse">
                {viewTimer} SECONDS REMAINING
              </span>
            </div>

            {/* Simulated Hazy Defense Picture Canvas */}
            <div className="aspect-[16/10] max-w-lg mx-auto bg-gradient-to-br from-slate-700 via-slate-800 to-navy-900 rounded-xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-slate-600/40 blur-sm absolute top-10 left-12" />
              <div className="w-32 h-16 rounded bg-slate-700/60 blur-md absolute bottom-8 right-16" />
              <div className="relative z-10 space-y-2 text-slate-300">
                <div className="text-sm font-bold uppercase tracking-wider font-mono">
                  [SCENE: RURAL RIVER CROSSING WITH SUBMERGED BRIDGE]
                </div>
                <div className="text-xs text-slate-400 font-sans max-w-xs mx-auto">
                  Three figures stand near the embankment. One points across the river while the other holds a rope and equipment.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  tacticalAudio.playInterfaceClick();
                  setPhase('WRITE');
                }}
                className="px-6 py-2.5 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase font-mono tracking-wider"
              >
                SKIP DIRECTLY TO STORY WRITING →
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Story Writing & Character Box (4m) */}
        {phase === 'WRITE' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                STORY WRITING WORKSPACE
              </span>
              <span className="text-xs font-mono text-red-400 font-bold">
                TIME LEFT: {Math.floor(writeTimer / 60)}:{(writeTimer % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {/* Character Matrix Box */}
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-300">
                PERCEPTION BOX (MAIN CHARACTER ATTRIBUTES):
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">AGE</label>
                  <input
                    type="number"
                    value={characterData.age}
                    onChange={(e) => setCharacterData({ ...characterData, age: e.target.value })}
                    className="w-full p-2 bg-navy-950 border border-navy-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">SEX</label>
                  <select
                    value={characterData.sex}
                    onChange={(e) => setCharacterData({ ...characterData, sex: e.target.value })}
                    className="w-full p-2 bg-navy-950 border border-navy-700 rounded text-white"
                  >
                    <option value="M">M (Male)</option>
                    <option value="F">F (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">MOOD</label>
                  <select
                    value={characterData.mood}
                    onChange={(e) => setCharacterData({ ...characterData, mood: e.target.value })}
                    className="w-full p-2 bg-navy-950 border border-navy-700 rounded text-white"
                  >
                    <option value="+">+ (Positive)</option>
                    <option value="0">0 (Neutral)</option>
                    <option value="-">- (Negative)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Story Editor */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>COMPOSE YOUR STORY (PAST, PRESENT, OUTCOME)</span>
                <span className={wordCount < 60 || wordCount > 130 ? 'text-amber-400' : 'text-defense-success font-bold'}>
                  {wordCount} WORDS (IDEAL: 70 - 110)
                </span>
              </div>
              <textarea
                rows={9}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Rafiq, a 24-year-old engineering graduate visiting his ancestral village, noticed the bamboo footbridge damaged by sudden upstream flash floods. Recognizing that schoolchildren and farmers were stranded on the opposite bank, he immediately mobilized local youth..."
                className="w-full p-4 bg-navy-900 border border-navy-700 rounded-xl text-white font-sans text-sm leading-relaxed focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              onClick={handleEvaluateStory}
              disabled={evaluating || wordCount < 15}
              className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest font-mono disabled:opacity-40 transition-all shadow-lg"
            >
              {evaluating ? 'AI PSYCHOLOGIST ANALYZING OLQ...' : 'SUBMIT STORY FOR AI EVALUATION →'}
            </button>
          </div>
        )}

        {/* Phase 3: AI Psychological Evaluation Results */}
        {phase === 'RESULT' && evaluation && (
          <div className="glass-panel rounded-2xl p-8 border border-gold-500/40 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div>
                <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                  AI PSYCHOLOGICAL REPORT
                </span>
                <h3 className="text-2xl font-black uppercase text-white font-military mt-1">
                  OFFICER LIKE QUALITIES (OLQ) ASSESSMENT
                </h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-gold-500/20 border-2 border-gold-500 text-gold-400 flex items-center justify-center font-military text-2xl font-black">
                {evaluation.score}
              </div>
            </div>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              {evaluation.summary}
            </p>

            {/* OLQ Dimensions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
              <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                <div className="text-[10px] text-slate-400">EFFECTIVE INTEL</div>
                <div className="text-sm font-bold text-defense-success mt-1">
                  {evaluation.olqFactors?.effectiveIntelligence}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                <div className="text-[10px] text-slate-400">DECISION SPEED</div>
                <div className="text-sm font-bold text-defense-success mt-1">
                  {evaluation.olqFactors?.decisionMakingSpeed}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                <div className="text-[10px] text-slate-400">SOCIAL COHESION</div>
                <div className="text-sm font-bold text-defense-success mt-1">
                  {evaluation.olqFactors?.socialAdaptability}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                <div className="text-[10px] text-slate-400">DETERMINATION</div>
                <div className="text-sm font-bold text-defense-success mt-1">
                  {evaluation.olqFactors?.determinationAndCourage}
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-defense-success/10 border border-defense-success/30 space-y-2">
                <div className="font-bold text-defense-success font-mono uppercase">OBSERVED STRENGTHS:</div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {evaluation.strengths?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="font-bold text-amber-400 font-mono uppercase">RECOMMENDED IMPROVEMENTS:</div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {evaluation.improvements?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4 border-t border-navy-800">
              <button
                onClick={() => {
                  setPhase('VIEW');
                  setViewTimer(30);
                  setWriteTimer(240);
                  setStory('');
                }}
                className="px-6 py-2.5 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase font-mono"
              >
                PRACTICE ANOTHER PPDT PICTURE →
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-slate-300 text-xs font-bold uppercase font-mono"
              >
                DASHBOARD
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
