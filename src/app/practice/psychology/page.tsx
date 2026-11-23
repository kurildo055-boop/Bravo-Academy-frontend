'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Clock, CheckCircle2, ArrowRight, Zap, Award } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function PsychologyPracticePage() {
  const [activeTest, setActiveTest] = useState<'WAT' | 'SCT' | 'SRT' | 'SDT'>('WAT');

  // WAT (Word Association Test: 15-second timer)
  const watWords = ['LEADER', 'COURAGE', 'DUTY', 'SACRIFICE', 'TEAM', 'FEAR', 'VICTORY', 'ORDER'];
  const [watIndex, setWatIndex] = useState(0);
  const [watTime, setWatTime] = useState(15);
  const [watSentence, setWatSentence] = useState('');
  const [watResponses, setWatResponses] = useState<string[]>([]);
  const [watDone, setWatDone] = useState(false);

  // SCT (Sentence Completion)
  const sctPrompts = [
    'When the unexpected crisis occurred, the commander...',
    'In challenging atmospheric conditions, a disciplined soldier...',
    'My deepest ambition as an officer is to...',
  ];
  const [sctAnswers, setSctAnswers] = useState<Record<number, string>>({});

  // SRT (Situation Reaction Test)
  const srtScenarios = [
    'You are leading a 4-man patrol in dense terrain when one member sustains an ankle sprain and your radio antenna breaks. You...',
    'During night naval navigation, radar detects an unidentified contact closing rapidly inside restricted waters. You...',
  ];
  const [srtAnswers, setSrtAnswers] = useState<Record<number, string>>({});

  // WAT Auto-countdown
  useEffect(() => {
    if (activeTest !== 'WAT' || watDone) return;
    const t = setInterval(() => {
      setWatTime((prev) => {
        if (prev <= 1) {
          // Advance to next word
          tacticalAudio.playInterfaceClick();
          setWatResponses((r) => [...r, watSentence]);
          setWatSentence('');
          if (watIndex < watWords.length - 1) {
            setWatIndex((i) => i + 1);
            return 15;
          } else {
            clearInterval(t);
            setWatDone(true);
            tacticalAudio.playRadarPing();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeTest, watIndex, watSentence, watDone]);

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase">
            <Brain className="w-4 h-4" />
            <span>STAGE 2 PSYCHOLOGICAL BATTERY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
            PSYCHOLOGY PRACTICE SUITE
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-xl mx-auto">
            WAT 15-second timed drill, Sentence Completion (SCT), Situation Reaction (SRT), and Self-Description (SDT).
          </p>
        </div>

        {/* Test Tabs */}
        <div className="flex justify-center gap-2 border-b border-navy-800 pb-3">
          {[
            { id: 'WAT', label: 'WAT (15-SEC DRILL)' },
            { id: 'SCT', label: 'SCT (SENTENCE)' },
            { id: 'SRT', label: 'SRT (SITUATION)' },
            { id: 'SDT', label: 'SDT (SELF DESCRIPTION)' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setActiveTest(t.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTest === t.id
                  ? 'bg-gold-500 text-navy-950 shadow-md'
                  : 'bg-navy-900 border border-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* WAT INTERFACE */}
        {activeTest === 'WAT' && (
          <div className="glass-panel rounded-2xl p-8 border border-gold-500/40 text-center space-y-6 shadow-2xl">
            {!watDone ? (
              <>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-navy-800 pb-3">
                  <span>WORD {watIndex + 1} OF {watWords.length}</span>
                  <span className="text-2xl font-bold text-red-400 font-mono animate-pulse">
                    00:{watTime.toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="py-8">
                  <div className="text-4xl sm:text-6xl font-black text-gold-400 font-military tracking-widest uppercase drop-shadow-[0_2px_12px_rgba(214,173,96,0.3)]">
                    {watWords[watIndex]}
                  </div>
                </div>

                <div className="max-w-lg mx-auto">
                  <input
                    type="text"
                    autoFocus
                    value={watSentence}
                    onChange={(e) => setWatSentence(e.target.value)}
                    placeholder="Type spontaneous assertive sentence..."
                    className="w-full text-center p-3.5 bg-navy-900 border border-navy-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4 py-4">
                <CheckCircle2 className="w-12 h-12 text-defense-success mx-auto" />
                <h3 className="text-2xl font-black uppercase text-white font-military">
                  WAT DRILL COMPLETED
                </h3>
                <div className="text-xs font-mono text-slate-300 max-w-md mx-auto space-y-2 text-left bg-navy-900 p-4 rounded-xl border border-navy-800">
                  <div className="font-bold text-gold-400">RECORDED SPONTANEOUS RESPONSES:</div>
                  {watResponses.map((r, i) => (
                    <div key={i}>
                      <strong className="text-slate-400">{watWords[i]}:</strong> {r || '(Missed due to timeout)'}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setWatIndex(0);
                    setWatTime(15);
                    setWatResponses([]);
                    setWatDone(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase font-mono"
                >
                  RESTART WAT DRILL →
                </button>
              </div>
            )}
          </div>
        )}

        {/* SCT INTERFACE */}
        {activeTest === 'SCT' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
            <h3 className="text-lg font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              SENTENCE COMPLETION TEST (SCT)
            </h3>
            <div className="space-y-4">
              {sctPrompts.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2 text-xs font-mono">
                  <div className="text-slate-300 font-bold">{idx + 1}. {p}</div>
                  <input
                    type="text"
                    value={sctAnswers[idx] || ''}
                    onChange={(e) => setSctAnswers({ ...sctAnswers, [idx]: e.target.value })}
                    placeholder="Complete with solution-oriented action..."
                    className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded text-white"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => tacticalAudio.playRadarPing()}
              className="w-full py-3 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase font-mono"
            >
              EVALUATE SCT COMPLETIONS →
            </button>
          </div>
        )}

        {/* SRT INTERFACE */}
        {activeTest === 'SRT' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
            <h3 className="text-lg font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              SITUATION REACTION TEST (SRT)
            </h3>
            <div className="space-y-4">
              {srtScenarios.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2 text-xs font-mono">
                  <div className="text-slate-200 font-bold leading-relaxed">{idx + 1}. {s}</div>
                  <textarea
                    rows={2}
                    value={srtAnswers[idx] || ''}
                    onChange={(e) => setSrtAnswers({ ...srtAnswers, [idx]: e.target.value })}
                    placeholder="Enter immediate crisis resolution..."
                    className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded text-white"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => tacticalAudio.playRadarPing()}
              className="w-full py-3 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase font-mono"
            >
              SUBMIT SRT REACTIONS →
            </button>
          </div>
        )}

        {/* SDT INTERFACE */}
        {activeTest === 'SDT' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
            <h3 className="text-lg font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              SELF-DESCRIPTION TEST (SDT)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <label className="text-gold-400 font-bold">1. WHAT PARENTS THINK OF ME:</label>
                <textarea rows={3} className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded text-white" />
              </div>
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <label className="text-gold-400 font-bold">2. WHAT TEACHERS THINK OF ME:</label>
                <textarea rows={3} className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded text-white" />
              </div>
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <label className="text-gold-400 font-bold">3. WHAT FRIENDS THINK OF ME:</label>
                <textarea rows={3} className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded text-white" />
              </div>
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <label className="text-gold-400 font-bold">4. WHAT I THINK OF MYSELF:</label>
                <textarea rows={3} className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded text-white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
