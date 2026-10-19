import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dev Daily — Alexa+ Developer Assistant',
  description: 'A simulated Alexa+ experience that gives developers a daily briefing of their GitHub activity, powered by AWS Bedrock.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#080c18] antialiased`}>{children}</body>
    </html>
  );
}
