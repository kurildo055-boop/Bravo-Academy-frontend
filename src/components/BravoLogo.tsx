'use client';

import React from 'react';
import Link from 'next/link';

interface BravoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BravoLogo: React.FC<BravoLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconDimensions = {
    sm: { w: 48, h: 48 },
    md: { w: 76, h: 76 },
    lg: { w: 96, h: 96 },
    xl: { w: 112, h: 112 },
  }[size];

  const titleSizes = {
    sm: 'text-base tracking-wider',
    md: 'text-xl sm:text-2xl tracking-widest',
    lg: 'text-2xl sm:text-3xl tracking-widest',
    xl: 'text-3xl sm:text-4xl tracking-widest',
  }[size];

  return (
    <Link href="/" className="inline-flex items-center gap-3.5 group select-none">
      <div className="relative flex items-center justify-center">
        {/* Glowing Aura */}
        <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-md group-hover:bg-gold-500/35 transition-all duration-300" />
        
        {/* Official Bravo Academy Emblem */}
        <img
          src="/images/bravo-emblem-transparent.png"
          alt="Bravo Academy Crest"
          width={iconDimensions.w}
          height={iconDimensions.h}
          className="relative drop-shadow-[0_2px_14px_rgba(214,173,96,0.6)] object-contain transition-transform group-hover:scale-105"
        />
      </div>

      {/* Subtle Vertical Divider */}
      <div className="h-9 w-[1px] bg-slate-700/80 mx-1 hidden sm:block" />

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black uppercase text-white font-military ${titleSizes} group-hover:text-gold-400 transition-colors`}>
            BRAVO
          </span>
          <span className={`font-black uppercase text-gold-500 font-military ${titleSizes}`}>
            ACADEMY
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-slate-300 uppercase font-sans -mt-0.5">
            ARMY · NAVY · AIR FORCE
          </span>
        )}
      </div>
    </Link>
  );
};
