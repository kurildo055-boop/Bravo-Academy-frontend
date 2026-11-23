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
  LogOut,
  Clock,
  Check,
  X,
  Trash2,
  Plus,
  Phone,
  Hash,
  GraduationCap,
  Eye,
  RefreshCw,
  Search,
  Lock,
  Compass,
  Award,
  Menu,
  ChevronRight,
  UserCheck,
  Calendar,
  Layers,
  ExternalLink
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';
import { DEFENSE_MODULES } from '@/lib/modules';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active Sidebar Tab: PAYMENTS, STUDENTS, COURSES, QUESTIONS, CMS
  const [activeTab, setActiveTab] = useState<'PAYMENTS' | 'STUDENTS' | 'COURSES' | 'QUESTIONS' | 'CMS'>('PAYMENTS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Admin user
  const [adminUser, setAdminUser] = useState<any | null>(null);

  // Stats (Real DB numbers, NO fake data)
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Payments State
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // 2. Students State
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentForceFilter, setStudentForceFilter] = useState('ALL');
  const [selectedStudentDossier, setSelectedStudentDossier] = useState<any | null>(null);
  const [grantCourseModalStudent, setGrantCourseModalStudent] = useState<any | null>(null);
  const [grantSelectedCourseId, setGrantSelectedCourseId] = useState('');
  const [grantValidityDays, setGrantValidityDays] = useState(90);
  const [grantingCourse, setGrantingCourse] = useState(false);

  // 3. Courses State
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseSaving, setCourseSaving] = useState(false);

  // Course Form
  const [courseForm, setCourseForm] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    targetForce: 'ALL',
    regularPrice: 4000,
    discountPrice: 2450,
    durationWeeks: 8,
    validityDays: 90,
    thumbnail: '',
    includedFeatures: DEFENSE_MODULES.map((m) => m.id),
    curriculum: [
      { title: 'Week 1: Screening & IQ Fundamentals' },
      { title: 'Week 2: PPDT Mastery & Psychological Battery' },
      { title: 'Week 3: GTO Ground Tasks & Planning Exercise (MPE)' },
      { title: 'Week 4: ISSB Officer Interview & Simulation' }
    ]
  });

  // 4. CMS State
  const [cms, setCms] = useState<any | null>(null);
  const [savingCms, setSavingCms] = useState(false);
  const [cmsMessage, setCmsMessage] = useState('');

  // Initial Auth & Data Load
  useEffect(() => {
    const stored = localStorage.getItem('bravo_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        setAdminUser(u);
      } catch {
        router.push('/login');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    loadInitialData();
  }, [router]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, cmsRes] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/admin/cms').then((r) => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (cmsRes.success) setCms(cmsRes.content);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // Load Payments
  const fetchPayments = async () => {
    setPaymentsLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?status=${paymentStatusFilter}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch {
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Load Students
  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await fetch(`/api/admin/students?q=${encodeURIComponent(studentSearch)}&force=${studentForceFilter}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch {
    } finally {
      setStudentsLoading(false);
    }
  };

  // Load Courses
  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await fetch('/api/courses?all=true');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        if (data.courses.length > 0 && !grantSelectedCourseId) {
          setGrantSelectedCourseId(data.courses[0].id);
        }
      }
    } catch {
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'PAYMENTS') {
      fetchPayments();
    } else if (activeTab === 'STUDENTS') {
      fetchStudents();
    } else if (activeTab === 'COURSES') {
      fetchCourses();
    }
  }, [activeTab, paymentStatusFilter, studentForceFilter]);

  // Handle Search submit for students
  const handleStudentSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  // Handle Approve Payment
  const handleApprovePayment = async (paymentId: string) => {
    setActionLoadingId(paymentId);
    tacticalAudio.playInterfaceClick();

    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/approve`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        tacticalAudio.playRadarPing();
        fetchPayments();
        loadInitialData();
      } else {
        alert(data.error || 'Failed to approve payment.');
      }
    } catch {
      alert('Network error approving payment.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Reject Payment
  const handleRejectPayment = async (paymentId: string) => {
    const remark = prompt('Enter rejection reason for candidate:', 'Transaction ID not verified in mobile banking.');
    if (remark === null) return;

    setActionLoadingId(paymentId);
    tacticalAudio.playInterfaceClick();

    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: remark })
      });
      const data = await res.json();
      if (data.success) {
        fetchPayments();
        loadInitialData();
      } else {
        alert(data.error || 'Failed to reject payment.');
      }
    } catch {
      alert('Network error rejecting payment.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete Student
  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to permanently delete cadet account for "${studentName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        tacticalAudio.playRadarPing();
        fetchStudents();
        loadInitialData();
      } else {
        alert(data.error || 'Failed to delete student.');
      }
    } catch {
      alert('Error deleting student.');
    }
  };

  // Handle Grant Course
  const handleGrantCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantCourseModalStudent || !grantSelectedCourseId) return;

    setGrantingCourse(true);
    tacticalAudio.playInterfaceClick();

    try {
      const res = await fetch(`/api/admin/students/${grantCourseModalStudent.id}/grant-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: grantSelectedCourseId,
          validityDays: grantValidityDays
        })
      });
      const data = await res.json();
      if (data.success) {
        tacticalAudio.playRadarPing();
        setGrantCourseModalStudent(null);
        fetchStudents();
      } else {
        alert(data.error || 'Failed to grant course.');
      }
    } catch {
      alert('Network error granting course.');
    } finally {
      setGrantingCourse(false);
    }
  };

  // Handle Open Create Course Modal
  const handleOpenCreateCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      id: '',
      title: '',
      slug: '',
      description: '',
      targetForce: 'ALL',
      regularPrice: 4000,
      discountPrice: 2450,
      durationWeeks: 8,
      validityDays: 90,
      thumbnail: '',
      includedFeatures: DEFENSE_MODULES.map((m) => m.id),
      curriculum: [
        { title: 'Week 1: Screening & IQ Fundamentals' },
        { title: 'Week 2: PPDT Mastery & Psychological Battery' },
        { title: 'Week 3: GTO Ground Tasks & Planning Exercise (MPE)' },
        { title: 'Week 4: ISSB Officer Interview & Simulation' }
      ]
    });
    setIsCourseModalOpen(true);
    tacticalAudio.playInterfaceClick();
  };

  // Handle Open Edit Course Modal
  const handleOpenEditCourse = (c: any) => {
    setEditingCourse(c);
    let feat: string[] = [];
    try {
      feat = JSON.parse(c.includedFeatures || '[]');
    } catch {
      feat = [];
    }

    let curr: any[] = [];
    try {
      curr = JSON.parse(c.curriculum || '[]');
    } catch {
      curr = [];
    }

    setCourseForm({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      targetForce: c.targetForce,
      regularPrice: c.regularPrice,
      discountPrice: c.discountPrice,
      durationWeeks: c.durationWeeks,
      validityDays: c.validityDays,
      thumbnail: c.thumbnail || '',
      includedFeatures: feat,
      curriculum: curr.length > 0 ? curr : [{ title: 'Module 1: Defense Prep' }]
    });
    setIsCourseModalOpen(true);
    tacticalAudio.playInterfaceClick();
  };

  // Handle Thumbnail File Upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Course image must be less than 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCourseForm((prev) => ({ ...prev, thumbnail: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Toggle Module Checkbox (Options 3 to 11)
  const toggleCourseModule = (moduleId: string) => {
    setCourseForm((prev) => {
      const exists = prev.includedFeatures.includes(moduleId);
      return {
        ...prev,
        includedFeatures: exists
          ? prev.includedFeatures.filter((id) => id !== moduleId)
          : [...prev.includedFeatures, moduleId]
      };
    });
  };

  // Save Course (Create or Update)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.slug) {
      alert('Title and Slug are required.');
      return;
    }

    setCourseSaving(true);
    tacticalAudio.playInterfaceClick();

    const isEdit = Boolean(courseForm.id);
    const url = isEdit ? `/api/courses/${courseForm.id}` : '/api/courses';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      });
      const data = await res.json();
      if (data.success) {
        tacticalAudio.playRadarPing();
        setIsCourseModalOpen(false);
        fetchCourses();
        loadInitialData();
      } else {
        alert(data.error || 'Failed to save course.');
      }
    } catch {
      alert('Network error saving course.');
    } finally {
      setCourseSaving(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to permanently delete this course? It will be removed from the database.')) {
      return;
    }

    tacticalAudio.playInterfaceClick();
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        tacticalAudio.playRadarPing();
        fetchCourses();
        loadInitialData();
      } else {
        alert(data.error || 'Failed to delete course.');
      }
    } catch {
      alert('Network error deleting course.');
    }
  };

  // Save CMS
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
    } catch {
      setCmsMessage('❌ Failed to update CMS.');
    } finally {
      setSavingCms(false);
    }
  };

  const handleLogout = async () => {
    tacticalAudio.playInterfaceClick();
    localStorage.removeItem('bravo_user');
    localStorage.removeItem('bravo_token');
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const pendingApprovalsCount = stats?.pendingApprovals || 0;

  // Sidebar navigation options
  const sidebarItems = [
    {
      id: 'PAYMENTS',
      label: 'Payment Verifications',
      icon: Clock,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-amber-500 text-navy-950 font-black'
    },
    {
      id: 'STUDENTS',
      label: 'Student Management',
      icon: Users,
      badge: stats?.totalStudents !== undefined ? stats.totalStudents : null,
      badgeColor: 'bg-navy-800 text-emerald-400 font-bold border border-emerald-500/30'
    },
    {
      id: 'COURSES',
      label: 'Course Management',
      icon: BookOpen,
      badge: stats?.totalCourses !== undefined ? stats.totalCourses : null,
      badgeColor: 'bg-navy-800 text-gold-400 font-bold'
    },
    {
      id: 'QUESTIONS',
      label: 'Question Suite',
      icon: Brain,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'CMS',
      label: 'Homepage CMS',
      icon: Settings,
      badge: null,
      badgeColor: ''
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col antialiased bg-military-grid">
      {/* ========================================================
          ADMIN TOP COMMAND BAR (NO MAIN NAVBAR, DEDICATED PANEL BAR)
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#06150e]/95 backdrop-blur-md border-b border-emerald-900/40 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle for Left Sidebar */}
          <button
            onClick={() => {
              tacticalAudio.playInterfaceClick();
              setMobileSidebarOpen(!mobileSidebarOpen);
            }}
            className="lg:hidden p-1.5 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 select-none group">
            <Shield className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-military font-black text-white text-base tracking-widest">
                BRAVO <span className="text-gold-400">HQ</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.2 rounded uppercase">
                COMMAND CENTER
              </span>
            </div>
          </Link>
        </div>

        {/* Real Stats Ticker & Admin User Bar */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden md:flex items-center gap-4 text-slate-400 border-r border-navy-800 pr-4">
            <div>
              CADETS: <strong className="text-white">{stats?.totalStudents || 0}</strong>
            </div>
            <div>
              REVENUE: <strong className="text-gold-400">৳{(stats?.totalRevenue || 0).toLocaleString()}</strong>
            </div>
            {pendingApprovalsCount > 0 && (
              <div className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                <span>PENDING: {pendingApprovalsCount}</span>
              </div>
            )}
          </div>

          {/* Admin User Info */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white truncate max-w-[150px]">
                {adminUser?.name || 'Command Admin'}
              </div>
              <div className="text-[10px] text-gold-400 uppercase">SUPERADMIN</div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-navy-900 hover:bg-red-950/60 border border-navy-700 hover:border-red-500/40 text-red-400 transition-colors"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN ADMIN WORKSPACE: LEFT SIDEBAR + CONTENT AREA
          ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* ========================================================
            LEFT SIDEBAR (OPTIONS IN SIDEBAR AS REQUESTED)
            ======================================================== */}
        <aside
          className={`fixed lg:static top-[53px] bottom-0 left-0 z-40 w-64 sm:w-72 bg-[#06150e]/95 lg:bg-[#06150e]/80 border-r border-emerald-900/40 flex flex-col justify-between p-4 transition-transform duration-300 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            <div className="px-2 pt-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                NAVIGATION PANELS
              </span>
            </div>

            {/* Sidebar Navigation Buttons */}
            <nav className="space-y-1.5 font-mono text-xs">
              {sidebarItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      tacticalAudio.playInterfaceClick();
                      setActiveTab(item.id as any);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400'
                        : 'text-slate-300 hover:text-white hover:bg-navy-900 border border-transparent hover:border-navy-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gold-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Launchpad to Question Extraction */}
          <div className="space-y-3 pt-4 border-t border-navy-800">
            <Link
              href="/admin/questions/extract-review"
              className="flex items-center justify-between p-3 rounded-xl bg-navy-900/90 border border-gold-500/30 text-gold-400 hover:text-white hover:border-gold-400 transition-all text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">AI OCR Extractor</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 text-[11px] font-mono text-slate-400 hover:text-slate-200"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* ========================================================
            RIGHT CONTENT AREA (RESPONSIVE WORKSPACE)
            ======================================================== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ========================================================
              TAB 1: PAYMENT VERIFICATIONS
              ======================================================== */}
          {activeTab === 'PAYMENTS' && (
            <div className="space-y-6">
              <div className="glass-panel p-5 rounded-2xl border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-military flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>MANUAL BKASH / NAGAD PAYMENT QUEUE</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Review candidate TrxID, sender number, college, roll & photo. Click Approve to grant immediate dashboard access.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {['ALL', 'PENDING_APPROVAL', 'COMPLETED', 'REJECTED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setPaymentStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
                        paymentStatusFilter === st
                          ? 'bg-gold-500 text-navy-950 font-black'
                          : 'bg-navy-900 border border-navy-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'PENDING_APPROVAL' ? 'PENDING' : st}
                    </button>
                  ))}
                  <button
                    onClick={fetchPayments}
                    className="p-1.5 rounded-lg bg-navy-900 border border-navy-700 text-slate-400 hover:text-white"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {paymentsLoading ? (
                <div className="text-center py-20 text-gold-400 font-mono">LOADING PAYMENT QUEUE...</div>
              ) : payments.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border border-navy-800 text-slate-400 font-mono text-xs">
                  No payment submissions found matching filter: {paymentStatusFilter}
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((p) => {
                    const isPending = p.status === 'PENDING_APPROVAL';
                    const isCompleted = p.status === 'COMPLETED';
                    const isRejected = p.status === 'REJECTED';

                    return (
                      <div
                        key={p.id}
                        className={`glass-panel rounded-2xl p-5 border transition-all ${
                          isPending
                            ? 'border-amber-500/50 bg-gradient-to-r from-[#1c1809] to-navy-950 shadow-xl'
                            : isCompleted
                            ? 'border-emerald-500/30 bg-navy-950/80'
                            : 'border-red-500/30 bg-navy-950/80 opacity-70'
                        }`}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                          {/* 1. Student Formal Photo & Identity */}
                          <div className="lg:col-span-3 flex items-start gap-3.5">
                            {p.studentPhotoUrl ? (
                              <div
                                onClick={() => setSelectedPhotoModal(p.studentPhotoUrl)}
                                className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gold-400 shrink-0 cursor-pointer group shadow"
                              >
                                <img src={p.studentPhotoUrl} alt="Cadet" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                  <Eye className="w-4 h-4" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center font-bold text-gold-400 font-military text-xl shrink-0">
                                {p.user?.name?.[0] || 'C'}
                              </div>
                            )}

                            <div className="overflow-hidden space-y-0.5">
                              <div className="text-sm font-bold text-white uppercase font-sans truncate">
                                {p.user?.name || 'Cadet'}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 truncate">
                                {p.user?.email}
                              </div>
                              <div className="text-[11px] font-mono text-gold-400 font-bold truncate">
                                📞 {p.candidatePhone || p.user?.phone || 'N/A'}
                              </div>
                            </div>
                          </div>

                          {/* 2. College, Roll & Course */}
                          <div className="lg:col-span-3 space-y-1 font-mono text-xs">
                            <div className="text-white font-bold truncate flex items-center gap-1.5 font-sans">
                              <GraduationCap className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                              <span className="truncate">{p.collegeOrUniversity || 'College/Univ N/A'}</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              Roll / ID: <span className="text-white font-bold">{p.studentRoll || 'N/A'}</span>
                            </div>
                            <div className="text-emerald-400 font-bold text-[11px] truncate">
                              📚 {p.course?.title || 'Defense Course'}
                            </div>
                          </div>

                          {/* 3. Transaction Details & Amount */}
                          <div className="lg:col-span-3 space-y-1 font-mono text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  p.paymentMethod === 'BKASH'
                                    ? 'bg-[#E2136E]/20 text-[#E2136E] border border-[#E2136E]/40'
                                    : 'bg-[#F7941D]/20 text-[#F7941D] border border-[#F7941D]/40'
                                }`}
                              >
                                {p.paymentMethod}
                              </span>
                              <span className="text-base font-black text-gold-400 font-military">
                                ৳{p.amount} BDT
                              </span>
                            </div>
                            <div className="text-slate-300 text-[11px]">
                              TrxID: <strong className="text-gold-400 font-mono">{p.transactionId}</strong>
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              Sender: {p.senderNumber} · {new Date(p.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {/* 4. Action Buttons */}
                          <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-2 justify-center">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApprovePayment(p.id)}
                                  disabled={actionLoadingId === p.id}
                                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs uppercase font-mono tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>{actionLoadingId === p.id ? 'APPROVING...' : 'APPROVE & UNLOCK'}</span>
                                </button>

                                <button
                                  onClick={() => handleRejectPayment(p.id)}
                                  disabled={actionLoadingId === p.id}
                                  className="w-full py-2 px-3 rounded-xl bg-navy-900 hover:bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>REJECT</span>
                                </button>
                              </>
                            )}

                            {isCompleted && (
                              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold uppercase text-center flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>ADMITTED & ACTIVE</span>
                              </div>
                            )}

                            {isRejected && (
                              <div className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 font-mono text-xs font-bold uppercase text-center flex items-center justify-center gap-1.5">
                                <X className="w-4 h-4 text-red-400" />
                                <span>REJECTED</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: STUDENT MANAGEMENT (ক্যাডেট ম্যানেজমেন্ট)
              ======================================================== */}
          {activeTab === 'STUDENTS' && (
            <div className="space-y-6">
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0c2419] to-navy-950 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-military flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                      <span>CADET MANAGEMENT CENTER (ক্যাডেট ম্যানেজমেন্ট)</span>
                    </h2>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">
                      View all registered officer aspirants, active course access, academic institution, and performance history.
                    </p>
                  </div>
                </div>

                {/* Search & Force Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                  <form onSubmit={handleStudentSearchSubmit} className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search cadets by name, email, phone, college, or roll..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-24 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase rounded-lg transition-colors"
                    >
                      SEARCH
                    </button>
                  </form>

                  <div className="sm:col-span-4 flex items-center gap-2">
                    <select
                      value={studentForceFilter}
                      onChange={(e) => setStudentForceFilter(e.target.value)}
                      className="w-full py-2.5 px-3 bg-navy-900 border border-navy-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ALL">ALL FORCES</option>
                      <option value="ARMY">BANGLADESH ARMY</option>
                      <option value="NAVY">BANGLADESH NAVY</option>
                      <option value="AIR_FORCE">AIR FORCE</option>
                    </select>

                    <button
                      onClick={fetchStudents}
                      className="p-2.5 bg-navy-900 border border-navy-700 rounded-xl text-slate-300 hover:text-white"
                      title="Refresh"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Students Grid / Table */}
              {studentsLoading ? (
                <div className="text-center py-20 text-emerald-400 font-mono">LOADING CADET DOSSIERS...</div>
              ) : students.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border border-navy-800 text-slate-400 font-mono text-xs">
                  No registered cadets found.
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((st) => {
                    const activeEnrollments = (st.enrollments || []).filter((e: any) => e.status === 'ACTIVE');
                    const hasActive = activeEnrollments.length > 0;

                    return (
                      <div
                        key={st.id}
                        className="glass-panel rounded-2xl p-5 border border-navy-800 hover:border-emerald-500/40 transition-all bg-navy-950/80"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Student Identity */}
                          <div className="md:col-span-4 flex items-start gap-3">
                            {st.studentProfile?.studentPhotoUrl ? (
                              <div
                                onClick={() => setSelectedPhotoModal(st.studentProfile.studentPhotoUrl)}
                                className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-400 shrink-0 cursor-pointer"
                              >
                                <img
                                  src={st.studentProfile.studentPhotoUrl}
                                  alt={st.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center font-bold text-gold-400 font-military text-lg shrink-0">
                                {st.name?.[0] || 'C'}
                              </div>
                            )}

                            <div className="overflow-hidden space-y-0.5">
                              <div className="text-sm font-bold text-white uppercase font-sans truncate">
                                {st.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 truncate">
                                {st.email}
                              </div>
                              <div className="text-[11px] font-mono text-emerald-400 font-bold truncate">
                                📞 {st.phone || 'N/A'}
                              </div>
                            </div>
                          </div>

                          {/* Academic Info & Force */}
                          <div className="md:col-span-3 space-y-1 font-mono text-xs">
                            <div className="text-slate-200 font-bold truncate flex items-center gap-1.5">
                              <GraduationCap className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                              <span className="truncate">{st.studentProfile?.collegeOrUniversity || 'Institution N/A'}</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              Roll / Reg: <span className="text-white font-bold">{st.studentProfile?.studentRoll || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-gold-400 uppercase font-bold">
                                {st.targetForce || 'ARMY'} CANDIDATE
                              </span>
                            </div>
                          </div>

                          {/* Enrolled Courses & Status */}
                          <div className="md:col-span-3 space-y-1 font-mono text-xs">
                            <div className="flex items-center gap-1.5">
                              {hasActive ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>{activeEnrollments.length} ACTIVE COURSE(S)</span>
                                </span>
                              ) : (
                                <span className="text-red-400 font-bold flex items-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  <span>NO ACTIVE ENROLLMENT</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {hasActive ? activeEnrollments[0].course?.title : 'Enlistment required'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Enlisted: {new Date(st.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="md:col-span-2 flex flex-col sm:flex-row md:flex-col gap-1.5 justify-center font-mono text-xs">
                            <button
                              onClick={() => {
                                setGrantCourseModalStudent(st);
                                tacticalAudio.playInterfaceClick();
                              }}
                              className="py-1.5 px-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold uppercase transition-colors text-[11px] text-center"
                            >
                              + GRANT COURSE
                            </button>

                            <button
                              onClick={() => handleDeleteStudent(st.id, st.name)}
                              className="py-1 px-2 rounded-lg bg-navy-900 hover:bg-red-950/80 border border-navy-800 hover:border-red-500/40 text-red-400 transition-colors text-[10px] text-center"
                            >
                              DELETE CADET
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 3: COURSE MANAGEMENT & CREATOR
              ======================================================== */}
          {activeTab === 'COURSES' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0c2419] to-navy-950">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-military flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <span>DEFENSE COURSES & ADMISSION CATALOG</span>
                  </h2>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    Create, edit, or delete defense programs. Mark which sidebar options (3 to 11) are unlocked for each course.
                  </p>
                </div>

                <button
                  onClick={handleOpenCreateCourse}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-gold-500 hover:from-emerald-500 hover:to-gold-400 text-navy-950 font-black text-xs uppercase font-mono tracking-wider shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>CREATE NEW DEFENSE COURSE</span>
                </button>
              </div>

              {coursesLoading ? (
                <div className="text-center py-20 text-emerald-400 font-mono">LOADING COURSES...</div>
              ) : courses.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border border-navy-800 text-slate-400 font-mono text-xs">
                  No courses found in database. Click 'Create New Defense Course' to add one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((c) => {
                    let feat: string[] = [];
                    try {
                      feat = JSON.parse(c.includedFeatures || '[]');
                    } catch {
                      feat = [];
                    }

                    return (
                      <div
                        key={c.id}
                        className="rounded-2xl border border-emerald-500/30 hover:border-emerald-400 transition-all bg-gradient-to-b from-[#0c2419] via-[#091a13] to-[#040e0a] overflow-hidden flex flex-col justify-between shadow-xl"
                      >
                        <div className="relative h-40 w-full bg-navy-950 overflow-hidden">
                          {c.thumbnail ? (
                            <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-navy-900 p-4">
                              <Shield className="w-10 h-10 text-emerald-400/60 mb-1" />
                              <span className="text-[10px] font-mono font-bold text-gold-400 uppercase">
                                BRAVO ACADEMY
                              </span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-navy-950/80 border border-emerald-500/40 text-emerald-300">
                              {c.targetForce}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h4 className="text-lg font-black uppercase text-white font-military leading-tight">
                              {c.title}
                            </h4>
                            <p className="text-xs text-slate-300 line-clamp-2 font-sans">{c.description}</p>

                            <div className="pt-2 text-[11px] font-mono text-emerald-300 space-y-1">
                              <div className="font-bold uppercase text-[10px] text-emerald-400">
                                ENTITLED MODULES ({feat.length} of 9):
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {feat.slice(0, 3).map((fId: string, idx: number) => {
                                  const mod = DEFENSE_MODULES.find((m) => m.id === fId);
                                  return (
                                    <span key={idx} className="bg-navy-900 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded">
                                      ✓ {mod ? mod.title : fId}
                                    </span>
                                  );
                                })}
                                {feat.length > 3 && (
                                  <span className="text-[9px] text-slate-400 px-1">+{feat.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-emerald-500/20 space-y-3">
                            <div className="flex items-baseline justify-between font-mono">
                              <div>
                                <span className="text-xl font-black text-gold-400 font-military">
                                  ৳{c.discountPrice}
                                </span>
                                <span className="text-xs text-slate-500 line-through ml-2">
                                  ৳{c.regularPrice}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400">{c.validityDays} Days</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                              <button
                                onClick={() => handleOpenEditCourse(c)}
                                className="py-2 px-3 rounded-lg bg-navy-900 hover:bg-navy-800 border border-gold-500/40 text-gold-400 font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>EDIT</span>
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(c.id)}
                                className="py-2 px-3 rounded-lg bg-navy-900 hover:bg-red-950/80 border border-red-500/40 text-red-400 font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>DELETE</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 4: QUESTION SUITE LAUNCHPAD
              ======================================================== */}
          {activeTab === 'QUESTIONS' && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-800 pb-3 gap-3">
                <div>
                  <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                    QUESTION BANK & OCR SUITE
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-military mt-1">
                    5 QUESTION CREATION METHODS READY
                  </h2>
                </div>
                <Link
                  href="/admin/questions"
                  className="px-4 py-2 bg-gold-500 text-navy-950 font-bold text-xs uppercase font-mono rounded-xl shrink-0 text-center"
                >
                  OPEN QUESTION CENTER →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
                <Link
                  href="/admin/questions"
                  className="p-4 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500 text-slate-300 hover:text-white transition-all text-center space-y-1.5"
                >
                  <div className="font-bold text-gold-400">METHOD 1</div>
                  <div>Manual Question Builder</div>
                </Link>
                <Link
                  href="/admin/questions"
                  className="p-4 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500 text-slate-300 hover:text-white transition-all text-center space-y-1.5"
                >
                  <div className="font-bold text-gold-400">METHOD 2</div>
                  <div>Excel / CSV Bulk Import</div>
                </Link>
                <Link
                  href="/admin/questions"
                  className="p-4 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500 text-slate-300 hover:text-white transition-all text-center space-y-1.5"
                >
                  <div className="font-bold text-gold-400">METHOD 3</div>
                  <div>AI Question Generator</div>
                </Link>
                <Link
                  href="/admin/questions/extract-review"
                  className="p-4 rounded-xl bg-navy-900 border border-gold-500/40 text-gold-400 text-center space-y-1.5 shadow-md"
                >
                  <div className="font-bold text-white">METHOD 4</div>
                  <div>AI Vision OCR Extractor</div>
                </Link>
                <Link
                  href="/admin/questions"
                  className="p-4 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500 text-slate-300 hover:text-white transition-all text-center space-y-1.5"
                >
                  <div className="font-bold text-gold-400">METHOD 5</div>
                  <div>Copy-Paste Text Import</div>
                </Link>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: HOMEPAGE CMS
              ======================================================== */}
          {activeTab === 'CMS' && cms && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gold-500/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-gold-400 font-bold uppercase">
                    CONTENT MANAGEMENT SYSTEM
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-military mt-1">
                    VISUAL HOMEPAGE BUILDER
                  </h2>
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingCms}
                    className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black uppercase tracking-wider transition-all shadow font-mono"
                  >
                    {savingCms ? 'SAVING CMS...' : 'SAVE & PUBLISH HOMEPAGE CHANGES'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          MODAL: GRANT COURSE TO STUDENT
          ======================================================== */}
      {grantCourseModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-emerald-500/40 space-y-5 text-center shadow-2xl relative">
            <button
              onClick={() => setGrantCourseModalStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 mx-auto flex items-center justify-center text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                DIRECT COURSE ENROLLMENT
              </span>
              <h3 className="text-lg font-black uppercase text-white font-military mt-1">
                GRANT COURSE TO {grantCourseModalStudent.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {grantCourseModalStudent.email}
              </p>
            </div>

            <form onSubmit={handleGrantCourse} className="space-y-4 text-xs font-mono text-left">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  SELECT DEFENSE COURSE
                </label>
                <select
                  value={grantSelectedCourseId}
                  onChange={(e) => setGrantSelectedCourseId(e.target.value)}
                  className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.targetForce} - ৳{c.discountPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  VALIDITY DURATION (DAYS)
                </label>
                <input
                  type="number"
                  value={grantValidityDays}
                  onChange={(e) => setGrantValidityDays(Number(e.target.value))}
                  className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={grantingCourse}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-xs uppercase font-mono tracking-wider shadow"
                >
                  {grantingCourse ? 'ACTIVATING...' : 'ACTIVATE ACCESS'}
                </button>
                <button
                  type="button"
                  onClick={() => setGrantCourseModalStudent(null)}
                  className="py-2.5 px-4 rounded-xl bg-navy-900 border border-navy-700 text-slate-300 text-xs font-bold font-mono uppercase"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE / EDIT DEFENSE COURSE (WITH 3-11 CHECKBOXES)
          ======================================================== */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-3xl w-full rounded-2xl p-6 sm:p-8 border border-emerald-500/40 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-navy-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                {editingCourse ? 'MODIFY EXISTING DEFENSE COURSE' : 'CREATE NEW DEFENSE COURSE'}
              </span>
              <h3 className="text-xl font-black uppercase text-white font-military mt-1">
                {editingCourse ? courseForm.title : 'NEW OFFICER CANDIDATE PROGRAM'}
              </h3>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    COURSE TITLE <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete ISSB Preparation Mastery"
                    value={courseForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setCourseForm({ ...courseForm, title, slug: editingCourse ? courseForm.slug : slug });
                    }}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    URL SLUG <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. issb-preparation-mastery"
                    value={courseForm.slug}
                    onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-gold-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  COURSE DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed description of officer preparation course..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">TARGET FORCE</label>
                  <select
                    value={courseForm.targetForce}
                    onChange={(e) => setCourseForm({ ...courseForm, targetForce: e.target.value })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  >
                    <option value="ALL">ALL FORCES</option>
                    <option value="ARMY">BANGLADESH ARMY</option>
                    <option value="NAVY">BANGLADESH NAVY</option>
                    <option value="AIR_FORCE">AIR FORCE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">REGULAR FEE (৳)</label>
                  <input
                    type="number"
                    value={courseForm.regularPrice}
                    onChange={(e) => setCourseForm({ ...courseForm, regularPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">CADET FEE (৳)</label>
                  <input
                    type="number"
                    value={courseForm.discountPrice}
                    onChange={(e) => setCourseForm({ ...courseForm, discountPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-gold-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">VALIDITY (DAYS)</label>
                  <input
                    type="number"
                    value={courseForm.validityDays}
                    onChange={(e) => setCourseForm({ ...courseForm, validityDays: Number(e.target.value) })}
                    className="w-full p-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Course Thumbnail */}
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  COURSE THUMBNAIL IMAGE (ছবি আপলোড অথবা URL)
                </label>
                <div className="p-3 bg-navy-900 border border-navy-700 rounded-lg flex flex-col sm:flex-row items-center gap-3">
                  {courseForm.thumbnail ? (
                    <div className="w-16 h-12 rounded overflow-hidden border border-emerald-400 shrink-0">
                      <img src={courseForm.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-12 rounded bg-navy-950 border border-navy-800 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                      NO IMAGE
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    id="course-thumb"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="course-thumb"
                    className="cursor-pointer px-3 py-1.5 rounded bg-navy-800 hover:bg-navy-700 border border-navy-600 text-slate-200 text-xs font-bold uppercase"
                  >
                    CHOOSE IMAGE
                  </label>
                  <input
                    type="text"
                    placeholder="Or enter image URL (https://...)"
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    className="flex-1 p-1.5 bg-navy-950 border border-navy-700 rounded text-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* ========================================================
                  9 CORE SIDEBAR MODULES (OPTIONS 3 TO 11)
                  ======================================================== */}
              <div className="p-4 rounded-xl bg-navy-950 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                      SELECT ENTITLED SIDEBAR MODULES (OPTIONS 3 TO 11)
                    </span>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Mark which candidate options are unlocked when this course is purchased.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCourseForm((prev) => ({
                          ...prev,
                          includedFeatures: DEFENSE_MODULES.map((m) => m.id)
                        }))
                      }
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      Select All 9
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => setCourseForm((prev) => ({ ...prev, includedFeatures: [] }))}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {DEFENSE_MODULES.map((mod) => {
                    const isChecked = courseForm.includedFeatures.includes(mod.id);
                    return (
                      <label
                        key={mod.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-white'
                            : 'bg-navy-900 border-navy-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCourseModule(mod.id)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-0 accent-emerald-500 shrink-0"
                        />
                        <span className="truncate text-xs font-mono font-bold">{mod.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-navy-800">
                <button
                  type="submit"
                  disabled={courseSaving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-gold-500 hover:from-emerald-500 hover:to-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider transition-all shadow-md font-mono"
                >
                  {courseSaving ? 'SAVING TO DATABASE...' : 'SAVE & PUBLISH COURSE'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 text-xs font-bold font-mono uppercase"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: VIEW FULL CADET PHOTO
          ======================================================== */}
      {selectedPhotoModal && (
        <div
          onClick={() => setSelectedPhotoModal(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-md w-full glass-panel rounded-2xl overflow-hidden border border-gold-500 p-2 shadow-2xl">
            <img src={selectedPhotoModal} alt="Cadet High Res" className="w-full h-auto rounded-xl object-contain max-h-[80vh]" />
            <div className="p-3 text-center text-xs font-mono text-gold-400">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
