'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BravoLogo } from '@/components/BravoLogo';
import {
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Phone,
  Copy,
  Check,
  Upload,
  User,
  GraduationCap,
  Hash,
  FileCheck,
  Clock
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Form Fields
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [collegeOrUniversity, setCollegeOrUniversity] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentPhotoUrl, setStudentPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const OFFICIAL_NUMBERS = {
    BKASH: '01711-223344',
    NAGAD: '01711-223344'
  };

  useEffect(() => {
    // Check auth status
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          if (data.user.phone) {
            setCandidatePhone(data.user.phone);
          }
          if (data.user.profile) {
            if (data.user.profile.collegeOrUniversity) {
              setCollegeOrUniversity(data.user.profile.collegeOrUniversity);
            }
            if (data.user.profile.studentRoll) {
              setStudentRoll(data.user.profile.studentRoll);
            }
          }
        }
      })
      .catch(() => {});

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

  const handleCopyNumber = () => {
    const num = OFFICIAL_NUMBERS[paymentMethod];
    navigator.clipboard.writeText(num.replace(/[^0-9]/g, ''));
    setCopiedNumber(true);
    tacticalAudio.playInterfaceClick();
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError('Candidate photo size must be less than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setStudentPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Please login or register an account before submitting payment.');
      return;
    }

    if (!senderNumber || !transactionId || !collegeOrUniversity || !studentRoll) {
      setError('Please fill in all required fields (Sender number, TrxID, College/University & Roll).');
      return;
    }

    setSubmitting(true);
    tacticalAudio.playInterfaceClick();

    try {
      const res = await fetch('/api/payments/manual-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          paymentMethod,
          amount: course.discountPrice,
          senderNumber,
          transactionId,
          collegeOrUniversity,
          studentRoll,
          candidatePhone: candidatePhone || currentUser.phone || senderNumber,
          studentPhotoUrl,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to submit payment details.');
        setSubmitting(false);
        return;
      }

      tacticalAudio.playRadarPing();
      setSubmittedSuccess(true);
      setSubmittedData(data.payment);
    } catch (err: any) {
      setError('Network connection error during payment submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-mono">
        INITIALIZING SECURE ADMISSION CHECKOUT...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white space-y-4">
        <p className="font-mono text-sm">Course not found or invalid course ID.</p>
        <Link href="/courses" className="px-4 py-2 bg-gold-500 text-navy-950 font-bold rounded-lg text-xs">
          Return to Courses
        </Link>
      </div>
    );
  }

  // If already submitted in this session
  if (submittedSuccess) {
    return (
      <div className="min-h-screen bg-navy-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
        <div className="max-w-2xl mx-auto glass-panel rounded-2xl p-8 sm:p-10 border border-emerald-500/40 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-gold-400 bg-gold-500/10 border border-gold-500/30 px-3 py-1 rounded-full uppercase">
              APPLICATION RECEIVED & VERIFICATION PENDING
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-military">
              PAYMENT SUBMITTED TO COMMAND HQ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Your bKash/Nagad admission payment proof has been successfully transmitted to the Bravo Academy Command Center.
            </p>
          </div>

          <div className="bg-navy-900/90 rounded-xl p-5 border border-navy-800 text-left space-y-2.5 font-mono text-xs text-slate-300">
            <div className="flex justify-between border-b border-navy-800 pb-2">
              <span className="text-slate-400">COURSE:</span>
              <span className="font-bold text-white">{course.title}</span>
            </div>
            <div className="flex justify-between border-b border-navy-800 pb-2">
              <span className="text-slate-400">AMOUNT PAID:</span>
              <span className="font-bold text-emerald-400">৳{course.discountPrice} BDT</span>
            </div>
            <div className="flex justify-between border-b border-navy-800 pb-2">
              <span className="text-slate-400">METHOD:</span>
              <span className="font-bold text-gold-400">{paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-navy-800 pb-2">
              <span className="text-slate-400">TRANSACTION ID:</span>
              <span className="font-bold text-gold-400">{submittedData?.transactionId || transactionId}</span>
            </div>
            <div className="flex justify-between border-b border-navy-800 pb-2">
              <span className="text-slate-400">SENDER NUMBER:</span>
              <span className="font-bold text-white">{submittedData?.senderNumber || senderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">INSTITUTION & ROLL:</span>
              <span className="font-bold text-white">{collegeOrUniversity} ({studentRoll})</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left flex items-start gap-3">
            <Clock className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold mb-1">HQ VERIFICATION IN PROGRESS (15-30 MINS)</p>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Command HQ admin will verify the transaction ID with the telecom network and approve your admission. Once approved, your Cadet Dashboard and entitled military modules will unlock automatically.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest transition-all shadow-lg font-mono"
            >
              <span>PROCEED TO CANDIDATE DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-military-grid">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>OFFICER CADET COURSE ADMISSION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-military">
            MANUAL BKASH / NAGAD PAYMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Pay via bKash or Nagad Send Money to our official number, then submit your transaction details below for Admin HQ verification.
          </p>
        </div>

        {/* Not Logged In Warning */}
        {!currentUser && (
          <div className="glass-panel p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>You must have a cadet account to activate course admission.</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/login?redirect=/checkout?courseId=${courseId}`} className="px-3 py-1 rounded bg-gold-500 text-navy-950 font-bold uppercase">
                Login
              </Link>
              <Link href={`/register?redirect=/checkout?courseId=${courseId}`} className="px-3 py-1 rounded bg-navy-800 text-white font-bold uppercase border border-navy-700">
                Register
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================
              LEFT COLUMN (5 Cols): Course Summary & Official Payment Info
              ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Course Summary Card */}
            <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-b from-[#0c2419] to-navy-950 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                  SELECTED DEFENSE COURSE
                </span>
                <span className="text-[11px] font-mono bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded font-bold">
                  {course.targetForce} FORCE
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black uppercase text-white font-military">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{course.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-navy-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Regular Fee:</span>
                  <span className="line-through text-slate-500">৳{course.regularPrice.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Cadet Discount Subsidy:</span>
                  <span>-৳{(course.regularPrice - course.discountPrice).toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-navy-800">
                  <span className="text-white font-bold">Total Payable:</span>
                  <span className="text-2xl font-black text-gold-400 font-military">
                    ৳{course.discountPrice.toLocaleString()} BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Official Payment Instructions Card */}
            <div className="glass-panel rounded-2xl p-6 border border-gold-500/30 bg-navy-900/90 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                  OFFICIAL PAYMENT NUMBERS
                </span>
                <span className="text-[10px] font-mono bg-navy-800 text-slate-300 px-2 py-0.5 rounded">
                  24/7 ACTIVE
                </span>
              </div>

              {/* Method Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setPaymentMethod('BKASH');
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'BKASH'
                      ? 'bg-[#E2136E]/20 border-[#E2136E] text-white font-bold shadow-[0_0_15px_rgba(226,19,110,0.3)]'
                      : 'bg-navy-950 border-navy-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold tracking-wider">bKash</div>
                  <div className="text-[10px] text-slate-300 font-mono mt-0.5">Send Money / Pay</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setPaymentMethod('NAGAD');
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'NAGAD'
                      ? 'bg-[#F7941D]/20 border-[#F7941D] text-white font-bold shadow-[0_0_15px_rgba(247,148,29,0.3)]'
                      : 'bg-navy-950 border-navy-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold tracking-wider">Nagad</div>
                  <div className="text-[10px] text-slate-300 font-mono mt-0.5">Send Money</div>
                </button>
              </div>

              {/* Number display with copy button */}
              <div className="p-4 rounded-xl bg-navy-950 border border-gold-500/40 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  {paymentMethod} PERSONAL NUMBER:
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-mono font-black text-gold-400 tracking-wider">
                    {OFFICIAL_NUMBERS[paymentMethod]}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold font-mono transition-all"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="font-bold text-white uppercase text-[11px] font-mono">PAYMENT STEPS (নির্দেশনা):</div>
                <ol className="space-y-1.5 list-decimal list-inside text-[11px] text-slate-300 leading-relaxed font-sans">
                  <li>আপনার <strong className="text-white">{paymentMethod}</strong> অ্যাপ অথবা *২৪৭# / *১৬৭# ডায়াল করুন।</li>
                  <li><strong className="text-white">Send Money</strong> সিলেক্ট করে উপরে দেওয়া নাম্বারে সঠিক ফি (<strong className="text-gold-400">৳{course.discountPrice}</strong>) পাঠান।</li>
                  <li>টাকা পাঠানোর পর প্রাপ্ত SMS থেকে <strong className="text-white">TrxID (Transaction ID)</strong> কপি করুন।</li>
                  <li>পাশের ফরমে আপনার তথ্য ও TrxID লিখে সাবমিট করুন। অ্যাডমিন ভেরিফাই করে অ্যাক্সেস আনলক করে দেবে।</li>
                </ol>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN (7 Cols): Candidate Info & Payment Submission Form
              ======================================================== */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6 shadow-2xl">
              <div className="border-b border-navy-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-white font-military">
                    CANDIDATE ADMISSION VERIFICATION FORM
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Fill out all details accurately to prevent verification delays.
                  </p>
                </div>
                <FileCheck className="w-6 h-6 text-gold-400" />
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProof} className="space-y-4 text-xs font-mono">
                {/* 1. Payment Verification Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1.5">
                      SENDER PHONE NUMBER <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 017XXXXXXXX (যে নাম্বার থেকে পাঠিয়েছেন)"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1.5">
                      TRANSACTION ID (TRXID) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. BL92KA819M"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-gold-400 font-bold placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Candidate Academic & Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1.5">
                      COLLEGE / UNIVERSITY NAME <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Notre Dame College / Dhaka College / BUET"
                        value={collegeOrUniversity}
                        onChange={(e) => setCollegeOrUniversity(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 font-sans text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1.5">
                      STUDENT ROLL / REGISTRATION <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 102938 / Roll 2024"
                        value={studentRoll}
                        onChange={(e) => setStudentRoll(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1.5">
                    CANDIDATE CONTACT PHONE (FOR SMS / WHATSAPP)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 018XXXXXXXX"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 font-mono text-xs"
                  />
                </div>

                {/* 3. Photo Upload with instant preview */}
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1.5">
                    CADET PASSPORT / FORMAL PHOTO (ছবি আপলোড)
                  </label>
                  <div className="p-4 rounded-xl bg-navy-900 border border-dashed border-navy-700 flex flex-col sm:flex-row items-center gap-4">
                    {studentPhotoUrl ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gold-500 shrink-0">
                        <img src={studentPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setStudentPhotoUrl('')}
                          className="absolute inset-0 bg-black/60 text-red-400 text-[10px] font-bold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          REMOVE
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-navy-950 border border-navy-800 flex flex-col items-center justify-center text-slate-500 shrink-0">
                        <Upload className="w-6 h-6 mb-1 text-gold-400/60" />
                        <span className="text-[9px] uppercase font-mono">NO PHOTO</span>
                      </div>
                    )}
                    <div className="space-y-1.5 flex-1 text-center sm:text-left">
                      <input
                        type="file"
                        accept="image/*"
                        id="candidate-photo"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="candidate-photo"
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-600 text-slate-200 text-xs font-mono font-bold uppercase transition-all"
                      >
                        <Upload className="w-3.5 h-3.5 text-gold-400" />
                        <span>CHOOSE PHOTO FROM DEVICE</span>
                      </label>
                      <p className="text-[10px] text-slate-400 font-sans">
                        PNG or JPG up to 3MB. Displayed on cadet credentials & defense verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Additional Remarks */}
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1.5">
                    ADDITIONAL NOTES (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any specific batch, preferred timing, or note for HQ..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 font-sans text-xs"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-gold-500 hover:from-emerald-500 hover:to-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl font-mono flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>TRANSMITTING ADMISSION PROOF...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>SUBMIT PAYMENT PROOF FOR HQ VERIFICATION</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-2 font-sans">
                    Verification is conducted securely by Bravo Academy commanding officers.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-mono">
          PREPARING SECURE CHECKOUT...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
