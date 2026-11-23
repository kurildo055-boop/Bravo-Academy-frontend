'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BravoLogo } from '@/components/BravoLogo';
import { Shield, Lock, CheckCircle2, ArrowRight, AlertCircle, Phone } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');
  const [customerPhone, setCustomerPhone] = useState('01812345678');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseId) {
      router.push('/courses');
      return;
    }

    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCourse(data.course);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    tacticalAudio.playInterfaceClick();

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          paymentMethod,
          customerPhone
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Payment initiation failed. Please ensure you are logged in.');
        setSubmitting(false);
        return;
      }

      router.push(data.redirectUrl || `/payment/gateway?method=${paymentMethod.toLowerCase()}&invoice=${data.invoiceNumber}&amount=${data.amount}`);
    } catch (err: any) {
      setError('Connection failure during checkout.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gold-400 font-mono">
        PREPARING ENROLLMENT CHECKOUT...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 text-white font-mono">
        Please select a valid course to enroll.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
          SECURE COURSE ENROLLMENT
        </h1>
        <p className="text-xs text-slate-400 font-sans">
          Official Bangladesh defense payment gateway with instant course activation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Order Summary */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5 border border-navy-800">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <span className="text-xs font-mono text-gold-400 font-bold uppercase">ORDER SUMMARY</span>
            <span className="text-xs font-mono text-slate-400">{course.targetForce} FORCE</span>
          </div>

          <h3 className="text-lg font-bold text-white uppercase">{course.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{course.description}</p>

          <div className="space-y-2 pt-3 border-t border-navy-800 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Regular Course Fee:</span>
              <span className="line-through text-slate-500">৳{course.regularPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-defense-success font-semibold">
              <span>Promotional Cadet Subsidy:</span>
              <span>-৳{(course.regularPrice - course.discountPrice).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-navy-800">
              <span>Total Payable Amount:</span>
              <span className="text-xl font-military text-gold-400">৳{course.discountPrice.toLocaleString()} BDT</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">🔒 ENROLLMENT GUARANTEE</div>
            <div>Instant unlocking of 1000+ IQ questions, PPDT, Psychology, and Mock Exams upon payment confirmation.</div>
          </div>
        </div>

        {/* Payment Method Selector & Form */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-navy-800">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                SELECT PAYMENT GATEWAY (BANGLADESH)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setPaymentMethod('BKASH');
                  }}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentMethod === 'BKASH'
                      ? 'bg-[#E2136E]/20 border-[#E2136E] text-white font-bold shadow-[0_0_15px_rgba(226,19,110,0.3)]'
                      : 'bg-navy-900 border-navy-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-base font-black text-[#E2136E] font-sans">bKash</div>
                  <div className="text-[10px] font-mono mt-1 text-slate-300">TOKENIZED CHECKOUT</div>
                </div>

                <div
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setPaymentMethod('NAGAD');
                  }}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentMethod === 'NAGAD'
                      ? 'bg-[#F7941D]/20 border-[#F7941D] text-white font-bold shadow-[0_0_15px_rgba(247,148,29,0.3)]'
                      : 'bg-navy-900 border-navy-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-base font-black text-[#F7941D] font-sans">Nagad</div>
                  <div className="text-[10px] font-mono mt-1 text-slate-300">DFS SECURE PAY</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                SENDER WALLET PHONE NUMBER
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01812345678"
                  className="w-full pl-10 pr-3 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>INITIALIZING GATEWAY...</span>
                ) : (
                  <>
                    <span>PROCEED TO {paymentMethod} (৳{course.discountPrice})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <Suspense fallback={<div className="text-center py-20 text-gold-400 font-mono">LOADING CHECKOUT...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
