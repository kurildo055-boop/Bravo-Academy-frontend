'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BravoLogo } from '@/components/BravoLogo';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle, KeyRound, UserCheck } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
    } catch (err: any) {
      setError('Connection failure. Check network and server state.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const googleEmail = prompt('Enter your Google Account email for Cadets:', email || 'cadet.google@bravoacademy.com');
    if (!googleEmail) return;

    setGoogleLoading(true);
    tacticalAudio.playInterfaceClick();

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail,
          name: googleEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          googleId: `google_${Date.now()}`
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Google authentication failed.');
        setGoogleLoading(false);
        return;
      }

      localStorage.setItem('bravo_user', JSON.stringify(data.user));
      tacticalAudio.playRadarPing();
      router.push('/dashboard');
    } catch {
      setError('Network connection error during Google sign-in.');
      setGoogleLoading(false);
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
        <div className="glass-panel rounded-xl p-3.5 mb-6 border border-gold-500/30 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-gold-400 font-mono font-bold uppercase">
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

        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-navy-800 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-navy-950 font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'SIGNING IN WITH GOOGLE...' : 'CONTINUE WITH GOOGLE'}</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <div className="flex-1 h-[1px] bg-navy-800" />
            <span>OR MILITARY CREDENTIALS</span>
            <div className="flex-1 h-[1px] bg-navy-800" />
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                MILITARY IDENTIFIER (EMAIL)
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
                  className="w-full pl-10 pr-3 py-2.5 bg-navy-900/90 border border-navy-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono transition-colors"
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
                  className="w-full pl-10 pr-3 py-2.5 bg-navy-900/90 border border-navy-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(214,173,96,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
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
