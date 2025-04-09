'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // URLパラメータからコードを取得
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/';
    
    const handleAuthCallback = async () => {
      if (code) {
        try {
          // セッションを交換
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('認証エラー:', error);
            router.push('/auth/signin?error=認証に失敗しました');
            return;
          }
          
          // 認証成功後のリダイレクト
          router.push(next);
        } catch (err) {
          console.error('コールバック処理エラー:', err);
          router.push('/auth/signin?error=認証処理中にエラーが発生しました');
        }
      } else {
        // コードがない場合はホームページにリダイレクト
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">認証処理中...</h1>
        <p className="text-gray-600">しばらくお待ちください。自動的にリダイレクトされます。</p>
      </div>
    </div>
  );
}