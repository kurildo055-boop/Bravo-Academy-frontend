'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Shield, CheckCircle2, Clock, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

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
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-mono">
        LOADING COURSE SYLLABUS...
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

  const curriculum = JSON.parse(course.curriculum || '[]');
  const features = JSON.parse(course.includedFeatures || '[]');

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Banner Card */}
        <div className="glass-panel rounded-2xl p-8 sm:p-12 border border-gold-500/30 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900 border border-navy-700 text-gold-400 text-xs font-mono font-bold uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>{course.targetForce} OFFICER CADET PREPARATION</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-military">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>{course.durationWeeks} WEEKS DURATION</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>{course.validityDays} DAYS ACCESS</span>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-baseline sm:items-center gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-gold-400 font-military">
                  ৳{course.discountPrice.toLocaleString()}
                </span>
                <span className="text-base text-slate-500 line-through">
                  ৳{course.regularPrice.toLocaleString()}
                </span>
              </div>

              <Link
                href={`/checkout?courseId=${course.id}`}
                onClick={() => tacticalAudio.playInterfaceClick()}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>ENROLL IN THIS COURSE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column: Curriculum & Included Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Syllabus Modules */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-navy-800">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              SYLLABUS & LESSON BREAKDOWN
            </h3>
            <div className="space-y-4">
              {curriculum.length > 0 ? (
                curriculum.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-navy-900/80 border border-navy-800/80 flex items-start gap-4"
                  >
                    <span className="w-8 h-8 rounded-lg bg-navy-800 text-gold-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Comprehensive tactical breakdown, simulated drills, and instructor review.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 font-mono">
                  Standard 4-Day ISSB screening, psychological battery, GTO obstacle, and interview modules included.
                </div>
              )}
            </div>
          </div>

          {/* Features Side Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-navy-800 h-fit">
            <h3 className="text-lg font-black uppercase text-gold-400 font-military border-b border-navy-800 pb-3">
              WHAT YOU RECEIVE
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                <span>Unlimited 1000+ IQ timed tests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                <span>PPDT picture stories & evaluation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                <span>15-second WAT psychological drill</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                <span>GTO bridging & command task guide</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                <span>AI-powered weakness & OLQ analytics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                <span>Officer mentor interview guidance</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-navy-800">
              <Link
                href={`/checkout?courseId=${course.id}`}
                className="w-full block text-center py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider transition-all"
              >
                PROCEED TO ENROLL
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
