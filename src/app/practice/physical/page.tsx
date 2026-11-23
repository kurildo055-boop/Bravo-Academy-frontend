'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Shield,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

interface PhysicalObstacle {
  id: string;
  obstacleNumber: number;
  name: string;
  marks: number;
  imageUrl?: string;
  techniqueGuide?: string;
  commonMistakes?: string;
  orderStrategy?: string;
}

export default function PhysicalPracticePage() {
  const [obstacles, setObstacles] = useState<PhysicalObstacle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeObstacle, setActiveObstacle] = useState<number>(1);

  // Cadet Fitness Self-Logger
  const [fitnessLogs, setFitnessLogs] = useState({
    runMin: 7.2,
    pushups: 35,
    pullups: 10,
    situps: 45
  });

  useEffect(() => {
    async function loadObstacles() {
      setLoading(true);
      try {
        const res = await fetch('/api/modules/physical');
        const data = await res.json();
        if (data.success && data.obstacles?.length > 0) {
          setObstacles(data.obstacles);
        } else {
          // Fallback if none in db
          setObstacles([
            {
              id: 'obs-1',
              obstacleNumber: 1,
              name: 'Long Jump (9-Foot Ditch)',
              marks: 5,
              imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
              techniqueGuide: 'Sprint with measured stride. Firm takeoff before the red foul board. Land flexing knees.',
              commonMistakes: 'Stepping on red foul line or stuttering approach stride.',
              orderStrategy: 'Clear early when legs are fresh.'
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadObstacles();
  }, []);

  const currentObstacle = obstacles.find((o) => o.obstacleNumber === activeObstacle) || obstacles[0];
  const totalMarks = obstacles.reduce((sum, o) => sum + (o.marks || 0), 0) || 55;

  return (
    <div className="min-h-screen bg-[#040d08] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>ISSB PHYSICAL • OPTION 9</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military tracking-wider mt-2">
              9 INDIVIDUAL OBSTACLES & FITNESS REGIMEN
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Complete Official ISSB 9-Obstacle Course (55 Marks, 3 Minutes) & Officer Stamina Standards
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:text-white text-xs font-mono font-bold uppercase transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Key Obstacle Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#071910] border border-emerald-900/60 space-y-1">
            <span className="text-slate-400 block uppercase">TOTAL OBSTACLES</span>
            <span className="text-xl font-bold text-white">9 OBSTACLES</span>
          </div>
          <div className="p-4 rounded-xl bg-[#071910] border border-emerald-900/60 space-y-1">
            <span className="text-slate-400 block uppercase">MAXIMUM MARKS</span>
            <span className="text-xl font-bold text-gold-400">{totalMarks} MARKS</span>
          </div>
          <div className="p-4 rounded-xl bg-[#071910] border border-emerald-900/60 space-y-1">
            <span className="text-slate-400 block uppercase">TIME LIMIT</span>
            <span className="text-xl font-bold text-emerald-400">3 MINUTES</span>
          </div>
          <div className="p-4 rounded-xl bg-[#071910] border border-emerald-900/60 space-y-1">
            <span className="text-slate-400 block uppercase">QUALIFYING MARKS</span>
            <span className="text-xl font-bold text-white">30+ MARKS</span>
          </div>
        </div>

        {/* Obstacle 1 to 9 Navigation Grid */}
        <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-emerald-950 pb-3 gap-2">
            <span className="text-xs font-mono text-gold-400 font-bold uppercase">
              SELECT OBSTACLE NUMBER TO VIEW TECHNIQUE BLUEPRINT:
            </span>
            <span className="text-xs font-mono text-slate-400">
              CLICK TO INSPECT FOULS & CROSSING SEQUENCE
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {obstacles.map((obs) => {
              const isSelected = activeObstacle === obs.obstacleNumber;
              return (
                <button
                  key={obs.obstacleNumber}
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setActiveObstacle(obs.obstacleNumber);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-gold-500 text-navy-950 border-gold-400 shadow-lg font-bold'
                      : 'bg-[#040e09] border-emerald-950 text-slate-300 hover:border-emerald-700'
                  }`}
                >
                  <span className="text-xs font-mono">#{obs.obstacleNumber}</span>
                  <span className="text-[10px] font-mono uppercase">{obs.marks} pts</span>
                </button>
              );
            })}
          </div>

          {/* Active Obstacle Blueprint Display */}
          {currentObstacle && (
            <div className="p-6 rounded-xl bg-[#040e09] border border-emerald-900/80 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-950 pb-3">
                <div>
                  <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                    OBSTACLE #{currentObstacle.obstacleNumber} • {currentObstacle.marks} MARKS
                  </span>
                  <h3 className="text-xl font-black text-white font-military uppercase mt-1">
                    {currentObstacle.name}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold">
                  PASS CRITERIA: ZERO FOULS
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Obstacle Image */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-emerald-800 bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentObstacle.imageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80'}
                    alt={currentObstacle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-gold-400 font-bold">
                    {currentObstacle.marks} MARKS
                  </div>
                </div>

                {/* Technical Guides */}
                <div className="md:col-span-2 space-y-4 text-xs font-sans">
                  {currentObstacle.techniqueGuide && (
                    <div className="p-4 rounded-xl bg-[#071910] border border-emerald-900 space-y-1.5">
                      <span className="font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>TACTICAL TECHNIQUE & FLUID EXECUTION:</span>
                      </span>
                      <p className="text-slate-200 leading-relaxed">{currentObstacle.techniqueGuide}</p>
                    </div>
                  )}

                  {currentObstacle.commonMistakes && (
                    <div className="p-4 rounded-xl bg-[#071910] border border-red-900/60 space-y-1.5">
                      <span className="font-mono font-bold text-red-400 uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>COMMON FOULS & TIME PENALTIES:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">{currentObstacle.commonMistakes}</p>
                    </div>
                  )}

                  {currentObstacle.orderStrategy && (
                    <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 space-y-1.5">
                      <span className="font-mono font-bold text-gold-400 uppercase flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        <span>OPTIMAL 3-MINUTE SEQUENCE PLACEMENT:</span>
                      </span>
                      <p className="text-slate-200 leading-relaxed">{currentObstacle.orderStrategy}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Daily Fitness Tracker Card */}
        <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-4">
          <div className="border-b border-emerald-950 pb-3">
            <span className="text-xs font-mono text-gold-400 font-bold uppercase">
              CADET DAILY PHYSICAL READINESS LOG
            </span>
            <h3 className="text-lg font-black text-white font-military uppercase mt-1">
              BENCHMARK AGAINST BANGLADESH DEFENSE FORCES STANDARDS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
              <span className="text-slate-400 block uppercase">1.6 KM (1 MILE) RUN</span>
              <input
                type="number"
                step="0.1"
                value={fitnessLogs.runMin}
                onChange={(e) => setFitnessLogs({ ...fitnessLogs, runMin: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-[#071910] border border-emerald-900 text-white font-bold"
              />
              <span className="text-[10px] text-emerald-400 block">Standard: &lt; 7.5 Mins (Excellent)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
              <span className="text-slate-400 block uppercase">PUSH-UPS (2 MINS)</span>
              <input
                type="number"
                value={fitnessLogs.pushups}
                onChange={(e) => setFitnessLogs({ ...fitnessLogs, pushups: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-[#071910] border border-emerald-900 text-white font-bold"
              />
              <span className="text-[10px] text-emerald-400 block">Standard: 30+ Reps (Excellent)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
              <span className="text-slate-400 block uppercase">PULL-UPS (BEAM)</span>
              <input
                type="number"
                value={fitnessLogs.pullups}
                onChange={(e) => setFitnessLogs({ ...fitnessLogs, pullups: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-[#071910] border border-emerald-900 text-white font-bold"
              />
              <span className="text-[10px] text-emerald-400 block">Standard: 8+ Reps (Excellent)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
              <span className="text-slate-400 block uppercase">SIT-UPS (2 MINS)</span>
              <input
                type="number"
                value={fitnessLogs.situps}
                onChange={(e) => setFitnessLogs({ ...fitnessLogs, situps: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-[#071910] border border-emerald-900 text-white font-bold"
              />
              <span className="text-[10px] text-emerald-400 block">Standard: 40+ Reps (Excellent)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
