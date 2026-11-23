'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BravoLogo } from '@/components/BravoLogo';
import { Shield, User, Mail, Lock, Phone, ArrowRight, AlertCircle, Compass, Crosshair } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    targetForce: 'ARMY'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    tacticalAudio.playInterfaceClick();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      localStorage.setItem('bravo_user', JSON.stringify(data.user));
      tacticalAudio.playRadarPing();
      router.push('/dashboard');
    } catch (err: any) {
      setError('Connection failure. Check network and server state.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-military-grid relative overflow-hidden pt-24">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <BravoLogo size="lg" />
        <h2 className="text-2xl font-black uppercase tracking-wider text-white font-military mt-4">
          CADET ENLISTMENT APPLICATION
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          Register to begin your officer candidate preparation journey.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-navy-800">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
                FULL CADET NAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-navy-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="cadet@example.com"
                  className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-navy-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
                  MOBILE PHONE
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01812345678"
                    className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-navy-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
                  CREATE PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-navy-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Target Force Selector */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                TARGET DEFENSE BRANCH
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'ARMY', label: 'ARMY', icon: Shield, color: 'border-defense-army' },
                  { id: 'NAVY', label: 'NAVY', icon: Compass, color: 'border-defense-navy' },
                  { id: 'AIR_FORCE', label: 'AIR FORCE', icon: Crosshair, color: 'border-defense-airforce' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      tacticalAudio.playInterfaceClick();
                      setFormData({ ...formData, targetForce: f.id });
                    }}
                    className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all ${
                      formData.targetForce === f.id
                        ? 'bg-gold-500/20 border-gold-500 text-gold-400 font-bold'
                        : 'bg-navy-900/80 border-navy-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <f.icon className="w-4 h-4" />
                    <span className="text-[11px] font-mono tracking-wider">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(214,173,96,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>COMMITTING ENLISTMENT...</span>
                ) : (
                  <>
                    <span>CONFIRM ENLISTMENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-navy-800 text-center text-xs text-slate-400">
            <span>Already enlisted cadet? </span>
            <Link
              href="/login"
              className="text-gold-400 hover:text-white font-bold uppercase tracking-wider transition-colors ml-1"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
