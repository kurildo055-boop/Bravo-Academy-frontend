'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Mic,
  Play,
  CheckCircle2,
  ArrowRight,
  Shield,
  HelpCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Layers
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

interface InterviewQuestion {
  id: string;
  category: string;
  questionText: string;
  guidelines?: string;
  counterQuestions?: string;
}

export default function InterviewPracticePage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cadet response & feedback
  const [response, setResponse] = useState('');
  const [recording, setRecording] = useState(false);
  const [revealedGuidelines, setRevealedGuidelines] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Fetch interview questions
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const url = selectedCategory === 'ALL'
          ? '/api/modules/interview'
          : `/api/modules/interview?category=${selectedCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.questions?.length > 0) {
          setQuestions(data.questions);
          setCurrentIndex(0);
        } else {
          setQuestions([
            {
              id: 'int-1',
              category: 'PIQ',
              questionText: 'Why do you wish to join the Bangladesh Armed Forces as an officer rather than joining a multinational corporation?',
              guidelines: 'Speak from authentic passion, patriotism, structured discipline, desire to lead troops under fire, and honor. Avoid cliché textbook responses.',
              counterQuestions: JSON.stringify(['If you are not selected this time, what is your alternate career plan?', 'How do your parents feel about the danger involved in combat?'])
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [selectedCategory]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const counterQuestions: string[] = typeof currentQuestion?.counterQuestions === 'string'
    ? JSON.parse(currentQuestion.counterQuestions || '[]')
    : (currentQuestion?.counterQuestions || []);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setResponse('');
      setRevealedGuidelines(false);
      setAiAnalysis(null);
      tacticalAudio.playInterfaceClick();
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setResponse('');
      setRevealedGuidelines(false);
      setAiAnalysis(null);
      tacticalAudio.playInterfaceClick();
    }
  };

  const handleEvaluateAi = async () => {
    setAnalyzing(true);
    tacticalAudio.playRadarPing();
    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'INTERVIEW',
          prompt: currentQuestion.questionText,
          studentResponse: response,
          targetForce: 'ARMY'
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.evaluation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040d08] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>ISSB DAY 3/4 • OPTION 8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military tracking-wider mt-2">
              BOARD PRESIDENT & DP INTERVIEW
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Personal Information Questionnaire (PIQ), Defense Knowledge, Geopolitics & Psychological Stress Inquiries
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:text-white text-xs font-mono font-bold uppercase transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'All Questions' },
            { id: 'PIQ', label: '1. PIQ & Personal Bio' },
            { id: 'DEFENSE_GK', label: '2. Defense & Tri-Service GK' },
            { id: 'GEOPOLITICS', label: '3. Geopolitics & Bay of Bengal' },
            { id: 'PSYCH_STRESS', label: '4. Psychological Stress Rapid-Fire' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gold-500 text-navy-950 shadow-md'
                  : 'bg-[#071910] border border-emerald-900/60 text-slate-300 hover:border-emerald-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Interview Simulator Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-3 text-xs font-mono">
            <span className="text-gold-400 font-bold uppercase">
              QUESTION {currentIndex + 1} OF {questions.length}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
              CATEGORY: {currentQuestion?.category || 'PIQ'}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="p-6 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2">
            <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">
              BOARD PRESIDENT DIRECTLY INQUIRES:
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans leading-relaxed">
              "{currentQuestion?.questionText}"
            </h3>
          </div>

          {/* Cadet Response Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold uppercase">CADET ORAL / WRITTEN RESPONSE:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRecording(!recording);
                    tacticalAudio.playInterfaceClick();
                  }}
                  className={`px-3 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 border ${
                    recording
                      ? 'bg-red-950 border-red-500 text-red-300 animate-pulse'
                      : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{recording ? 'MIC RECORDING...' : 'TOGGLE MIC SIMULATOR'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="State your clear, composed response with confidence, structured reasoning, eye-contact composure, and honesty..."
              className="w-full p-4 rounded-xl bg-[#040e09] border border-emerald-900 text-white font-sans text-xs focus:border-gold-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Actions & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-950">
            <div className="flex gap-2">
              <button
                disabled={currentIndex <= 0}
                onClick={handlePrevQuestion}
                className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                disabled={currentIndex >= questions.length - 1}
                onClick={handleNextQuestion}
                className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-40"
              >
                Next Question →
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRevealedGuidelines(!revealedGuidelines)}
                className="px-4 py-2 rounded-xl bg-[#040e09] border border-gold-500/40 text-gold-400 text-xs font-mono font-bold uppercase hover:bg-gold-500/10"
              >
                {revealedGuidelines ? 'Hide Guidelines' : 'Officer Guidelines'}
              </button>
              <button
                disabled={analyzing || !response}
                onClick={handleEvaluateAi}
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-bold uppercase transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{analyzing ? 'Evaluating...' : 'AI Evaluation'}</span>
              </button>
            </div>
          </div>

          {/* Officer Guidelines & Counter Questions */}
          {revealedGuidelines && (
            <div className="p-5 rounded-xl bg-[#040e09] border border-gold-500/40 space-y-4 animate-fadeIn text-xs">
              {currentQuestion?.guidelines && (
                <div className="space-y-1">
                  <span className="font-mono font-bold text-gold-400 uppercase block">RECOMMENDED OFFICER APPROACH:</span>
                  <p className="text-slate-300 font-sans leading-relaxed">{currentQuestion.guidelines}</p>
                </div>
              )}

              {counterQuestions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-emerald-950">
                  <span className="font-mono font-bold text-red-400 uppercase block">EXPECTED PRESIDENT COUNTER-QUESTIONS:</span>
                  <div className="space-y-1 text-slate-300 font-sans">
                    {counterQuestions.map((cq, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-gold-400 font-mono">Q{i + 1}:</span>
                        <span>"{cq}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Feedback Card */}
          {aiAnalysis && (
            <div className="p-5 rounded-xl bg-[#040e09] border border-emerald-700/60 space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-mono font-bold uppercase">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>AI OFFICER QUALITIES (OLQ) CRITIQUE</span>
                </span>
                <span>SCORE: {aiAnalysis.score || 85}%</span>
              </div>
              <p className="text-slate-200 font-sans leading-relaxed">
                {aiAnalysis.feedback || 'Good structured response with convincing self-awareness.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
