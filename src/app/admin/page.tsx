'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Users,
  BookOpen,
  DollarSign,
  Brain,
  FileSpreadsheet,
  Sparkles,
  FileText,
  Upload,
  Settings,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  Video,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any | null>(null);
  const [cms, setCms] = useState<any | null>(null);
  const [savingCms, setSavingCms] = useState(false);
  const [cmsMessage, setCmsMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in as ADMIN
    const stored = localStorage.getItem('bravo_user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
    }

    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/cms').then((r) => r.json())
    ])
      .then(([statsData, cmsData]) => {
        if (statsData.success) setStats(statsData.stats);
        if (cmsData.success) setCms(cmsData.content);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCms(true);
    tacticalAudio.playInterfaceClick();
    setCmsMessage('');

    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cms)
      });
      const data = await res.json();
      if (data.success) {
        setCmsMessage('✅ Homepage CMS successfully published to live site!');
        tacticalAudio.playRadarPing();
      }
    } catch (e) {
      setCmsMessage('❌ Failed to update CMS.');
    } finally {
      setSavingCms(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase">
              <Shield className="w-4 h-4" />
              <span>COMMAND CONTROL CENTER (ADMIN)</span>
            </div>
            <h1 className="text-3xl font-black uppercase text-white font-military mt-2">
              BRAVO ACADEMY HEADQUARTERS
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Logged in as Commanding Administrator. Full platform authority over questions, courses, and homepage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/questions"
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase font-mono tracking-wider shadow-md"
            >
              QUESTION MANAGEMENT CENTER →
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-navy-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>TOTAL CADETS</span>
              <Users className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-3xl font-black text-white font-military">
              {stats?.totalStudents || 3421}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">Active defense aspirants</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-navy-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>QUESTION BANK</span>
              <Brain className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-3xl font-black text-gold-400 font-military">
              {stats?.totalQuestions || 1055}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">12 verified categories</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-navy-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>DEFENSE COURSES</span>
              <BookOpen className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-3xl font-black text-white font-military">
              {stats?.totalCourses || 7}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Army, Navy, Air Force</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-navy-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>TOTAL REVENUE</span>
              <DollarSign className="w-4 h-4 text-defense-success" />
            </div>
            <div className="text-3xl font-black text-defense-success font-military">
              ৳{(stats?.totalRevenue || 284500).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">bKash & Nagad verified</div>
          </div>
        </div>

        {/* Quick Launchpad to 5 Question Creation Methods */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-4">
          <h3 className="text-lg font-black uppercase text-white font-military border-b border-navy-800 pb-3">
            QUESTION CREATION SUITE (5 METHODS READY)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
            <Link
              href="/admin/questions"
              className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500 text-slate-300 hover:text-white transition-all text-center space-y-1"
            >
              <div className="font-bold text-gold-400">METHOD 1</div>
              <div>Manual Question Builder</div>
            </Link>
            <Link
              href="/admin/questions"
              className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500 text-slate-300 hover:text-white transition-all text-center space-y-1"
            >
              <div className="font-bold text-gold-400">METHOD 2</div>
              <div>Excel / CSV Bulk Import</div>
            </Link>
            <Link
              href="/admin/questions"
              className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500 text-slate-300 hover:text-white transition-all text-center space-y-1"
            >
              <div className="font-bold text-gold-400">METHOD 3</div>
              <div>AI Question Generator</div>
            </Link>
            <Link
              href="/admin/questions/extract-review"
              className="p-3.5 rounded-xl bg-navy-900 border border-gold-500/40 text-gold-400 text-center space-y-1 shadow-md"
            >
              <div className="font-bold text-white">METHOD 4</div>
              <div>AI Vision OCR Extractor</div>
            </Link>
            <Link
              href="/admin/questions"
              className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500 text-slate-300 hover:text-white transition-all text-center space-y-1"
            >
              <div className="font-bold text-gold-400">METHOD 5</div>
              <div>Copy-Paste Text Import</div>
            </Link>
          </div>
        </div>

        {/* ========================================================
            VISUAL HOMEPAGE CMS BUILDER
            ======================================================== */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gold-500/40 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                CONTENT MANAGEMENT SYSTEM
              </span>
              <h3 className="text-xl font-black uppercase text-white font-military mt-1">
                VISUAL HOMEPAGE BUILDER
              </h3>
            </div>
            <span className="text-xs font-mono bg-navy-900 px-3 py-1 rounded text-slate-300 border border-navy-700">
              POSTGRESQL SYNCHRONIZED
            </span>
          </div>

          {cmsMessage && (
            <div className="p-3 rounded-lg bg-navy-900 border border-gold-500 text-xs font-mono text-gold-400">
              {cmsMessage}
            </div>
          )}

          {cms && (
            <form onSubmit={handleSaveCms} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    HERO MAIN HEADLINE
                  </label>
                  <input
                    type="text"
                    value={cms.heroTitle}
                    onChange={(e) => setCms({ ...cms, heroTitle: e.target.value })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    ANNOUNCEMENT TICKER
                  </label>
                  <input
                    type="text"
                    value={cms.announcementText}
                    onChange={(e) => setCms({ ...cms, announcementText: e.target.value })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  HERO SUBTITLE
                </label>
                <textarea
                  rows={2}
                  value={cms.heroSubtitle}
                  onChange={(e) => setCms({ ...cms, heroSubtitle: e.target.value })}
                  className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Primary Button</label>
                  <input
                    type="text"
                    value={cms.primaryCtaText}
                    onChange={(e) => setCms({ ...cms, primaryCtaText: e.target.value })}
                    className="w-full p-2 bg-navy-900 border border-navy-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Primary Link</label>
                  <input
                    type="text"
                    value={cms.primaryCtaLink}
                    onChange={(e) => setCms({ ...cms, primaryCtaLink: e.target.value })}
                    className="w-full p-2 bg-navy-900 border border-navy-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Secondary Button</label>
                  <input
                    type="text"
                    value={cms.secondaryCtaText}
                    onChange={(e) => setCms({ ...cms, secondaryCtaText: e.target.value })}
                    className="w-full p-2 bg-navy-900 border border-navy-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Secondary Link</label>
                  <input
                    type="text"
                    value={cms.secondaryCtaLink}
                    onChange={(e) => setCms({ ...cms, secondaryCtaLink: e.target.value })}
                    className="w-full p-2 bg-navy-900 border border-navy-700 rounded text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingCms}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest font-mono transition-all shadow-md"
              >
                {savingCms ? 'PUBLISHING HOMEPAGE EDITS...' : 'SAVE & PUBLISH HOMEPAGE CHANGES →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
