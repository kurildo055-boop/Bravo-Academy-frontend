'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Mic, Play, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function InterviewPracticePage() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [response, setResponse] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const interviewQuestions = [
    {
      q: 'Why do you wish to join the Bangladesh Armed Forces as an officer rather than joining a civil corporation?',
      category: 'Service Motivation'
    },
    {
      q: 'What is your greatest personal weakness, and what concrete steps have you undertaken to overcome it?',
      category: 'Self-Awareness & Honesty'
    },
    {
      q: 'If you are assigned as commander of a forward outpost under adverse weather with limited supplies, how will you maintain troop morale?',
      category: 'Command & Leadership'
    },
    {
      q: 'What are your views on current geopolitical maritime developments in the Bay of Bengal?',
      category: 'General Awareness'
    }
  ];

  const handleEvaluate = async () => {
    setAnalyzing(true);
    tacticalAudio.playRadarPing();

    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'INTERVIEW',
          prompt: interviewQuestions[questionIdx].q,
          studentResponse: response
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

  const currentItem = interviewQuestions[questionIdx];

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase">
            <Award className="w-4 h-4" />
            <span>STAGE 4 BOARD INTERVIEW</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
            BOARD INTERVIEW TACTICAL SIMULATOR
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-xl mx-auto">
            Simulates questions from the President and Deputy President of the Inter Services Selection Board.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3 text-xs font-mono">
            <span className="text-gold-400 font-bold">
              QUESTION {questionIdx + 1} OF {interviewQuestions.length}
            </span>
            <span className="text-slate-400">{currentItem.category}</span>
          </div>

          <div className="p-5 rounded-xl bg-navy-900 border border-navy-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase">BOARD PRESIDENT ASKS:</div>
            <h3 className="text-base sm:text-lg font-bold text-white font-sans leading-snug">
              "{currentItem.q}"
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 block">
              ENTER YOUR CADET RESPONSE:
            </label>
            <textarea
              rows={5}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="State your clear, composed response with confidence, structured reasoning, and patriotism..."
              className="w-full p-4 bg-navy-900 border border-navy-700 rounded-xl text-white font-sans text-xs leading-relaxed focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              disabled={questionIdx === 0}
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setQuestionIdx(questionIdx - 1);
                setAiAnalysis(null);
                setResponse('');
              }}
              className="px-4 py-2 rounded-lg bg-navy-900 border border-navy-700 text-xs font-mono text-slate-300 disabled:opacity-30"
            >
              PREVIOUS QUESTION
            </button>

            <button
              onClick={handleEvaluate}
              disabled={analyzing || !response.trim()}
              className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs font-mono uppercase tracking-wider disabled:opacity-40 shadow-md"
            >
              {analyzing ? 'ANALYZING CADET SPEECH...' : 'ANALYZE CADET RESPONSE →'}
            </button>

            <button
              disabled={questionIdx >= interviewQuestions.length - 1}
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setQuestionIdx(questionIdx + 1);
                setAiAnalysis(null);
                setResponse('');
              }}
              className="px-4 py-2 rounded-lg bg-navy-900 border border-navy-700 text-xs font-mono text-slate-300 disabled:opacity-30"
            >
              NEXT QUESTION
            </button>
          </div>

          {aiAnalysis && (
            <div className="p-5 rounded-xl bg-navy-900/90 border border-gold-500/40 space-y-4 pt-4 mt-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-gold-400 uppercase">
                  INTERVIEW EVALUATION SCORE
                </span>
                <span className="text-xl font-bold font-military text-white">
                  {aiAnalysis.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">{aiAnalysis.summary}</p>
              <div className="text-xs font-mono text-slate-400 space-y-1">
                <div className="text-defense-success font-bold">STRENGTHS:</div>
                {aiAnalysis.strengths?.map((s: string, i: number) => (
                  <div key={i}>✓ {s}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
