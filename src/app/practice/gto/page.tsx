'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Play,
  RotateCcw,
  Award,
  Users,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

interface GtoTask {
  id: string;
  taskType: string;
  title: string;
  description: string;
  mapImageUrl?: string;
  resources?: string;
  rules?: string;
  modelSolution?: string;
  timeAllowedMin?: number;
}

export default function GtoPracticePage() {
  const [activeTab, setActiveTab] = useState<'PGT_HGT' | 'COMMAND_TASK' | 'LECTURETTE' | 'GD' | 'RULES'>('RULES');
  const [tasks, setTasks] = useState<GtoTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Lecturette Timer State
  const [lecturetteActive, setLecturetteActive] = useState(false);
  const [prepTime, setPrepTime] = useState(180); // 3 mins prep
  const [speechTime, setSpeechTime] = useState(180); // 3 mins speech
  const [lecturettePhase, setLecturettePhase] = useState<'PREP' | 'SPEECH' | 'DONE'>('PREP');

  // Load GTO tasks from database
  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      try {
        const res = await fetch('/api/modules/gto');
        const data = await res.json();
        if (data.success && data.tasks?.length > 0) {
          setTasks(data.tasks);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  // Lecturette Timer Countdown
  useEffect(() => {
    if (!lecturetteActive) return;
    const t = setInterval(() => {
      if (lecturettePhase === 'PREP') {
        setPrepTime((p) => {
          if (p <= 1) {
            setLecturettePhase('SPEECH');
            tacticalAudio.playRadarPing();
            return 180;
          }
          return p - 1;
        });
      } else if (lecturettePhase === 'SPEECH') {
        setSpeechTime((s) => {
          if (s <= 1) {
            setLecturettePhase('DONE');
            setLecturetteActive(false);
            tacticalAudio.playRadarPing();
            return 0;
          }
          return s - 1;
        });
      }
    }, 1000);
    return () => clearInterval(t);
  }, [lecturetteActive, lecturettePhase]);

  const pgtTasks = tasks.filter((t) => t.taskType === 'PGT' || t.taskType === 'HGT');
  const commandTasks = tasks.filter((t) => t.taskType === 'COMMAND_TASK');
  const lecturetteTasks = tasks.filter((t) => t.taskType === 'LECTURETTE');
  const gdTasks = tasks.filter((t) => t.taskType === 'GD');

  return (
    <div className="min-h-screen bg-[#040d08] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>ISSB DAY 3 • OPTION 6</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military tracking-wider mt-2">
              GTO GROUND TASKS & STRATEGY ENGINE
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Progressive Group Task (PGT), Half Group Task (HGT), Command Task, Cantilever Physics & Lecturette
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/practice/mpe"
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-bold uppercase transition-all shadow-md"
            >
              Go to Planning (MPE) →
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:text-white text-xs font-mono font-bold uppercase transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-emerald-950 pb-3">
          {[
            { id: 'RULES', label: '1. GTO Core Rules & Physics' },
            { id: 'PGT_HGT', label: '2. PGT & HGT Tasks' },
            { id: 'COMMAND_TASK', label: '3. Command Task Briefings' },
            { id: 'LECTURETTE', label: '4. 3-Min Lecturette' },
            { id: 'GD', label: '5. Group Discussion (GD)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'
                  : 'bg-[#071910] border border-emerald-900/60 text-slate-300 hover:border-emerald-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: GTO CORE RULES & CANTILEVER PHYSICS */}
        {activeTab === 'RULES' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
              <div className="border-b border-emerald-950 pb-3">
                <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                  FUNDAMENTAL OUTDOOR GROUND PRINCIPLES
                </span>
                <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                  THE 6 INVIOLABLE GTO RULES & LEVER MECHANICS
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="font-mono font-bold text-gold-400 uppercase block">1. RULE OF COLOR CODE</span>
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">White surfaces:</strong> Safe for cadets feet and helping materials (plank, spar, load).<br />
                    <strong className="text-red-400">Red surfaces:</strong> Out of bounds for both men and materials. Touching red causes 2-minute penalty.<br />
                    <strong className="text-amber-400">Yellow/Blue:</strong> Cadets can step on it, but helping materials cannot touch it.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="font-mono font-bold text-gold-400 uppercase block">2. RULE OF RIGIDITY (CANTILEVER)</span>
                  <p className="text-slate-300 leading-relaxed">
                    No two helping materials (e.g. two planks, or plank and log) can be tied together to lengthen them unless supported by an intermediate structure. Applying fulcrum levers over white pillars creates rigid cantilever spans.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="font-mono font-bold text-gold-400 uppercase block">3. RULE OF INFINITY</span>
                  <p className="text-slate-300 leading-relaxed">
                    The starting line and finish line extend into infinity on both flanks. You cannot bypass the obstacle ground from the outside; you must cross through the designated obstacle channel.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="font-mono font-bold text-gold-400 uppercase block">4. RULE OF LOAD (AMMUNITION BOX)</span>
                  <p className="text-slate-300 leading-relaxed">
                    The 20-30 kg simulated load must accompany the group at all times and cannot be thrown or dropped on unpainted/red ground. It must be passed safely hand-to-hand across the bridge.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="font-mono font-bold text-gold-400 uppercase block">5. RULE OF DISTANCE (4-FOOT JUMP)</span>
                  <p className="text-slate-300 leading-relaxed">
                    No cadet can leap across any gap exceeding 4 feet. Any gap wider than 4 feet mandates a constructed bridge using planks, spars, and rope knots.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="font-mono font-bold text-gold-400 uppercase block">6. FULCRUM & LEVER TACTICS</span>
                  <p className="text-slate-300 leading-relaxed">
                    Class-1 Lever: Insert plank underneath rear white crossbar, place atop front white pillar. Weight of 1 cadet sitting on rear end safely counterbalances 2 crossing cadets on the forward cantilever overhang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PGT & HGT TASKS */}
        {activeTab === 'PGT_HGT' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
              <div className="border-b border-emerald-950 pb-3">
                <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                  PROGRESSIVE GROUP TASK & HALF GROUP TASK
                </span>
                <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                  AUTHENTIC OBSTACLE SCENARIOS & BRIDGING BLUEPRINTS
                </h3>
              </div>

              {pgtTasks.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-slate-400">Loading PGT tasks...</div>
              ) : (
                <div className="space-y-6">
                  {pgtTasks.map((t, idx) => {
                    const resources: string[] = typeof t.resources === 'string' ? JSON.parse(t.resources || '[]') : (t.resources || []);
                    const rules: string[] = typeof t.rules === 'string' ? JSON.parse(t.rules || '[]') : (t.rules || []);
                    return (
                      <div key={t.id || idx} className="p-6 rounded-xl bg-[#040e09] border border-emerald-950 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-950 pb-2">
                          <span className="text-gold-400 font-mono font-bold text-xs uppercase">
                            {t.taskType}: {t.title}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{t.timeAllowedMin || 35} MINS ALLOWED</span>
                        </div>
                        <p className="text-xs text-slate-200 font-sans leading-relaxed">{t.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                          <div className="p-3 rounded-lg bg-[#071910] border border-emerald-900/60 space-y-1">
                            <span className="text-gold-400 font-bold block uppercase">HELPING MATERIALS:</span>
                            {resources.map((r, i) => (
                              <div key={i} className="text-slate-300">• {r}</div>
                            ))}
                          </div>
                          <div className="p-3 rounded-lg bg-[#071910] border border-emerald-900/60 space-y-1">
                            <span className="text-emerald-400 font-bold block uppercase">STAGE CONSTRAINTS:</span>
                            {rules.map((rule, i) => (
                              <div key={i} className="text-slate-300">• {rule}</div>
                            ))}
                          </div>
                        </div>

                        {t.modelSolution && (
                          <div className="p-4 rounded-lg bg-gold-500/10 border border-gold-500/30 text-xs font-sans space-y-1">
                            <span className="font-mono font-bold text-gold-400 uppercase block">OPTIMAL BRIDGING SOLUTION:</span>
                            <p className="text-slate-300 leading-relaxed">{t.modelSolution}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMMAND TASK */}
        {activeTab === 'COMMAND_TASK' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
              <div className="border-b border-emerald-950 pb-3">
                <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                  INDIVIDUAL LEADERSHIP ASSESSMENT
                </span>
                <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                  COMMAND TASK SIMULATOR & BRIEFING PROTOCOL
                </h3>
              </div>

              {commandTasks.map((t, idx) => (
                <div key={t.id || idx} className="p-6 rounded-xl bg-[#040e09] border border-emerald-950 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
                    <span className="text-gold-400 font-mono font-bold text-xs uppercase">{t.title}</span>
                    <span className="text-xs font-mono text-slate-400">{t.timeAllowedMin || 15} MINS</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{t.description}</p>
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs font-sans text-emerald-300 space-y-1.5">
                    <span className="font-mono font-bold uppercase text-emerald-400 block">COMMANDER BRIEFING STEPS:</span>
                    <div>1. Choose 2 subordinates calmly based on physical agility.</div>
                    <div>2. Explain the goal clearly without raising your voice.</div>
                    <div>3. Lead from the front: place yourself in the middle of the bridge, not hiding safely behind.</div>
                  </div>
                  {t.modelSolution && (
                    <div className="p-4 rounded-lg bg-gold-500/10 border border-gold-500/30 text-xs font-sans">
                      <span className="font-mono font-bold text-gold-400 uppercase block mb-1">COMMAND SOLUTION:</span>
                      <p className="text-slate-300">{t.modelSolution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LECTURETTE */}
        {activeTab === 'LECTURETTE' && (
          <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6 text-center">
            <div className="max-w-xl mx-auto space-y-3">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                3 MINUTES PREPARATION • 3 MINUTES SPEECH
              </span>
              <h3 className="text-xl font-black text-white font-military uppercase">
                LECTURETTE CADET TIMER & TOPIC CARDS
              </h3>
              <p className="text-xs text-slate-300 font-sans">
                Draw a topic, use 3 minutes to organize Introduction (30s), Main Arguments (2 mins), and Conclusion (30s).
              </p>
            </div>

            {/* Timer Display */}
            <div className="p-6 rounded-xl bg-[#040e09] border border-emerald-950 max-w-sm mx-auto space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase">
                PHASE: {lecturettePhase === 'PREP' ? '3-MIN PREPARATION' : lecturettePhase === 'SPEECH' ? '3-MIN LIVE SPEECH' : 'COMPLETED'}
              </span>
              <div className="text-4xl font-black font-mono text-gold-400 animate-pulse">
                {lecturettePhase === 'PREP'
                  ? `${Math.floor(prepTime / 60)}:${(prepTime % 60).toString().padStart(2, '0')}`
                  : `${Math.floor(speechTime / 60)}:${(speechTime % 60).toString().padStart(2, '0')}`}
              </div>
              <div className="flex justify-center gap-2">
                {!lecturetteActive ? (
                  <button
                    onClick={() => {
                      setLecturetteActive(true);
                      setLecturettePhase('PREP');
                      setPrepTime(180);
                      setSpeechTime(180);
                      tacticalAudio.playInterfaceClick();
                    }}
                    className="px-4 py-2 rounded-lg bg-gold-500 text-navy-950 font-mono font-bold text-xs uppercase"
                  >
                    Start Timer
                  </button>
                ) : (
                  <button
                    onClick={() => setLecturetteActive(false)}
                    className="px-4 py-2 rounded-lg bg-red-900 border border-red-700 text-red-200 font-mono font-bold text-xs uppercase"
                  >
                    Stop Timer
                  </button>
                )}
              </div>
            </div>

            {/* Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {lecturetteTasks.map((lec, idx) => (
                <div key={lec.id || idx} className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="text-xs font-mono font-bold text-gold-400 uppercase block">TOPIC #{idx + 1}: {lec.title}</span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{lec.description}</p>
                  {lec.modelSolution && (
                    <div className="p-3 rounded bg-emerald-950/40 border border-emerald-900 text-[11px] font-sans text-slate-300">
                      <strong className="text-emerald-400 block font-mono">RECOMMENDED SPEECH OUTLINE:</strong>
                      {lec.modelSolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GD (GROUP DISCUSSION) */}
        {activeTab === 'GD' && (
          <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
            <div className="border-b border-emerald-950 pb-3">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                COOPERATIVE GROUP DISCUSSIONS
              </span>
              <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                HIGH FREQUENCY ISSB GD TOPICS
              </h3>
            </div>

            <div className="space-y-4">
              {gdTasks.map((gd, idx) => (
                <div key={gd.id || idx} className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
                  <span className="text-xs font-mono font-bold text-gold-400 uppercase block">GD TOPIC #{idx + 1}: {gd.title}</span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{gd.description}</p>
                  {gd.modelSolution && (
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900 text-xs font-sans text-slate-300">
                      <strong className="text-emerald-400 block font-mono mb-1">BALANCED MILITARY ARGUMENTS:</strong>
                      {gd.modelSolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
