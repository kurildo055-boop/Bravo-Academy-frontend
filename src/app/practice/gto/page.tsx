'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Compass, Map, Activity, CheckCircle, ArrowRight, Award } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function GtoPracticePage() {
  const [activeTab, setActiveTab] = useState<'TASKS' | 'PLANNING' | 'FITNESS'>('TASKS');

  // Fitness tracker state
  const [fitness, setFitness] = useState({
    runTimeMin: 7.5,
    pushups: 32,
    pullups: 10,
    situps: 45
  });

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase">
            <Shield className="w-4 h-4" />
            <span>STAGE 3 GROUND TASKS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
            GTO OUTDOOR TASKS & PLANNING EXERCISE
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-xl mx-auto">
            Tactical bridging, fulcrum and cantilever principles, Military Planning Exercise (MPE), and physical fitness tracking.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center gap-3 border-b border-navy-800 pb-3">
          {[
            { id: 'TASKS', label: 'GROUND TASKS & BRIDGING' },
            { id: 'PLANNING', label: 'PLANNING EXERCISE (MPE)' },
            { id: 'FITNESS', label: 'PHYSICAL FITNESS TRACKER' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setActiveTab(t.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === t.id
                  ? 'bg-gold-500 text-navy-950 shadow-md'
                  : 'bg-navy-900 border border-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 1. Ground Tasks & Bridging Principles */}
        {activeTab === 'TASKS' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              GTO BRIDGING RULES & FULCRUM MECHANICS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              <div className="p-5 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
                <div className="text-gold-400 font-mono font-bold uppercase flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>RULE OF RIGIDITY (CANTILEVER PRINCIPLE)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  When bridging two unpainted structures separated by a red boundary, place the longer wooden plank underneath the first support and anchor the short end using your team\'s weight. This creates a secure Class-1 lever.
                </p>
                <div className="text-[11px] font-mono text-emerald-400">
                  ✓ Weight of 1 cadet on fulcrum end supports 2 crossing cadets safely.
                </div>
              </div>

              <div className="p-5 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
                <div className="text-gold-400 font-mono font-bold uppercase flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>COLOR CODE DISCIPLINE (RED & WHITE)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  White surfaces: Permitted for both cadet footing and bridging materials.
                  Red surfaces: Out of bounds (lava/danger zone) for all equipment and bodies.
                </p>
                <div className="text-[11px] font-mono text-amber-400">
                  ⚠ Touching red causes immediate 2-minute penalty or restart of command task.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2 text-xs font-mono">
              <div className="font-bold text-white uppercase">COMMAND TASK LEADERSHIP PROTOCOL:</div>
              <p className="text-slate-400">
                As commander, brief your subordinates calmly. Assign specific roles: Subordinate 1 holds the fulcrum anchor, Subordinate 2 carries the load, while you lead from the front.
              </p>
            </div>
          </div>
        )}

        {/* 2. Planning Exercise (MPE) */}
        {activeTab === 'PLANNING' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3 flex items-center gap-2">
              <Map className="w-5 h-5 text-gold-400" />
              <span>MILITARY PLANNING EXERCISE (TACTICAL SCENARIO)</span>
            </h3>

            <div className="p-4 rounded-xl bg-navy-900 border border-gold-500/30 text-xs font-sans space-y-3 text-slate-300">
              <strong className="text-white font-mono uppercase block text-sm">MISSION PROBLEM STATEMENT:</strong>
              <p>
                You are a group of 8 cadets traveling on a hired microbus from Bogra to Rangpur. At 1400 hrs, near Mithapukur, you witness:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Problem A: An injured motorcyclist bleeding severely requiring hospital transport within 45 mins.</li>
                <li>Problem B: Information that saboteurs plan to derail the intercity express train at railway bridge km-42 at 1515 hrs.</li>
                <li>Problem C: A cow has strayed onto the adjacent railway track.</li>
              </ul>
              <p className="text-gold-400 font-mono">
                Resources available: Your microbus (speed 60 km/h), a first-aid kit, two bicycles at a roadside tea stall, and your team of 8.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 block">
                YOUR INDIVIDUAL WRITTEN SOLUTION PLAN:
              </label>
              <textarea
                rows={5}
                placeholder="Division of party: Party 1 (2 cadets) rushes motorcyclist to Mithapukur hospital... Party 2 (4 cadets) proceeds to railway station / bridge km-42 to alert station master..."
                className="w-full p-3.5 bg-navy-900 border border-navy-700 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              onClick={() => tacticalAudio.playRadarPing()}
              className="px-6 py-3 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase font-mono tracking-wider shadow-md"
            >
              SUBMIT PLANNING SOLUTION FOR REVIEW →
            </button>
          </div>
        )}

        {/* 3. Physical Fitness Tracker */}
        {activeTab === 'FITNESS' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-defense-success" />
              <span>DEFENSE CADET FITNESS BENCHMARK TRACKER</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <span className="text-slate-400 block">1.6 KM RUN</span>
                <input
                  type="number"
                  step="0.1"
                  value={fitness.runTimeMin}
                  onChange={(e) => setFitness({ ...fitness, runTimeMin: Number(e.target.value) })}
                  className="w-full p-2 bg-navy-950 border border-navy-700 rounded text-white text-lg font-bold"
                />
                <span className="text-[10px] text-emerald-400">Target: &lt; 7.5 mins (EXCELLENT)</span>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <span className="text-slate-400 block">PUSH-UPS</span>
                <input
                  type="number"
                  value={fitness.pushups}
                  onChange={(e) => setFitness({ ...fitness, pushups: Number(e.target.value) })}
                  className="w-full p-2 bg-navy-950 border border-navy-700 rounded text-white text-lg font-bold"
                />
                <span className="text-[10px] text-emerald-400">Target: 30+ reps</span>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <span className="text-slate-400 block">PULL-UPS</span>
                <input
                  type="number"
                  value={fitness.pullups}
                  onChange={(e) => setFitness({ ...fitness, pullups: Number(e.target.value) })}
                  className="w-full p-2 bg-navy-950 border border-navy-700 rounded text-white text-lg font-bold"
                />
                <span className="text-[10px] text-emerald-400">Target: 8+ reps</span>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
                <span className="text-slate-400 block">SIT-UPS</span>
                <input
                  type="number"
                  value={fitness.situps}
                  onChange={(e) => setFitness({ ...fitness, situps: Number(e.target.value) })}
                  className="w-full p-2 bg-navy-950 border border-navy-700 rounded text-white text-lg font-bold"
                />
                <span className="text-[10px] text-emerald-400">Target: 40+ reps</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-defense-success/10 border border-defense-success/30 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">CURRENT ESTIMATED PHYSICAL GRADING:</span>
              <span className="font-bold text-defense-success text-sm">GRADE ALPHA (100% COMBAT READY)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
