'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain,
  PlusCircle,
  FileSpreadsheet,
  Sparkles,
  FileText,
  ClipboardPaste,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  Upload,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function AdminQuestionsPage() {
  const [activeTab, setActiveTab] = useState<'BANK' | 'MANUAL' | 'EXCEL' | 'AI_GEN' | 'EXTRACT' | 'PASTE'>('BANK');

  // Bank state
  const [questions, setQuestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedDiff, setSelectedDiff] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 1055, totalPages: 53 });
  const [loading, setLoading] = useState(false);

  // Method 1: Manual Form
  const [manualForm, setManualForm] = useState({
    questionText: '',
    categoryId: '',
    difficulty: 'MEDIUM',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    timeLimitSec: 30
  });

  // Method 3: AI Generator
  const [aiPrompt, setAiPrompt] = useState('Generate 10 defense numerical reasoning questions with 4 options and detailed explanations.');
  const [aiCount, setAiCount] = useState(5);
  const [aiDiff, setAiDiff] = useState('MEDIUM');
  const [aiGenerated, setAiGenerated] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Method 4: Extraction
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedResult, setExtractedResult] = useState<any | null>(null);

  // Method 5: Paste
  const [pasteText, setPasteText] = useState(`1. If a fighter jet climbs at 200 m/s for 15 seconds, what altitude has it gained?
A) 2000 meters
B) 3000 meters
C) 4000 meters
D) 1500 meters
Answer: B
Explanation: Distance = Speed * Time = 200 * 15 = 3000m.`);
  const [pastedQuestions, setPastedQuestions] = useState<any[]>([]);

  // Feedback status
  const [message, setMessage] = useState('');

  const fetchQuestions = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(p),
      limit: '15',
    });
    if (selectedCat) params.append('categoryId', selectedCat);
    if (selectedDiff) params.append('difficulty', selectedDiff);
    if (search) params.append('search', search);

    fetch(`/api/questions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuestions(data.questions);
          setCategories(data.categories);
          setPagination(data.pagination);
          if (!manualForm.categoryId && data.categories.length > 0) {
            setManualForm((prev) => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions(page);
  }, [page, selectedCat, selectedDiff]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playInterfaceClick();
    setMessage('');

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: manualForm.questionText,
          categoryId: manualForm.categoryId,
          difficulty: manualForm.difficulty,
          correctAnswer: manualForm.correctAnswer,
          explanation: manualForm.explanation,
          timeLimitSec: manualForm.timeLimitSec,
          options: {
            A: manualForm.optionA,
            B: manualForm.optionB,
            C: manualForm.optionC,
            D: manualForm.optionD,
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Question successfully added to live question bank.');
        tacticalAudio.playRadarPing();
        setManualForm({
          ...manualForm,
          questionText: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          explanation: ''
        });
        fetchQuestions(1);
      } else {
        setMessage('❌ Error: ' + data.error);
      }
    } catch (err: any) {
      setMessage('❌ Failed to save question.');
    }
  };

  const handleAiGenerate = async () => {
    setAiLoading(true);
    tacticalAudio.playInterfaceClick();
    setMessage('');
    try {
      const res = await fetch('/api/questions/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          count: aiCount,
          difficulty: aiDiff,
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiGenerated(data.questions);
        tacticalAudio.playRadarPing();
      }
    } catch (e) {
      setMessage('Failed to generate AI questions.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleExtraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setExtracting(true);
    tacticalAudio.playInterfaceClick();
    try {
      const form = new FormData();
      form.append('file', selectedFile);

      const res = await fetch('/api/questions/ai-extract', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (data.success) {
        setExtractedResult(data);
        tacticalAudio.playRadarPing();
      }
    } catch (e) {
      setMessage('Extraction failed.');
    } finally {
      setExtracting(false);
    }
  };

  const handlePasteParse = async () => {
    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch('/api/questions/paste-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: pasteText })
      });
      const data = await res.json();
      if (data.success) {
        setPastedQuestions(data.questions);
        tacticalAudio.playRadarPing();
      }
    } catch (e) {
      setMessage('Paste parsing failed.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase">
              <Brain className="w-4 h-4" />
              <span>COMMAND QUESTION BANK CENTER</span>
            </div>
            <h1 className="text-3xl font-black uppercase text-white font-military mt-2">
              QUESTION MANAGEMENT & 5 CREATION METHODS
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Total active questions in bank: <strong className="text-gold-400 font-mono">{pagination.total}</strong> across 12 defense categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/questions/extract-review"
              onClick={() => tacticalAudio.playInterfaceClick()}
              className="px-4 py-2.5 rounded-xl bg-navy-900 border border-gold-500/40 text-gold-400 text-xs font-bold font-mono hover:bg-gold-500 hover:text-navy-950 transition-all shadow-md"
            >
              EXTRACTION REVIEW CENTER →
            </Link>
          </div>
        </div>

        {/* 5 Method Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-navy-800 pb-3">
          {[
            { id: 'BANK', label: '1000+ QUESTION BANK', icon: Brain },
            { id: 'MANUAL', label: 'METHOD 1: MANUAL BUILDER', icon: PlusCircle },
            { id: 'EXCEL', label: 'METHOD 2: EXCEL / CSV BULK', icon: FileSpreadsheet },
            { id: 'AI_GEN', label: 'METHOD 3: AI GENERATOR', icon: Sparkles },
            { id: 'EXTRACT', label: 'METHOD 4: AI IMAGE/PDF/DOCX', icon: FileText },
            { id: 'PASTE', label: 'METHOD 5: COPY-PASTE IMPORT', icon: ClipboardPaste },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setActiveTab(tab.id as any);
                setMessage('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-navy-950 shadow-md font-black'
                  : 'bg-navy-900 border border-navy-800 text-slate-400 hover:text-white hover:border-gold-500/30'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {message && (
          <div className="p-3 rounded-lg bg-navy-900 border border-gold-500/40 text-xs font-mono text-white">
            {message}
          </div>
        )}

        {/* ========================================================
            TAB 1: LIVE 1000+ QUESTION BANK VIEWER
            ======================================================== */}
        {activeTab === 'BANK' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="glass-panel rounded-xl p-4 flex flex-wrap items-center gap-4 border border-navy-800">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions by keyword or formula..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchQuestions(1)}
                  className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <select
                value={selectedCat}
                onChange={(e) => {
                  setSelectedCat(e.target.value);
                  setPage(1);
                }}
                className="py-2 px-3 bg-navy-900 border border-navy-700 rounded-lg text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="">ALL 12 CATEGORIES</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={selectedDiff}
                onChange={(e) => {
                  setSelectedDiff(e.target.value);
                  setPage(1);
                }}
                className="py-2 px-3 bg-navy-900 border border-navy-700 rounded-lg text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="">ALL DIFFICULTIES</option>
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>

              <button
                onClick={() => fetchQuestions(1)}
                className="px-4 py-2 bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-xs font-mono font-bold text-gold-400 rounded-lg transition-colors"
              >
                APPLY FILTER
              </button>
            </div>

            {/* Questions Table */}
            <div className="glass-panel rounded-2xl border border-navy-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy-900 text-slate-400 uppercase font-mono border-b border-navy-800">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Question Text</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Correct</th>
                      <th className="py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60 font-sans">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 font-mono text-gold-400">
                          LOADING DEFENSE QUESTION BANK...
                        </td>
                      </tr>
                    ) : (
                      questions.map((q, idx) => (
                        <tr key={q.id} className="hover:bg-navy-900/60 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-500">{(page - 1) * 15 + idx + 1}</td>
                          <td className="py-3 px-4 text-white font-medium max-w-md">
                            <div className="line-clamp-2">{q.questionText}</div>
                            <div className="text-[11px] text-slate-400 mt-1 flex gap-2 font-mono">
                              {q.options?.map((opt: any) => (
                                <span
                                  key={opt.id}
                                  className={opt.key === q.correctAnswer ? 'text-defense-success font-bold' : ''}
                                >
                                  {opt.key}: {opt.text}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            {q.category?.name || 'General'}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.difficulty === 'HARD'
                                ? 'bg-red-950 text-red-400'
                                : q.difficulty === 'MEDIUM'
                                ? 'bg-amber-950 text-amber-400'
                                : 'bg-emerald-950 text-emerald-400'
                            }`}>
                              {q.difficulty}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-defense-success">
                            {q.correctAnswer}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">
                            {q.timeLimitSec}s
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-navy-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div>
                  Page {page} of {pagination.totalPages} ({pagination.total} Total Questions)
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1.5 rounded bg-navy-900 border border-navy-700 disabled:opacity-40"
                  >
                    PREV
                  </button>
                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1.5 rounded bg-navy-900 border border-navy-700 disabled:opacity-40"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: METHOD 1 — MANUAL QUESTION BUILDER
            ======================================================== */}
        {activeTab === 'MANUAL' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 max-w-3xl mx-auto shadow-2xl">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3 mb-6">
              METHOD 1: MANUAL QUESTION BUILDER
            </h3>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Question Statement</label>
                <textarea
                  required
                  rows={3}
                  value={manualForm.questionText}
                  onChange={(e) => setManualForm({ ...manualForm, questionText: e.target.value })}
                  placeholder="Enter clear, concise military reasoning or situational prompt..."
                  className="w-full p-3 bg-navy-900 border border-navy-700 rounded-lg text-white font-sans text-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Category</label>
                  <select
                    value={manualForm.categoryId}
                    onChange={(e) => setManualForm({ ...manualForm, categoryId: e.target.value })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Difficulty</label>
                  <select
                    value={manualForm.difficulty}
                    onChange={(e) => setManualForm({ ...manualForm, difficulty: e.target.value })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Option A</label>
                  <input
                    type="text"
                    required
                    value={manualForm.optionA}
                    onChange={(e) => setManualForm({ ...manualForm, optionA: e.target.value })}
                    placeholder="Choice A text"
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Option B</label>
                  <input
                    type="text"
                    required
                    value={manualForm.optionB}
                    onChange={(e) => setManualForm({ ...manualForm, optionB: e.target.value })}
                    placeholder="Choice B text"
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Option C</label>
                  <input
                    type="text"
                    required
                    value={manualForm.optionC}
                    onChange={(e) => setManualForm({ ...manualForm, optionC: e.target.value })}
                    placeholder="Choice C text"
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Option D</label>
                  <input
                    type="text"
                    required
                    value={manualForm.optionD}
                    onChange={(e) => setManualForm({ ...manualForm, optionD: e.target.value })}
                    placeholder="Choice D text"
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Correct Answer</label>
                  <select
                    value={manualForm.correctAnswer}
                    onChange={(e) => setManualForm({ ...manualForm, correctAnswer: e.target.value })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Timer (Seconds)</label>
                  <input
                    type="number"
                    value={manualForm.timeLimitSec}
                    onChange={(e) => setManualForm({ ...manualForm, timeLimitSec: Number(e.target.value) })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Detailed Solution Explanation</label>
                <textarea
                  rows={2}
                  value={manualForm.explanation}
                  onChange={(e) => setManualForm({ ...manualForm, explanation: e.target.value })}
                  placeholder="Explain mathematical formula or deductive reasoning logic..."
                  className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white font-sans text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest transition-all"
              >
                PUBLISH QUESTION TO LIVE BANK →
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 3: METHOD 2 — EXCEL / CSV BULK IMPORT
            ======================================================== */}
        {activeTab === 'EXCEL' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 max-w-2xl mx-auto shadow-2xl space-y-6">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              METHOD 2: EXCEL / CSV BULK IMPORT
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Upload XLSX or CSV spreadsheets containing 50, 100, or 1000+ question rows. The background worker parses, validates columns, checks duplicates, and maps options.
            </p>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="text-xs font-bold text-gold-400 font-mono">STANDARDIZED TEMPLATE COLUMNS:</div>
              <div className="text-[11px] font-mono text-slate-300 bg-navy-950 p-2.5 rounded border border-navy-800 overflow-x-auto">
                question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, time_limit
              </div>
            </div>

            <div className="border-2 border-dashed border-navy-700 hover:border-gold-500/50 rounded-2xl p-8 text-center space-y-3 cursor-pointer">
              <Upload className="w-8 h-8 text-gold-400 mx-auto" />
              <div className="text-xs font-mono text-white font-bold">DRAG & DROP CSV / XLSX FILE HERE</div>
              <div className="text-[10px] text-slate-500 font-mono">Supports up to 50MB files</div>
            </div>

            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                setMessage('✅ Batch parser simulated. 50 verified questions imported to database.');
              }}
              className="w-full py-3 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-widest font-mono"
            >
              SIMULATE BATCH UPLOAD (50 QUESTIONS) →
            </button>
          </div>
        )}

        {/* ========================================================
            TAB 4: METHOD 3 — AI QUESTION GENERATOR
            ======================================================== */}
        {activeTab === 'AI_GEN' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 max-w-3xl mx-auto shadow-2xl space-y-6">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              METHOD 3: AI QUESTION GENERATOR
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">AI Prompt Instructions</label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-3 bg-navy-900 border border-navy-700 rounded-lg text-white font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Batch Count</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Target Difficulty</label>
                  <select
                    value={aiDiff}
                    onChange={(e) => setAiDiff(e.target.value)}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAiGenerate}
                disabled={aiLoading}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {aiLoading ? 'GENERATING STRUCTURED DEFENSE QUESTIONS...' : 'GENERATE AI QUESTION CANDIDATES →'}
              </button>
            </div>

            {aiGenerated.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-navy-800">
                <div className="text-xs font-mono font-bold text-gold-400">
                  GENERATED ({aiGenerated.length}) QUESTIONS — REVIEW BEFORE PUBLISHING:
                </div>
                {aiGenerated.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2 text-xs">
                    <div className="text-white font-medium">{q.question}</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                      <div>A: {q.options.A}</div>
                      <div>B: {q.options.B}</div>
                      <div>C: {q.options.C}</div>
                      <div>D: {q.options.D}</div>
                    </div>
                    <div className="text-defense-success font-mono font-bold">Answer: {q.correct_answer}</div>
                    <div className="text-slate-400 text-[11px]">{q.explanation}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 5: METHOD 4 — MULTIMODAL AI IMAGE/PDF/DOCX EXTRACTOR
            ======================================================== */}
        {activeTab === 'EXTRACT' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 max-w-2xl mx-auto shadow-2xl space-y-6">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              METHOD 4: AI IMAGE / PDF / DOCX QUESTION EXTRACTOR
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Upload a single image with multiple questions, scanned PDFs, or Word documents. Multimodal Vision AI detects question regions, options, diagrams, and answer keys.
            </p>

            <form onSubmit={handleExtraction} className="space-y-4">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.docx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full p-3 bg-navy-900 border border-navy-700 rounded-xl text-xs text-slate-300 font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-navy-950 hover:file:bg-gold-400"
              />

              <button
                type="submit"
                disabled={extracting || !selectedFile}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs uppercase tracking-widest disabled:opacity-40"
              >
                {extracting ? 'EXTRACTING WITH VISION AI...' : 'EXECUTE MULTIMODAL EXTRACTION →'}
              </button>
            </form>

            {extractedResult && (
              <div className="p-4 rounded-xl bg-navy-900 border border-gold-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gold-400 font-bold">DETECTED {extractedResult.detectedCount} QUESTIONS</span>
                  <Link
                    href="/admin/questions/extract-review"
                    className="text-white hover:text-gold-400 underline"
                  >
                    Open Review Center →
                  </Link>
                </div>
                {extractedResult.items?.map((item: any) => (
                  <div key={item.id} className="text-xs text-slate-300 p-2 rounded bg-navy-950 border border-navy-800">
                    {item.questionText}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 6: METHOD 5 — COPY-PASTE BULK IMPORT
            ======================================================== */}
        {activeTab === 'PASTE' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 max-w-3xl mx-auto shadow-2xl space-y-6">
            <h3 className="text-xl font-black uppercase text-white font-military border-b border-navy-800 pb-3">
              METHOD 5: COPY-PASTE BULK IMPORT
            </h3>

            <p className="text-xs text-slate-300 font-sans">
              Paste raw questions directly from Google Docs or Word. The regex parsing algorithm automatically parses question numbers, 4 options, and answers.
            </p>

            <textarea
              rows={8}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full p-3 bg-navy-900 border border-navy-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-gold-500"
            />

            <button
              onClick={handlePasteParse}
              className="w-full py-3 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-widest font-mono"
            >
              PARSE RAW TEXT QUESTIONS →
            </button>

            {pastedQuestions.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-navy-800 text-xs">
                <div className="font-bold text-gold-400 font-mono">PARSED {pastedQuestions.length} QUESTIONS:</div>
                {pastedQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-navy-900 rounded-lg border border-navy-800 space-y-1">
                    <div className="font-bold text-white">{q.question}</div>
                    <div className="text-slate-400 font-mono">Options: {JSON.stringify(q.options)}</div>
                    <div className="text-defense-success font-mono font-bold">Answer: {q.correct_answer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
