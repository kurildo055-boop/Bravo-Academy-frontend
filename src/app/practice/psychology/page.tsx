'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Brain,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Award,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Eye,
  FileText,
  AlertTriangle,
  Play,
  Shield,
  Layers
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

interface PsychItem {
  id: string;
  testType: string;
  promptText: string;
  imageUrl?: string;
  timeLimitSec: number;
  sampleAnswer?: string;
  category?: string;
}

export default function PsychologyPracticePage() {
  const [activeTab, setActiveTab] = useState<'WAT' | 'TAT' | 'SCT' | 'SRT' | 'SD'>('WAT');

  // Database loaded items
  const [items, setItems] = useState<PsychItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // 1. WAT STATE
  const [watActive, setWatActive] = useState(false);
  const [watIndex, setWatIndex] = useState(0);
  const [watTime, setWatTime] = useState(15);
  const [watInput, setWatInput] = useState('');
  const [watResponses, setWatResponses] = useState<{ word: string; sentence: string }[]>([]);
  const [watFinished, setWatFinished] = useState(false);
  const watInputRef = useRef<HTMLInputElement | null>(null);

  // 2. TAT STATE
  const [tatIndex, setTatIndex] = useState(0);
  const [tatPhase, setTatPhase] = useState<'VIEW' | 'WRITE' | 'REVIEW'>('VIEW');
  const [tatViewTime, setTatViewTime] = useState(30);
  const [tatWriteTime, setTatWriteTime] = useState(240);
  const [tatStory, setTatStory] = useState('');

  // 3. SCT STATE
  const [sctAnswers, setSctAnswers] = useState<Record<string, string>>({});

  // 4. SRT STATE
  const [srtAnswers, setSrtAnswers] = useState<Record<string, string>>({});
  const [srtRevealed, setSrtRevealed] = useState<Record<string, boolean>>({});

  // 5. SD STATE
  const [sdAnswers, setSdAnswers] = useState<Record<string, string>>({});

  // Fetch psychology items
  useEffect(() => {
    async function fetchPsychItems() {
      setLoadingItems(true);
      try {
        const res = await fetch(`/api/modules/psychology?type=${activeTab}`);
        const data = await res.json();
        if (data.success && data.items?.length > 0) {
          setItems(data.items);
        } else {
          // Fallback if none in db yet
          if (activeTab === 'WAT') {
            const fallbackWords = ['LEADER', 'DUTY', 'WAR', 'BRAVE', 'FEAR', 'SACRIFICE', 'ATTACK', 'PEACE', 'HONOR', 'VICTORY'];
            setItems(fallbackWords.map((w, i) => ({ id: `fb-${i}`, testType: 'WAT', promptText: w, timeLimitSec: 15 })));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingItems(false);
      }
    }
    fetchPsychItems();
  }, [activeTab]);

  // WAT 15-SECOND AUTO ADVANCING TIMER
  useEffect(() => {
    if (!watActive || watFinished || items.length === 0) return;

    if (watTime <= 3 && watTime > 0) {
      tacticalAudio.playRadarPing();
    }

    const t = setInterval(() => {
      setWatTime((prev) => {
        if (prev <= 1) {
          // Record current response & advance
          const currentWord = items[watIndex]?.promptText || '';
          setWatResponses((r) => [...r, { word: currentWord, sentence: watInput }]);
          setWatInput('');

          if (watIndex < items.length - 1) {
            setWatIndex((i) => i + 1);
            tacticalAudio.playInterfaceClick();
            return 15;
          } else {
            clearInterval(t);
            setWatFinished(true);
            setWatActive(false);
            tacticalAudio.playRadarPing();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [watActive, watFinished, watIndex, watTime, watInput, items]);

  const handleStartWat = () => {
    setWatIndex(0);
    setWatTime(15);
    setWatInput('');
    setWatResponses([]);
    setWatFinished(false);
    setWatActive(true);
    tacticalAudio.playInterfaceClick();
    setTimeout(() => watInputRef.current?.focus(), 100);
  };

  const handleManualWatNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!watActive || watFinished) return;

    const currentWord = items[watIndex]?.promptText || '';
    setWatResponses((r) => [...r, { word: currentWord, sentence: watInput }]);
    setWatInput('');

    if (watIndex < items.length - 1) {
      setWatIndex((i) => i + 1);
      setWatTime(15);
      tacticalAudio.playInterfaceClick();
      setTimeout(() => watInputRef.current?.focus(), 50);
    } else {
      setWatFinished(true);
      setWatActive(false);
      tacticalAudio.playRadarPing();
    }
  };

  // TAT Timers
  useEffect(() => {
    if (activeTab !== 'TAT') return;
    if (tatPhase === 'VIEW') {
      const t = setInterval(() => {
        setTatViewTime((prev) => {
          if (prev <= 1) {
            clearInterval(t);
            setTatPhase('WRITE');
            tacticalAudio.playRadarPing();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    } else if (tatPhase === 'WRITE') {
      const t = setInterval(() => {
        setTatWriteTime((prev) => {
          if (prev <= 1) {
            clearInterval(t);
            setTatPhase('REVIEW');
            tacticalAudio.playRadarPing();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [activeTab, tatPhase]);

  const currentTatItem = items[tatIndex] || items[0];

  return (
    <div className="min-h-screen bg-[#040d08] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Brain className="w-3.5 h-3.5" />
              <span>ISSB DAY 2 • OPTION 5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military tracking-wider mt-2">
              PSYCHOLOGY BATTERY SUITE
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Word Association (WAT 15s Drill), Thematic Apperception (TAT), Sentence Completion (SCT), Situation Reaction (SRT) & Self-Description (SD)
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:text-white hover:border-emerald-500 text-xs font-mono font-bold uppercase transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-emerald-950 pb-3">
          {[
            { id: 'WAT', label: '1. WAT (15-Sec Flashcard Drill)', icon: Zap },
            { id: 'TAT', label: '2. TAT (12 Picture Stories)', icon: Eye },
            { id: 'SCT', label: '3. SCT (Sentence Completion)', icon: FileText },
            { id: 'SRT', label: '4. SRT (Situation Reaction)', icon: AlertTriangle },
            { id: 'SD', label: '5. SD (Self-Description)', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  tacticalAudio.playInterfaceClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  isSelected
                    ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'
                    : 'bg-[#071910] border border-emerald-900/60 text-slate-300 hover:border-emerald-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            SUB-TEST 1: WAT (WORD ASSOCIATION TEST)
            ======================================================== */}
        {activeTab === 'WAT' && (
          <div className="space-y-6">
            {!watActive && !watFinished ? (
              <div className="p-8 rounded-2xl bg-[#071910] border border-emerald-800/60 text-center space-y-6">
                <div className="max-w-xl mx-auto space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-white font-military">
                    WAT 15-SECOND RAPID FLASHCARD DRILL
                  </h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    60 words are flashed on the projection screen for 15 seconds each. In these 15 seconds, you must observe the word, formulate a spontaneous, positive, meaningful sentence, and type it before the screen automatically advances.
                  </p>
                  <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 text-xs font-mono text-left space-y-1.5 text-slate-300">
                    <span className="text-gold-400 font-bold block uppercase">PSYCHOLOGIST GOLDEN RULES:</span>
                    <div>• Avoid proverbs/clichés (e.g. "Honesty is the best policy").</div>
                    <div>• Demonstrate officer traits: duty, courage, resilience, empathy.</div>
                    <div>• Do not write negative or morbid thoughts even for words like 'DEATH' or 'WAR'.</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={handleStartWat}
                    className="px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-mono font-black text-sm uppercase tracking-wider shadow-xl transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>START 15-SECOND WAT DRILL ({items.length} WORDS LOADED)</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">
                    Auto-advances every 15 seconds • Hit Enter or click Next to save early
                  </span>
                </div>
              </div>
            ) : watActive && !watFinished ? (
              <div className="p-8 rounded-2xl bg-[#071910] border-2 border-gold-500/60 text-center space-y-8 shadow-2xl">
                {/* Header info */}
                <div className="flex items-center justify-between text-xs font-mono border-b border-emerald-950 pb-3">
                  <span className="text-emerald-400 font-bold">
                    WORD {watIndex + 1} OF {items.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span className={`text-2xl font-black font-mono ${watTime <= 3 ? 'text-red-400 animate-pulse' : 'text-gold-400'}`}>
                      00:{watTime.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Main Flashed Word */}
                <div className="py-10">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-2">
                    ASSOCIATE INSTANTLY:
                  </span>
                  <h2 className="text-5xl sm:text-7xl font-black uppercase text-gold-400 font-military tracking-widest drop-shadow-[0_4px_20px_rgba(225,161,0,0.3)] animate-fadeIn">
                    {items[watIndex]?.promptText || 'LEADER'}
                  </h2>
                </div>

                {/* Fast Input Form */}
                <form onSubmit={handleManualWatNext} className="max-w-xl mx-auto space-y-4">
                  <input
                    ref={watInputRef}
                    type="text"
                    value={watInput}
                    onChange={(e) => setWatInput(e.target.value)}
                    placeholder="Type spontaneous positive response sentence..."
                    className="w-full px-5 py-4 rounded-xl bg-[#040e09] border-2 border-emerald-800 text-white font-sans text-base focus:border-gold-500 focus:outline-none text-center"
                    autoFocus
                  />
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                    <span>Press Enter ↵ to advance immediately</span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 hover:text-white font-bold uppercase"
                    >
                      Next Word →
                    </button>
                  </div>
                </form>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-emerald-950">
                  <div
                    className="bg-gold-500 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(watTime / 15) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              /* WAT COMPLETED SUMMARY */
              <div className="p-6 rounded-2xl bg-[#071910] border border-gold-500/50 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
                  <div>
                    <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                      WAT DRILL COMPLETED • {watResponses.length} RESPONSES LOGGED
                    </span>
                    <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                      PSYCHOLOGICAL BATTERY RECORD SHEET
                    </h3>
                  </div>
                  <button
                    onClick={handleStartWat}
                    className="px-4 py-2 rounded-xl bg-gold-500 text-navy-950 font-mono font-bold text-xs uppercase flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake WAT Drill</span>
                  </button>
                </div>

                <div className="divide-y divide-emerald-950 max-h-[60vh] overflow-y-auto pr-2">
                  {watResponses.map((res, i) => (
                    <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-500 w-8">{i + 1}.</span>
                        <span className="font-mono font-bold text-gold-400 uppercase w-28">{res.word}</span>
                        <span className="text-white font-sans">{res.sentence || '(No sentence provided)'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                        {res.sentence.length > 5 ? '✓ Recorded' : '⚠ Blank/Omitted'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            SUB-TEST 2: TAT (THEMATIC APPERCEPTION TEST)
            ======================================================== */}
        {activeTab === 'TAT' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
                <div>
                  <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                    SLIDE {tatIndex + 1} OF {items.length || 1}
                  </span>
                  <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                    THEMATIC APPERCEPTION TEST (TAT)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={tatIndex <= 0}
                    onClick={() => {
                      setTatIndex((i) => i - 1);
                      setTatPhase('VIEW');
                      setTatViewTime(30);
                      setTatWriteTime(240);
                      setTatStory('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-xs font-mono text-slate-300 disabled:opacity-40"
                  >
                    ← Prev Slide
                  </button>
                  <button
                    disabled={tatIndex >= items.length - 1}
                    onClick={() => {
                      setTatIndex((i) => i + 1);
                      setTatPhase('VIEW');
                      setTatViewTime(30);
                      setTatWriteTime(240);
                      setTatStory('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-xs font-mono text-slate-300 disabled:opacity-40"
                  >
                    Next Slide →
                  </button>
                </div>
              </div>

              {/* TAT Phase Controller */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Slide */}
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-emerald-800 bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentTatItem?.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80'}
                      alt="TAT Slide"
                      className="w-full h-full object-cover filter blur-[1px]"
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-black/80 font-mono text-xs text-gold-400 font-bold">
                      {tatPhase === 'VIEW' ? `00:${tatViewTime.toString().padStart(2, '0')}` : '4:00 TIMER'}
                    </div>
                  </div>
                  <div className="text-xs font-sans text-slate-300 p-3 rounded-lg bg-[#040e09] border border-emerald-950">
                    <span className="font-mono text-gold-400 font-bold block mb-1">PROMPT DESCRIPTION:</span>
                    {currentTatItem?.promptText}
                  </div>
                </div>

                {/* Story Editor & Sample Solution */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                      <span className="text-emerald-400 font-bold uppercase">CADET STORY RESPONSE:</span>
                      <span>Words: {tatStory.split(/\s+/).filter(Boolean).length}</span>
                    </div>
                    <textarea
                      rows={10}
                      value={tatStory}
                      onChange={(e) => setTatStory(e.target.value)}
                      placeholder="Write your 100-120 word narrative describing the background, hero action, and successful outcome..."
                      className="w-full p-3 rounded-xl bg-[#040e09] border border-emerald-900 text-white font-sans text-xs focus:border-gold-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {currentTatItem?.sampleAnswer && (
                    <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs font-sans space-y-1">
                      <span className="font-mono font-bold text-gold-400 uppercase block">RECOMMENDED PSYCHOLOGIST ANGLE:</span>
                      <p className="text-slate-300">{currentTatItem.sampleAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-TEST 3: SCT (SENTENCE COMPLETION TEST)
            ======================================================== */}
        {activeTab === 'SCT' && (
          <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
            <div className="border-b border-emerald-950 pb-4">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                RAPID SENTENCE COMPLETION DRILL
              </span>
              <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                SCT DRILL ({items.length} ITEMS)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Complete the sentence with spontaneous, positive, and mission-oriented thought. Avoid escapism.
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-gold-400 font-bold">{idx + 1}.</span>
                    <span className="text-white font-bold">{item.promptText}</span>
                  </div>
                  <input
                    type="text"
                    value={sctAnswers[item.id] || ''}
                    onChange={(e) => setSctAnswers({ ...sctAnswers, [item.id]: e.target.value })}
                    placeholder="Complete the sentence..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#071910] border border-emerald-900 text-white text-xs font-sans focus:border-gold-500 focus:outline-none"
                  />
                  {item.sampleAnswer && (
                    <div className="text-[11px] font-mono text-emerald-400 pt-1">
                      ✓ Model Ending: <span className="text-slate-300">{item.sampleAnswer}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-TEST 4: SRT (SITUATION REACTION TEST)
            ======================================================== */}
        {activeTab === 'SRT' && (
          <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
            <div className="border-b border-emerald-950 pb-4">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                TACTICAL CRISIS MANAGEMENT
              </span>
              <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                SITUATION REACTION TEST (SRT)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Immediate, practical decisions under life-or-death or tactical crisis constraints.
              </p>
            </div>

            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gold-400 font-bold uppercase">SITUATION #{idx + 1}</span>
                    <span className="text-slate-400">{item.category || 'TACTICAL'}</span>
                  </div>
                  <p className="text-sm font-sans font-bold text-white leading-relaxed">
                    "{item.promptText}"
                  </p>
                  <textarea
                    rows={3}
                    value={srtAnswers[item.id] || ''}
                    onChange={(e) => setSrtAnswers({ ...srtAnswers, [item.id]: e.target.value })}
                    placeholder="State your exact step-by-step immediate course of action..."
                    className="w-full p-3 rounded-lg bg-[#071910] border border-emerald-900 text-white text-xs font-sans focus:border-gold-500 focus:outline-none"
                  />
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setSrtRevealed({ ...srtRevealed, [item.id]: !srtRevealed[item.id] })}
                      className="text-xs font-mono text-gold-400 hover:text-gold-300 font-bold uppercase underline"
                    >
                      {srtRevealed[item.id] ? 'Hide Model Officer Reaction' : 'View Model Officer Reaction'}
                    </button>
                  </div>
                  {srtRevealed[item.id] && item.sampleAnswer && (
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-xs font-sans text-emerald-300">
                      <span className="font-mono font-bold uppercase block text-emerald-400 mb-1">OFFICER SOLUTION:</span>
                      {item.sampleAnswer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-TEST 5: SD (SELF-DESCRIPTION)
            ======================================================== */}
        {activeTab === 'SD' && (
          <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
            <div className="border-b border-emerald-950 pb-4">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                HONEST SELF-APPRAISAL
              </span>
              <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                SELF-DESCRIPTION BATTERY (SD)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                5 Standard ISSB Dimensions: Parents View, Teachers View, Friends View, Self Perception & Future Vision.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { key: 'PARENTS', label: '1. What your parents think of you', desc: 'Their view on your obedience, responsibility, emotional maturity and domestic habits.' },
                { key: 'TEACHERS', label: '2. What your teachers and instructors think of you', desc: 'Their view on your academic diligence, discipline, leadership and extracurricular participation.' },
                { key: 'FRIENDS', label: '3. What your closest friends and peers think of you', desc: 'Your loyalty, cooperative spirit, dependability in emergencies and sense of humor.' },
                { key: 'SELF', label: '4. What you think of yourself', desc: 'Your genuine strengths, acknowledged minor shortcomings, and corrective measures.' },
                { key: 'FUTURE', label: '5. What kind of person & officer you aspire to become', desc: 'Your professional military vision and values.' }
              ].map((dim) => (
                <div key={dim.key} className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="text-xs font-mono font-bold text-gold-400 uppercase block">{dim.label}</span>
                  <p className="text-[11px] text-slate-400 font-sans">{dim.desc}</p>
                  <textarea
                    rows={4}
                    value={sdAnswers[dim.key] || ''}
                    onChange={(e) => setSdAnswers({ ...sdAnswers, [dim.key]: e.target.value })}
                    placeholder="Draft honest, balanced appraisal..."
                    className="w-full p-3 rounded-lg bg-[#071910] border border-emerald-900 text-white text-xs font-sans focus:border-gold-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
