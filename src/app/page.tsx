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
  VolumeX,
  Target,
  Check
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

const FALLBACK_COURSES = [
  {
    id: 'course-army-bma',
    title: 'BMA Long Course Complete Mastery',
    targetForce: 'ARMY',
    slug: 'bma-long-course',
    description: 'Complete 360° pre-commission preparation for Bangladesh Military Academy. Includes full IQ battery, PPDT, GTO tasks, and Viva drills.',
    regularPrice: 5800,
    discountPrice: 3500,
    validityDays: 180,
    features: ['100+ Authentic Verbal IQ Drills', 'PPDT Story Writing & Narration', 'GTO Field Tactics & MPE Plans'],
  },
  {
    id: 'course-navy-bna',
    title: 'BNA Officer Cadet Naval Package',
    targetForce: 'NAVY',
    slug: 'bna-officer-cadet',
    description: 'Rigorous training module for Bangladesh Naval Academy officer cadet screening. Specialized spatial reasoning, science aptitude, and interview prep.',
    regularPrice: 5200,
    discountPrice: 3200,
    validityDays: 180,
    features: ['Naval Aptitude & Spatial Tests', 'Psychology Battery & WAT Drills', 'Board Viva Simulation with Mentors'],
  },
  {
    id: 'course-airforce-bafa',
    title: 'BAFA GD(P) & Engineering Special',
    targetForce: 'AIR_FORCE',
    slug: 'bafa-gdp-engineering',
    description: 'Elite aviation aptitude, rapid supersonic decision drills, flight psychology, and technical screening for Bangladesh Air Force Academy.',
    regularPrice: 6200,
    discountPrice: 3800,
    validityDays: 180,
    features: ['Flight Grading & Pilot Aptitude', 'High-Speed Reflex Time Drills', '4-Day Complete ISSB Simulation'],
  },
];

const FALLBACK_VIDEOS = [
  {
    id: 'vid-1',
    title: 'PPDT Masterclass: 30-Second Picture Perception & Story Formulation',
    description: 'Learn the exact military psychology methodology to identify hero, mood, action, and outcome in under 4 minutes.',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '18 Min',
  },
  {
    id: 'vid-2',
    title: 'GTO Ground Tasks: Bridging & Cantilever Tactics Explained',
    description: 'Comprehensive physical obstacle breakdown covering fulcrum physics, plank tying, and leaderless group dynamics.',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '24 Min',
  },
  {
    id: 'vid-3',
    title: 'Board Interview Psychology: Body Language & Officer Like Qualities (OLQ)',
    description: 'Master the President & Deputy President viva questions, general knowledge tactics, and authentic composure under pressure.',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '21 Min',
  },
];

const FALLBACK_TESTIMONIALS = [
  {
    id: 'test-1',
    candidateName: 'Cadet Tahmidur Rahman',
    cadetCourse: '91 BMA Long Course',
    forceSelected: 'Bangladesh Army',
    rating: 5,
    reviewText: 'The strict 30-second IQ timers and authentic PPDT scenarios gave me extreme confidence. Recommended on my very first attempt!',
  },
  {
    id: 'test-2',
    candidateName: 'Cadet Fahim Chowdhury',
    cadetCourse: '2024-B BNA Officer Cadet',
    forceSelected: 'Bangladesh Navy',
    rating: 5,
    reviewText: 'The spatial reasoning drills and MPE planning tasks match the actual ISSB board standards completely. Best platform in BD.',
  },
  {
    id: 'test-3',
    candidateName: 'Cadet Tanvir Ahmed',
    cadetCourse: '86 BAFA GD(P)',
    forceSelected: 'Bangladesh Air Force',
    rating: 5,
    reviewText: 'Superb platform. The rapid decision drills and psychology word association battery prepared me thoroughly for flight grading.',
  },
];

const FALLBACK_FAQS = [
  {
    id: 'faq-1',
    question: 'How does Bravo Academy simulate the real ISSB screening test?',
    answer: 'We provide authentic timed Verbal & Non-Verbal IQ drills with strict 30-second server constraints, realistic PPDT picture projection with automated story timers, and comprehensive 4-day psychological battery assessments modeled directly after ISSB standards.',
  },
  {
    id: 'faq-2',
    question: 'Can I practice on my mobile phone or tablet?',
    answer: 'Yes! Bravo Academy is 100% responsive and optimized for mobile phones, tablets, laptops, and desktop computers with zero loss of functionality.',
  },
  {
    id: 'faq-3',
    question: 'How does course enrollment and payment approval work?',
    answer: 'Candidates make a quick payment via bKash or Nagad, submit their transaction ID and cadet details, and our admin team verifies and unlocks the full candidate dashboard with premium access.',
  },
  {
    id: 'faq-4',
    question: 'Are the IQ questions authentic Bangladesh defense questions?',
    answer: 'Yes, our question bank contains over 1,000 verified questions extracted from official defense examination papers and authentic academy mock series.',
  },
];

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [camMode, setCamMode] = useState<'COMMAND' | 'DOGFIGHT' | 'FLEET'>('COMMAND');
  const [heroMode, setHeroMode] = useState<'video' | '3d'>('video');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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
    totalQuestions: 1005,
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

  // Strictly 3 courses for the homepage as requested by user
  const rawCourses = data?.featuredCourses && data.featuredCourses.length > 0 ? data.featuredCourses : FALLBACK_COURSES;
  const coursesToDisplay = rawCourses.slice(0, 3);

  const videosToDisplay = data?.videos && data.videos.length > 0 ? data.videos.slice(0, 3) : FALLBACK_VIDEOS;
  const testimonialsToDisplay = data?.testimonials && data.testimonials.length > 0 ? data.testimonials.slice(0, 3) : FALLBACK_TESTIMONIALS;
  const faqsToDisplay = data?.faqs && data.faqs.length > 0 ? data.faqs.slice(0, 4) : FALLBACK_FAQS;

  return (
    <div className="relative min-h-screen bg-[#040d08] text-slate-100 overflow-hidden">
      {/* Background Military Grid Accent */}
      <div className="fixed inset-0 bg-military-grid pointer-events-none opacity-40 z-0" />

      {/* ========================================================
          1. CINEMATIC HERO SECTION (PRESERVED INTACT)
          ======================================================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        {/* Dynamic Hero Background */}
        {heroMode === 'video' ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

        {/* Minimal Edge Transitions */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#040d08] via-transparent to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
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
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-200 font-sans leading-relaxed drop-shadow-md">
            {cms.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href={cms.primaryCtaLink}
              onClick={handleSound}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-amber-500 to-emerald-600 hover:from-gold-400 hover:to-emerald-500 text-navy-950 font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(214,173,96,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>{cms.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={cms.secondaryCtaLink}
              onClick={handleSound}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#09241a]/90 hover:bg-[#0d2f22] border border-emerald-500/40 hover:border-emerald-400 text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{cms.secondaryCtaText}</span>
            </Link>
          </div>

          {/* Tactical Background Mode & Prominent Audio Controller */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={toggleSound}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border backdrop-blur-md transition-all shadow-xl ${
                isPlayingAudio && !isMuted
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse'
                  : 'bg-slate-900/85 border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50'
              }`}
            >
              {isPlayingAudio && !isMuted ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span>DEFENSE SOUNDTRACK: PLAYING (MUTE)</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>DEFENSE SOUNDTRACK: MUTED (PLAY)</span>
                </>
              )}
            </button>

            <div className="inline-flex items-center p-1 rounded-full bg-[#082218]/90 border border-slate-700/80 backdrop-blur-md shadow-xl">
              <button
                onClick={() => {
                  handleSound();
                  setHeroMode('video');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider transition-all ${
                  heroMode === 'video'
                    ? 'bg-gradient-to-r from-gold-500 to-emerald-600 text-navy-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>OFFICIAL FOOTAGE</span>
              </button>
              <button
                onClick={() => {
                  handleSound();
                  setHeroMode('3d');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider transition-all ${
                  heroMode === '3d'
                    ? 'bg-gradient-to-r from-gold-500 to-emerald-600 text-navy-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>3D SIMULATOR</span>
              </button>
            </div>

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
                    {mode === 'COMMAND' ? 'COMMAND' : mode === 'DOGFIGHT' ? 'DOGFIGHT' : 'FLEET'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Radar Scanning Coordinate Bar */}
          <div className="pt-1 flex items-center justify-center gap-5 text-[11px] font-mono text-emerald-400/80">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              RADAR ACTIVE
            </span>
            <span>LAT 23.8103° N · LON 90.4125° E</span>
            <span className="hidden sm:inline">DHAKA CANTONMENT</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. COMPACT TACTICAL HUD STATS BAR (ARMY VIBE BACKGROUND)
          ======================================================== */}
      <section className="relative z-10 border-y border-emerald-900/50 bg-[#04100b]/90 backdrop-blur-md py-5 sm:py-6 overflow-hidden">
        {/* Army Vibe Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 filter contrast-125 saturate-50"
          style={{ backgroundImage: `url('/images/backgrounds/bg-forces.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040d08] via-transparent to-[#040d08] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-emerald-900/30 text-center">
            <div className="pt-2 sm:pt-0 sm:px-3 space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300 font-military">
                {stats.totalStudents.toLocaleString()}+
              </div>
              <div className="text-[11px] sm:text-xs font-mono font-medium text-emerald-300/80 uppercase tracking-wider">
                Total Enrolled Cadets
              </div>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-3 space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-military">
                {stats.availableCourses} Wings
              </div>
              <div className="text-[11px] sm:text-xs font-mono font-medium text-emerald-300/80 uppercase tracking-wider">
                Officer Preparation Wings
              </div>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-3 space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300 font-military">
                {stats.totalQuestions.toLocaleString()}+
              </div>
              <div className="text-[11px] sm:text-xs font-mono font-medium text-emerald-300/80 uppercase tracking-wider">
                Original IQ Questions
              </div>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-3 space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 font-military">
                {stats.successfulCandidates}+
              </div>
              <div className="text-[11px] sm:text-xs font-mono font-medium text-emerald-300/80 uppercase tracking-wider">
                Recommended Green Cards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. THREE FORCE CARDS (ARMY VIBE BACKGROUND)
          ======================================================== */}
      <section id="forces" className="relative z-10 py-10 md:py-14 px-4 sm:px-6 lg:px-8 border-t border-emerald-900/40 overflow-hidden">
        {/* Army Vibe Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 filter contrast-125 saturate-50"
          style={{ backgroundImage: `url('/images/backgrounds/bg-forces.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d08] via-[#040d08]/85 to-[#040d08] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-8 md:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>TRI-SERVICE EXCELLENCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white font-military tracking-wide">
              CHOOSE YOUR DEFENSE BRANCH
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300">
              Specialized pre-commission curriculums tailored specifically to the requirements of the Bangladesh Armed Forces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {/* Card 1: Army */}
            <div className="group relative rounded-xl p-5 sm:p-6 bg-[#061811]/90 backdrop-blur-md border border-emerald-900/60 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 uppercase">
                    BMA LONG COURSE
                  </span>
                  <h3 className="text-xl font-black uppercase text-white font-military mt-1">
                    BANGLADESH ARMY
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Comprehensive training for Bangladesh Military Academy (BMA Bhatiary). Covers tactical leadership, command tasks, and physical endurance requirements.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-emerald-900/50">
                <Link
                  href="/courses?force=ARMY"
                  onClick={handleSound}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-emerald-300 transition-colors"
                >
                  <span>EXPLORE ARMY CURRICULUM</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Navy */}
            <div className="group relative rounded-xl p-5 sm:p-6 bg-[#061811]/90 backdrop-blur-md border border-emerald-900/60 hover:border-sky-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(14,165,233,0.2)] flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/10 rounded-bl-full pointer-events-none group-hover:bg-sky-500/20 transition-all" />
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
                  <Compass className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30 uppercase">
                    BNA OFFICER CADET
                  </span>
                  <h3 className="text-xl font-black uppercase text-white font-military mt-1">
                    BANGLADESH NAVY
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Maritime strategy, naval aptitude tests, and officer development for Bangladesh Naval Academy (BNA Chattogram) executive and technical branches.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-emerald-900/50">
                <Link
                  href="/courses?force=NAVY"
                  onClick={handleSound}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-sky-300 transition-colors"
                >
                  <span>EXPLORE NAVY CURRICULUM</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3: Air Force */}
            <div className="group relative rounded-xl p-5 sm:p-6 bg-[#061811]/90 backdrop-blur-md border border-emerald-900/60 hover:border-amber-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:bg-amber-500/20 transition-all" />
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <Crosshair className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 uppercase">
                    BAFA GD(P) & ENGINEERING
                  </span>
                  <h3 className="text-xl font-black uppercase text-white font-military mt-1">
                    BANGLADESH AIR FORCE
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aviation aptitude, spatial awareness, supersonic rapid decision drills, and flight psychology for Bangladesh Air Force Academy (BAFA Jashore).
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-emerald-900/50">
                <Link
                  href="/courses?force=AIR_FORCE"
                  onClick={handleSound}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-amber-300 transition-colors"
                >
                  <span>EXPLORE AIR FORCE CURRICULUM</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. 1000+ IQ PRACTICE ENGINE TEASER (ARMY VIBE BACKGROUND)
          ======================================================== */}
      <section className="relative z-10 py-10 md:py-14 bg-[#05140d]/90 backdrop-blur-sm border-y border-emerald-950/80 overflow-hidden">
        {/* Tactical Military Operations Center Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 filter contrast-125 saturate-75"
          style={{ backgroundImage: `url('/images/backgrounds/bg-iq.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040d08]/95 via-[#040d08]/80 to-[#040d08]/95 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span>1000+ VERIFIED PRACTICE QUESTIONS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-military leading-tight">
                MASTER DEFENSE IQ UNDER REAL EXAM PRESSURE
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Verbal, Non-Verbal, Numerical, Spatial, and Pattern Recognition questions with strict 30-second timers, objective automated scoring, and comprehensive step-by-step solutions.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Random Question Pools</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Strict Server Timers</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>12 Defense Categories</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Performance Analytics</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/exam/iq"
                  onClick={handleSound}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-emerald-600 hover:from-gold-400 hover:to-emerald-500 text-navy-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
                >
                  <Timer className="w-4 h-4" />
                  <span>LAUNCH TIMED IQ DRILL</span>
                </Link>
              </div>
            </div>

            {/* Right Interactive IQ Preview Box */}
            <div className="lg:col-span-5">
              <div className="rounded-xl p-5 sm:p-6 bg-[#071f16]/95 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono text-gold-400 font-bold uppercase tracking-wider">
                      LIVE QUESTION PREVIEW
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-[#04100b] px-2.5 py-1 rounded border border-emerald-900/60 text-emerald-300">
                    TIME: 00:28
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-emerald-400/80 uppercase">
                    CATEGORY: NUMERICAL REASONING
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                    What is the next number in the military tactical sequence: <br />
                    <span className="text-gold-400 font-mono text-lg font-bold">4, 9, 19, 39, [ ? ]</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {[
                    { label: 'A) 69', isCorrect: false },
                    { label: 'B) 78', isCorrect: false },
                    { label: 'C) 79', isCorrect: true },
                    { label: 'D) 89', isCorrect: false },
                  ].map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const showCorrect = selectedAnswer !== null && opt.isCorrect;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          handleSound();
                          setSelectedAnswer(idx);
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-mono text-left transition-all ${
                          showCorrect
                            ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                            : isSelected
                            ? 'bg-red-500/20 border-red-500 text-red-200'
                            : 'bg-[#04100b] border-emerald-900/60 text-slate-300 hover:border-emerald-500/50 hover:bg-[#07241a]'
                        }`}
                      >
                        {opt.label} {showCorrect && '✓'}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-lg bg-[#04100b] border border-emerald-900/60 text-[11px] text-slate-300 font-sans">
                  <strong className="text-gold-400 font-mono">SOLUTION: </strong>
                  Each term is multiplied by 2 and increased by 1: (39 × 2) + 1 = 79.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURED COURSES SECTION (ARMY VIBE BACKGROUND)
          ======================================================== */}
      <section className="relative z-10 py-10 md:py-14 px-4 sm:px-6 lg:px-8 border-t border-emerald-950/80 overflow-hidden">
        {/* Military Training Grounds Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 filter contrast-125 saturate-60"
          style={{ backgroundImage: `url('/images/backgrounds/bg-courses.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d08] via-[#040d08]/85 to-[#040d08] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono tracking-widest uppercase">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>TRI-SERVICE ENROLLMENT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white font-military mt-2">
                OFFICER PREPARATION COURSES
              </h2>
            </div>
            <Link
              href="/courses"
              onClick={handleSound}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-emerald-300 transition-colors"
            >
              <span>VIEW ALL COURSES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Strictly 3 Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {coursesToDisplay.map((course: any) => (
              <div
                key={course.id}
                className="group relative rounded-xl p-5 sm:p-6 bg-[#071d15]/90 backdrop-blur-md border border-emerald-900/60 hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#04100b] text-emerald-300 uppercase font-semibold border border-emerald-800/60">
                      {course.targetForce || 'TRI-SERVICE'} FORCE
                    </span>
                    <span className="text-[10px] font-bold text-gold-400 bg-gold-500/15 border border-gold-500/30 px-2 py-0.5 rounded">
                      SAVE 40%
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black uppercase text-white font-military group-hover:text-gold-400 transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Features Highlights */}
                  {course.features && course.features.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {course.features.slice(0, 3).map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-baseline gap-2 pt-2 border-t border-emerald-900/50">
                    <span className="text-2xl font-black text-gold-400 font-military">
                      ৳{(course.discountPrice || 3500).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ৳{(course.regularPrice || 5800).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300/80 ml-auto bg-[#04100b] px-2 py-0.5 rounded border border-emerald-900/50">
                      {course.validityDays || 180} Days Access
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-900/50 flex items-center gap-2.5">
                  <Link
                    href={`/courses/${course.slug || course.id}`}
                    onClick={handleSound}
                    className="flex-1 text-center py-2.5 rounded-lg bg-[#04100b] hover:bg-[#07241a] text-slate-200 text-xs font-bold uppercase tracking-wider border border-emerald-900/60 hover:border-emerald-500/50 transition-all"
                  >
                    CURRICULUM
                  </Link>
                  <Link
                    href={`/checkout?courseId=${course.id}`}
                    onClick={handleSound}
                    className="flex-1 text-center py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-emerald-600 hover:from-gold-400 hover:to-emerald-500 text-navy-950 text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(214,173,96,0.3)] hover:scale-105 active:scale-95"
                  >
                    ENROLL NOW
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. TACTICAL VIDEO LECTURES (ARMY VIBE BACKGROUND)
          ======================================================== */}
      <section className="relative z-10 py-10 md:py-14 bg-[#05130d]/90 backdrop-blur-sm border-t border-emerald-950/80 overflow-hidden">
        {/* Tactical Command Briefing Room Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 filter contrast-125 saturate-60"
          style={{ backgroundImage: `url('/images/backgrounds/bg-videos.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d08] via-[#040d08]/85 to-[#040d08] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8 md:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono tracking-widest uppercase">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>TACTICAL VIDEO LECTURES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white font-military">
              DEFENSE MASTERCLASSES & GUIDANCE
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300">
              Insightful video tutorials from our military mentors breaking down PPDT, GTO bridging, and Board Interview psychology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {videosToDisplay.map((video: any) => (
              <div
                key={video.id}
                className="group relative rounded-xl overflow-hidden bg-[#071d15]/90 backdrop-blur-md border border-emerald-900/60 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer transition-all duration-300"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video bg-[#04100b] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-gold-500 to-emerald-500 text-navy-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-300 border border-emerald-900/50">
                    {video.duration || 'MASTERCLASS'}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#071d15] border border-emerald-500/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3.5 border-b border-emerald-900/60 bg-[#04100b]">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase truncate pr-4">
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white text-xs font-mono font-bold px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded"
              >
                CLOSE [✕]
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
            <div className="p-3.5 bg-[#04100b] border-t border-emerald-900/60">
              <p className="text-xs text-slate-300">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. SUCCESSFUL CANDIDATES & TESTIMONIALS (ARMY VIBE BACKGROUND)
          ======================================================== */}
      <section id="testimonials" className="relative z-10 py-10 md:py-14 px-4 sm:px-6 lg:px-8 border-t border-emerald-950/80 overflow-hidden">
        {/* Military Parade Grounds Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 filter contrast-125 saturate-60"
          style={{ backgroundImage: `url('/images/backgrounds/bg-testimonials.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d08] via-[#040d08]/85 to-[#040d08] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-8 md:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono tracking-widest uppercase">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>COMMISSIONED OFFICERS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white font-military">
              RECOMMENDED CANDIDATE STORIES
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300">
              Real experiences from Bravo Academy alumni who earned their Green Cards and are currently serving the nation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {testimonialsToDisplay.map((t: any) => (
              <div
                key={t.id}
                className="rounded-xl p-5 sm:p-6 bg-[#071d15]/80 backdrop-blur-md border border-emerald-900/60 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-gold-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    "{t.reviewText}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-900/50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-gold-400 text-xs">
                    {t.candidateName ? t.candidateName[0] : 'C'}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">{t.candidateName}</div>
                    <div className="text-[10px] font-mono text-emerald-300/80">
                      {t.cadetCourse} · {t.forceSelected}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. FREQUENTLY ASKED QUESTIONS (ARMY VIBE BACKGROUND)
          ======================================================== */}
      <section className="relative z-10 py-10 md:py-14 bg-[#05130d]/90 backdrop-blur-sm border-t border-emerald-950/80 overflow-hidden">
        {/* Tactical Military Camouflage Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 filter contrast-125 saturate-60"
          style={{ backgroundImage: `url('/images/backgrounds/bg-faq.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d08] via-[#040d08]/88 to-[#040d08] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-6 md:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono tracking-widest uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>GOT QUESTIONS?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-military">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqsToDisplay.map((faq: any, idx: number) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isOpen
                      ? 'bg-[#071f16] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-[#071d15]/80 border-emerald-900/60 hover:border-emerald-500/30'
                  }`}
                >
                  <button
                    onClick={() => {
                      handleSound();
                      setActiveFaq(isOpen ? null : idx);
                    }}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-gold-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-emerald-400 transition-transform ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-emerald-900/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FINAL CALL TO ACTION BANNER (ARMY VIBE BACKGROUND)
          ======================================================== */}
      <section className="relative z-10 py-10 md:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="relative rounded-2xl p-6 sm:p-10 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden">
          {/* Tactical Commandos Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-30 filter contrast-125 saturate-75"
            style={{ backgroundImage: `url('/images/backgrounds/bg-cta.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#082218]/95 via-[#061911]/90 to-[#040d08]/95 pointer-events-none" />

          <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-gold-400 uppercase">
              BECOME A BANGLADESH DEFENSE OFFICER
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-military">
              START YOUR PREPARATION TODAY
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Join thousands of dedicated candidates preparing for Bangladesh Army, Navy, and Air Force commissions with Bravo Academy.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                onClick={handleSound}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-amber-500 to-emerald-600 hover:from-gold-400 hover:to-emerald-500 text-navy-950 font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(214,173,96,0.4)] hover:scale-105 active:scale-95"
              >
                REGISTER AS CADET
              </Link>
              <Link
                href="/courses"
                onClick={handleSound}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#071f16] border border-emerald-500/40 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#0a2c1f] hover:border-emerald-400 transition-all"
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
