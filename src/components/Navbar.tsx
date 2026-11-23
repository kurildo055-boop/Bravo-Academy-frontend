'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BravoLogo } from './BravoLogo';
import { AudioControls } from './AudioControls';
import { Menu, X, Shield, BookOpen, Award, Users, CheckCircle, ArrowRight, UserCheck, LayoutDashboard, LogOut } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; email?: string } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Close user dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Check login state from localStorage
    try {
      const stored = localStorage.getItem('bravo_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = () => {
    tacticalAudio.playInterfaceClick();
  };

  const handleLogout = async () => {
    tacticalAudio.playInterfaceClick();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('bravo_user');
    localStorage.removeItem('bravo_token');
    setUser(null);
    setUserMenuOpen(false);
    window.location.href = '/login';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#071610]/95 backdrop-blur-md border-b border-emerald-900/40 shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-[#071610]/95 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <BravoLogo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/#forces"
              onClick={handleNavClick}
              className="text-sm font-semibold tracking-wide text-slate-200 hover:text-gold-400 transition-colors uppercase font-sans"
            >
              FORCES
            </Link>
            <Link
              href="/courses"
              onClick={handleNavClick}
              className="text-sm font-semibold tracking-wide text-slate-200 hover:text-gold-400 transition-colors uppercase font-sans"
            >
              COURSES
            </Link>
            <Link
              href="/exam/iq"
              onClick={handleNavClick}
              className="text-sm font-semibold tracking-wide text-slate-200 hover:text-gold-400 transition-colors uppercase font-sans flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-ping" />
              IQ PRACTICE
            </Link>
            <Link
              href="/simulation"
              onClick={handleNavClick}
              className="text-sm font-semibold tracking-wide text-slate-200 hover:text-gold-400 transition-colors uppercase font-sans"
            >
              ISSB SIMULATION
            </Link>
            <Link
              href="/#testimonials"
              onClick={handleNavClick}
              className="text-sm font-semibold tracking-wide text-slate-200 hover:text-gold-400 transition-colors uppercase font-sans"
            >
              SUCCESS STORIES
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <AudioControls />

            {user ? (
              /* User Authenticated: Small Round Avatar Button with Dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 text-navy-950 font-black text-sm uppercase shadow-[0_0_14px_rgba(214,173,96,0.5)] border-2 border-gold-400 hover:scale-105 active:scale-95 transition-all"
                  aria-label="User profile menu"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-navy-950" />
                </button>

                {/* Dropdown Menu on Click */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-navy-950/98 border border-gold-500/40 shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-navy-800">
                      <div className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{user.role === 'ADMIN' ? 'COMMAND HQ · ADMIN' : 'DEFENSE CADET'}</span>
                      </div>
                      <div className="text-sm font-bold text-white truncate mt-1">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {user.email || (user.role === 'ADMIN' ? 'admin@bravoacademy.com' : 'cadet@bravoacademy.com')}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                        onClick={() => {
                          tacticalAudio.playInterfaceClick();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:bg-navy-900/90 transition-colors uppercase font-mono"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gold-400" />
                        <span>{user.role === 'ADMIN' ? 'COMMAND CENTER' : 'MY DASHBOARD'}</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors uppercase font-mono text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>LOG OUT</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Mode: Sign In and Register Buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={handleNavClick}
                  className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white text-xs uppercase font-bold tracking-wider hover:bg-navy-800/80 transition-all border border-slate-700/60 hover:border-gold-500/40"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  onClick={handleNavClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 hover:brightness-110 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(214,173,96,0.3)]"
                >
                  <span>REGISTER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800/80"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-950/98 border-b border-navy-800 px-5 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            <Link
              href="/#forces"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-200 hover:text-gold-400"
            >
              Forces (Army · Navy · Air Force)
            </Link>
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-200 hover:text-gold-400"
            >
              Course Curriculum
            </Link>
            <Link
              href="/exam/iq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gold-400"
            >
              IQ Practice (1000+ Questions)
            </Link>
            <Link
              href="/simulation"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-200 hover:text-gold-400"
            >
              4-Day ISSB Simulation
            </Link>
            <Link
              href="/#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-200 hover:text-gold-400"
            >
              Successful Candidates
            </Link>
          </nav>

          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-gold-500 text-navy-950 font-bold text-sm tracking-wider uppercase block"
                >
                  Go to {user.role === 'ADMIN' ? 'Command Center' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 rounded-lg border border-rose-500/40 text-rose-400 font-bold text-xs uppercase"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-navy-700 text-white font-bold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-gold-500 text-navy-950 font-bold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
