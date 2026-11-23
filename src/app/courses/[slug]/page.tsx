'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Shield,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  AlertCircle,
  Brain,
  FileText,
  Compass,
  Award,
  Activity,
  Check,
  Zap,
  Phone
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';
import { DEFENSE_MODULES } from '@/lib/modules';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCourse(data.course);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-gold-400 font-mono space-y-3">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest">LOADING COURSE SYLLABUS...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-xl font-bold font-military">COURSE NOT FOUND</h2>
        <Link href="/courses" className="text-gold-400 text-xs font-mono underline">
          Return to Course Catalog →
        </Link>
      </div>
    );
  }

  let curriculum: any[] = [];
  try {
    curriculum = JSON.parse(course.curriculum || '[]');
  } catch {
    curriculum = [];
  }

  let features: string[] = [];
  try {
    features = JSON.parse(course.includedFeatures || '[]');
  } catch {
    features = [];
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Banner Card - Green Mix Theme */}
        <div className="rounded-2xl p-8 sm:p-12 border border-emerald-500/40 bg-gradient-to-br from-[#0e271c] via-[#091a13] to-navy-950 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>{course.targetForce} OFFICER CADET PREPARATION</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-military tracking-wide">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{course.durationWeeks} WEEKS DURATION</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-400" />
                  <span>{course.validityDays} DAYS ACCESS VALIDITY</span>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-baseline sm:items-center gap-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-gold-400 font-military">
                    ৳{course.discountPrice.toLocaleString()} <span className="text-xs font-mono text-slate-400">BDT</span>
                  </span>
                  <span className="text-base text-slate-500 line-through">
                    ৳{course.regularPrice.toLocaleString()}
                  </span>
                </div>

                <Link
                  href={`/checkout?courseId=${course.id}`}
                  onClick={() => tacticalAudio.playInterfaceClick()}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-gold-500 hover:from-emerald-500 hover:to-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-mono"
                >
                  <span>ENROLL NOW VIA BKASH / NAGAD</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Thumbnail Box */}
            <div className="lg:col-span-4">
              <div className="rounded-xl overflow-hidden border border-emerald-500/40 shadow-2xl bg-navy-900 aspect-video lg:aspect-square flex items-center justify-center">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <Shield className="w-16 h-16 text-emerald-400 mx-auto" />
                    <div className="font-mono text-xs font-bold text-gold-400 uppercase">
                      BRAVO ACADEMY
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Curriculum & Included Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Syllabus Modules (2 Cols) */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-emerald-500/30">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>DETAILED SYLLABUS & TRAINING BREAKDOWN</span>
            </h3>

            <div className="space-y-4">
              {curriculum.length > 0 ? (
                curriculum.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gradient-to-r from-[#0c2419]/70 to-navy-900 border border-emerald-500/20 flex items-start gap-4"
                  >
                    <span className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white uppercase">{item.title}</h4>
                      <p className="text-xs text-slate-300 font-sans">
                        {item.description || 'Comprehensive tactical breakdown, simulated drills, and instructor review.'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 font-mono p-4 rounded-xl bg-navy-900 border border-navy-800">
                  Standard 4-Day ISSB screening, psychological battery, GTO obstacle, and interview modules included in this program.
                </div>
              )}
            </div>
          </div>

          {/* Included Candidate Modules (Options 3 to 11) */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-gold-500/30 h-fit bg-gradient-to-b from-[#0c2419] to-navy-950">
            <h3 className="text-lg font-black uppercase text-gold-400 font-military border-b border-navy-800 pb-3">
              ENTITLED TRAINING MODULES
            </h3>

            <div className="space-y-3 text-xs">
              {DEFENSE_MODULES.map((mod) => {
                const isIncluded = features.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isIncluded
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-navy-900/60 border-navy-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {isIncluded ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] shrink-0">✕</span>
                      )}
                      <span className="font-mono font-bold truncate">{mod.title}</span>
                    </div>
                    <span className="text-[10px] font-mono shrink-0 uppercase">
                      {isIncluded ? 'UNLOCKED' : 'NOT INCLUDED'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href={`/checkout?courseId=${course.id}`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-gold-500 hover:from-emerald-500 hover:to-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider transition-all shadow-md font-mono flex items-center justify-center gap-2"
              >
                <span>PROCEED TO ADMISSION CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
