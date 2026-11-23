'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { tacticalAudio } from '@/lib/audio';

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || '8801711223344';
  const message = encodeURIComponent('Salam, I want to inquire about Bravo Academy ISSB Course Enrollment and IQ Test Bank.');

  const handleClick = () => {
    tacticalAudio.playInterfaceClick();
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Contact Bravo Academy on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs uppercase tracking-wider group"
    >
      <MessageCircle className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline">DEFENSE DESK</span>
    </button>
  );
};
