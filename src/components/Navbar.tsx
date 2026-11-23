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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);

    // Close user dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Initial check from localStorage
    try {
      const stored = localStorage.getItem('bravo_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {}

    // Verify session from server API
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('bravo_user', JSON.stringify(data.user));
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = () => {
    tacticalAudio.playInterfaceClick();
    setMobileMenuOpen(false);
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
          ? 'bg-[#06150e]/95 backdrop-blur-md border-b border-emerald-900/40 shadow-xl py-1.5'
          : 'bg-gradient-to-b from-[#06150e]/95 via-[#06150e]/70 to-transparent py-2 sm:py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 sm:h-12">
          {/* Logo */}
          <BravoLogo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/#forces"
              onClick={handleNavClick}
              className="text-xs font-bold tracking-wider text-slate-200 hover:text-gold-400 transition-colors uppercase font-mono"
            >
              FORCES
            </Link>
            <Link
              href="/courses"
              onClick={handleNavClick}
              className="text-xs font-bold tracking-wider text-slate-200 hover:text-gold-400 transition-colors uppercase font-mono"
            >
              COURSES
            </Link>
            <Link
              href="/exam/iq"
              onClick={handleNavClick}
              className="text-xs font-bold tracking-wider text-slate-200 hover:text-gold-400 transition-colors uppercase font-mono flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
              IQ PRACTICE
            </Link>
            <Link
              href="/simulation"
              onClick={handleNavClick}
              className="text-xs font-bold tracking-wider text-slate-200 hover:text-gold-400 transition-colors uppercase font-mono"
            >
              ISSB SIMULATION
            </Link>
            <Link
              href="/#testimonials"
              onClick={handleNavClick}
              className="text-xs font-bold tracking-wider text-slate-200 hover:text-gold-400 transition-colors uppercase font-mono"
            >
              SUCCESS STORIES
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            <AudioControls />

            {user ? (
              /* User Authenticated: Small Round Avatar Button with Dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => {
                    tacticalAudio.playInterfaceClick();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 text-navy-950 font-black text-xs uppercase shadow-[0_0_12px_rgba(214,173,96,0.4)] border border-gold-400 hover:scale-105 active:scale-95 transition-all"
                  aria-label="User profile menu"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-navy-950" />
                </button>

                {/* Dropdown Menu on Click */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-xl bg-navy-950/98 border border-gold-500/40 shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-navy-800">
                      <div className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{user.role === 'ADMIN' ? 'COMMAND HQ · ADMIN' : 'DEFENSE CADET'}</span>
                      </div>
                      <div className="text-xs font-bold text-white truncate mt-1">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {user.email}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                        onClick={() => {
                          tacticalAudio.playInterfaceClick();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-navy-900/90 transition-colors uppercase font-mono"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-gold-400" />
                        <span>{user.role === 'ADMIN' ? 'COMMAND CENTER' : 'MY DASHBOARD'}</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors uppercase font-mono text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
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
                  className="px-3 py-1 rounded-lg text-slate-300 hover:text-white text-xs uppercase font-bold tracking-wider hover:bg-navy-800/80 transition-all border border-slate-700/60 hover:border-gold-500/40 font-mono"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  onClick={handleNavClick}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 hover:brightness-110 font-black text-xs uppercase tracking-wider transition-all shadow-md font-mono"
                >
                  <span>REGISTER</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                tacticalAudio.playInterfaceClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 border border-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-3 pb-4 border-t border-navy-800 bg-navy-950/98 backdrop-blur-xl rounded-xl p-4 space-y-2 animate-in fade-in duration-200 font-mono text-xs">
            <Link
              href="/#forces"
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-navy-900 uppercase font-bold"
            >
              FORCES
            </Link>
            <Link
              href="/courses"
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-navy-900 uppercase font-bold"
            >
              COURSES
            </Link>
            <Link
              href="/exam/iq"
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-gold-400 hover:bg-navy-900 uppercase font-bold"
            >
              IQ PRACTICE
            </Link>
            <Link
              href="/simulation"
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-navy-900 uppercase font-bold"
            >
              ISSB SIMULATION
            </Link>
            <Link
              href="/#testimonials"
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-navy-900 uppercase font-bold"
            >
              SUCCESS STORIES
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
