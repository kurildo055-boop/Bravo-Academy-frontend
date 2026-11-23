'use client';

import React from 'react';
import Link from 'next/link';

interface BravoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BravoLogo: React.FC<BravoLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconDimensions = {
    sm: { w: 34, h: 34 },
    md: { w: 46, h: 46 },
    lg: { w: 62, h: 62 },
    xl: { w: 78, h: 78 },
  }[size];

  const titleSizes = {
    sm: 'text-sm tracking-wider',
    md: 'text-base sm:text-lg tracking-wider',
    lg: 'text-xl sm:text-2xl tracking-widest',
    xl: 'text-2xl sm:text-3xl tracking-widest',
  }[size];

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
      <div className="relative flex items-center justify-center shrink-0">
        {/* Subtle Glowing Aura */}
        <div className="absolute inset-0 bg-gold-500/15 rounded-full blur-sm group-hover:bg-gold-500/30 transition-all duration-300" />
        
        {/* Official Bravo Academy Emblem */}
        <img
          src="/images/bravo-emblem-transparent.png"
          alt="Bravo Academy Crest"
          width={iconDimensions.w}
          height={iconDimensions.h}
          className="relative drop-shadow-[0_2px_10px_rgba(214,173,96,0.5)] object-contain transition-transform group-hover:scale-105"
        />
      </div>

      {/* Subtle Vertical Divider */}
      <div className="h-6 w-[1px] bg-slate-700/80 mx-0.5 hidden sm:block" />

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black uppercase text-white font-military ${titleSizes} group-hover:text-gold-400 transition-colors`}>
            BRAVO
          </span>
          <span className={`font-black uppercase text-gold-500 font-military ${titleSizes}`}>
            ACADEMY
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-slate-300 uppercase font-sans mt-0.5">
            ARMY · NAVY · AIR FORCE
          </span>
        )}
      </div>
    </Link>
  );
};
