import type { Metadata } from 'next';
import './globals.css';
import Header from '@/app/components/layout/header';
import Footer from '@/app/components/layout/footer';
import { SupabaseProvider } from '@/app/providers/supabase-provider';
import { initializeStorage } from '@/lib/supabase/storage-setup';

// アプリ起動時にストレージの初期化を試みる（サーバーサイドでのみ実行）
if (typeof window === 'undefined') {
  initializeStorage().catch(err => {
    console.error('Failed to initialize storage buckets:', err);
  });
}

export const metadata: Metadata = {
  title: 'syolink - 書道掲示板サービス',
  description: '書道の作品や練習のための掲示板Webサービス',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <SupabaseProvider>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}