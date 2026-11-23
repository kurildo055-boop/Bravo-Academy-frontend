'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit3,
  Layers,
  ArrowLeft,
  Check,
  Shield,
  Clock
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function ExtractionReviewPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchJobs = () => {
    setLoading(true);
    fetch('/api/questions/import-jobs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.jobs);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const allItems = jobs.flatMap((j) => j.items || []);
  const pendingItems = allItems.filter((i) => i.status === 'PENDING_REVIEW');

  const toggleSelect = (id: string) => {
    tacticalAudio.playInterfaceClick();
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    tacticalAudio.playInterfaceClick();
    if (selectedItems.length === pendingItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingItems.map((i) => i.id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) return;
    tacticalAudio.playRadarPing();
    setMessage('Publishing selected questions to live database...');

    try {
      const res = await fetch('/api/questions/import-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: selectedItems })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`🎉 ${data.approvedCount} questions approved and published to live Question Bank!`);
        setSelectedItems([]);
        fetchJobs();
      }
    } catch (e) {
      setMessage('Approval failed.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Back & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/questions"
              onClick={() => tacticalAudio.playInterfaceClick()}
              className="p-2 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="text-xs font-mono font-bold text-gold-400 uppercase">
                DOCUMENT OCR & VISION AI
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-military">
                EXTRACTION REVIEW CENTER
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs font-mono text-slate-300 hover:text-white"
            >
              {selectedItems.length === pendingItems.length ? 'DESELECT ALL' : 'SELECT ALL'}
            </button>
            <button
              onClick={handleBulkApprove}
              disabled={selectedItems.length === 0}
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase font-mono tracking-wider disabled:opacity-40 shadow-lg"
            >
              APPROVE & PUBLISH ({selectedItems.length}) →
            </button>
          </div>
        </div>

        {/* Extraction Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">TOTAL EXTRACTED</div>
            <div className="text-2xl font-black text-white font-military">{allItems.length}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">PENDING AUDIT</div>
            <div className="text-2xl font-black text-gold-400 font-military">{pendingItems.length}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">HIGH CONFIDENCE</div>
            <div className="text-2xl font-black text-defense-success font-military">
              {allItems.filter((i) => i.confidence >= 0.9).length}
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-navy-800 space-y-1">
            <div className="text-xs font-mono text-slate-400">REVIEW REQUIRED</div>
            <div className="text-2xl font-black text-amber-400 font-military">
              {allItems.filter((i) => i.confidence < 0.9).length}
            </div>
          </div>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-navy-900 border border-gold-500 text-xs font-mono text-gold-400">
            {message}
          </div>
        )}

        {/* Extracted Items List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 font-mono text-gold-400">
              AUDITING EXTRACTED QUESTION JOBS...
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-3 border border-navy-800">
              <CheckCircle2 className="w-12 h-12 text-defense-success mx-auto" />
              <h3 className="text-lg font-bold text-white font-military uppercase">ALL EXTRACTIONS AUDITED</h3>
              <p className="text-xs text-slate-400 font-sans">
                No pending questions requiring review. You can upload new documents in the Question Bank tab.
              </p>
              <Link
                href="/admin/questions"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs uppercase font-mono"
              >
                Go to Question Bank →
              </Link>
            </div>
          ) : (
            pendingItems.map((item) => {
              const options = item.optionsJson ? JSON.parse(item.optionsJson) : {};
              const isSelected = selectedItems.includes(item.id);
              const isHighConfidence = item.confidence >= 0.9;

              return (
                <div
                  key={item.id}
                  className={`glass-panel rounded-xl p-5 border transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-navy-900/90 shadow-lg'
                      : 'border-navy-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded text-gold-500 focus:ring-0 mt-1 cursor-pointer"
                    />

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isHighConfidence
                                ? 'bg-defense-success/20 text-defense-success border border-defense-success/40'
                                : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            }`}
                          >
                            {isHighConfidence ? 'HIGH CONFIDENCE (96%)' : 'MANUAL REVIEW (88%)'}
                          </span>
                          <span className="text-slate-500">PAGE {item.pageNumber || 1}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSelect(item.id)}
                            className="text-gold-400 hover:text-white"
                          >
                            {isSelected ? '✓ SELECTED' : '+ SELECT FOR APPROVAL'}
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-white leading-snug font-sans">
                        {item.questionText}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                        {Object.entries(options).map(([k, v]) => (
                          <div
                            key={k}
                            className={`p-2 rounded border text-[11px] ${
                              k === item.detectedAnswer
                                ? 'bg-defense-success/20 border-defense-success text-white font-bold'
                                : 'bg-navy-900 border-navy-800 text-slate-300'
                            }`}
                          >
                            <span className="text-gold-400 font-bold mr-1">{k}:</span>
                            <span>{String(v)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-navy-800 text-slate-400">
                        <span>
                          ANSWER KEY: <strong className="text-defense-success">{item.detectedAnswer || 'REQUIRED'}</strong>
                        </span>
                        <span>STATUS: {item.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
