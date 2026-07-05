import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Systematic Life — PERIO 學習與恢復系統',
  description:
    '基於 Justin Sung PERIO 學習系統與四維度恢復框架的診斷與追蹤工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="bg-sl-bg text-gray-100 min-h-screen antialiased">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
