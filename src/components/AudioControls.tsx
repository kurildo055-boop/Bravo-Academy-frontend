'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Zap } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export const AudioControls: React.FC = () => {
  const [muted, setMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleSound = () => {
    const isNowMuted = tacticalAudio.toggleMute();
    setMuted(isNowMuted);
    setHasInteracted(true);
    if (!isNowMuted) {
      tacticalAudio.playRadarPing();
      tacticalAudio.startAmbient();
    }
  };

  const playJet = () => {
    tacticalAudio.playJetFlyby();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Jet Sound FX Trigger */}
      <button
        onClick={playJet}
        title="Fighter Jet Flyby Sound FX"
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-800/60 border border-gold-500/20 text-gold-400 hover:text-white hover:border-gold-500/50 hover:bg-navy-800 transition-all text-xs font-mono"
      >
        <Zap className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
        <span>SCRAMBLE JET</span>
      </button>

      {/* Ambient Audio Toggle */}
      <button
        onClick={toggleSound}
        title={muted ? 'Enable Command Center Sound' : 'Mute Tactical Audio'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 ${
          muted
            ? 'bg-navy-950/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
            : 'bg-gold-500/10 border-gold-500/60 text-gold-400 shadow-[0_0_12px_rgba(214,173,96,0.3)] animate-pulse'
        }`}
      >
        {muted ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span className="hidden sm:inline">COMMS MUTED</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-gold-400" />
            <span className="hidden sm:inline font-bold">TACTICAL COMMS LIVE</span>
          </>
        )}
      </button>
    </div>
  );
};
