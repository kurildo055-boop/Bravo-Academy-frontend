'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Timer,
  Brain,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  Edit3,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Clock,
  Shield,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

interface PpdtScenario {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  characterHints?: string;
  modelStory?: string;
  tips?: string;
  difficulty: string;
}

export default function PpdtPracticePage() {
  const [scenarios, setScenarios] = useState<PpdtScenario[]>([]);
  const [loadingScenarios, setLoadingScenarios] = useState(true);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  // States: 'SELECT' | 'VIEW' | 'WRITE' | 'RESULT'
  const [stage, setStage] = useState<'SELECT' | 'VIEW' | 'WRITE' | 'RESULT'>('SELECT');
  const [viewTimer, setViewTimer] = useState(30);
  const [writeTimer, setWriteTimer] = useState(240); // 4 minutes = 240s

  // Cadet responses
  const [characters, setCharacters] = useState({
    count: '3',
    age: '24',
    sex: 'M',
    mood: '+',
    action: 'Organizing emergency river crossing with local youth'
  });
  const [story, setStory] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  // Load scenarios from API
  useEffect(() => {
    async function loadScenarios() {
      try {
        const res = await fetch('/api/modules/ppdt');
        const data = await res.json();
        if (data.success && data.scenarios?.length > 0) {
          setScenarios(data.scenarios);
        } else {
          // Fallback if none in db yet
          setScenarios([
            {
              id: 'fb-1',
              title: 'Rural Flash Flood & Damaged River Bridge',
              imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
              description: 'A riverside embankment path where flash floods damaged the wooden footbridge. Three youths consult with ropes and wooden spars.',
              modelStory: 'Rahim, a 24-year-old engineering cadet visiting his village in Sunamganj, observed flood waters washing away the primary footbridge. He swiftly organized the local youth committee, gathered bamboo and nylon ropes, constructed an anchored cantilever bridge, and escorted stranded schoolchildren across.',
              tips: 'Protagonist must display initiative, rapid decision-making, and constructive teamwork.',
              difficulty: 'MEDIUM'
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingScenarios(false);
      }
    }
    loadScenarios();
  }, []);

  const currentScenario = scenarios[selectedScenarioIndex] || scenarios[0];

  // 30s View Phase Timer
  useEffect(() => {
    if (stage !== 'VIEW') return;
    const t = setInterval(() => {
      setViewTimer((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setStage('WRITE');
          tacticalAudio.playRadarPing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  // 4m Write Phase Timer
  useEffect(() => {
    if (stage !== 'WRITE') return;
    const t = setInterval(() => {
      setWriteTimer((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleFinishWriting();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  const handleStartObservation = (idx?: number) => {
    if (typeof idx === 'number') {
      setSelectedScenarioIndex(idx);
    }
    setViewTimer(30);
    setWriteTimer(240);
    setStory('');
    setEvaluation(null);
    setStage('VIEW');
    tacticalAudio.playInterfaceClick();
  };

  const handleProceedToWriteEarly = () => {
    setStage('WRITE');
    tacticalAudio.playInterfaceClick();
  };

  const handleFinishWriting = async () => {
    setStage('RESULT');
    tacticalAudio.playRadarPing();
  };

  const handleRequestAiEvaluation = async () => {
    setEvaluating(true);
    tacticalAudio.playRadarPing();
    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'PPDT_STORY',
          prompt: `${currentScenario.title}: ${currentScenario.description}`,
          studentResponse: `Character Box: ${JSON.stringify(characters)}\nStory: ${story}`,
          targetForce: 'ARMY'
        })
      });
      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const wordCount = story.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#040d08] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>ISSB SCREENING • OPTION 4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military tracking-wider mt-2">
              PPDT PRACTICE ENGINE
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Picture Perception & Discussion Test — 30s Hazy Image Observation, Box Notation & 4-Minute Timed Story
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:text-white hover:border-emerald-500 text-xs font-mono font-bold uppercase transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* STAGE 1: SCENARIO SELECTION */}
        {stage === 'SELECT' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#071910]/80 border border-emerald-800/40 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-gold-400 font-mono font-bold text-xs uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                <span>PPDT SCREENING INSTRUCTIONS & PROTOCOL</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-slate-300">
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-900/40 space-y-1.5">
                  <span className="font-bold text-white font-mono uppercase block text-emerald-400">1. Observe (30 Sec)</span>
                  <p>Study the hazy slide. Note the number of characters, their estimated age, sex, and mood (+, -, 0).</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-900/40 space-y-1.5">
                  <span className="font-bold text-white font-mono uppercase block text-emerald-400">2. Box Notation (1 Min)</span>
                  <p>Circle the main protagonist in the perception box. Mark Age, Sex (M/F), Mood (+/-/0), and action.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-900/40 space-y-1.5">
                  <span className="font-bold text-white font-mono uppercase block text-emerald-400">3. Write Story (4 Mins)</span>
                  <p>Cover what led to the situation, what is happening now, and the realistic positive outcome (100-120 words).</p>
                </div>
              </div>
            </div>

            {/* Scenarios Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold uppercase text-slate-200 tracking-wider">
                  Select a PPDT Picture Scenario ({scenarios.length} Available)
                </h3>
                <button
                  onClick={() => handleStartObservation(Math.floor(Math.random() * scenarios.length))}
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-mono font-bold text-xs uppercase transition-all shadow-lg"
                >
                  ⚡ Start Random Drill
                </button>
              </div>

              {loadingScenarios ? (
                <div className="p-8 text-center text-xs font-mono text-emerald-400">Loading scenarios...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarios.map((sc, idx) => (
                    <div
                      key={sc.id || idx}
                      onClick={() => handleStartObservation(idx)}
                      className="group cursor-pointer rounded-2xl bg-[#071910] border border-emerald-900/50 hover:border-gold-500/60 p-4 transition-all duration-300 space-y-3 shadow-md flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-emerald-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sc.imageUrl}
                          alt={sc.title}
                          className="w-full h-full object-cover filter blur-[1.5px] group-hover:blur-0 transition-all duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-gold-400 font-bold uppercase">
                          {sc.difficulty || 'MEDIUM'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white group-hover:text-gold-400 transition-colors">
                          {sc.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {sc.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartObservation(idx);
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-950/80 group-hover:bg-gold-500 group-hover:text-navy-950 border border-emerald-700/50 text-emerald-400 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2"
                      >
                        <span>Start Test</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 2: 30s HAZY PICTURE OBSERVATION */}
        {stage === 'VIEW' && (
          <div className="p-8 rounded-2xl bg-[#071910] border-2 border-gold-500/50 shadow-2xl space-y-6 text-center">
            <div className="flex flex-wrap items-center justify-between border-b border-emerald-900/50 pb-4 gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold-400 uppercase">
                <Eye className="w-4 h-4 animate-pulse" />
                <span>PHASE 1: OBSERVE THE HAZY SLIDE</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-red-400 animate-pulse">
                  00:{viewTimer.toString().padStart(2, '0')}
                </span>
                <button
                  onClick={handleProceedToWriteEarly}
                  className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700 text-emerald-300 text-xs font-mono font-bold uppercase"
                >
                  Skip to Writing →
                </button>
              </div>
            </div>

            {/* Hazy Image Canvas */}
            <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border-2 border-emerald-800/80 relative shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentScenario.imageUrl}
                alt={currentScenario.title}
                className="w-full h-80 sm:h-96 object-cover filter blur-[2px] contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-left text-xs font-mono text-slate-300">
                  <span className="text-gold-400 font-bold block">{currentScenario.title}</span>
                  <span>Analyze character count, ages, and surrounding objects.</span>
                </div>
              </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-emerald-900">
              <div
                className="bg-gold-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(viewTimer / 30) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STAGE 3: BOX NOTATION & 4-MINUTE STORY WRITING */}
        {stage === 'WRITE' && (
          <div className="space-y-6">
            {/* Header Timer Bar */}
            <div className="p-4 rounded-xl bg-[#071910] border border-emerald-800/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-gold-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  PHASE 2: STORY WRITING ({currentScenario.title})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-mono text-xs text-slate-300">
                  WORDS: <span className={`font-bold ${wordCount >= 90 && wordCount <= 140 ? 'text-emerald-400' : 'text-gold-400'}`}>{wordCount}</span> / 120
                </div>
                <div className={`text-xl font-mono font-bold px-3 py-1 rounded bg-[#030a06] border ${writeTimer <= 30 ? 'text-red-400 border-red-500 animate-pulse' : 'text-gold-400 border-gold-500/40'}`}>
                  {Math.floor(writeTimer / 60)}:{(writeTimer % 60).toString().padStart(2, '0')}
                </div>
                <button
                  onClick={handleFinishWriting}
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-mono font-bold text-xs uppercase shadow-md transition-all"
                >
                  Submit Story
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Character Box (PPDT Sheet Format) */}
              <div className="p-5 rounded-2xl bg-[#071910] border border-emerald-800/50 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold-400 uppercase border-b border-emerald-950 pb-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>PPDT PERCEPTION BOX</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">TOTAL CHARACTERS PERCEIVED:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={characters.count}
                      onChange={(e) => setCharacters({ ...characters, count: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">HERO AGE:</label>
                      <input
                        type="text"
                        value={characters.age}
                        onChange={(e) => setCharacters({ ...characters, age: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">SEX:</label>
                      <select
                        value={characters.sex}
                        onChange={(e) => setCharacters({ ...characters, sex: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-bold"
                      >
                        <option value="M">M (Male)</option>
                        <option value="F">F (Female)</option>
                        <option value="P">P (Person)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">MOOD:</label>
                      <select
                        value={characters.mood}
                        onChange={(e) => setCharacters({ ...characters, mood: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-bold"
                      >
                        <option value="+">+ (Positive)</option>
                        <option value="0">0 (Neutral)</option>
                        <option value="-">- (Negative)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">ACTION / TITLE OF STORY:</label>
                    <textarea
                      rows={2}
                      value={characters.action}
                      onChange={(e) => setCharacters({ ...characters, action: e.target.value })}
                      placeholder="e.g. Constructing emergency cantilever bridge across flooded river"
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>
                </div>

                {/* Thumbnail Reminder */}
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-emerald-950 opacity-60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentScenario.imageUrl} alt="" className="w-full h-full object-cover filter blur-[2px]" />
                </div>
              </div>

              {/* Story Editor */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-[#071910] border border-emerald-800/50 space-y-3 flex flex-col">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-emerald-950 pb-2">
                  <span className="text-gold-400 font-bold uppercase">CADET STORY COMPOSITION</span>
                  <span>STRUCTURE: Past → Present Action → Positive Outcome</span>
                </div>

                <textarea
                  rows={14}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Start your story directly: Introduce the hero by name and profession, describe what led to this situation, detail the specific practical actions taken, and conclude with the positive resolution..."
                  className="w-full flex-1 p-4 rounded-xl bg-[#040e09] border border-emerald-900/80 text-white font-sans text-sm leading-relaxed focus:border-gold-500 focus:outline-none resize-none"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: RESULT, MODEL STORY & AI EVALUATION */}
        {stage === 'RESULT' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#071910] border border-gold-500/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
                <div>
                  <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                    DRILL COMPLETE • {currentScenario.title}
                  </span>
                  <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                    PERCEPTION & STORY COMPARISON
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartObservation(selectedScenarioIndex)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold uppercase flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry This</span>
                  </button>
                  <button
                    onClick={() => setStage('SELECT')}
                    className="px-4 py-1.5 rounded-lg bg-gold-500 text-navy-950 text-xs font-mono font-bold uppercase"
                  >
                    Select Another Scenario
                  </button>
                </div>
              </div>

              {/* Side-by-Side: Cadet Story vs Model Officer Story */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Cadet Story */}
                <div className="p-5 rounded-xl bg-[#040e09] border border-emerald-900/60 space-y-3">
                  <div className="flex items-center justify-between text-emerald-400 font-mono font-bold uppercase">
                    <span>YOUR SUBMISSION ({wordCount} WORDS)</span>
                    <span className="text-[10px] text-slate-400">
                      Age: {characters.age} | Sex: {characters.sex} | Mood: {characters.mood}
                    </span>
                  </div>
                  <p className="text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                    {story || '(No story text submitted)'}
                  </p>
                </div>

                {/* Model Story */}
                <div className="p-5 rounded-xl bg-[#040e09] border border-gold-500/40 space-y-3">
                  <div className="text-gold-400 font-mono font-bold uppercase flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>RECOMMENDED OFFICER MODEL STORY</span>
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {currentScenario.modelStory || 'No model story registered by instructor yet.'}
                  </p>
                  {currentScenario.tips && (
                    <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-300 text-[11px] font-sans">
                      <span className="font-bold font-mono uppercase block text-gold-400 mb-1">OFFICER TIP:</span>
                      {currentScenario.tips}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Evaluation Trigger */}
              <div className="pt-4 border-t border-emerald-950 flex flex-col items-center space-y-3">
                {!evaluation ? (
                  <button
                    onClick={handleRequestAiEvaluation}
                    disabled={evaluating || !story}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-gold-500 text-navy-950 font-mono font-black text-xs uppercase tracking-wider shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{evaluating ? 'EVALUATING OFFICER QUALITIES...' : 'GET AI OFFICER QUALITIES (OLQ) ANALYSIS'}</span>
                  </button>
                ) : (
                  <div className="w-full p-5 rounded-xl bg-[#040e09] border border-gold-500/40 text-xs font-mono space-y-3">
                    <div className="text-gold-400 font-bold uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>OFFICER QUALITIES (OLQ) ASSESSMENT</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded bg-black/40 border border-emerald-950">
                        <span className="text-[10px] text-slate-400 block">SCORE</span>
                        <span className="text-lg font-bold text-gold-400">{evaluation.score || 82}%</span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-emerald-950">
                        <span className="text-[10px] text-slate-400 block">RECOMMENDATION</span>
                        <span className="text-sm font-bold text-emerald-400">{evaluation.status || 'RECOMMENDED'}</span>
                      </div>
                      <div className="p-2 rounded bg-black/40 border border-emerald-950 col-span-2">
                        <span className="text-[10px] text-slate-400 block">KEY TRAIT</span>
                        <span className="text-xs font-bold text-white">{evaluation.keyTrait || 'Initiative & Logical Planning'}</span>
                      </div>
                    </div>
                    {evaluation.feedback && (
                      <p className="text-slate-300 font-sans text-xs leading-relaxed pt-2">
                        {evaluation.feedback}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
