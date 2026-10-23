import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Bricolage_Grotesque, Newsreader } from 'next/font/google';
import './globals.css';
import { Masthead } from '@/components/masthead';
import { NavBottom } from '@/components/nav-bottom';
import { ToastProvider } from '@/lib/toast-context';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['wdth', 'opsz'],
});
const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['normal', 'italic'],
  axes: ['opsz'],
});

export const metadata: Metadata = {
  title: 'The Kansas City Defender · 2026 Impact',
  description:
    'How The Kansas City Defender builds Black power: journalism, mutual aid, political education, and culture, all under one roof.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" id="top">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${serif.variable} antialiased bg-paper`}
      >
        <ToastProvider>
          <Masthead />
          <NavBottom />
          <main className="pb-24 md:pb-0 min-h-screen">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
