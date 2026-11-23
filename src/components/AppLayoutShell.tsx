'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export const AppLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  // Hide main website Navbar, Footer and WhatsApp button on candidate dashboard and admin panel
  const isDashboardOrAdmin =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin');

  if (isDashboardOrAdmin) {
    return (
      <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col antialiased selection:bg-gold-500 selection:text-navy-950">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col antialiased selection:bg-gold-500 selection:text-navy-950">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
