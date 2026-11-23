'use client';

import React from 'react';
import Link from 'next/link';
import { BravoLogo } from './BravoLogo';
import { Shield, Phone, Mail, MapPin, Award, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 text-slate-300 relative z-10 pt-16 pb-12 overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <BravoLogo size="lg" />
            <p className="text-sm text-slate-400 leading-relaxed font-sans mt-3">
              Premier military officer selection training platform for candidates preparing for the Bangladesh Army, Bangladesh Navy, and Bangladesh Air Force ISSB.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-gold-400">
              <Shield className="w-4 h-4" />
              <span>PREPARE · PERFORM · LEAD</span>
            </div>
          </div>

          {/* Col 2: Armed Forces Wings */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-white uppercase font-military mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-defense-army" />
              DEFENSE WINGS
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses?force=ARMY" className="hover:text-gold-400 transition-colors">
                  Bangladesh Army (BMA Long Course)
                </Link>
              </li>
              <li>
                <Link href="/courses?force=NAVY" className="hover:text-gold-400 transition-colors">
                  Bangladesh Navy (Officer Cadet Course)
                </Link>
              </li>
              <li>
                <Link href="/courses?force=AIR_FORCE" className="hover:text-gold-400 transition-colors">
                  Bangladesh Air Force (BAFA GD-P)
                </Link>
              </li>
              <li>
                <Link href="/courses?category=ISSB_FULL" className="hover:text-gold-400 transition-colors">
                  Combined 4-Day ISSB Mastery
                </Link>
              </li>
              <li>
                <Link href="/exam/iq" className="hover:text-gold-400 transition-colors text-gold-400/90 font-medium">
                  1000+ Question IQ Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Examination Modules */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-white uppercase font-military mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              ISSB TEST BATTERY
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/practice/ppdt" className="hover:text-gold-400 transition-colors">
                  PPDT Picture & Story Writing
                </Link>
              </li>
              <li>
                <Link href="/practice/psychology" className="hover:text-gold-400 transition-colors">
                  Psychology (TAT, WAT, SCT, SRT, SDT)
                </Link>
              </li>
              <li>
                <Link href="/practice/gto" className="hover:text-gold-400 transition-colors">
                  GTO Outdoor Tasks & Planning
                </Link>
              </li>
              <li>
                <Link href="/practice/interview" className="hover:text-gold-400 transition-colors">
                  Board Interview Tactical Simulation
                </Link>
              </li>
              <li>
                <Link href="/simulation" className="hover:text-gold-400 transition-colors">
                  Full 4-Day Live ISSB Simulation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Academy Office */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-white uppercase font-military mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-defense-airforce" />
              ACADEMY CONTACT
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <span>Dhaka Cantonment & Chattogram Center, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span>+880 1711-223344 / +880 1812-345678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>admissions@bravoacademy.com</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="text-xs text-slate-500 hover:text-gold-400 font-mono transition-colors"
                >
                  Admin Portal Login →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-navy-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Bravo Academy. All rights reserved. Independent educational training platform for defense aspirants.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-slate-300">Educational Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
