'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  FileText,
  Compass,
  Award,
  Activity,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Eye,
  Clock,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function AdminModulesManager() {
  const [activeModule, setActiveModule] = useState<'IQ' | 'PPDT' | 'PSYCH' | 'GTO' | 'INTERVIEW' | 'PHYSICAL'>('IQ');

  // Notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // ========================================================
  // MODULE 1: IQ QUESTIONS (Option 3 & 10)
  // ========================================================
  const [iqQuestions, setIqQuestions] = useState<any[]>([]);
  const [iqLoading, setIqLoading] = useState(false);
  const [iqSectionFilter, setIqSectionFilter] = useState<'ALL' | 'VERBAL' | 'NON_VERBAL'>('ALL');
  const [iqSearch, setIqSearch] = useState('');
  const [iqModalOpen, setIqModalOpen] = useState(false);
  const [iqEditingId, setIqEditingId] = useState<string | null>(null);
  const [iqForm, setIqForm] = useState({
    questionText: '',
    iqSection: 'VERBAL',
    difficulty: 'MEDIUM',
    imageUrl: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    optionE: '',
    correctAnswer: 'A',
    explanation: ''
  });

  const fetchIqQuestions = async () => {
    setIqLoading(true);
    try {
      const url = `/api/questions?iqSection=${iqSectionFilter}&limit=50&search=${encodeURIComponent(iqSearch)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setIqQuestions(data.questions || []);
      }
    } catch (e: any) {
      showNotification('Failed to load IQ questions', true);
    } finally {
      setIqLoading(false);
    }
  };

  const handleSaveIq = async (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playInterfaceClick();
    try {
      const payload = {
        questionText: iqForm.questionText,
        iqSection: iqForm.iqSection,
        difficulty: iqForm.difficulty,
        imageUrl: iqForm.imageUrl || undefined,
        categoryId: 'cmd1p9wqa0000vl9x6qj78099', // general category
        options: {
          A: iqForm.optionA,
          B: iqForm.optionB,
          C: iqForm.optionC,
          D: iqForm.optionD,
          ...(iqForm.optionE ? { E: iqForm.optionE } : {})
        },
        correctAnswer: iqForm.correctAnswer,
        explanation: iqForm.explanation
      };

      const url = iqEditingId ? `/api/questions/${iqEditingId}` : '/api/questions';
      const method = iqEditingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(iqEditingId ? 'IQ question updated successfully' : 'IQ question created successfully');
        setIqModalOpen(false);
        setIqEditingId(null);
        fetchIqQuestions();
      } else {
        showNotification(data.error || 'Failed to save question', true);
      }
    } catch (err: any) {
      showNotification(err.message, true);
    }
  };

  const handleDeleteIq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this IQ question?')) return;
    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Question deleted');
        fetchIqQuestions();
      } else {
        showNotification(data.error || 'Failed to delete question', true);
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  // ========================================================
  // MODULE 2: PPDT SCENARIOS (Option 4)
  // ========================================================
  const [ppdtScenarios, setPpdtScenarios] = useState<any[]>([]);
  const [ppdtLoading, setPpdtLoading] = useState(false);
  const [ppdtModalOpen, setPpdtModalOpen] = useState(false);
  const [ppdtEditingId, setPpdtEditingId] = useState<string | null>(null);
  const [ppdtForm, setPpdtForm] = useState({
    title: '',
    imageUrl: '',
    description: '',
    characterHints: '',
    modelStory: '',
    tips: '',
    difficulty: 'MEDIUM'
  });

  const fetchPpdt = async () => {
    setPpdtLoading(true);
    try {
      const res = await fetch('/api/modules/ppdt');
      const data = await res.json();
      if (data.success) {
        setPpdtScenarios(data.scenarios || []);
      }
    } catch (e) {
      showNotification('Failed to fetch PPDT scenarios', true);
    } finally {
      setPpdtLoading(false);
    }
  };

  const handleSavePpdt = async (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playInterfaceClick();
    try {
      const url = ppdtEditingId ? `/api/modules/ppdt/${ppdtEditingId}` : '/api/modules/ppdt';
      const method = ppdtEditingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ppdtForm)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(ppdtEditingId ? 'PPDT scenario updated' : 'PPDT scenario created');
        setPpdtModalOpen(false);
        setPpdtEditingId(null);
        fetchPpdt();
      } else {
        showNotification(data.error || 'Failed to save PPDT', true);
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const handleDeletePpdt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this PPDT scenario?')) return;
    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch(`/api/modules/ppdt/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('PPDT scenario deleted');
        fetchPpdt();
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  // ========================================================
  // MODULE 3: PSYCHOLOGY BATTERY (Option 5)
  // ========================================================
  const [psychItems, setPsychItems] = useState<any[]>([]);
  const [psychLoading, setPsychLoading] = useState(false);
  const [psychTypeFilter, setPsychTypeFilter] = useState<'WAT' | 'TAT' | 'SCT' | 'SRT' | 'SD'>('WAT');
  const [bulkWatText, setBulkWatText] = useState('');
  const [bulkWatSaving, setBulkWatSaving] = useState(false);
  const [psychModalOpen, setPsychModalOpen] = useState(false);
  const [psychEditingId, setPsychEditingId] = useState<string | null>(null);
  const [psychForm, setPsychForm] = useState({
    testType: 'WAT',
    promptText: '',
    imageUrl: '',
    timeLimitSec: 15,
    sampleAnswer: '',
    category: ''
  });

  const fetchPsych = async () => {
    setPsychLoading(true);
    try {
      const res = await fetch(`/api/modules/psychology?type=${psychTypeFilter}`);
      const data = await res.json();
      if (data.success) {
        setPsychItems(data.items || []);
      }
    } catch (e) {
      showNotification('Failed to fetch psychology items', true);
    } finally {
      setPsychLoading(false);
    }
  };

  const handleBulkWatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkWatText.trim()) return;
    setBulkWatSaving(true);
    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch('/api/modules/psychology/bulk-wat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawWords: bulkWatText })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Successfully imported ${data.count} WAT words!`);
        setBulkWatText('');
        fetchPsych();
      } else {
        showNotification(data.error || 'Failed to bulk import WAT', true);
      }
    } catch (e: any) {
      showNotification(e.message, true);
    } finally {
      setBulkWatSaving(false);
    }
  };

  const handleSavePsych = async (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playInterfaceClick();
    try {
      const url = psychEditingId ? `/api/modules/psychology/${psychEditingId}` : '/api/modules/psychology';
      const method = psychEditingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(psychForm)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(psychEditingId ? 'Psychology item updated' : 'Psychology item created');
        setPsychModalOpen(false);
        setPsychEditingId(null);
        fetchPsych();
      } else {
        showNotification(data.error || 'Failed to save', true);
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const handleDeletePsych = async (id: string) => {
    if (!confirm('Are you sure you want to delete this psychology item?')) return;
    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch(`/api/modules/psychology/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Item deleted');
        fetchPsych();
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  // ========================================================
  // MODULE 4: GTO & MPE (Options 6 & 7)
  // ========================================================
  const [gtoTasks, setGtoTasks] = useState<any[]>([]);
  const [gtoLoading, setGtoLoading] = useState(false);
  const [gtoTypeFilter, setGtoTypeFilter] = useState<string>('ALL');
  const [gtoModalOpen, setGtoModalOpen] = useState(false);
  const [gtoEditingId, setGtoEditingId] = useState<string | null>(null);
  const [gtoForm, setGtoForm] = useState({
    taskType: 'PGT',
    title: '',
    description: '',
    mapImageUrl: '',
    resources: '',
    rules: '',
    modelSolution: '',
    timeAllowedMin: 30
  });

  const fetchGto = async () => {
    setGtoLoading(true);
    try {
      const url = gtoTypeFilter === 'ALL' ? '/api/modules/gto' : `/api/modules/gto?taskType=${gtoTypeFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setGtoTasks(data.tasks || []);
      }
    } catch (e) {
      showNotification('Failed to fetch GTO tasks', true);
    } finally {
      setGtoLoading(false);
    }
  };

  const handleSaveGto = async (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playInterfaceClick();
    try {
      const url = gtoEditingId ? `/api/modules/gto/${gtoEditingId}` : '/api/modules/gto';
      const method = gtoEditingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gtoForm)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(gtoEditingId ? 'GTO task updated' : 'GTO task created');
        setGtoModalOpen(false);
        setGtoEditingId(null);
        fetchGto();
      } else {
        showNotification(data.error || 'Failed to save GTO task', true);
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const handleDeleteGto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this GTO task?')) return;
    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch(`/api/modules/gto/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('GTO task deleted');
        fetchGto();
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  // ========================================================
  // MODULE 5: INTERVIEW QUESTIONS (Option 8)
  // ========================================================
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewCatFilter, setInterviewCatFilter] = useState('ALL');
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewEditingId, setInterviewEditingId] = useState<string | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    category: 'PIQ',
    questionText: '',
    guidelines: '',
    counterQuestions: ''
  });

  const fetchInterview = async () => {
    setInterviewLoading(true);
    try {
      const url = interviewCatFilter === 'ALL' ? '/api/modules/interview' : `/api/modules/interview?category=${interviewCatFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setInterviewQuestions(data.questions || []);
      }
    } catch (e) {
      showNotification('Failed to fetch interview questions', true);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playInterfaceClick();
    try {
      const url = interviewEditingId ? `/api/modules/interview/${interviewEditingId}` : '/api/modules/interview';
      const method = interviewEditingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewForm)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(interviewEditingId ? 'Interview question updated' : 'Interview question created');
        setInterviewModalOpen(false);
        setInterviewEditingId(null);
        fetchInterview();
      } else {
        showNotification(data.error || 'Failed to save', true);
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const handleDeleteInterview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview question?')) return;
    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch(`/api/modules/interview/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Question deleted');
        fetchInterview();
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  // ========================================================
  // MODULE 6: 9 PHYSICAL OBSTACLES (Option 9)
  // ========================================================
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [obstaclesLoading, setObstaclesLoading] = useState(false);
  const [obstacleModalOpen, setObstacleModalOpen] = useState(false);
  const [obstacleForm, setObstacleForm] = useState({
    obstacleNumber: 1,
    name: '',
    marks: 5,
    imageUrl: '',
    techniqueGuide: '',
    commonMistakes: '',
    orderStrategy: ''
  });

  const fetchObstacles = async () => {
    setObstaclesLoading(true);
    try {
      const res = await fetch('/api/modules/physical');
      const data = await res.json();
      if (data.success) {
        setObstacles(data.obstacles || []);
      }
    } catch (e) {
      showNotification('Failed to fetch obstacles', true);
    } finally {
      setObstaclesLoading(false);
    }
  };

  const handleSaveObstacle = async (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch('/api/modules/physical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obstacleForm)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Obstacle #${obstacleForm.obstacleNumber} saved successfully`);
        setObstacleModalOpen(false);
        fetchObstacles();
      } else {
        showNotification(data.error || 'Failed to save obstacle', true);
      }
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  // Load active module data on switch
  useEffect(() => {
    if (activeModule === 'IQ') fetchIqQuestions();
    else if (activeModule === 'PPDT') fetchPpdt();
    else if (activeModule === 'PSYCH') fetchPsych();
    else if (activeModule === 'GTO') fetchGto();
    else if (activeModule === 'INTERVIEW') fetchInterview();
    else if (activeModule === 'PHYSICAL') fetchObstacles();
  }, [activeModule, iqSectionFilter, psychTypeFilter, gtoTypeFilter, interviewCatFilter]);

  return (
    <div className="space-y-6">

      {/* Top Banner & Module Selector */}
      <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL CONTENT CMS • OPTIONS 3 TO 11</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-military tracking-wider mt-2">
              TRAINING MODULE CONTENT MANAGER
            </h2>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Directly Add, Edit, and Delete real training data for all candidate sidebar modules (3 to 11) saved to Supabase PostgreSQL.
            </p>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono font-bold animate-fadeIn flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-300 text-xs font-mono font-bold animate-fadeIn flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Module Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: 'IQ', label: 'Option 3 & 10: IQ Questions', icon: Brain },
            { id: 'PPDT', label: 'Option 4: PPDT Scenarios', icon: FileText },
            { id: 'PSYCH', label: 'Option 5: Psychology Battery', icon: Sparkles },
            { id: 'GTO', label: 'Option 6 & 7: GTO & MPE Tasks', icon: Compass },
            { id: 'INTERVIEW', label: 'Option 8: Board Interview', icon: Award },
            { id: 'PHYSICAL', label: 'Option 9: 9 Physical Obstacles', icon: Activity },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  tacticalAudio.playInterfaceClick();
                  setActiveModule(m.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  isSelected
                    ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'
                    : 'bg-[#040e09] border border-emerald-950 text-slate-300 hover:border-emerald-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          PANEL 1: IQ QUESTIONS (OPTIONS 3 & 10)
          ======================================================== */}
      {activeModule === 'IQ' && (
        <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">FILTER SECTION:</span>
              <div className="flex gap-1.5">
                {(['ALL', 'VERBAL', 'NON_VERBAL'] as const).map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setIqSectionFilter(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase ${
                      iqSectionFilter === sec ? 'bg-gold-500 text-navy-950' : 'bg-[#040e09] border border-emerald-950 text-slate-400'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setIqEditingId(null);
                setIqForm({
                  questionText: '',
                  iqSection: iqSectionFilter === 'NON_VERBAL' ? 'NON_VERBAL' : 'VERBAL',
                  difficulty: 'MEDIUM',
                  imageUrl: '',
                  optionA: '',
                  optionB: '',
                  optionC: '',
                  optionD: '',
                  optionE: '',
                  correctAnswer: 'A',
                  explanation: ''
                });
                setIqModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New IQ Question</span>
            </button>
          </div>

          {/* Search box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={iqSearch}
              onChange={(e) => setIqSearch(e.target.value)}
              placeholder="Search question text or explanation..."
              className="flex-1 px-4 py-2 rounded-xl bg-[#040e09] border border-emerald-950 text-white text-xs font-sans focus:border-gold-500 focus:outline-none"
            />
            <button
              onClick={fetchIqQuestions}
              className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold uppercase"
            >
              Search
            </button>
          </div>

          {/* Questions Table */}
          {iqLoading ? (
            <div className="p-8 text-center text-xs font-mono text-emerald-400">Loading IQ questions from Supabase...</div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400">Showing {iqQuestions.length} Questions</span>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {iqQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold uppercase text-[10px]">
                          {q.iqSection || 'VERBAL'}
                        </span>
                        <span className="text-[10px] text-slate-500">{q.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setIqEditingId(q.id);
                            const optMap: any = {};
                            q.options?.forEach((o: any) => { optMap[o.key] = o.text; });
                            setIqForm({
                              questionText: q.questionText,
                              iqSection: q.iqSection || 'VERBAL',
                              difficulty: q.difficulty || 'MEDIUM',
                              imageUrl: q.imageUrl || '',
                              optionA: optMap.A || '',
                              optionB: optMap.B || '',
                              optionC: optMap.C || '',
                              optionD: optMap.D || '',
                              optionE: optMap.E || '',
                              correctAnswer: q.correctAnswer || 'A',
                              explanation: q.explanation || ''
                            });
                            setIqModalOpen(true);
                          }}
                          className="px-2 py-1 rounded bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-slate-300 font-mono text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteIq(q.id)}
                          className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-800 text-red-300 font-mono text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="font-bold text-white font-sans">{q.questionText}</p>

                    {q.imageUrl && (
                      <div className="max-w-xs p-2 rounded bg-slate-900 border border-emerald-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={q.imageUrl} alt="Diagram" className="max-h-28 object-contain mx-auto" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 font-sans text-[11px]">
                      {q.options?.map((opt: any) => (
                        <div
                          key={opt.key}
                          className={`p-2 rounded border ${
                            opt.key === q.correctAnswer
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-[#071910] border-emerald-950'
                          }`}
                        >
                          <span className="font-mono">{opt.key}:</span> {opt.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add/Edit IQ Modal */}
          {iqModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#071910] border border-gold-500/60 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                  <h3 className="font-military font-bold text-lg text-white uppercase">
                    {iqEditingId ? 'Edit IQ Question' : 'Add New IQ Question'}
                  </h3>
                  <button onClick={() => setIqModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveIq} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">IQ SECTION:</label>
                      <select
                        value={iqForm.iqSection}
                        onChange={(e) => setIqForm({ ...iqForm, iqSection: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-bold"
                      >
                        <option value="VERBAL">VERBAL IQ</option>
                        <option value="NON_VERBAL">NON-VERBAL IQ (Spatial / Diagram)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">DIFFICULTY:</label>
                      <select
                        value={iqForm.difficulty}
                        onChange={(e) => setIqForm({ ...iqForm, difficulty: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-bold"
                      >
                        <option value="EASY">EASY</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HARD">HARD</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">QUESTION TEXT:</label>
                    <textarea
                      rows={3}
                      required
                      value={iqForm.questionText}
                      onChange={(e) => setIqForm({ ...iqForm, questionText: e.target.value })}
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                      placeholder="Enter question prompt..."
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">DIAGRAM IMAGE URL (Optional for Non-Verbal):</label>
                    <input
                      type="text"
                      value={iqForm.imageUrl}
                      onChange={(e) => setIqForm({ ...iqForm, imageUrl: e.target.value })}
                      placeholder="https://... or leave empty"
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">OPTION A:</label>
                      <input
                        type="text"
                        required
                        value={iqForm.optionA}
                        onChange={(e) => setIqForm({ ...iqForm, optionA: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">OPTION B:</label>
                      <input
                        type="text"
                        required
                        value={iqForm.optionB}
                        onChange={(e) => setIqForm({ ...iqForm, optionB: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">OPTION C:</label>
                      <input
                        type="text"
                        required
                        value={iqForm.optionC}
                        onChange={(e) => setIqForm({ ...iqForm, optionC: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">OPTION D:</label>
                      <input
                        type="text"
                        required
                        value={iqForm.optionD}
                        onChange={(e) => setIqForm({ ...iqForm, optionD: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">OPTION E (Optional):</label>
                    <input
                      type="text"
                      value={iqForm.optionE}
                      onChange={(e) => setIqForm({ ...iqForm, optionE: e.target.value })}
                      placeholder="Optional 5th option..."
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">CORRECT ANSWER KEY:</label>
                      <select
                        value={iqForm.correctAnswer}
                        onChange={(e) => setIqForm({ ...iqForm, correctAnswer: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-gold-400 font-bold"
                      >
                        <option value="A">OPTION A</option>
                        <option value="B">OPTION B</option>
                        <option value="C">OPTION C</option>
                        <option value="D">OPTION D</option>
                        <option value="E">OPTION E</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">EXPLANATION / LOGIC:</label>
                      <input
                        type="text"
                        value={iqForm.explanation}
                        onChange={(e) => setIqForm({ ...iqForm, explanation: e.target.value })}
                        placeholder="Explain the pattern..."
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                    <button
                      type="button"
                      onClick={() => setIqModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#040e09] border border-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gold-500 text-navy-950 font-bold uppercase"
                    >
                      {iqEditingId ? 'Save Changes' : 'Create Question'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PANEL 2: PPDT SCENARIOS (OPTION 4)
          ======================================================== */}
      {activeModule === 'PPDT' && (
        <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
            <div>
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">OPTION 4 MANAGEMENT</span>
              <h3 className="text-lg font-black text-white font-military uppercase">PPDT PICTURE SCENARIOS</h3>
            </div>
            <button
              onClick={() => {
                setPpdtEditingId(null);
                setPpdtForm({
                  title: '',
                  imageUrl: '',
                  description: '',
                  characterHints: '',
                  modelStory: '',
                  tips: '',
                  difficulty: 'MEDIUM'
                });
                setPpdtModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add PPDT Scenario</span>
            </button>
          </div>

          {ppdtLoading ? (
            <div className="p-8 text-center text-xs font-mono text-emerald-400">Loading PPDT scenarios...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ppdtScenarios.map((sc) => (
                <div key={sc.id} className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-3 text-xs">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-900 border border-emerald-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sc.imageUrl} alt={sc.title} className="w-full h-full object-cover filter blur-[1px]" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-gold-400 font-bold">
                      {sc.difficulty}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-sans">{sc.title}</h4>
                    <p className="text-slate-400 font-sans line-clamp-2 mt-1">{sc.description}</p>
                  </div>
                  {sc.modelStory && (
                    <div className="p-2.5 rounded bg-[#071910] border border-emerald-950 text-slate-300 font-sans text-[11px] line-clamp-2">
                      <strong className="text-gold-400 font-mono">Model Story:</strong> {sc.modelStory}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                    <button
                      onClick={() => {
                        setPpdtEditingId(sc.id);
                        setPpdtForm({
                          title: sc.title,
                          imageUrl: sc.imageUrl,
                          description: sc.description || '',
                          characterHints: sc.characterHints || '',
                          modelStory: sc.modelStory || '',
                          tips: sc.tips || '',
                          difficulty: sc.difficulty || 'MEDIUM'
                        });
                        setPpdtModalOpen(true);
                      }}
                      className="px-3 py-1 rounded bg-navy-900 text-slate-300 font-mono text-xs hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePpdt(sc.id)}
                      className="px-3 py-1 rounded bg-red-950 text-red-300 font-mono text-xs hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PPDT Modal */}
          {ppdtModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#071910] border border-gold-500/60 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                  <h3 className="font-military font-bold text-lg text-white uppercase">
                    {ppdtEditingId ? 'Edit PPDT Scenario' : 'Add PPDT Scenario'}
                  </h3>
                  <button onClick={() => setPpdtModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePpdt} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">SCENARIO TITLE:</label>
                    <input
                      type="text"
                      required
                      value={ppdtForm.title}
                      onChange={(e) => setPpdtForm({ ...ppdtForm, title: e.target.value })}
                      placeholder="e.g. Rural Flash Flood & Damaged River Bridge"
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">HAZY PICTURE IMAGE URL:</label>
                    <input
                      type="text"
                      required
                      value={ppdtForm.imageUrl}
                      onChange={(e) => setPpdtForm({ ...ppdtForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... or hosted image URL"
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">SCENE DESCRIPTION:</label>
                    <textarea
                      rows={2}
                      value={ppdtForm.description}
                      onChange={(e) => setPpdtForm({ ...ppdtForm, description: e.target.value })}
                      placeholder="Describe the background and visible figures..."
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">RECOMMENDED MODEL OFFICER STORY (100-120 Words):</label>
                    <textarea
                      rows={5}
                      value={ppdtForm.modelStory}
                      onChange={(e) => setPpdtForm({ ...ppdtForm, modelStory: e.target.value })}
                      placeholder="Hero name, initiative, concrete actions, and positive outcome..."
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">OFFICER ASSESSMENT TIPS:</label>
                    <input
                      type="text"
                      value={ppdtForm.tips}
                      onChange={(e) => setPpdtForm({ ...ppdtForm, tips: e.target.value })}
                      placeholder="e.g. Focus on logical planning with available materials"
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                    <button
                      type="button"
                      onClick={() => setPpdtModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#040e09] border border-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gold-500 text-navy-950 font-bold uppercase"
                    >
                      {ppdtEditingId ? 'Save Scenario' : 'Create Scenario'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PANEL 3: PSYCHOLOGY BATTERY (OPTION 5)
          ======================================================== */}
      {activeModule === 'PSYCH' && (
        <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">TEST TYPE:</span>
              {(['WAT', 'TAT', 'SCT', 'SRT', 'SD'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPsychTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase ${
                    psychTypeFilter === t ? 'bg-gold-500 text-navy-950' : 'bg-[#040e09] border border-emerald-950 text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setPsychEditingId(null);
                setPsychForm({
                  testType: psychTypeFilter,
                  promptText: '',
                  imageUrl: '',
                  timeLimitSec: psychTypeFilter === 'WAT' ? 15 : psychTypeFilter === 'TAT' ? 240 : 30,
                  sampleAnswer: '',
                  category: ''
                });
                setPsychModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Single {psychTypeFilter} Item</span>
            </button>
          </div>

          {/* SPECIAL ZERO-FRICTION WAT BULK PASTE FOR ADMIN */}
          {psychTypeFilter === 'WAT' && (
            <div className="p-5 rounded-xl bg-[#040e09] border border-gold-500/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold-400 uppercase">
                <Sparkles className="w-4 h-4" />
                <span>1-CLICK BULK WAT WORDS IMPORT (EFFORTLESS FOR ADMIN)</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Paste 10, 20, or 60 words separated by commas or newlines. The system will instantly generate 15-second flashcards for all of them!
              </p>
              <form onSubmit={handleBulkWatSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  value={bulkWatText}
                  onChange={(e) => setBulkWatText(e.target.value)}
                  placeholder="LEADER, DUTY, WAR, BRAVE, FEAR, SACRIFICE, ATTACK, PEACE, HONOR, VICTORY, DISCIPLINE..."
                  className="w-full p-3 rounded-lg bg-[#071910] border border-emerald-900 text-white font-mono text-xs focus:border-gold-500 focus:outline-none uppercase tracking-wider"
                />
                <button
                  type="submit"
                  disabled={bulkWatSaving || !bulkWatText.trim()}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase shadow-md disabled:opacity-50"
                >
                  {bulkWatSaving ? 'Importing Words...' : '⚡ Import All WAT Words to Database'}
                </button>
              </form>
            </div>
          )}

          {/* Psychology Items List */}
          {psychLoading ? (
            <div className="p-8 text-center text-xs font-mono text-emerald-400">Loading {psychTypeFilter} items...</div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400">Total {psychItems.length} {psychTypeFilter} Items</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                {psychItems.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2 text-xs flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>#{idx + 1} • {item.testType}</span>
                        <span>{item.timeLimitSec}s</span>
                      </div>
                      <p className="font-bold text-white font-sans">{item.promptText}</p>
                      {item.sampleAnswer && (
                        <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                          <strong className="text-emerald-400 font-mono">Answer:</strong> {item.sampleAnswer}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                      <button
                        onClick={() => handleDeletePsych(item.id)}
                        className="px-2 py-1 rounded bg-red-950 text-red-300 font-mono text-[10px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Psychology Item Modal */}
          {psychModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#071910] border border-gold-500/60 rounded-2xl p-6 max-w-lg w-full space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                  <h3 className="font-military font-bold text-lg text-white uppercase">
                    Add {psychTypeFilter} Item
                  </h3>
                  <button onClick={() => setPsychModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePsych} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">PROMPT / WORD / SCENARIO TEXT:</label>
                    <textarea
                      rows={3}
                      required
                      value={psychForm.promptText}
                      onChange={(e) => setPsychForm({ ...psychForm, promptText: e.target.value })}
                      placeholder={psychTypeFilter === 'WAT' ? 'e.g. COURAGE' : 'Enter prompt text...'}
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  {psychTypeFilter === 'TAT' && (
                    <div>
                      <label className="text-slate-400 block mb-1">IMAGE URL (For TAT):</label>
                      <input
                        type="text"
                        value={psychForm.imageUrl}
                        onChange={(e) => setPsychForm({ ...psychForm, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-slate-400 block mb-1">SAMPLE / RECOMMENDED OFFICER RESPONSE:</label>
                    <textarea
                      rows={2}
                      value={psychForm.sampleAnswer}
                      onChange={(e) => setPsychForm({ ...psychForm, sampleAnswer: e.target.value })}
                      placeholder="Sample positive completion..."
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                    <button
                      type="button"
                      onClick={() => setPsychModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#040e09] border border-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gold-500 text-navy-950 font-bold uppercase"
                    >
                      Save Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PANEL 4: GTO & MPE TASKS (OPTIONS 6 & 7)
          ======================================================== */}
      {activeModule === 'GTO' && (
        <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">FILTER TASK:</span>
              {(['ALL', 'PGT', 'HGT', 'COMMAND_TASK', 'MPE', 'LECTURETTE', 'GD'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setGtoTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase ${
                    gtoTypeFilter === t ? 'bg-gold-500 text-navy-950' : 'bg-[#040e09] border border-emerald-950 text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setGtoEditingId(null);
                setGtoForm({
                  taskType: gtoTypeFilter === 'ALL' ? 'PGT' : gtoTypeFilter,
                  title: '',
                  description: '',
                  mapImageUrl: '',
                  resources: '',
                  rules: '',
                  modelSolution: '',
                  timeAllowedMin: 30
                });
                setGtoModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add GTO / MPE Task</span>
            </button>
          </div>

          {gtoLoading ? (
            <div className="p-8 text-center text-xs font-mono text-emerald-400">Loading GTO tasks...</div>
          ) : (
            <div className="space-y-4">
              {gtoTasks.map((t) => (
                <div key={t.id} className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span className="text-gold-400 font-bold uppercase">{t.taskType}: {t.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{t.timeAllowedMin} Mins</span>
                      <button
                        onClick={() => {
                          setGtoEditingId(t.id);
                          setGtoForm({
                            taskType: t.taskType,
                            title: t.title,
                            description: t.description,
                            mapImageUrl: t.mapImageUrl || '',
                            resources: t.resources || '',
                            rules: t.rules || '',
                            modelSolution: t.modelSolution || '',
                            timeAllowedMin: t.timeAllowedMin || 30
                          });
                          setGtoModalOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-navy-900 text-slate-300 font-mono hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGto(t.id)}
                        className="px-2 py-1 rounded bg-red-950 text-red-300 font-mono hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-200 font-sans leading-relaxed">{t.description}</p>

                  {t.modelSolution && (
                    <div className="p-3 rounded bg-[#071910] border border-emerald-900/60 text-slate-300 font-sans text-[11px]">
                      <strong className="text-gold-400 font-mono">Model Solution:</strong> {t.modelSolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* GTO Modal */}
          {gtoModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#071910] border border-gold-500/60 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                  <h3 className="font-military font-bold text-lg text-white uppercase">
                    {gtoEditingId ? 'Edit GTO / MPE Task' : 'Add GTO / MPE Task'}
                  </h3>
                  <button onClick={() => setGtoModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveGto} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">TASK TYPE:</label>
                      <select
                        value={gtoForm.taskType}
                        onChange={(e) => setGtoForm({ ...gtoForm, taskType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-bold"
                      >
                        <option value="PGT">PGT (Progressive Group Task)</option>
                        <option value="HGT">HGT (Half Group Task)</option>
                        <option value="COMMAND_TASK">COMMAND TASK</option>
                        <option value="MPE">MPE (Military Planning Exercise)</option>
                        <option value="LECTURETTE">LECTURETTE</option>
                        <option value="GD">GD (Group Discussion)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">TIME ALLOWED (MINUTES):</label>
                      <input
                        type="number"
                        value={gtoForm.timeAllowedMin}
                        onChange={(e) => setGtoForm({ ...gtoForm, timeAllowedMin: parseInt(e.target.value) || 30 })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">TASK TITLE:</label>
                    <input
                      type="text"
                      required
                      value={gtoForm.title}
                      onChange={(e) => setGtoForm({ ...gtoForm, title: e.target.value })}
                      placeholder="e.g. Stage 1: The 18-Foot Gap & Cantilever Bridge"
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">DETAILED DESCRIPTION / BRIEFING:</label>
                    <textarea
                      rows={4}
                      required
                      value={gtoForm.description}
                      onChange={(e) => setGtoForm({ ...gtoForm, description: e.target.value })}
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">MAP / DIAGRAM IMAGE URL (For MPE/PGT):</label>
                    <input
                      type="text"
                      value={gtoForm.mapImageUrl}
                      onChange={(e) => setGtoForm({ ...gtoForm, mapImageUrl: e.target.value })}
                      placeholder="https://... or leave empty"
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">OPTIMAL MODEL SOLUTION:</label>
                    <textarea
                      rows={3}
                      value={gtoForm.modelSolution}
                      onChange={(e) => setGtoForm({ ...gtoForm, modelSolution: e.target.value })}
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                    <button
                      type="button"
                      onClick={() => setGtoModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#040e09] border border-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gold-500 text-navy-950 font-bold uppercase"
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PANEL 5: INTERVIEW QUESTIONS (OPTION 8)
          ======================================================== */}
      {activeModule === 'INTERVIEW' && (
        <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">FILTER CATEGORY:</span>
              {(['ALL', 'PIQ', 'DEFENSE_GK', 'GEOPOLITICS', 'PSYCH_STRESS'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setInterviewCatFilter(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase ${
                    interviewCatFilter === c ? 'bg-gold-500 text-navy-950' : 'bg-[#040e09] border border-emerald-950 text-slate-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setInterviewEditingId(null);
                setInterviewForm({
                  category: interviewCatFilter === 'ALL' ? 'PIQ' : interviewCatFilter,
                  questionText: '',
                  guidelines: '',
                  counterQuestions: ''
                });
                setInterviewModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Interview Question</span>
            </button>
          </div>

          {interviewLoading ? (
            <div className="p-8 text-center text-xs font-mono text-emerald-400">Loading interview questions...</div>
          ) : (
            <div className="space-y-3">
              {interviewQuestions.map((q) => (
                <div key={q.id} className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span className="text-gold-400 font-bold uppercase">CATEGORY: {q.category}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setInterviewEditingId(q.id);
                          setInterviewForm({
                            category: q.category,
                            questionText: q.questionText,
                            guidelines: q.guidelines || '',
                            counterQuestions: q.counterQuestions || ''
                          });
                          setInterviewModalOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-navy-900 text-slate-300 font-mono hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInterview(q.id)}
                        className="px-2 py-1 rounded bg-red-950 text-red-300 font-mono hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-white font-sans text-sm">"{q.questionText}"</h4>
                  {q.guidelines && (
                    <div className="p-2.5 rounded bg-[#071910] border border-emerald-950 text-slate-300 font-sans text-[11px]">
                      <strong className="text-emerald-400 font-mono">Guidelines:</strong> {q.guidelines}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Interview Modal */}
          {interviewModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#071910] border border-gold-500/60 rounded-2xl p-6 max-w-lg w-full space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                  <h3 className="font-military font-bold text-lg text-white uppercase">
                    {interviewEditingId ? 'Edit Interview Question' : 'Add Interview Question'}
                  </h3>
                  <button onClick={() => setInterviewModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveInterview} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">CATEGORY:</label>
                    <select
                      value={interviewForm.category}
                      onChange={(e) => setInterviewForm({ ...interviewForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-bold"
                    >
                      <option value="PIQ">PIQ (Personal Bio & Family)</option>
                      <option value="DEFENSE_GK">DEFENSE & TRI-SERVICE GK</option>
                      <option value="GEOPOLITICS">GEOPOLITICS & MARITIME</option>
                      <option value="PSYCH_STRESS">PSYCHOLOGICAL STRESS</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">QUESTION TEXT:</label>
                    <textarea
                      rows={3}
                      required
                      value={interviewForm.questionText}
                      onChange={(e) => setInterviewForm({ ...interviewForm, questionText: e.target.value })}
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">OFFICER APPROACH GUIDELINES:</label>
                    <textarea
                      rows={3}
                      value={interviewForm.guidelines}
                      onChange={(e) => setInterviewForm({ ...interviewForm, guidelines: e.target.value })}
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                    <button
                      type="button"
                      onClick={() => setInterviewModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#040e09] border border-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gold-500 text-navy-950 font-bold uppercase"
                    >
                      Save Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PANEL 6: 9 PHYSICAL OBSTACLES (OPTION 9)
          ======================================================== */}
      {activeModule === 'PHYSICAL' && (
        <div className="p-6 rounded-2xl bg-[#071910] border border-emerald-800/60 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950 pb-4">
            <div>
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">OPTION 9 MANAGEMENT</span>
              <h3 className="text-lg font-black text-white font-military uppercase">9 INDIVIDUAL OBSTACLES</h3>
            </div>
          </div>

          {obstaclesLoading ? (
            <div className="p-8 text-center text-xs font-mono text-emerald-400">Loading obstacles...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {obstacles.map((obs) => (
                <div key={obs.obstacleNumber} className="p-5 rounded-xl bg-[#040e09] border border-emerald-950 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-gold-400 font-mono font-bold">
                      <span>OBSTACLE #{obs.obstacleNumber}</span>
                      <span>{obs.marks} MARKS</span>
                    </div>
                    <h4 className="font-bold text-white text-sm font-sans">{obs.name}</h4>
                    {obs.techniqueGuide && (
                      <p className="text-slate-300 font-sans line-clamp-3 text-[11px] leading-relaxed">
                        {obs.techniqueGuide}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                    <button
                      onClick={() => {
                        setObstacleForm({
                          obstacleNumber: obs.obstacleNumber,
                          name: obs.name,
                          marks: obs.marks || 5,
                          imageUrl: obs.imageUrl || '',
                          techniqueGuide: obs.techniqueGuide || '',
                          commonMistakes: obs.commonMistakes || '',
                          orderStrategy: obs.orderStrategy || ''
                        });
                        setObstacleModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gold-500 text-navy-950 font-mono font-bold text-xs uppercase"
                    >
                      Edit Obstacle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Obstacle Edit Modal */}
          {obstacleModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#071910] border border-gold-500/60 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                  <h3 className="font-military font-bold text-lg text-white uppercase">
                    Edit Obstacle #{obstacleForm.obstacleNumber}
                  </h3>
                  <button onClick={() => setObstacleModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveObstacle} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">OBSTACLE NAME:</label>
                      <input
                        type="text"
                        required
                        value={obstacleForm.name}
                        onChange={(e) => setObstacleForm({ ...obstacleForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">MARKS (e.g. 5 to 8):</label>
                      <input
                        type="number"
                        required
                        value={obstacleForm.marks}
                        onChange={(e) => setObstacleForm({ ...obstacleForm, marks: parseInt(e.target.value) || 5 })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">IMAGE URL:</label>
                    <input
                      type="text"
                      value={obstacleForm.imageUrl}
                      onChange={(e) => setObstacleForm({ ...obstacleForm, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">TECHNIQUE GUIDE:</label>
                    <textarea
                      rows={3}
                      value={obstacleForm.techniqueGuide}
                      onChange={(e) => setObstacleForm({ ...obstacleForm, techniqueGuide: e.target.value })}
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">COMMON FOULS & MISTAKES:</label>
                    <textarea
                      rows={2}
                      value={obstacleForm.commonMistakes}
                      onChange={(e) => setObstacleForm({ ...obstacleForm, commonMistakes: e.target.value })}
                      className="w-full p-3 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">OPTIMAL 3-MIN SEQUENCE STRATEGY:</label>
                    <input
                      type="text"
                      value={obstacleForm.orderStrategy}
                      onChange={(e) => setObstacleForm({ ...obstacleForm, orderStrategy: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#040e09] border border-emerald-900 text-white font-sans text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                    <button
                      type="button"
                      onClick={() => setObstacleModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#040e09] border border-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gold-500 text-navy-950 font-bold uppercase"
                    >
                      Save Obstacle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
