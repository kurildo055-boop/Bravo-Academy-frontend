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
  ArrowRight
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function IqExamPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes countdown
  const [examFinished, setExamFinished] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch 25 random questions from live database
    fetch('/api/questions?limit=25')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.questions.length > 0) {
          setQuestions(data.questions);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Timer Countdown with auto-submit
  useEffect(() => {
    if (examFinished || loading || questions.length === 0) return;

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
  }, [examFinished, loading, questions]);

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

  const handleSubmitExam = async () => {
    setSubmitting(true);
    tacticalAudio.playRadarPing();

    const payload = {
      answers: questions.map((q) => ({
        questionId: q.id,
        chosenAnswer: selectedAnswers[q.id] || null
      })),
      timeSpentSec: 1200 - timeLeft
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
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-mono">
        INITIALIZING TIMED IQ EXAMINATION PROTOCOL...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white space-y-4">
        <div>No questions available in bank. Please run seed script or create questions.</div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isAnswered = Boolean(selectedAnswers[currentQ?.id]);
  const isFlagged = Boolean(flaggedQuestions[currentQ?.id]);

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ========================================================
            RESULTS VIEW AFTER COMPLETION
            ======================================================== */}
        {examFinished && results ? (
          <div className="glass-panel rounded-2xl p-8 sm:p-12 border border-gold-500/40 space-y-8 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-500 text-gold-400 flex items-center justify-center mx-auto text-2xl font-black font-military">
                {results.score}%
              </div>
              <h2 className="text-3xl font-black uppercase text-white font-military">
                {results.isPassed ? 'QUALIFIED FOR SCREENING' : 'SCREENING BENCHMARK UNMET'}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                {results.feedback}
              </p>
            </div>

            {/* Score Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center font-mono">
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                <div className="text-xs text-slate-400">CORRECT</div>
                <div className="text-xl font-bold text-defense-success">{results.correctCount}</div>
              </div>
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                <div className="text-xs text-slate-400">INCORRECT</div>
                <div className="text-xl font-bold text-red-400">
                  {results.totalQuestions - results.correctCount}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                <div className="text-xs text-slate-400">TOTAL</div>
                <div className="text-xl font-bold text-white">{results.totalQuestions}</div>
              </div>
            </div>

            {/* Step-by-Step Question Review */}
            <div className="space-y-4 pt-6 border-t border-navy-800">
              <h3 className="text-lg font-black uppercase text-white font-military">
                STEP-BY-STEP QUESTION ANALYSIS & SOLUTIONS
              </h3>

              <div className="space-y-4">
                {results.reviewedAnswers?.map((ans: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border text-xs space-y-3 ${
                      ans.isCorrect
                        ? 'bg-defense-success/10 border-defense-success/30'
                        : 'bg-red-950/20 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-slate-400">QUESTION #{idx + 1}</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          ans.isCorrect ? 'bg-defense-success text-navy-950' : 'bg-red-500 text-white'
                        }`}
                      >
                        {ans.isCorrect ? 'CORRECT' : 'INCORRECT / MISSED'}
                      </span>
                    </div>

                    <p className="text-sm text-white font-sans font-medium">{ans.questionText}</p>

                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      {ans.options?.map((opt: any) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded border ${
                            opt.key === ans.correctAnswer
                              ? 'border-defense-success bg-defense-success/20 text-white font-bold'
                              : opt.key === ans.chosenAnswer
                              ? 'border-red-500 bg-red-950/40 text-red-300'
                              : 'border-navy-800 bg-navy-900 text-slate-400'
                          }`}
                        >
                          <span className="font-bold mr-1">{opt.key}:</span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded bg-navy-950/80 border border-navy-800 font-sans text-slate-300">
                      <strong className="text-gold-400 font-mono">SOLUTION LOGIC: </strong>
                      {ans.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider font-mono"
              >
                RETAKE PRACTICE EXAM →
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white font-bold text-xs uppercase tracking-wider font-mono"
              >
                BACK TO CADET DASHBOARD
              </Link>
            </div>
          </div>
        ) : (
          /* ========================================================
              ACTIVE EXAM QUESTION INTERFACE
              ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left 3 Cols: Active Question */}
            <div className="lg:col-span-3 glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-navy-800 shadow-2xl">
              {/* Question Top Bar */}
              <div className="flex items-center justify-between border-b border-navy-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-navy-900 text-gold-400 font-bold">
                    QUESTION {currentIndex + 1} OF {questions.length}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {currentQ.category?.name || 'General Reasoning'}
                  </span>
                </div>

                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    isFlagged
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                      : 'bg-navy-900 text-slate-400 border border-navy-800 hover:text-white'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isFlagged ? 'FLAGGED' : 'FLAG FOR REVIEW'}</span>
                </button>
              </div>

              {/* Question Statement */}
              <div className="space-y-4 min-h-[140px]">
                <h3 className="text-lg sm:text-xl font-bold text-white font-sans leading-relaxed">
                  {currentQ.questionText}
                </h3>
              </div>

              {/* 4 Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {currentQ.options?.map((opt: any) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.key;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => selectOption(opt.key)}
                      className={`p-4 rounded-xl border cursor-pointer font-mono text-sm transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-gold-500/20 border-gold-500 text-white font-bold shadow-[0_0_15px_rgba(214,173,96,0.25)]'
                          : 'bg-navy-900/90 border-navy-800 text-slate-300 hover:border-slate-600 hover:bg-navy-900'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-slate-400'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="leading-snug">{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-navy-800 pt-5 mt-6">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setCurrentIndex(currentIndex - 1);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs font-mono font-bold text-slate-300 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => {
                      tacticalAudio.playInterfaceClick();
                      setCurrentIndex(currentIndex + 1);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-black uppercase tracking-wider shadow-md"
                  >
                    <span>NEXT QUESTION</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-defense-success hover:bg-emerald-500 text-white text-xs font-mono font-black uppercase tracking-wider shadow-lg animate-pulse"
                  >
                    <span>{submitting ? 'EVALUATING...' : 'SUBMIT EXAMINATION'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right 1 Col: Timer & Question Matrix Palette */}
            <div className="space-y-6">
              {/* Countdown Timer */}
              <div className="glass-panel rounded-2xl p-5 border border-navy-800 text-center space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Timer className="w-4 h-4 text-gold-400" />
                  <span>REMAINING TIME</span>
                </div>
                <div className={`text-3xl font-black font-mono tracking-wider ${
                  timeLeft <= 180 ? 'text-red-400 animate-pulse' : 'text-gold-400'
                }`}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Question Palette Matrix */}
              <div className="glass-panel rounded-2xl p-5 border border-navy-800 space-y-4">
                <div className="text-xs font-mono font-bold text-white uppercase border-b border-navy-800 pb-2">
                  QUESTION NAVIGATION
                </div>

                <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                  {questions.map((q, idx) => {
                    const answered = Boolean(selectedAnswers[q.id]);
                    const flagged = Boolean(flaggedQuestions[q.id]);
                    const isCurrent = currentIndex === idx;

                    let bg = 'bg-navy-900 border-navy-800 text-slate-400';
                    if (isCurrent) bg = 'bg-gold-500 text-navy-950 font-bold border-gold-500 shadow-md';
                    else if (flagged) bg = 'bg-amber-950/80 border-amber-500 text-amber-300';
                    else if (answered) bg = 'bg-defense-success/20 border-defense-success text-defense-success font-bold';

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          tacticalAudio.playInterfaceClick();
                          setCurrentIndex(idx);
                        }}
                        className={`w-full aspect-square rounded-lg border flex items-center justify-center transition-all ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] font-mono space-y-1.5 pt-2 border-t border-navy-800 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-defense-success/40 border border-defense-success" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500" />
                    <span>Flagged for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-navy-900 border border-navy-700" />
                    <span>Unvisited</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitExam}
                  className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-gold-500 hover:text-navy-950 border border-gold-500/40 text-gold-400 text-xs font-mono font-bold uppercase transition-all"
                >
                  FINISH & SUBMIT NOW
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
