'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Compass, Crosshair, CheckCircle, ArrowRight, BookOpen, Clock, Calendar, Check, Zap } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';
import { DEFENSE_MODULES } from '@/lib/modules';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForce, setSelectedForce] = useState('ALL');

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCourses(data.courses);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((c) => {
    if (selectedForce === 'ALL') return true;
    return c.targetForce === selectedForce || c.targetForce === 'ALL';
  });

  const handleSound = () => {
    tacticalAudio.playInterfaceClick();
  };

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            <span>BANGLADESH DEFENSE FORCES · OFFICER COMMISSION SYLLABUS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white font-military tracking-wide">
            OFFICER CADET PREPARATION PROGRAMS
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Specialized commission preparation pathways for Bangladesh Army (BMA Long Course), Bangladesh Navy (BNA Officer Cadet), and Bangladesh Air Force (BAFA Flight Cadet).
          </p>

          {/* Force Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            {[
              { id: 'ALL', label: 'ALL COMBAT COURSES', icon: Shield },
              { id: 'ARMY', label: 'BANGLADESH ARMY', icon: Shield },
              { id: 'NAVY', label: 'BANGLADESH NAVY', icon: Compass },
              { id: 'AIR_FORCE', label: 'AIR FORCE', icon: Crosshair },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  handleSound();
                  setSelectedForce(f.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all ${
                  selectedForce === f.id
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400'
                    : 'bg-navy-900 border border-navy-800 text-slate-300 hover:border-emerald-500/40 hover:text-white'
                }`}
              >
                <f.icon className="w-3.5 h-3.5 text-gold-400" />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid - Elite Military Green Mix Theme */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-navy-900/60 border border-navy-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              let features: string[] = [];
              try {
                features = JSON.parse(course.includedFeatures || '[]');
              } catch {
                features = [];
              }

              return (
                <div
                  key={course.id}
                  className="rounded-2xl flex flex-col justify-between border border-emerald-500/30 hover:border-emerald-400/80 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-gradient-to-b from-[#0e271c] via-[#091a13] to-[#040e0a] overflow-hidden group relative"
                >
                  {/* Glowing Top Line */}
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-gold-400 to-emerald-600" />

                  {/* Course Image Thumbnail / Force Badge Banner */}
                  <div className="relative h-44 w-full bg-navy-950 overflow-hidden">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c2e1d] to-[#06150e] p-4 text-center">
                        <Shield className="w-12 h-12 text-emerald-400/60 mb-2" />
                        <span className="text-xs font-mono font-bold text-gold-400 tracking-widest uppercase">
                          BRAVO ACADEMY DEFENSE CORPS
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091a13] via-transparent to-black/30" />

                    {/* Force Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded bg-navy-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 shadow">
                        {course.targetForce}
                      </span>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-mono font-black text-navy-950 bg-gold-400 px-2 py-0.5 rounded shadow uppercase">
                        ADMISSION OPEN
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl font-black uppercase text-white font-military tracking-wide leading-tight group-hover:text-emerald-300 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-sans">
                        {course.description}
                      </p>

                      {/* Included Entitled Modules Preview (Options 3 to 11) */}
                      <div className="space-y-2 pt-3 border-t border-emerald-500/20">
                        <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                          INCLUDED TACTICAL MODULES:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {features.slice(0, 4).map((featId: string, idx: number) => {
                            const mod = DEFENSE_MODULES.find((m) => m.id === featId);
                            const label = mod ? mod.title : featId;
                            return (
                              <span
                                key={idx}
                                className="text-[10px] font-mono bg-navy-900/90 border border-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded flex items-center gap-1"
                              >
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                                <span>{label}</span>
                              </span>
                            );
                          })}
                          {features.length > 4 && (
                            <span className="text-[10px] font-mono bg-navy-900/90 border border-navy-700 text-slate-400 px-1.5 py-0.5 rounded">
                              +{features.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Validity */}
                    <div className="pt-4 border-t border-emerald-500/20 space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-2xl sm:text-3xl font-black text-gold-400 font-military">
                            ৳{course.discountPrice.toLocaleString()} <span className="text-xs font-mono text-slate-400">BDT</span>
                          </div>
                          <div className="text-[11px] text-slate-500 line-through">
                            Fee: ৳{course.regularPrice.toLocaleString()} BDT
                          </div>
                        </div>
                        <div className="text-right text-[11px] font-mono text-slate-300 space-y-0.5">
                          <div className="text-emerald-400 font-bold">{course.durationWeeks} WEEKS DURATION</div>
                          <div className="text-slate-400">{course.validityDays} Days Access</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <Link
                          href={`/courses/${course.slug}`}
                          onClick={handleSound}
                          className="text-center py-2.5 px-3 rounded-xl bg-navy-900/90 hover:bg-navy-800 border border-emerald-500/30 text-slate-200 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all"
                        >
                          DETAILS & SYLLABUS
                        </Link>
                        <Link
                          href={`/checkout?courseId=${course.id}`}
                          onClick={handleSound}
                          className="text-center py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-gold-500 hover:from-emerald-500 hover:to-gold-400 text-navy-950 text-xs font-black uppercase font-mono tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95"
                        >
                          ENROLL NOW →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
