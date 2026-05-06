import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Outfit, DM_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '3-Day Strength + Fat Loss Program',
  description:
    'Lose fat, build muscle, and stay consistent with a simple 3-day gym plan. Back & Biceps, Chest & Shoulders & Triceps, Legs & Cardio.',
  keywords: ['fitness', 'workout', 'strength training', 'fat loss', 'gym program'],
};

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${outfit.variable} ${dmMono.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#080808] text-[#f5f5f5] antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/5 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-display text-lg tracking-widest text-[#3b82f6]">
              3-DAY STRENGTH + FAT LOSS
            </p>
            <p className="text-[#52525b] text-sm text-center">
              Calorie estimates are approximate and for general tracking only, not medical guidance.
            </p>
            <p className="text-[#52525b] text-sm">Built for consistency.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
