'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain,
  Clock,
  Shield,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flag,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

interface QuestionItem {
  id: string;
  questionText: string;
  iqSection: string;
  difficulty: string;
  imageUrl?: string;
  correctAnswer: string;
  explanation?: string;
  options: { key: string; text: string }[];
}

export default function MockExamPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Exam state: 'BRIEFING' | 'EXAM' | 'RESULT'
  const [stage, setStage] = useState<'BRIEFING' | 'EXAM' | 'RESULT'>('BRIEFING');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes = 3600s
  const [negativeMarking, setNegativeMarking] = useState(true);

  // Load 100 balanced questions (50 Verbal + 50 Non-Verbal or best available)
  const loadMockQuestions = async () => {
    setLoading(true);
    try {
      const [verbalRes, nonVerbalRes] = await Promise.all([
        fetch('/api/questions?iqSection=VERBAL&random=true&limit=50').then((r) => r.json()),
        fetch('/api/questions?iqSection=NON_VERBAL&random=true&limit=50').then((r) => r.json())
      ]);

      let pool: QuestionItem[] = [];
      if (verbalRes.success && verbalRes.questions) pool = pool.concat(verbalRes.questions);
      if (nonVerbalRes.success && nonVerbalRes.questions) pool = pool.concat(nonVerbalRes.questions);

      // If non-verbal had fewer than 50, fill from general questions
      if (pool.length < 50) {
        const fillRes = await fetch('/api/questions?random=true&limit=100').then((r) => r.json());
        if (fillRes.success && fillRes.questions) pool = fillRes.questions;
      }

      setQuestions(pool);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMockQuestions();
  }, []);

  // 60-Minute Countdown
  useEffect(() => {
    if (stage !== 'EXAM') return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setStage('RESULT');
          tacticalAudio.playRadarPing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  const handleStartExam = () => {
    setTimeLeft(3600);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setStage('EXAM');
    tacticalAudio.playRadarPing();
  };

  const handleSelectOption = (key: string) => {
    tacticalAudio.playInterfaceClick();
    const qId = questions[currentIndex]?.id;
    if (qId) {
      setAnswers({ ...answers, [qId]: key });
    }
  };

  const handleToggleFlag = () => {
    const qId = questions[currentIndex]?.id;
    if (qId) {
      setFlagged({ ...flagged, [qId]: !flagged[qId] });
      tacticalAudio.playInterfaceClick();
    }
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  // Calculate score
  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const incorrectCount = answeredCount - correctCount;
  const penalty = negativeMarking ? incorrectCount * 0.25 : 0;
  const finalScore = Math.max(0, Math.round((correctCount - penalty) * 10) / 10);
  const percentage = Math.round((finalScore / (questions.length || 100)) * 100);
  const isPassed = percentage >= 60;

  return (
    <div className="min-h-screen bg-[#040d08] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>ISSB SCREENING DAY 1 • OPTION 10</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military tracking-wider mt-2">
              FULL 100-MARK SCREENING MOCK EXAMINATION
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Strict 60-Minute Timed Military Aptitude Test • Balanced Verbal & Non-Verbal Matrices • 0.25 Negative Marking
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:text-white text-xs font-mono font-bold uppercase transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* STAGE 1: BRIEFING */}
        {stage === 'BRIEFING' && (
          <div className="p-8 rounded-2xl bg-[#071910] border border-gold-500/50 space-y-6 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-400 mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase text-white font-military">
                OFFICIAL MOCK TEST PROTOCOL
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                This examination accurately simulates the Day 1 preliminary intelligence screening at the ISSB selection center.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
              <div>
                <span className="text-slate-400 block">TOTAL QUESTIONS</span>
                <span className="text-base font-bold text-white">{questions.length} Q</span>
              </div>
              <div>
                <span className="text-slate-400 block">TIME LIMIT</span>
                <span className="text-base font-bold text-gold-400">60 MINUTES</span>
              </div>
              <div>
                <span className="text-slate-400 block">PASS CUTOFF</span>
                <span className="text-base font-bold text-emerald-400">60%</span>
              </div>
              <div>
                <span className="text-slate-400 block">PENALTY</span>
                <span className="text-base font-bold text-red-400">-0.25 / WRONG</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleStartExam}
                disabled={loading || questions.length === 0}
                className="px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-mono font-black text-sm uppercase tracking-wider shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'LOADING QUESTIONS...' : 'BEGIN 100-MARK MOCK EXAM →'}
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: LIVE EXAMINATION */}
        {stage === 'EXAM' && currentQ && (
          <div className="space-y-6">
            {/* Top Stats Bar */}
            <div className="p-4 rounded-xl bg-[#071910] border border-emerald-800/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs font-bold">
                  Q {currentIndex + 1} OF {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#040e09] border border-emerald-950 text-gold-400 font-mono text-[11px] font-bold uppercase">
                  {currentQ.iqSection} IQ
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span>ANSWERED: {answeredCount}/{questions.length}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-lg border font-mono text-lg font-black ${
                  timeLeft <= 300 ? 'bg-red-950 border-red-500 text-red-400 animate-pulse' : 'bg-[#040e09] border-gold-500/50 text-gold-400'
                }`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you wish to submit the examination now?')) {
                      setStage('RESULT');
                      tacticalAudio.playRadarPing();
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-mono font-bold text-xs uppercase"
                >
                  Submit Exam
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

              {/* Main Question Panel */}
              <div className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 uppercase">
                      DIFFICULTY: {currentQ.difficulty || 'MEDIUM'}
                    </span>
                    <button
                      onClick={handleToggleFlag}
                      className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 border ${
                        flagged[currentQ.id]
                          ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                          : 'bg-[#040e09] border-emerald-950 text-slate-400'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{flagged[currentQ.id] ? 'FLAGGED FOR REVIEW' : 'FLAG'}</span>
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white font-sans leading-relaxed">
                    {currentQ.questionText}
                  </h3>

                  {/* Diagram Image if Non-Verbal */}
                  {currentQ.imageUrl && (
                    <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-900 border border-emerald-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={currentQ.imageUrl} alt="Diagram" className="max-h-64 mx-auto object-contain" />
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentQ.options?.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(opt.key)}
                        className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-gold-500/20 border-gold-500 text-white shadow-md'
                            : 'bg-[#040e09] border-emerald-950 text-slate-300 hover:border-emerald-700'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-gold-500 text-navy-950' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {opt.key}
                        </span>
                        <span className="text-xs font-sans mt-0.5">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Navigation */}
                <div className="flex justify-between items-center pt-4 border-t border-emerald-950">
                  <button
                    disabled={currentIndex <= 0}
                    onClick={() => {
                      setCurrentIndex((i) => i - 1);
                      tacticalAudio.playInterfaceClick();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-mono text-slate-300 disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={currentIndex >= questions.length - 1}
                    onClick={() => {
                      setCurrentIndex((i) => i + 1);
                      tacticalAudio.playInterfaceClick();
                    }}
                    className="px-5 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-mono font-bold uppercase"
                  >
                    Next Question →
                  </button>
                </div>
              </div>

              {/* Question Navigation Palette */}
              <div className="p-5 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-4">
                <span className="text-xs font-mono font-bold text-gold-400 uppercase block">
                  QUESTION PALETTE ({questions.length})
                </span>

                <div className="grid grid-cols-5 gap-1.5 max-h-[50vh] overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isFlagged = !!flagged[q.id];
                    const isCurrent = currentIndex === idx;

                    return (
                      <button
                        key={q.id || idx}
                        onClick={() => {
                          setCurrentIndex(idx);
                          tacticalAudio.playInterfaceClick();
                        }}
                        className={`h-8 rounded text-xs font-mono font-bold transition-all ${
                          isCurrent
                            ? 'ring-2 ring-gold-400 text-white bg-gold-600'
                            : isFlagged
                            ? 'bg-amber-900/80 text-amber-200'
                            : isAnswered
                            ? 'bg-emerald-900/80 text-emerald-300'
                            : 'bg-[#040e09] border border-emerald-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 text-[10px] font-mono border-t border-emerald-950 pt-3 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-900 inline-block" />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-amber-900 inline-block" />
                    <span>Flagged ({Object.keys(flagged).filter((k) => flagged[k]).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-[#040e09] border border-emerald-950 inline-block" />
                    <span>Unanswered ({questions.length - answeredCount})</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STAGE 3: RESULT & REVIEW */}
        {stage === 'RESULT' && (
          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-[#071910] border border-gold-500/50 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
                <div>
                  <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                    MOCK EXAMINATION COMPLETE
                  </span>
                  <h3 className="text-2xl font-black text-white font-military uppercase mt-1">
                    PERFORMANCE AUDIT & GREEN CARD ASSESSMENT
                  </h3>
                </div>
                <button
                  onClick={handleStartExam}
                  className="px-4 py-2 rounded-xl bg-gold-500 text-navy-950 font-mono font-bold text-xs uppercase flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Mock Exam</span>
                </button>
              </div>

              {/* Score Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">FINAL SCORE</span>
                  <span className="text-3xl font-black font-mono text-gold-400">{finalScore} / {questions.length}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">PERCENTILE</span>
                  <span className="text-3xl font-black font-mono text-white">{percentage}%</span>
                </div>
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">ACCURACY</span>
                  <span className="text-3xl font-black font-mono text-emerald-400">
                    {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">BOARD STATUS</span>
                  <span className={`text-base font-black font-mono mt-1 block ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPassed ? '✓ SCREENED IN' : '✗ SCREENED OUT'}
                  </span>
                </div>
              </div>

              {/* Detailed Question Review */}
              <div className="space-y-4 pt-4 border-t border-emerald-950">
                <span className="text-xs font-mono font-bold text-gold-400 uppercase block">
                  DETAILED QUESTION-BY-QUESTION AUDIT ({questions.length} QUESTIONS)
                </span>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {questions.map((q, idx) => {
                    const userAns = answers[q.id];
                    const isCorrect = userAns === q.correctAnswer;
                    return (
                      <div key={q.id || idx} className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-400 font-mono">
                          <span>Q{idx + 1} • {q.iqSection} IQ</span>
                          <span className={`font-bold ${isCorrect ? 'text-emerald-400' : userAns ? 'text-red-400' : 'text-slate-500'}`}>
                            {isCorrect ? '✓ CORRECT' : userAns ? `✗ INCORRECT (YOURS: ${userAns})` : 'SKIPPED'}
                          </span>
                        </div>
                        <p className="text-white font-sans font-bold">{q.questionText}</p>
                        <div className="text-emerald-400 font-mono">
                          CORRECT ANSWER: <span className="font-bold">{q.correctAnswer}</span>
                        </div>
                        {q.explanation && (
                          <div className="p-2.5 rounded bg-[#071910] border border-emerald-900/60 text-slate-300 font-sans">
                            <span className="font-mono text-gold-400 font-bold block mb-0.5">EXPLANATION:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
