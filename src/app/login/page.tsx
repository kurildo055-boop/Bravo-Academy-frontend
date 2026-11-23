'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BravoLogo } from '@/components/BravoLogo';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    tacticalAudio.playInterfaceClick();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      // Store basic info for client navigation state
      localStorage.setItem('bravo_user', JSON.stringify(data.user));
      tacticalAudio.playRadarPing();

      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Connection failure. Check network and server state.');
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    tacticalAudio.playInterfaceClick();
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-military-grid relative overflow-hidden pt-24">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <BravoLogo size="lg" />
        <h2 className="text-2xl font-black uppercase tracking-wider text-white font-military mt-4">
          CANDIDATE & COMMAND LOGIN
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          Enter your defense academy credentials to access training modules.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* One-Click Quick Credentials Helper */}
        <div className="glass-panel rounded-xl p-3 mb-5 border border-gold-500/30 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-gold-400 font-mono font-bold uppercase text-[11px]">
            <KeyRound className="w-3.5 h-3.5" />
            <span>INSTANT DEMO CREDENTIALS:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('cadet@bravoacademy.com', 'Cadet@Bravo2026!')}
              className="py-1.5 px-2.5 rounded bg-navy-900 border border-navy-700 hover:border-gold-500/50 text-slate-300 hover:text-white text-[11px] font-mono text-left transition-colors"
            >
              <div className="font-bold text-emerald-400">👤 CADET (STUDENT)</div>
              <div className="truncate text-[10px] text-slate-400">cadet@bravoacademy.com</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@bravoacademy.com', 'Admin@Bravo2026!')}
              className="py-1.5 px-2.5 rounded bg-navy-900 border border-navy-700 hover:border-gold-500/50 text-slate-300 hover:text-white text-[11px] font-mono text-left transition-colors"
            >
              <div className="font-bold text-gold-400">⭐ COMMAND (ADMIN)</div>
              <div className="truncate text-[10px] text-slate-400">admin@bravoacademy.com</div>
            </button>
          </div>
        </div>

        <div className="glass-panel py-7 px-6 sm:px-9 rounded-2xl shadow-2xl border border-navy-800 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                MILITARY IDENTIFIER (GMAIL / EMAIL)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cadet@bravoacademy.com"
                  className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-navy-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                PASSWORD PASSCODE
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-navy-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(214,173,96,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 font-mono"
              >
                {loading ? (
                  <span>AUTHENTICATING COMMAND...</span>
                ) : (
                  <>
                    <span>AUTHENTICATE & ENTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-navy-800 text-center text-xs text-slate-400">
            <span>New defense aspirant? </span>
            <Link
              href="/register"
              className="text-gold-400 hover:text-white font-bold uppercase tracking-wider transition-colors ml-1"
            >
              Register as Cadet →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
