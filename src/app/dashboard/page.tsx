'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BravoLogo } from '@/components/BravoLogo';
import {
  Shield,
  BookOpen,
  Brain,
  Award,
  Clock,
  Compass,
  Crosshair,
  User,
  LogOut,
  Lock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Activity,
  Zap,
  HelpCircle,
  FileText
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Fallback to local storage if available
          try {
            const stored = localStorage.getItem('bravo_user');
            if (stored) {
              const parsed = JSON.parse(stored);
              setUser({
                name: parsed.name,
                email: parsed.email,
                role: parsed.role,
                targetForce: parsed.targetForce || 'ARMY',
                enrollments: [
                  {
                    course: {
                      title: 'Complete ISSB Preparation Mastery',
                      targetForce: 'ALL',
                      validityDays: 90
                    },
                    status: 'ACTIVE',
                    expiresAt: new Date(Date.now() + 85 * 86400000).toISOString()
                  }
                ]
              });
            } else {
              router.push('/login');
            }
          } catch (e) {
            router.push('/login');
          }
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    tacticalAudio.playInterfaceClick();
    localStorage.removeItem('bravo_user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-mono">
        LOADING CADET DASHBOARD...
      </div>
    );
  }

  const activeEnrollments = user?.enrollments || [];
  const hasActiveEnrollment = activeEnrollments.length > 0;

  const sidebarLinks = [
    { id: 'DASHBOARD', label: '1. Dashboard Overview', icon: Shield },
    { id: 'COURSES', label: '2. My Enrolled Courses', icon: BookOpen },
    { id: 'IQ', label: '3. IQ Practice (1000+ Q)', icon: Brain, href: '/exam/iq' },
    { id: 'PPDT', label: '4. PPDT Practice', icon: FileText, href: '/practice/ppdt' },
    { id: 'PSYCH', label: '5. Psychology Battery', icon: Brain, href: '/practice/psychology' },
    { id: 'GTO', label: '6. GTO Preparation', icon: Compass, href: '/practice/gto' },
    { id: 'PLANNING', label: '7. Planning Exercise (MPE)', icon: Compass, href: '/practice/gto' },
    { id: 'INTERVIEW', label: '8. Interview Practice', icon: Award, href: '/practice/interview' },
    { id: 'PHYSICAL', label: '9. Physical Preparation', icon: Activity, href: '/practice/gto' },
    { id: 'MOCK', label: '10. Mock Examination', icon: Clock, href: '/exam/iq' },
    { id: 'SIMULATION', label: '11. Full 4-Day Simulation', icon: Award, href: '/simulation' },
    { id: 'RESULTS', label: '12. My Performance Results', icon: CheckCircle2 },
    { id: 'PROFILE', label: '13. Cadet Profile & Bio', icon: User },
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20 pb-16 bg-military-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ========================================================
              SIDEBAR (16 SECTIONS TAILORED FOR DEFENSE CANDIDATES)
              ======================================================== */}
          <div className="glass-panel rounded-2xl p-5 border border-navy-800 space-y-6 h-fit">
            {/* User Badge */}
            <div className="p-4 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center font-bold text-gold-400 font-military text-lg">
                {user?.name?.[0] || 'C'}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate font-sans">{user?.name}</div>
                <div className="text-[11px] font-mono text-gold-400 uppercase">
                  {user?.targetForce || 'ARMY'} CANDIDATE
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1 text-xs font-mono">
              {sidebarLinks.map((item) => {
                const isSelected = activeTab === item.id;
                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => tacticalAudio.playInterfaceClick()}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-navy-900 transition-all"
                    >
                      <item.icon className="w-4 h-4 text-gold-400 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      tacticalAudio.playInterfaceClick();
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-navy-900'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-navy-950' : 'text-gold-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-navy-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>LOGOUT SESSION</span>
                </button>
              </div>
            </nav>
          </div>

          {/* ========================================================
              MAIN CADET DASHBOARD VIEW
              ======================================================== */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Cadet Status Card */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-gold-400 font-bold uppercase tracking-widest">
                  OFFICER CADET DOSSIER
                </span>
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military mt-1">
                  WELCOME, {user?.name}
                </h1>
                <p className="text-xs text-slate-300 font-sans mt-1">
                  Target: Bangladesh {user?.targetForce || 'Army'} Commission · Status: Active Cadet
                </p>
              </div>

              <Link
                href="/exam/iq"
                onClick={() => tacticalAudio.playRadarPing()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 text-navy-950 font-black text-xs uppercase font-mono tracking-wider shadow-lg flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>START TIMED IQ DRILL</span>
              </Link>
            </div>

            {/* Preparation Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">ACTIVE COURSES</div>
                <div className="text-2xl font-black text-gold-400 font-military">
                  {activeEnrollments.length}
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">IQ ACCURACY</div>
                <div className="text-2xl font-black text-defense-success font-military">
                  84%
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">QUESTIONS ATTEMPTED</div>
                <div className="text-2xl font-black text-white font-military">
                  185
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">PPDT STORIES SCORED</div>
                <div className="text-2xl font-black text-sky-400 font-military">
                  6
                </div>
              </div>
            </div>

            {/* Active Enrolled Courses */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-4">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <h3 className="text-lg font-black uppercase text-white font-military flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gold-400" />
                  <span>ACTIVE ENROLLED PROGRAMS</span>
                </h3>
                <Link
                  href="/courses"
                  className="text-xs font-mono text-gold-400 hover:text-white"
                >
                  Browse Catalog →
                </Link>
              </div>

              {activeEnrollments.length > 0 ? (
                <div className="space-y-3">
                  {activeEnrollments.map((enr: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-navy-900 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-white uppercase font-sans">
                          {enr.course?.title || 'Complete ISSB Preparation'}
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-1">
                          Branch: {enr.course?.targetForce || 'ALL'} · Status: <span className="text-defense-success font-bold">ACTIVE</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href="/exam/iq"
                          className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-xs font-mono font-bold text-gold-400 transition-all border border-navy-700"
                        >
                          LAUNCH MODULES
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Locked State with Enrollment CTA */
                <div className="p-8 text-center space-y-4 bg-navy-900/60 rounded-xl border border-navy-800">
                  <Lock className="w-10 h-10 text-gold-500/60 mx-auto" />
                  <div className="text-base font-bold text-white font-military uppercase">
                    NO ACTIVE COURSE ENROLLMENT
                  </div>
                  <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                    To access the full 1000+ question bank, PPDT evaluations, GTO drills, and live mock exams, enroll in an officer cadet course.
                  </p>
                  <Link
                    href="/courses"
                    className="inline-block px-6 py-2.5 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase font-mono shadow-md"
                  >
                    ENROLL NOW VIA BKASH / NAGAD →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Practice Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/exam/iq"
                onClick={() => tacticalAudio.playInterfaceClick()}
                className="glass-panel p-5 rounded-xl border border-navy-800 hover:border-gold-500/40 space-y-2 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <Brain className="w-5 h-5 text-gold-400" />
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-white uppercase font-military">IQ DRILLS</div>
                <div className="text-xs text-slate-400 font-sans">
                  Timed verbal, non-verbal, and spatial reasoning problems.
                </div>
              </Link>

              <Link
                href="/practice/ppdt"
                onClick={() => tacticalAudio.playInterfaceClick()}
                className="glass-panel p-5 rounded-xl border border-navy-800 hover:border-gold-500/40 space-y-2 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-gold-400" />
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-white uppercase font-military">PPDT SIMULATOR</div>
                <div className="text-xs text-slate-400 font-sans">
                  30s hazy image perception and instant AI story scoring.
                </div>
              </Link>

              <Link
                href="/simulation"
                onClick={() => tacticalAudio.playInterfaceClick()}
                className="glass-panel p-5 rounded-xl border border-navy-800 hover:border-gold-500/40 space-y-2 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <Shield className="w-5 h-5 text-gold-400" />
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-white uppercase font-military">4-DAY SIMULATION</div>
                <div className="text-xs text-slate-400 font-sans">
                  Full screening, psychological battery, GTO, and interview.
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
