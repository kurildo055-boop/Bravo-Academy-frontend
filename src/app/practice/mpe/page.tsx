'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Clock,
  Shield,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

interface MpeTask {
  id: string;
  title: string;
  description: string;
  mapImageUrl?: string;
  resources?: string;
  rules?: string;
  modelSolution?: string;
  timeAllowedMin?: number;
}

export default function MpePracticePage() {
  const [tasks, setTasks] = useState<MpeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);

  // Time & calculations
  const [timer, setTimer] = useState(1800); // 30 minutes
  const [timerActive, setTimerActive] = useState(false);

  // Cadet Tactical Plan
  const [planText, setPlanText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadMpe() {
      setLoading(true);
      try {
        const res = await fetch('/api/modules/gto?taskType=MPE');
        const data = await res.json();
        if (data.success && data.tasks?.length > 0) {
          setTasks(data.tasks);
        } else {
          setTasks([
            {
              id: 'mpe-1',
              title: 'Border Outpost "Operation Sentinel" Supply Ambush',
              description: 'You are Lieutenant commanding a border patrol post at 14:00 hours. An urgent dispatch reveals: (1) An injured soldier at Outpost Charlie needs blood transfusion by 16:30 hours; (2) Bandits plan to dynamite the railway bridge at 16:00 hours; (3) Fuel depot catches fire at 15:30. Resources available: 1x Speedboat (30 km/h), 1x Jeep (40 km/h), 8 soldiers, 2 first-aid kits.',
              mapImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80',
              resources: JSON.stringify(['1x Speedboat (30 km/h)', '1x Military 4x4 Jeep (40 km/h)', '8x Armed Soldiers', '2x Tactical Radios']),
              rules: JSON.stringify([
                'Calculate exact time and distance for each detachment.',
                'Never split into single-man units; minimum 2 men per detachment.',
                'Prioritize human life and critical infrastructure.'
              ]),
              modelSolution: 'Detachment A (Jeep, 4 soldiers, Medic): Dispatched to Outpost Charlie (20 km along road = 30 mins, arrives 14:30, well ahead of 16:30 deadline). Detachment B (Speedboat, 4 soldiers): Rushes downstream (15 km = 30 mins) to secure railway bridge by 14:45. Alert Local Police via radio for depot.',
              timeAllowedMin: 30
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMpe();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;
    const t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setTimerActive(false);
          setSubmitted(true);
          tacticalAudio.playRadarPing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerActive]);

  const currentTask = tasks[selectedTaskIdx] || tasks[0];
  const resources: string[] = typeof currentTask?.resources === 'string'
    ? JSON.parse(currentTask.resources || '[]')
    : (currentTask?.resources || []);
  const rules: string[] = typeof currentTask?.rules === 'string'
    ? JSON.parse(currentTask.rules || '[]')
    : (currentTask?.rules || []);

  const handleStartTimer = () => {
    setTimer(1800);
    setTimerActive(true);
    setSubmitted(false);
    tacticalAudio.playInterfaceClick();
  };

  return (
    <div className="min-h-screen bg-[#040d08] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>ISSB DAY 3 • OPTION 7</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military tracking-wider mt-2">
              MILITARY PLANNING EXERCISE (MPE)
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Tactical Map Scenario, Simultaneous Emergency Prioritization & Time-Distance Resource Optimization
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/practice/gto"
              className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:text-white text-xs font-mono font-bold uppercase transition-all"
            >
              ← GTO Ground Tasks
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-bold uppercase transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Tactical Situation Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Map & Briefing */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-950 pb-3">
                <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                  OPERATIONAL SCENARIO BRIEFING
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>TIME: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                  </div>
                  {!timerActive ? (
                    <button
                      onClick={handleStartTimer}
                      className="px-3 py-1 rounded bg-gold-500 text-navy-950 text-xs font-mono font-bold uppercase"
                    >
                      Start 30m Drill
                    </button>
                  ) : (
                    <button
                      onClick={() => setTimerActive(false)}
                      className="px-3 py-1 rounded bg-red-900 border border-red-700 text-red-200 text-xs font-mono font-bold uppercase"
                    >
                      Pause
                    </button>
                  )}
                </div>
              </div>

              {/* Tactical Map */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-emerald-800 bg-slate-900 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentTask?.mapImageUrl || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80'}
                  alt="MPE Tactical Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-xs font-mono text-slate-200">
                    <span className="text-gold-400 font-bold block">{currentTask?.title}</span>
                    <span>Grid: North indicated top • 1 Grid Square = 5 Kilometers</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2 text-xs">
                <span className="font-mono font-bold text-emerald-400 uppercase block">MISSION SITUATION DISPATCH:</span>
                <p className="text-slate-200 font-sans leading-relaxed">{currentTask?.description}</p>
              </div>

              {/* Resource Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-1.5">
                  <span className="text-gold-400 font-bold uppercase block">AVAILABLE FORCES & ASSETS:</span>
                  {resources.map((r, i) => (
                    <div key={i} className="text-slate-300">• {r}</div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-1.5">
                  <span className="text-emerald-400 font-bold uppercase block">OPERATIONAL CONSTRAINTS:</span>
                  {rules.map((rule, i) => (
                    <div key={i} className="text-slate-300">• {rule}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cadet Tactical Plan & Model Solution */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-4">
              <span className="text-xs font-mono font-bold text-gold-400 uppercase block">
                CADET TACTICAL ALLOCATION PLAN
              </span>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  DRAFT TIME-DISTANCE & UNIT ALLOCATION:
                </label>
                <textarea
                  rows={14}
                  value={planText}
                  onChange={(e) => setPlanText(e.target.value)}
                  placeholder="Outline your plan:
1. Priority assessment (Life vs Infrastructure)
2. Detachment 1: Assets assigned, route, arrival time calculation
3. Detachment 2: Assets assigned, route, arrival time calculation
4. Fallback communications protocol..."
                  className="w-full p-4 rounded-xl bg-[#040e09] border border-emerald-900 text-white font-sans text-xs focus:border-gold-500 focus:outline-none leading-relaxed resize-none"
                />
              </div>

              <button
                onClick={() => {
                  setSubmitted(true);
                  tacticalAudio.playRadarPing();
                }}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-mono font-bold text-xs uppercase shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>SUBMIT PLAN & REVEAL MILITARY SOLUTION</span>
              </button>
            </div>

            {submitted && currentTask?.modelSolution && (
              <div className="p-6 rounded-2xl bg-[#071910] border-2 border-gold-500/60 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold-400 uppercase">
                  <Award className="w-4 h-4" />
                  <span>RECOMMENDED MILITARY COMMAND SOLUTION</span>
                </div>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">
                  {currentTask.modelSolution}
                </p>
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-[11px] font-mono text-emerald-300">
                  ✓ Core Criteria: Life-saving prioritized over property • Both detachments deployed within vehicle capacity • Time deadlines met with margin.
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
