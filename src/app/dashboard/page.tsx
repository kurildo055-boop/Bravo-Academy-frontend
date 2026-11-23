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
  FileText,
  AlertTriangle,
  RefreshCw,
  X,
  Sparkles,
  Phone,
  Hash,
  GraduationCap,
  Menu,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';
import { DEFENSE_MODULES, checkModuleAccess } from '@/lib/modules';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [lockedModalModule, setLockedModalModule] = useState<any | null>(null);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('bravo_user', JSON.stringify(data.user));
      } else {
        const stored = localStorage.getItem('bravo_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } else {
          router.push('/login');
        }
      }
    } catch {
      const stored = localStorage.getItem('bravo_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        router.push('/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const handleRefreshStatus = () => {
    setRefreshing(true);
    tacticalAudio.playRadarPing();
    fetchUserData();
  };

  const handleLogout = async () => {
    tacticalAudio.playInterfaceClick();
    localStorage.removeItem('bravo_user');
    localStorage.removeItem('bravo_token');
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-gold-400 font-mono space-y-3">
        <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <span className="tracking-widest uppercase text-xs">SYNCHRONIZING CADET TERMINAL...</span>
      </div>
    );
  }

  const activeEnrollments = (user?.enrollments || []).filter(
    (e: any) => e.status === 'ACTIVE' && (!e.expiresAt || new Date(e.expiresAt) > new Date())
  );
  const hasActiveEnrollment = activeEnrollments.length > 0;
  const pendingPayment = user?.pendingPayment;

  // Real stats calculated from user test attempts (NO fake data)
  const attempts = user?.testAttempts || [];
  const totalAttempted = attempts.length;
  const avgScore = totalAttempted > 0
    ? Math.round(attempts.reduce((acc: number, cur: any) => acc + (cur.score || 0), 0) / totalAttempted)
    : 0;

  interface SidebarItem {
    id: string;
    label: string;
    icon: any;
    type: string;
    href?: string;
    moduleDef?: any;
  }

  // 13 Navigation items matching user requirements (Items 3-11 are granular modules)
  const sidebarLinks: SidebarItem[] = [
    { id: 'DASHBOARD', label: '1. Dashboard Overview', icon: Shield, type: 'standard' },
    { id: 'COURSES', label: '2. My Enrolled Courses', icon: BookOpen, type: 'standard' },
    ...DEFENSE_MODULES.map((mod) => ({
      id: mod.id,
      label: mod.sidebarLabel,
      icon: mod.id.includes('iq') || mod.id.includes('psych')
        ? Brain
        : mod.id.includes('ppdt')
        ? FileText
        : mod.id.includes('gto') || mod.id.includes('planning')
        ? Compass
        : mod.id.includes('interview') || mod.id.includes('simulation')
        ? Award
        : mod.id.includes('physical')
        ? Activity
        : Clock,
      href: mod.href,
      type: 'module',
      moduleDef: mod
    })),
    { id: 'RESULTS', label: '12. My Performance Results', icon: CheckCircle2, type: 'standard' },
    { id: 'PROFILE', label: '13. Cadet Profile & Bio', icon: User, type: 'standard' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col antialiased bg-military-grid">
      {/* ========================================================
          CANDIDATE TOP BAR (NO MAIN NAVBAR, DEDICATED CADET BAR)
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#06150e]/95 backdrop-blur-md border-b border-emerald-900/40 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => {
              tacticalAudio.playInterfaceClick();
              setMobileSidebarOpen(!mobileSidebarOpen);
            }}
            className="lg:hidden p-1.5 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 select-none group">
            <BravoLogo size="sm" showSubtitle={false} />
            <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold">
              CADET TERMINAL
            </span>
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden sm:flex items-center gap-2 border-r border-navy-800 pr-3">
            {hasActiveEnrollment ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>COMMISSION ACTIVE</span>
              </span>
            ) : pendingPayment ? (
              <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>VERIFICATION PENDING</span>
              </span>
            ) : (
              <span className="text-red-400 font-bold text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>UNENROLLED</span>
              </span>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-white truncate max-w-[140px] font-sans">
              {user?.name}
            </div>
            <div className="text-[10px] text-gold-400 uppercase">
              {user?.targetForce || 'ARMY'} CADET
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-navy-900 hover:bg-red-950/60 border border-navy-700 hover:border-red-500/40 text-red-400 transition-colors"
            title="Logout Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================
          MAIN CADET WORKSPACE: LEFT SIDEBAR + CONTENT AREA
          ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* ========================================================
            SIDEBAR (13 NAVIGATION ITEMS - RESPONSIVE DRAWER)
            ======================================================== */}
        <aside
          className={`fixed lg:static top-[50px] bottom-0 left-0 z-40 w-72 bg-[#06150e]/95 lg:bg-[#06150e]/80 border-r border-emerald-900/40 flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-300 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-4">
            {/* Cadet User Badge */}
            <div className="p-3.5 rounded-xl bg-navy-900 border border-emerald-500/30 flex items-center gap-3">
              {user?.profile?.studentPhotoUrl ? (
                <div className="w-11 h-11 rounded-full overflow-hidden border border-emerald-400 shrink-0">
                  <img
                    src={user.profile.studentPhotoUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center font-bold text-gold-400 font-military text-base shrink-0">
                  {user?.name?.[0] || 'C'}
                </div>
              )}
              <div className="overflow-hidden space-y-0.5">
                <div className="text-xs font-bold text-white truncate font-sans">{user?.name}</div>
                <div className="text-[10px] font-mono text-gold-400 uppercase">
                  {user?.targetForce || 'ARMY'} CANDIDATE
                </div>
                <div className="text-[9px] font-mono">
                  {hasActiveEnrollment ? (
                    <span className="text-emerald-400 font-bold">● ACTIVE</span>
                  ) : pendingPayment ? (
                    <span className="text-amber-400 font-bold">⏳ PENDING</span>
                  ) : (
                    <span className="text-red-400 font-bold">🔒 LOCKED</span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 text-xs font-mono">
              {sidebarLinks.map((item) => {
                const isSelected = activeTab === item.id;

                if (item.type === 'module') {
                  const isUnlocked = hasActiveEnrollment && checkModuleAccess(item.id, activeEnrollments);

                  if (isUnlocked) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href!}
                        onClick={() => {
                          tacticalAudio.playInterfaceClick();
                          setMobileSidebarOpen(false);
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <item.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] shrink-0" />
                      </Link>
                    );
                  }

                  // Locked Module (Options 3 to 11)
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        tacticalAudio.playInterfaceClick();
                        setLockedModalModule(item.moduleDef);
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-navy-900 transition-all text-left"
                    >
                      <div className="flex items-center gap-2.5 truncate opacity-70">
                        <item.icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-gold-400 bg-gold-500/10 border border-gold-500/30 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>LOCK</span>
                      </div>
                    </button>
                  );
                }

                // Standard Menu Items (1, 2, 12, 13)
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      tacticalAudio.playInterfaceClick();
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-navy-900'
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-navy-950' : 'text-gold-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-3 border-t border-navy-800 space-y-2">
            <Link
              href="/courses"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-navy-900 border border-gold-500/30 text-gold-400 text-xs font-mono hover:text-white"
            >
              <span>Explore Courses</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 transition-colors text-xs font-mono"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>LOGOUT SESSION</span>
            </button>
          </div>
        </aside>

        {/* ========================================================
            MAIN CADET CONTENT VIEW
            ======================================================== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* SCENARIO 1: CANDIDATE HAS PENDING VERIFICATION */}
          {!hasActiveEnrollment && pendingPayment && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-amber-500/40 bg-gradient-to-br from-[#1c1809] to-navy-950 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>HQ VERIFICATION IN PROGRESS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-military">
                    ADMISSION PAYMENT UNDER COMMAND REVIEW
                  </h2>
                  <p className="text-xs text-slate-300 font-sans">
                    Your bKash / Nagad admission proof has been recorded and is currently in the verification queue.
                  </p>
                </div>

                <button
                  onClick={handleRefreshStatus}
                  disabled={refreshing}
                  className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-gold-500/30 text-gold-400 font-mono text-xs font-bold uppercase flex items-center gap-2 shrink-0 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'CHECKING...' : 'REFRESH STATUS'}</span>
                </button>
              </div>

              {/* Submitted Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">PROGRAM APPLIED:</span>
                  <div className="font-bold text-white truncate font-sans">
                    {pendingPayment.course?.title || 'Defense Preparation Course'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">AMOUNT PAID:</span>
                  <div className="font-bold text-emerald-400">
                    ৳{pendingPayment.amount} BDT ({pendingPayment.paymentMethod})
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">TRANSACTION ID (TRXID):</span>
                  <div className="font-bold text-gold-400">{pendingPayment.transactionId}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">SENDER PHONE:</span>
                  <div className="font-bold text-white">{pendingPayment.senderNumber || 'N/A'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">INSTITUTION & ROLL:</span>
                  <div className="font-bold text-white truncate font-sans">
                    {pendingPayment.collegeOrUniversity || 'N/A'} ({pendingPayment.studentRoll || 'N/A'})
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">SUBMISSION DATE:</span>
                  <div className="font-bold text-slate-300">
                    {new Date(pendingPayment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-white uppercase text-[11px] font-mono">COMMAND HQ PROTOCOL:</div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  Commanding officers verify every candidate transaction with the telecom network.
                  Once approved by Admin, all practice modules (IQ drills, PPDT, psychology batteries, and mock examinations) will automatically unlock on this terminal.
                </p>
              </div>
            </div>
          )}

          {/* SCENARIO 2: CANDIDATE HAS NO ACTIVE ENROLLMENT & NO PENDING PAYMENT (LOCKED DASHBOARD) */}
          {!hasActiveEnrollment && !pendingPayment && (
            <div className="glass-panel rounded-2xl p-8 sm:p-12 border border-red-500/30 bg-gradient-to-br from-[#1a0c0c] via-navy-950 to-[#0a1c14] text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-500/10 border-2 border-gold-400/50 mx-auto flex items-center justify-center text-gold-400 shadow-[0_0_30px_rgba(214,173,96,0.2)]">
                <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 border border-red-500/40 px-3 py-1 rounded-full uppercase">
                  TERMINAL RESTRICTED · ADMISSION REQUIRED
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-military">
                  CADET TRAINING ACCESS LOCKED
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  Your candidate account has been registered, but you do not currently have an active course enrollment.
                  To unlock the 1000+ IQ drills, PPDT simulators, psychological battery, GTO preparation, and full 4-day mock simulations, please enroll in a defense course.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/courses"
                  onClick={() => tacticalAudio.playInterfaceClick()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-gold-500 hover:from-emerald-500 hover:to-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl font-mono flex items-center justify-center gap-2"
                >
                  <span>BROWSE DEFENSE COURSES & ENROLL (ভর্তি হতে এখানে ক্লিক করুন)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* SCENARIO 3: CANDIDATE HAS ACTIVE APPROVED ENROLLMENT (FULL UNLOCKED DASHBOARD) */}
          {hasActiveEnrollment && (
            <>
              {/* Top Cadet Status Card */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-r from-[#0c2419] to-navy-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>OFFICER CADET DOSSIER · COMMISSION VERIFIED</span>
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military mt-1">
                    WELCOME, {user?.name}
                  </h1>
                  <p className="text-xs text-slate-300 font-sans mt-1">
                    Active Force: Bangladesh {user?.targetForce || 'Army'} Commission · Enrollment: <span className="text-emerald-400 font-bold">APPROVED & ACTIVE</span>
                  </p>
                </div>

                <Link
                  href="/exam/iq"
                  onClick={() => tacticalAudio.playRadarPing()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 text-navy-950 font-black text-xs uppercase font-mono tracking-wider shadow-lg flex items-center gap-2 shrink-0"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>START TIMED IQ DRILL</span>
                </Link>
              </div>

              {/* Real Performance Statistics (NO fake data) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">ACTIVE COURSES</div>
                  <div className="text-2xl font-black text-gold-400 font-military">
                    {activeEnrollments.length}
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">AVG TEST SCORE</div>
                  <div className="text-2xl font-black text-emerald-400 font-military">
                    {avgScore > 0 ? `${avgScore}%` : 'N/A'}
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">DRILLS COMPLETED</div>
                  <div className="text-2xl font-black text-white font-military">
                    {totalAttempted}
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">ACCESS VALIDITY</div>
                  <div className="text-2xl font-black text-sky-400 font-military">
                    ACTIVE
                  </div>
                </div>
              </div>

              {/* Active Enrolled Courses */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-4">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <h3 className="text-lg font-black uppercase text-white font-military flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold-400" />
                    <span>YOUR ACTIVE DEFENSE COURSES</span>
                  </h3>
                  <Link
                    href="/courses"
                    className="text-xs font-mono text-gold-400 hover:text-white"
                  >
                    Browse More Programs →
                  </Link>
                </div>

                <div className="space-y-3">
                  {activeEnrollments.map((enr: any, idx: number) => {
                    const course = enr.course || {};
                    let features: string[] = [];
                    try {
                      features = JSON.parse(course.includedFeatures || '[]');
                    } catch {
                      features = [];
                    }

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-navy-900 to-navy-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="text-base font-bold text-white uppercase font-sans">
                            {course.title || 'ISSB Preparation Mastery'}
                          </div>
                          <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                            <span>FORCE: {course.targetForce || 'ALL'}</span>
                            <span>·</span>
                            <span>STATUS: <span className="text-emerald-400 font-bold">APPROVED & ACTIVE</span></span>
                            {enr.expiresAt && (
                              <>
                                <span>·</span>
                                <span>VALID UNTIL: {new Date(enr.expiresAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          {features.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {features.map((featId, fIdx) => {
                                const mod = DEFENSE_MODULES.find((m) => m.id === featId);
                                return (
                                  <span
                                    key={fIdx}
                                    className="text-[10px] font-mono bg-navy-800/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded"
                                  >
                                    ✓ {mod ? mod.title : featId}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href="/exam/iq"
                            onClick={() => tacticalAudio.playInterfaceClick()}
                            className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-bold uppercase transition-all shadow"
                          >
                            START PRACTICE
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 9 Core Candidate Modules Grid (Options 3 to 11) */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-4">
                <div className="border-b border-navy-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black uppercase text-white font-military">
                      TACTICAL DEFENSE TRAINING MODULES (OPTIONS 3 TO 11)
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      Unlocked modules are determined by your enrolled course entitlements.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEFENSE_MODULES.map((mod) => {
                    const isUnlocked = checkModuleAccess(mod.id, activeEnrollments);

                    if (isUnlocked) {
                      return (
                        <Link
                          key={mod.id}
                          href={mod.href}
                          onClick={() => tacticalAudio.playInterfaceClick()}
                          className="p-5 rounded-xl bg-navy-900/90 border border-emerald-500/30 hover:border-emerald-400 space-y-2 group transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                              ✓ UNLOCKED
                            </span>
                            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <div className="text-sm font-bold text-white uppercase font-military">
                            {mod.title}
                          </div>
                          <div className="text-xs text-slate-400 font-sans line-clamp-2">
                            {mod.description}
                          </div>
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={mod.id}
                        onClick={() => {
                          tacticalAudio.playInterfaceClick();
                          setLockedModalModule(mod);
                        }}
                        className="p-5 rounded-xl bg-navy-950/60 border border-navy-800/80 space-y-2 cursor-pointer hover:border-gold-500/40 transition-all opacity-80"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-gold-400 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>COURSE LOCKED</span>
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-300 uppercase font-military">
                          {mod.title}
                        </div>
                        <div className="text-xs text-slate-500 font-sans line-clamp-2">
                          {mod.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ========================================================
          LOCKED MODULE MODAL
          ======================================================== */}
      {lockedModalModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 sm:p-8 border border-gold-500/40 space-y-5 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setLockedModalModule(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-gold-500/20 border border-gold-500/40 mx-auto flex items-center justify-center text-gold-400">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-gold-400 uppercase font-bold">
                TRAINING MODULE RESTRICTED
              </span>
              <h3 className="text-xl font-black uppercase text-white font-military">
                {lockedModalModule.title}
              </h3>
              <p className="text-xs text-slate-300 font-sans">
                {lockedModalModule.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 text-left text-xs text-slate-300 space-y-1 font-sans">
              <p className="font-bold text-white">কেন এই মডিউলটি লক?</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                আপনার বর্তমান এনরোল করা কোর্সে এই মডিউলের অ্যাক্সেস নেই। কমান্ড অ্যাডমিন কোর্স তৈরি করার সময় যে অপশনগুলো সিলেক্ট করেছেন শুধুমাত্র সেই মডিউলগুলোতে আপনার অ্যাক্সেস রয়েছে।
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/courses"
                onClick={() => setLockedModalModule(null)}
                className="flex-1 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs uppercase font-mono tracking-wider transition-all"
              >
                UPGRADE COURSE →
              </Link>
              <button
                onClick={() => setLockedModalModule(null)}
                className="py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 font-bold text-xs uppercase font-mono transition-all border border-navy-700"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
