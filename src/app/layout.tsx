import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { NavSidebar } from '@/components/nav-sidebar';
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

export const metadata: Metadata = {
  title: 'Defender Impact Dashboard',
  description:
    'Internal impact tracker for The Kansas City Defender, a Black nonprofit media organization.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cream`}
      >
        <ToastProvider>
          <NavSidebar />
          <NavBottom />
          <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
