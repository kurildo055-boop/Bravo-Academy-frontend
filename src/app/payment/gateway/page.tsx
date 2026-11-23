'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, CheckCircle, ArrowRight, Lock, Key, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { tacticalAudio } from '@/lib/audio';

function GatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const method = (searchParams.get('method') || 'bkash').toUpperCase();
  const invoice = searchParams.get('invoice') || `INV-${Date.now().toString().slice(-6)}`;
  const amount = searchParams.get('amount') || '2999';

  const [step, setStep] = useState<'OTP' | 'PIN' | 'SUCCESS'>('OTP');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('12345');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const brandColor = method === 'BKASH' ? '#E2136E' : '#F7941D';

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 'OTP') {
      tacticalAudio.playInterfaceClick();
      setStep('PIN');
      return;
    }

    setVerifying(true);
    tacticalAudio.playInterfaceClick();

    try {
      const generatedTrx = `${method}-TX-${Date.now().toString().slice(-8)}`;

      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: invoice,
          transactionId: generatedTrx,
          paymentMethod: method
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Payment authorization failed.');
        setVerifying(false);
        return;
      }

      setTransactionId(data.transactionId || generatedTrx);
      setStep('SUCCESS');
      tacticalAudio.playRadarPing();

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setTimeout(() => {
        router.push('/dashboard');
      }, 3500);
    } catch (err: any) {
      setError('Gateway verification error. Please retry.');
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase border"
          style={{ color: brandColor, borderColor: `${brandColor}60`, backgroundColor: `${brandColor}15` }}
        >
          {method} SECURE SANDBOX TERMINAL
        </div>
        <h2 className="text-2xl font-black uppercase text-white font-military">
          AUTHORIZE PAYMENT
        </h2>
        <div className="text-xs font-mono text-slate-400">
          INVOICE: {invoice} · AMOUNT: ৳{amount} BDT
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 sm:p-8 border shadow-2xl relative" style={{ borderColor: `${brandColor}40` }}>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="text-xs text-slate-300 font-sans">
                A verification code has been sent to your registered mobile wallet.
              </div>
              <div className="text-[11px] font-mono text-gold-400">(Default test OTP: 123456)</div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                ENTER 6-DIGIT OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-[0.5em] py-3 bg-navy-900 border border-navy-700 rounded-xl text-white text-lg font-mono focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all"
              style={{ backgroundColor: brandColor }}
            >
              VERIFY OTP →
            </button>
          </form>
        )}

        {step === 'PIN' && (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="text-xs text-slate-300 font-sans">
                Enter your {method} wallet secret PIN to authorize debit of <strong>৳{amount} BDT</strong>.
              </div>
              <div className="text-[11px] font-mono text-gold-400">(Sandbox test PIN: 12345)</div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                WALLET PIN
              </label>
              <input
                type="password"
                required
                maxLength={5}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center tracking-[0.5em] py-3 bg-navy-900 border border-navy-700 rounded-xl text-white text-lg font-mono focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all disabled:opacity-50"
              style={{ backgroundColor: brandColor }}
            >
              {verifying ? 'VERIFYING TRANSACTION...' : `CONFIRM PAYMENT ৳${amount}`}
            </button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-defense-success/20 border-2 border-defense-success text-defense-success flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black uppercase text-white font-military">
              ENROLLMENT ACTIVE!
            </h3>

            <div className="text-xs text-slate-300 font-mono space-y-1 bg-navy-900 p-3 rounded-lg border border-navy-800">
              <div>TRX ID: <span className="text-gold-400 font-bold">{transactionId}</span></div>
              <div>METHOD: {method} · STATUS: SETTLED</div>
            </div>

            <p className="text-xs text-slate-400">
              Redirecting you to your defense candidate dashboard...
            </p>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider"
            >
              ENTER DASHBOARD NOW →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-military-grid pt-24">
      <Suspense fallback={<div className="text-center py-20 text-gold-400 font-mono">LOADING TERMINAL...</div>}>
        <GatewayContent />
      </Suspense>
    </div>
  );
}
