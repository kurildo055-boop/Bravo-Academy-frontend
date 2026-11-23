import type { Metadata } from 'next';
import './globals.css';
import { AppLayoutShell } from '@/components/AppLayoutShell';

export const metadata: Metadata = {
  title: 'BRAVO ACADEMY | Army · Navy · Air Force ISSB Preparation Platform',
  description: 'Premier defense officer selection preparation platform for Bangladesh Army (BMA), Navy (BNA), and Air Force (BAFA) ISSB candidates. 1000+ IQ Question Bank, PPDT, Psychology, GTO & Simulation.',
  keywords: ['ISSB Bangladesh', 'Bravo Academy', 'BMA Long Course', 'BAFA ISSB', 'BNA Cadet', 'ISSB IQ Test', 'PPDT Story Writing', 'Psychology Test ISSB'],
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-navy-950 text-slate-100 antialiased">
        <AppLayoutShell>
          {children}
        </AppLayoutShell>
      </body>
    </html>
  );
}
