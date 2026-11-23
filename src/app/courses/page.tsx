'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Compass, Crosshair, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

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
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
            <span>OFFICER COMMISSION SYLLABUS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white font-military tracking-wide">
            DEFENSE PREPARATION COURSES
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Curated preparation paths for Bangladesh Army (BMA), Bangladesh Navy (BNA), and Bangladesh Air Force (BAFA) candidates.
          </p>

          {/* Force Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            {[
              { id: 'ALL', label: 'ALL COURSES', icon: Shield },
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
                    ? 'bg-gold-500 text-navy-950 shadow-[0_0_15px_rgba(214,173,96,0.4)]'
                    : 'bg-navy-900 border border-navy-800 text-slate-300 hover:border-gold-500/40'
                }`}
              >
                <f.icon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel h-80 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const features = JSON.parse(course.includedFeatures || '[]');
              return (
                <div
                  key={course.id}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-navy-800 hover:border-gold-500/40 relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-navy-800 text-gold-400 font-bold uppercase">
                        {course.targetForce}
                      </span>
                      <span className="text-xs font-mono font-bold text-defense-success bg-defense-success/15 px-2 py-0.5 rounded">
                        DISCOUNT OFFER
                      </span>
                    </div>

                    <h3 className="text-xl font-black uppercase text-white font-military">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Features checklist preview */}
                    <div className="space-y-1.5 pt-2 border-t border-navy-800/80">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        ENTITLED MODULES:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {features.slice(0, 4).map((feat: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono bg-navy-900 border border-navy-700 text-slate-300 px-2 py-0.5 rounded"
                          >
                            ✓ {feat.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-gold-400 font-military">
                        ৳{course.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        ৳{course.regularPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto font-mono">
                        {course.validityDays} Days Validity
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-navy-800 flex items-center gap-3">
                    <Link
                      href={`/courses/${course.slug}`}
                      onClick={handleSound}
                      className="flex-1 text-center py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      SYLLABUS
                    </Link>
                    <Link
                      href={`/checkout?courseId=${course.id}`}
                      onClick={handleSound}
                      className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 text-xs font-black uppercase tracking-wider transition-all shadow-md"
                    >
                      ENROLL NOW
                    </Link>
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
