'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Timer,
  CheckCircle,
  AlertCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Shield,
  RotateCcw,
  Award,
  ArrowRight,
  Brain,
  Sliders,
  Check,
  X,
  Play,
  HelpCircle,
  Eye,
  Layers
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function IqExamPage() {
  // Pre-Exam Customization State
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [selectedSection, setSelectedSection] = useState<'VERBAL' | 'NON_VERBAL' | 'ALL'>('ALL');
  const [selectedMode, setSelectedMode] = useState<'EXAM' | 'PRACTICE'>('EXAM');
  const [selectedCount, setSelectedCount] = useState<number>(25);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Exam / Practice Active State
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1200); // in seconds
  const [totalInitialTime, setTotalInitialTime] = useState(1200);
  const [examFinished, setExamFinished] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Start Exam after customization
  const handleStartExam = async () => {
    setLoading(true);
    tacticalAudio.playRadarPing();

    // Calculate time based on count and mode: ~45 seconds per question for ISSB standard
    const totalSec = selectedCount * 48;
    setTimeLeft(totalSec);
    setTotalInitialTime(totalSec);

    const sectionParam = selectedSection === 'ALL' ? '' : `&iqSection=${selectedSection}`;
    const diffParam = selectedDifficulty === 'ALL' ? '' : `&difficulty=${selectedDifficulty}`;

    try {
      const res = await fetch(`/api/questions?limit=${selectedCount}&random=true${sectionParam}${diffParam}`);
      const data = await res.json();
      if (data.success && data.questions.length > 0) {
        setQuestions(data.questions);
        setIsConfiguring(false);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setFlaggedQuestions({});
        setRevealedSolutions({});
        setExamFinished(false);
        setResults(null);
      } else {
        alert('No questions found matching your filter. Please try a different selection.');
      }
    } catch {
      alert('Error fetching questions.');
    } finally {
      setLoading(false);
    }
  };

  // Timer Countdown with auto-submit (Only in EXAM mode)
  useEffect(() => {
    if (isConfiguring || examFinished || loading || questions.length === 0 || selectedMode === 'PRACTICE') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isConfiguring, examFinished, loading, questions, selectedMode]);

  const selectOption = (optKey: string) => {
    tacticalAudio.playInterfaceClick();
    const currentQ = questions[currentIndex];
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optKey
    });
  };

  const toggleFlag = () => {
    tacticalAudio.playInterfaceClick();
    const currentQ = questions[currentIndex];
    setFlaggedQuestions({
      ...flaggedQuestions,
      [currentQ.id]: !flaggedQuestions[currentQ.id]
    });
  };

  const toggleShowSolution = () => {
    tacticalAudio.playInterfaceClick();
    const currentQ = questions[currentIndex];
    setRevealedSolutions({
      ...revealedSolutions,
      [currentQ.id]: !revealedSolutions[currentQ.id]
    });
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    tacticalAudio.playRadarPing();

    const payload = {
      answers: questions.map((q) => ({
        questionId: q.id,
        chosenAnswer: selectedAnswers[q.id] || null
      })),
      timeSpentSec: totalInitialTime - timeLeft
    };

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setResults(data);
        setExamFinished(true);
      }
    } catch {
      alert('Network failure submitting exam.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ========================================================
  // VIEW 1: PRE-EXAM CUSTOMIZATION DASHBOARD (USER REQUEST)
  // ========================================================
  if (isConfiguring) {
    return (
      <div className="min-h-screen bg-navy-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>OFFICER SCREENING · INTELLIGENCE TEST ENGINE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
              IQ PRACTICE & EXAM GENERATOR
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-sans">
              Customize your preparation session before beginning. Select Verbal vs Non-Verbal, question count, and practice mode.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-emerald-500/30 bg-gradient-to-br from-[#0c2419] via-navy-950 to-navy-900 space-y-8 shadow-2xl">
            {/* Step 1: IQ Section (Verbal vs Non-Verbal vs Combined) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-2">
                  <span>1. CHOOSE IQ SECTION (ভার্বাল / নন-ভার্বাল বিভাজন)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">ISSB DAY 1 SCREENING</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'ALL',
                    label: 'COMBINED MOCK',
                    bengali: 'ভার্বাল + নন-ভার্বাল (ISSB ফুল)',
                    desc: '50% Verbal Analogies + 50% Spatial Matrix'
                  },
                  {
                    id: 'VERBAL',
                    label: 'VERBAL IQ ONLY',
                    bengali: 'শুধু ভার্বাল আইকিউ',
                    desc: 'Number series, word coding, blood relations'
                  },
                  {
                    id: 'NON_VERBAL',
                    label: 'NON-VERBAL IQ ONLY',
                    bengali: 'শুধু নন-ভার্বাল / স্পেশিয়াল',
                    desc: 'Figure pattern, rotation, dice, Raven matrices'
                  }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      tacticalAudio.playInterfaceClick();
                      setSelectedSection(s.id as any);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedSection === s.id
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-navy-900/90 border-navy-800 text-slate-300 hover:border-emerald-500/40 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-mono font-black uppercase tracking-wider">{s.label}</div>
                    <div className="text-[11px] font-sans mt-0.5 opacity-90">{s.bengali}</div>
                    <div className="text-[10px] text-slate-300 mt-2 line-clamp-2">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Practice Mode vs Real Exam Mode */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                <span className="text-xs font-mono font-bold text-gold-400 uppercase flex items-center gap-2">
                  <span>2. SELECT TRAINING MODE (প্র্যাকটিস বনাম এক্সাম মোড)</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setSelectedMode('EXAM');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedMode === 'EXAM'
                      ? 'bg-gradient-to-r from-amber-600 to-gold-500 text-navy-950 font-bold border-gold-400 shadow-lg'
                      : 'bg-navy-900 border-navy-800 text-slate-300 hover:border-gold-500/40'
                  }`}
                >
                  <div className="text-xs font-mono font-black uppercase tracking-wider flex items-center justify-between">
                    <span>REAL TIMED EXAM MODE</span>
                    <Timer className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] mt-1 font-sans">কঠোর টাইমার ও এক্সাম প্রেশার</div>
                  <p className="text-[10px] mt-2 opacity-80 font-sans">
                    Strict ISSB countdown, question navigation palette, negative marking, instant final scorecard.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setSelectedMode('PRACTICE');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedMode === 'PRACTICE'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold border-emerald-400 shadow-lg'
                      : 'bg-navy-900 border-navy-800 text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="text-xs font-mono font-black uppercase tracking-wider flex items-center justify-between">
                    <span>UNTIMED PRACTICE & LEARNING</span>
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] mt-1 font-sans">লার্নিং ড্রিল ও ইনস্ট্যান্ট সমাধান</div>
                  <p className="text-[10px] mt-2 opacity-80 font-sans">
                    No rush, solve at your own pace. Reveal detailed step-by-step logic and explanation after each question.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 3: Question Count & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase text-slate-300">
                  NUMBER OF QUESTIONS (প্রশ্নের সংখ্যা)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        tacticalAudio.playInterfaceClick();
                        setSelectedCount(cnt);
                      }}
                      className={`py-2 rounded-lg font-mono text-xs font-bold uppercase border transition-all ${
                        selectedCount === cnt
                          ? 'bg-gold-500 text-navy-950 border-gold-400 shadow'
                          : 'bg-navy-900 border-navy-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase text-slate-300">
                  DIFFICULTY LEVEL (কঠিনতার মাত্রা)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => {
                        tacticalAudio.playInterfaceClick();
                        setSelectedDifficulty(diff);
                      }}
                      className={`py-2 rounded-lg font-mono text-xs font-bold uppercase border transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-emerald-500 text-navy-950 border-emerald-400 shadow'
                          : 'bg-navy-900 border-navy-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartExam}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-gold-500 hover:from-emerald-500 hover:to-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl font-mono flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>INITIALIZING TACTICAL QUESTION STREAM...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>LAUNCH CUSTOMIZED IQ DRILL ({selectedCount} QUESTIONS)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW 2: EXAM RESULTS SCREEN
  // ========================================================
  if (examFinished && results) {
    return (
      <div className="min-h-screen bg-navy-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="glass-panel rounded-2xl p-8 sm:p-10 border border-gold-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gold-500/20 border-2 border-gold-400 mx-auto flex items-center justify-center text-gold-400 shadow-md">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
                OFFICER CANDIDATE APTITUDE EVALUATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
                TEST SESSION COMPLETE
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">SCORE PERCENTAGE</div>
                <div className={`text-3xl font-black font-military ${results.isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {results.percentage}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">CORRECT ANSWERS</div>
                <div className="text-3xl font-black text-white font-military">
                  {results.correctCount} / {results.totalQuestions}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">BENCHMARK STATUS</div>
                <div className={`text-base font-black font-military mt-2 ${results.isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {results.isPassed ? 'RECOMMENDED PASS' : 'NEEDS PRACTICE'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">SECTION TESTED</div>
                <div className="text-base font-black text-gold-400 font-military mt-2">
                  {selectedSection}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setIsConfiguring(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black uppercase tracking-wider transition-all"
              >
                START NEW CUSTOM DRILL →
              </button>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-200 uppercase font-bold tracking-wider transition-all"
              >
                RETURN TO DASHBOARD
              </Link>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
            <h3 className="text-lg font-black uppercase text-white font-military border-b border-navy-800 pb-3 flex items-center justify-between">
              <span>STEP-BY-STEP SOLUTION REVIEW</span>
              <span className="text-xs font-mono text-slate-400">MILITARY LOGIC BREAKDOWN</span>
            </h3>

            <div className="space-y-4">
              {results.reviewedAnswers?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    item.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-red-950/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      QUESTION {idx + 1} ({item.category})
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        item.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {item.isCorrect ? '✓ CORRECT' : '✕ INCORRECT'}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white mb-3">{item.questionText}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                    <div className="p-2 rounded bg-navy-900/80 border border-navy-800">
                      <span className="text-slate-400">Your Answer: </span>
                      <strong className={item.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                        {item.chosenAnswer || 'SKIPPED'}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-navy-900/80 border border-navy-800">
                      <span className="text-slate-400">Correct Answer: </span>
                      <strong className="text-emerald-400">{item.correctAnswer}</strong>
                    </div>
                  </div>

                  {item.explanation && (
                    <div className="p-3 rounded-lg bg-navy-950/80 border border-navy-800 text-xs text-slate-300 font-sans">
                      <strong className="text-gold-400 font-mono text-[11px] block mb-1">EXPLANATION:</strong>
                      {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW 3: ACTIVE TEST / PRACTICE INTERFACE
  // ========================================================
  const currentQ = questions[currentIndex] || {};
  const currentSelected = selectedAnswers[currentQ.id];
  const isFlagged = flaggedQuestions[currentQ.id];
  const isSolutionRevealed = revealedSolutions[currentQ.id];

  return (
    <div className="min-h-screen bg-navy-950 pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-navy-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Exit test and return to customization?')) {
                  setIsConfiguring(true);
                }
              }}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>CUSTOMIZE</span>
            </button>
            <span className="text-slate-700">|</span>
            <div className="text-xs font-mono text-gold-400 uppercase font-bold">
              {selectedSection} IQ · {selectedMode} MODE
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selectedMode === 'EXAM' && (
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider ${
                  timeLeft < 300
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'bg-navy-900 border border-navy-700 text-emerald-400'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>{formatTimer(timeLeft)} REMAINING</span>
              </div>
            )}

            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-gold-500 text-navy-950 font-black text-xs uppercase font-mono tracking-wider shadow transition-all hover:scale-105"
            >
              {submitting ? 'EVALUATING...' : 'FINISH & SUBMIT'}
            </button>
          </div>
        </div>

        {/* 2-Column: Question Interface + Navigation Palette */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Active Question Box (8 cols) */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                QUESTION {currentIndex + 1} OF {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-gold-400 font-bold uppercase">
                  {currentQ.iqSection || 'VERBAL'}
                </span>
                <button
                  type="button"
                  onClick={toggleFlag}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                    isFlagged
                      ? 'bg-amber-500 text-navy-950 font-bold shadow'
                      : 'bg-navy-900 border border-navy-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isFlagged ? 'FLAGGED' : 'FLAG'}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h3>

            {/* Non-Verbal Diagram Image (If present) */}
            {currentQ.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-navy-950 p-2 max-w-md mx-auto">
                <img
                  src={currentQ.imageUrl}
                  alt="Spatial IQ Figure"
                  className="w-full h-auto max-h-64 object-contain rounded-lg"
                />
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options?.map((opt: any) => {
                const isSelected = currentSelected === opt.key;
                return (
                  <button
                    key={opt.id || opt.key}
                    type="button"
                    onClick={() => selectOption(opt.key)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-600/30 to-gold-500/20 border-emerald-400 text-white font-bold shadow-md'
                        : 'bg-navy-900/80 border-navy-800 text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-navy-950 font-black'
                          : 'bg-navy-800 text-slate-400 border border-navy-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-sm font-sans flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Practice Mode Solution Revealer */}
            {selectedMode === 'PRACTICE' && (
              <div className="pt-4 border-t border-navy-800 space-y-3">
                <button
                  type="button"
                  onClick={toggleShowSolution}
                  className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-gold-500/30 text-gold-400 font-mono text-xs font-bold uppercase flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isSolutionRevealed ? 'HIDE EXPLANATION' : 'REVEAL STEP-BY-STEP EXPLANATION'}</span>
                </button>

                {isSolutionRevealed && (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-sans text-slate-200 space-y-1 animate-in fade-in duration-200">
                    <div className="font-bold text-emerald-400 font-mono text-xs">
                      CORRECT ANSWER: OPTION {currentQ.correctAnswer}
                    </div>
                    <p className="leading-relaxed text-slate-300">
                      {currentQ.explanation || 'Step-by-step military reasoning analysis.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Prev / Next Buttons */}
            <div className="pt-4 border-t border-navy-800 flex items-center justify-between font-mono text-xs">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  tacticalAudio.playInterfaceClick();
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                className="px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-slate-300 hover:text-white disabled:opacity-40 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS</span>
              </button>

              <button
                type="button"
                disabled={currentIndex === questions.length - 1}
                onClick={() => {
                  tacticalAudio.playInterfaceClick();
                  setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
                }}
                className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black uppercase tracking-wider disabled:opacity-40 flex items-center gap-1.5 shadow"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Question Navigation Palette (4 cols) */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-navy-800 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                QUESTION PALETTE ({questions.length})
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {Object.keys(selectedAnswers).length} ANSWERED
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span>Flagged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-navy-800 border border-navy-700" />
                <span>Skipped</span>
              </div>
            </div>

            {/* Grid of Question Numbers */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isAns = Boolean(selectedAnswers[q.id]);
                const isFlg = Boolean(flaggedQuestions[q.id]);
                const isCurr = currentIndex === idx;

                let btnBg = 'bg-navy-900 border-navy-700 text-slate-400';
                if (isFlg) btnBg = 'bg-amber-500 text-navy-950 font-bold border-amber-400';
                else if (isAns) btnBg = 'bg-emerald-500 text-navy-950 font-bold border-emerald-400';

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => {
                      tacticalAudio.playInterfaceClick();
                      setCurrentIndex(idx);
                    }}
                    className={`h-9 rounded-lg border font-mono text-xs font-bold transition-all ${btnBg} ${
                      isCurr ? 'ring-2 ring-gold-400 scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
