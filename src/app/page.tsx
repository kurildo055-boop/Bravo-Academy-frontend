'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TacticalHeroCanvas } from '@/components/TacticalHeroCanvas';
import { BravoLogo } from '@/components/BravoLogo';
import {
  Shield,
  Compass,
  Crosshair,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Play,
  Zap,
  Users,
  Brain,
  Timer,
  ChevronRight,
  Star,
  Sparkles,
  HelpCircle,
  Video,
  FileText,
  Volume2,
  VolumeX
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [camMode, setCamMode] = useState<'COMMAND' | 'DOGFIGHT' | 'FLEET'>('COMMAND');
  const [heroMode, setHeroMode] = useState<'video' | '3d'>('video');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch('/api/home')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch((err) => console.error(err));

    // Attempt automatic audio playback on website entry
    const attemptAutoplay = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.75;
        audioRef.current
          .play()
          .then(() => {
            setIsPlayingAudio(true);
            setIsMuted(false);
          })
          .catch(() => {
            // Browser policy blocked unmuted autoplay; listen for first user interaction
          });
      }
    };

    attemptAutoplay();

    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.75;
        audioRef.current
          .play()
          .then(() => {
            setIsPlayingAudio(true);
            setIsMuted(false);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleSound = () => {
    tacticalAudio.playInterfaceClick();
  };

  const toggleSound = () => {
    handleSound();
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      if (videoRef.current) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
        setIsMuted(false);
      });
    } else {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      setIsMuted(true);
    }
  };

  const stats = data?.stats || {
    totalStudents: 3421,
    availableCourses: 7,
    totalQuestions: 1055,
    successfulCandidates: 890,
  };

  const cms = data?.cms || {
    heroTitle: 'YOUR DEFENSE JOURNEY STARTS HERE',
    heroSubtitle: 'Complete ISSB Preparation for Army, Navy & Air Force Officer Candidates.',
    primaryCtaText: 'START IQ PRACTICE',
    primaryCtaLink: '/exam/iq',
    secondaryCtaText: 'EXPLORE COURSES',
    secondaryCtaLink: '/courses',
  };

  return (
    <div className="relative min-h-screen bg-[#071610] overflow-hidden">
      {/* ========================================================
          1. CINEMATIC HERO SECTION
          ======================================================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Dynamic Hero Background: Live Action Video Footage or 3D WebGL Flight Canvas */}
        {heroMode === 'video' ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 100% Natural Crystal-Clear HD Military Video */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter brightness-100 contrast-100 transition-opacity duration-700"
              src="/videos/hero-bg.mp4"
            />
            <audio ref={audioRef} loop src="/videos/hero-audio.m4a" />
          </div>
        ) : (
          <TacticalHeroCanvas viewMode={camMode} onViewChange={setCamMode} />
        )}

        {/* Minimal Edge-Only Transitions: 100% Crystal-Clear Video Transparency (Zero Dark Fog / Tint) */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#071610] via-transparent to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
          {/* Tactical Badge & Radar Indicator */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#082218]/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-widest uppercase shadow-lg backdrop-blur-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>BANGLADESH DEFENSE FORCES · SELECTION ACADEMY</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-military drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            YOUR DEFENSE JOURNEY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-emerald-400">
              STARTS HERE
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-200 font-sans leading-relaxed drop-shadow-md">
            {cms.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={cms.primaryCtaLink}
              onClick={handleSound}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 via-amber-500 to-emerald-600 hover:from-gold-400 hover:to-emerald-500 text-navy-950 font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(214,173,96,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>{cms.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={cms.secondaryCtaLink}
              onClick={handleSound}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#09241a]/90 hover:bg-[#0d2f22] border border-emerald-500/40 hover:border-emerald-400 text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{cms.secondaryCtaText}</span>
            </Link>
          </div>

          {/* Tactical Background Mode & Prominent Audio Song Controller */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {/* Audio Song Autoplay & Manual Off/On Button */}
            <button
              onClick={toggleSound}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider border backdrop-blur-md transition-all shadow-xl ${
                isPlayingAudio && !isMuted
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse'
                  : 'bg-slate-900/85 border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50'
              }`}
            >
              {isPlayingAudio && !isMuted ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>DEFENSE SOUNDTRACK: PLAYING (CLICK TO MUTE)</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>DEFENSE SOUNDTRACK: MUTED (CLICK TO PLAY)</span>
                </>
              )}
            </button>

            {/* Mode Switcher */}
            <div className="inline-flex items-center p-1 rounded-full bg-[#082218]/90 border border-slate-700/80 backdrop-blur-md shadow-xl">
              <button
                onClick={() => {
                  handleSound();
                  setHeroMode('video');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all ${
                  heroMode === 'video'
                    ? 'bg-gradient-to-r from-gold-500 to-emerald-600 text-navy-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>OFFICIAL DEFENSE FOOTAGE</span>
              </button>
              <button
                onClick={() => {
                  handleSound();
                  setHeroMode('3d');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all ${
                  heroMode === '3d'
                    ? 'bg-gradient-to-r from-gold-500 to-emerald-600 text-navy-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>3D BATTLE SIMULATOR</span>
              </button>
            </div>

            {/* 3D Camera Angles */}
            {heroMode === '3d' && (
              <div className="flex items-center gap-1.5">
                {(['COMMAND', 'DOGFIGHT', 'FLEET'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      handleSound();
                      setCamMode(mode);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all ${
                      camMode === mode
                        ? 'bg-gold-500 text-navy-950 font-black shadow-[0_0_14px_rgba(214,173,96,0.6)]'
                        : 'bg-navy-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-gold-500/40'
                    }`}
                  >
                    {mode === 'COMMAND' ? 'COMMAND VIEW' : mode === 'DOGFIGHT' ? 'DOGFIGHT CHASE' : 'NAVAL FLEET'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Radar Scanning Coordinate Bar */}
          <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-defense-success" />
              RADAR ACTIVE
            </span>
            <span>LAT 23.8103° N · LON 90.4125° E</span>
            <span className="hidden sm:inline">DHAKA CANTONMENT</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. LIVE PLATFORM STATISTICS (DATABASE-DRIVEN)
          ======================================================== */}
      <section className="relative z-10 border-y border-navy-800 bg-navy-900/60 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-gold-400 font-military">
                {stats.totalStudents.toLocaleString()}+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Total Enrolled Cadets
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-military">
                {stats.availableCourses} Courses
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Officer Preparation Wings
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-gold-400 font-military">
                {stats.totalQuestions.toLocaleString()}+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Original IQ Questions
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-defense-success font-military">
                {stats.successfulCandidates}+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Recommended Green Cards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. THREE FORCE CARDS: ARMY · NAVY · AIR FORCE
          ======================================================== */}
      <section id="forces" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-gold-500 uppercase">
            TRI-SERVICE EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-military tracking-wide">
            CHOOSE YOUR DEFENSE BRANCH
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-400">
            Specialized pre-commission curriculums tailored specifically to the requirements of the Bangladesh Armed Forces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Army */}
          <div className="group glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between border-t-4 border-t-defense-army relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-defense-army/10 rounded-bl-full pointer-events-none group-hover:bg-defense-army/20 transition-all" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-defense-army/20 border border-defense-army/40 flex items-center justify-center text-white">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white font-military">
                BANGLADESH ARMY
              </h3>
              <span className="inline-block text-xs font-mono px-2.5 py-1 rounded bg-defense-army/30 text-emerald-300 font-semibold">
                BMA LONG COURSE
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Comprehensive training for the Bangladesh Military Academy (BMA Bhatiary). Covers tactical leadership, command tasks, and physical endurance requirements.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-navy-800">
              <Link
                href="/courses?force=ARMY"
                onClick={handleSound}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-white transition-colors"
              >
                <span>EXPLORE ARMY CURRICULUM</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Navy */}
          <div className="group glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between border-t-4 border-t-defense-navy relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-defense-navy/20 rounded-bl-full pointer-events-none group-hover:bg-defense-navy/35 transition-all" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-defense-navy/40 border border-sky-500/40 flex items-center justify-center text-white">
                <Compass className="w-7 h-7 text-sky-400" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white font-military">
                BANGLADESH NAVY
              </h3>
              <span className="inline-block text-xs font-mono px-2.5 py-1 rounded bg-sky-950/60 text-sky-300 font-semibold border border-sky-800/40">
                BNA OFFICER CADET
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Maritime strategy, naval aptitude tests, and officer development for the Bangladesh Naval Academy (BNA Chattogram) executive and technical branches.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-navy-800">
              <Link
                href="/courses?force=NAVY"
                onClick={handleSound}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-white transition-colors"
              >
                <span>EXPLORE NAVY CURRICULUM</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Air Force */}
          <div className="group glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between border-t-4 border-t-defense-airforce relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-defense-airforce/20 rounded-bl-full pointer-events-none group-hover:bg-defense-airforce/35 transition-all" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-blue-900/40 border border-blue-400/40 flex items-center justify-center text-white">
                <Crosshair className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white font-military">
                BANGLADESH AIR FORCE
              </h3>
              <span className="inline-block text-xs font-mono px-2.5 py-1 rounded bg-blue-950/60 text-blue-300 font-semibold border border-blue-800/40">
                BAFA GD(P) & ENGINEERING
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Aviation aptitude, spatial awareness, supersonic rapid decision drills, and flight psychology for Bangladesh Air Force Academy (BAFA Jashore).
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-navy-800">
              <Link
                href="/courses?force=AIR_FORCE"
                onClick={handleSound}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-white transition-colors"
              >
                <span>EXPLORE AIR FORCE CURRICULUM</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. 1000+ IQ PRACTICE ENGINE TEASER
          ======================================================== */}
      <section className="relative z-10 py-20 bg-navy-900/40 backdrop-blur-sm border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
                <Brain className="w-4 h-4" />
                <span>1000+ VERIFIED PRACTICE QUESTIONS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-military">
                MASTER DEFENSE IQ UNDER REAL EXAM PRESSURE
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Verbal, Non-Verbal, Numerical, Spatial, and Pattern Recognition questions with strict 30-second timers, objective automated scoring, and comprehensive step-by-step solutions.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                  <span>Random Question Pools</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                  <span>Strict Server Timers</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                  <span>12 Defense Categories</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-defense-success shrink-0" />
                  <span>Instant Performance Analytics</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/exam/iq"
                  onClick={handleSound}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <Timer className="w-4 h-4" />
                  <span>LAUNCH TIMED IQ DRILL</span>
                </Link>
              </div>
            </div>

            {/* Interactive IQ Preview Card */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-gold-500/30 relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-navy-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-defense-success animate-ping" />
                  <span className="text-xs font-mono text-gold-400 font-bold uppercase">LIVE QUESTION PREVIEW</span>
                </div>
                <span className="text-xs font-mono bg-navy-800 px-2.5 py-1 rounded text-slate-300">
                  TIME: 00:28
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400">CATEGORY: NUMERICAL REASONING</div>
                <p className="text-base sm:text-lg font-semibold text-white leading-snug">
                  What is the next number in the military tactical sequence: <br />
                  <span className="text-gold-400 font-mono text-xl">4, 9, 19, 39, [ ? ]</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {['A) 69', 'B) 78', 'C) 79 (Correct)', 'D) 89'].map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs sm:text-sm font-mono cursor-pointer transition-all ${
                      idx === 2
                        ? 'bg-defense-success/20 border-defense-success text-white font-bold'
                        : 'bg-navy-900 border-navy-800 text-slate-300 hover:border-gold-500/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-lg bg-navy-950/80 border border-navy-800 text-xs text-slate-400 font-sans">
                <strong className="text-gold-400 font-mono">SOLUTION: </strong>
                Each term is multiplied by 2 and increased by 1: (39 × 2) + 1 = 79.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURED COURSES SECTION
          ======================================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-gold-500 uppercase">
              ENROLLMENT CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-military mt-1">
              OFFICER PREPARATION COURSES
            </h2>
          </div>
          <Link
            href="/courses"
            onClick={handleSound}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-white transition-colors"
          >
            <span>VIEW ALL 7 COURSES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data?.featuredCourses || []).slice(0, 3).map((course: any) => (
            <div
              key={course.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-navy-800 hover:border-gold-500/40 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-navy-800 text-gold-400 uppercase font-semibold">
                    {course.targetForce} FORCE
                  </span>
                  <span className="text-xs font-bold text-defense-success bg-defense-success/10 px-2 py-0.5 rounded">
                    SAVE 40%
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase text-white font-military">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-2xl font-black text-gold-400 font-military">
                    ৳{course.discountPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    ৳{course.regularPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-auto">
                    {course.validityDays} Days Access
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-navy-800 flex items-center gap-3">
                <Link
                  href={`/courses/${course.slug}`}
                  onClick={handleSound}
                  className="flex-1 text-center py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold uppercase tracking-wider border border-navy-700 transition-all"
                >
                  CURRICULUM
                </Link>
                <Link
                  href={`/checkout?courseId=${course.id}`}
                  onClick={handleSound}
                  className="flex-1 text-center py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-black uppercase tracking-wider transition-all shadow-md"
                >
                  ENROLL NOW
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. FACEBOOK VIDEO GALLERY (ADMIN DYNAMIC)
          ======================================================== */}
      <section className="relative z-10 py-20 bg-navy-900/50 backdrop-blur-sm border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-gold-500 uppercase">
              TACTICAL VIDEO LECTURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
              DEFENSE MASTERCLASSES & GUIDANCE
            </h2>
            <p className="max-w-xl mx-auto text-sm text-slate-400">
              Insightful video tutorials from our military mentors breaking down PPDT, GTO bridging, and Board Interview psychology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data?.videos || []).map((video: any) => (
              <div
                key={video.id}
                className="glass-panel rounded-xl overflow-hidden border border-navy-800 hover:border-gold-500/40 group cursor-pointer transition-all"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video bg-navy-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-navy-950/40 group-hover:bg-navy-950/20 transition-all" />
                  <div className="w-12 h-12 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-white">
                    VIDEO MASTERCLASS
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-navy-900 border border-gold-500/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-navy-800">
              <h3 className="text-sm font-bold text-white uppercase">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                CLOSE
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={selectedVideo.embedUrl || selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-navy-950">
              <p className="text-xs text-slate-300">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. SUCCESSFUL CANDIDATES & TESTIMONIALS
          ======================================================== */}
      <section id="testimonials" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-gold-500 uppercase">
            COMMISSIONED OFFICERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
            RECOMMENDED CANDIDATE STORIES
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-400">
            Real experiences from Bravo Academy alumni who earned their Green Cards and are currently serving the nation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(data?.testimonials || []).map((t: any) => (
            <div
              key={t.id}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-navy-800 hover:border-gold-500/30"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-gold-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{t.reviewText}"
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-navy-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center font-bold text-gold-400">
                  {t.candidateName[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.candidateName}</div>
                  <div className="text-xs text-gold-400/90 font-mono">{t.cadetCourse} · {t.forceSelected}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          8. FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ======================================================== */}
      <section className="relative z-10 py-20 bg-navy-900/50 backdrop-blur-sm border-t border-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-gold-500 uppercase">
              GOT QUESTIONS?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {(data?.faqs || []).map((faq: any, idx: number) => (
              <div
                key={faq.id}
                className="glass-panel rounded-xl border border-navy-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => {
                    handleSound();
                    setActiveFaq(activeFaq === idx ? null : idx);
                  }}
                  className="w-full text-left p-5 flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-gold-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-gold-400 transition-transform ${
                      activeFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-navy-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FINAL CALL TO ACTION BANNER
          ======================================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="glass-panel rounded-3xl p-10 sm:p-16 border-2 border-gold-500/40 shadow-[0_0_50px_rgba(214,173,96,0.15)] relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-gold-400 uppercase">
              BECOME A BANGLADESH DEFENSE OFFICER
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-military">
              START YOUR PREPARATION TODAY
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Join thousands of dedicated candidates preparing for Bangladesh Army, Navy, and Air Force commissions with Bravo Academy.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                onClick={handleSound}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                REGISTER AS CADET
              </Link>
              <Link
                href="/courses"
                onClick={handleSound}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-navy-900 border border-gold-500/40 text-white font-bold text-sm uppercase tracking-widest hover:bg-navy-800 transition-all"
              >
                BROWSE ALL COURSES
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
