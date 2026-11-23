'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Brain, Users, Award, CheckCircle2, ArrowRight, Activity, Compass, Clock, FileText } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function SimulationPage() {
  const [activeDay, setActiveDay] = useState(1);

  const daysData = [
    {
      day: 1,
      title: 'DAY 1: SCREENING PHASE',
      subtitle: 'Verbal IQ, Non-Verbal IQ & PPDT Story Writing',
      modules: [
        { name: '100-Mark Intelligence Test (Verbal & Non-Verbal)', link: '/exam/mock', status: 'READY' },
        { name: 'PPDT Picture Observation (30s) & Story Writing (4m)', link: '/practice/ppdt', status: 'READY' },
        { name: 'Group Discussion & Screening Result Simulation', link: '/practice/ppdt', status: 'READY' },
      ],
      description: 'The critical filter. Approximately 60% of candidates are screened out on Day 1. Speed, high IQ accuracy, and proactive character perception are paramount.'
    },
    {
      day: 2,
      title: 'DAY 2: PSYCHOLOGY BATTERY',
      subtitle: 'TAT, WAT, SCT, SRT & Self Description',
      modules: [
        { name: 'TAT — Thematic Apperception Test (12 Pictures)', link: '/practice/psychology', status: 'READY' },
        { name: 'WAT — Word Association Test (60 Words, 15s each)', link: '/practice/psychology', status: 'READY' },
        { name: 'SCT — Sentence Completion Test (60 Sentences)', link: '/practice/psychology', status: 'READY' },
        { name: 'SRT — Situation Reaction Test (60 Situations)', link: '/practice/psychology', status: 'READY' },
        { name: 'SD — Self Description Battery (5 Dimensions)', link: '/practice/psychology', status: 'READY' },
      ],
      description: 'Psychologist measures subconscious personality attributes, emotional stability, stress tolerance, and true military officer potential.'
    },
    {
      day: 3,
      title: 'DAY 3: GTO GROUND TASKS & INTERVIEW',
      subtitle: 'Outdoor Bridging, Command Task & Board Interview',
      modules: [
        { name: 'Progressive Group Task (PGT) & Half Group Task (HGT)', link: '/practice/gto', status: 'READY' },
        { name: 'Military Planning Exercise (MPE Map Simulation)', link: '/practice/mpe', status: 'READY' },
        { name: 'Individual Command Task & Cantilever Physics', link: '/practice/gto', status: 'READY' },
        { name: '9 Individual Obstacle Run (55 Marks, 3 Mins)', link: '/practice/physical', status: 'READY' },
        { name: 'President / Deputy President Personal Interview', link: '/practice/interview', status: 'READY' },
      ],
      description: 'Tests resourcefulness under physical fatigue, cooperative team dynamics, courage at heights, and interpersonal presence.'
    },
    {
      day: 4,
      title: 'DAY 4: BOARD CONFERENCE & RESULTS',
      subtitle: 'Final Deliberation & Green Card Recommendation',
      modules: [
        { name: 'Board Conference Review Session & Interview Follow-up', link: '/practice/interview', status: 'READY' },
        { name: 'Comprehensive Officer Like Qualities (OLQ) Report', link: '/dashboard', status: 'READY' },
        { name: 'Green Card Commission Recommendation Status', link: '/dashboard', status: 'READY' },
      ],
      description: 'The collective panel of psychologists, GTOs, and senior officers convene to make final commissioning recommendations.'
    }
  ];

  const currentDay = daysData[activeDay - 1];

  return (
    <div className="min-h-screen bg-[#040d08] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>FULL 4-DAY SEQUENCE • OPTION 11</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white font-military tracking-wider mt-2">
              4-DAY OFFICER SELECTION SIMULATOR
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Experience the complete, uninterrupted 4-day selection schedule of the Inter Services Selection Board.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:text-white text-xs font-mono font-bold uppercase transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Day 1 - 4 Navigation Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {daysData.map((d) => (
            <button
              key={d.day}
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setActiveDay(d.day);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeDay === d.day
                  ? 'bg-gold-500/20 border-gold-500 shadow-lg'
                  : 'bg-[#071910] border-emerald-900/60 hover:border-emerald-700'
              }`}
            >
              <div className="text-xs font-mono text-gold-400 font-bold">DAY 0{d.day}</div>
              <div className="text-sm font-bold text-white font-military uppercase mt-1">
                {d.title.split(':')[1]}
              </div>
            </button>
          ))}
        </div>

        {/* Active Day Detail Card */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#071910] border border-gold-500/30 space-y-6 shadow-2xl">
          <div className="border-b border-emerald-950 pb-4">
            <div className="text-xs font-mono text-gold-400 font-bold">{currentDay.subtitle}</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-military mt-1">
              {currentDay.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans leading-relaxed">
              {currentDay.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase">
              DAY 0{activeDay} SCHEDULED TEST MODULES:
            </div>
            {currentDay.modules.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 flex flex-wrap items-center justify-between gap-3 hover:border-gold-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-950 text-gold-400 font-mono text-xs font-bold flex items-center justify-center border border-emerald-900">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white font-sans">{m.name}</span>
                </div>

                <Link
                  href={m.link}
                  onClick={() => tacticalAudio.playInterfaceClick()}
                  className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <span>START DRILL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
