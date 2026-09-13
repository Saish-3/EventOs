import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'EventOS — Mumbai Tech Week Companion', description: 'AI-powered event operating system demo for Mumbai Tech Week 2026' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body className="min-h-screen">{children}</body></html>; }
